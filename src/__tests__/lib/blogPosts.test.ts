import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getPost, latestPosts, listPosts } from '@/lib/blog/posts'
import type { PostMeta } from '@/lib/blog/post'

// readFile is wrapped, real underneath, so a case can count the files a loader opens.
jest.mock('node:fs/promises', () => {
  const actual = jest.requireActual('node:fs/promises')
  return { ...actual, readFile: jest.fn(actual.readFile) }
})

// Post files written the way Decap's json-frontmatter format writes them (gray-matter with "{" and "}"
// as the delimiters, the object's own braces trimmed), so the loader reads what /admin saves.
const decapFile = (meta: Partial<PostMeta>, body: string): string =>
  `{\n${JSON.stringify(meta, null, 2).trim().slice(1, -1).trim()}\n}\n${body}\n`

const meta = (slug: string, date: string, draft: boolean): Partial<PostMeta> => ({
  title: `Post ${slug}`,
  slug,
  date,
  description: `About ${slug}`,
  keyword: slug,
  tags: [slug],
  series: { id: 'CV', part: 1 },
  draft,
})

let dir: string

const writePosts = (posts: Partial<PostMeta>[]): Promise<void[]> =>
  Promise.all(posts.map((post) => writeFile(join(dir, `${post.slug}.md`), decapFile(post, `## ${post.title}\n\nBody of ${post.slug}.`))))

const slugs = (posts: { slug: string }[]): string[] => posts.map((post) => post.slug)

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'blog-'))
})

afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('listPosts', () => {
  beforeEach(() =>
    writePosts([meta('older', '2026-01-05', false), meta('draft', '2026-12-01', true), meta('newest', '2026-10-20', false), meta('middle', '2026-03-15', false)]),
  )

  it('lists the published posts newest first and hides drafts in production', async () => {
    expect(slugs(await listPosts({ env: 'production', dir }))).toEqual(['newest', 'middle', 'older'])
  })

  it('hides drafts in the test environment and when the environment is unset', async () => {
    expect(slugs(await listPosts({ env: 'test', dir }))).not.toContain('draft')
    expect(slugs(await listPosts({ env: undefined, dir }))).not.toContain('draft')
  })

  it('lists drafts too in development, still newest first', async () => {
    expect(slugs(await listPosts({ env: 'development', dir }))).toEqual(['draft', 'newest', 'middle', 'older'])
  })

  it('reads the front matter and the body under it', async () => {
    const [newest] = await listPosts({ env: 'production', dir })
    expect(newest).toEqual({
      title: 'Post newest',
      slug: 'newest',
      date: '2026-10-20',
      description: 'About newest',
      keyword: 'newest',
      cover: undefined,
      coverAlt: undefined,
      tags: ['newest'],
      series: { id: 'CV', part: 1 },
      draft: false,
      body: '## Post newest\n\nBody of newest.\n',
    })
  })

  it('lists no post when the folder is gone', async () => {
    expect(await listPosts({ env: 'development', dir: join(dir, 'missing') })).toEqual([])
  })

  it('names the file whose front matter lacks a field', async () => {
    await writeFile(join(dir, 'broken.md'), decapFile({ title: 'No slug', date: '2026-01-01' }, 'Body'))
    await expect(listPosts({ env: 'production', dir })).rejects.toThrow('content/blog/broken.md: missing slug, description, keyword')
  })
})

describe('getPost', () => {
  beforeEach(() => writePosts([meta('published', '2026-01-05', false), meta('draft', '2026-02-01', true)]))

  it('finds a published post by its slug in production', async () => {
    expect((await getPost('published', { env: 'production', dir }))?.title).toBe('Post published')
  })

  it('gives null for a draft in production and the draft in development', async () => {
    expect(await getPost('draft', { env: 'production', dir })).toBeNull()
    expect((await getPost('draft', { env: 'development', dir }))?.slug).toBe('draft')
  })

  it('reads only the one file of the slug', async () => {
    jest.mocked(readFile).mockClear()
    await getPost('published', { env: 'production', dir })
    expect(jest.mocked(readFile).mock.calls.map(([path]) => path)).toEqual([join(dir, 'published.md')])
  })

  it('gives null for a slug with no file', async () => {
    expect(await getPost('missing', { env: 'production', dir })).toBeNull()
  })

  it('never reads outside the blog folder', async () => {
    const blog = join(dir, 'blog')
    await mkdir(blog)
    await writeFile(join(dir, 'labels.md'), decapFile(meta('labels', '2026-01-05', false), 'Outside the blog.'))
    jest.mocked(readFile).mockClear()
    expect(await getPost('../labels', { env: 'production', dir: blog })).toBeNull()
    expect(jest.mocked(readFile)).not.toHaveBeenCalled()
  })

  it('gives null when the file names another slug than its own', async () => {
    await writeFile(join(dir, 'renamed.md'), decapFile(meta('original', '2026-01-05', false), 'Body'))
    expect(await getPost('renamed', { env: 'production', dir })).toBeNull()
  })
})

describe('latestPosts', () => {
  it('gives no post when there are none', async () => {
    expect(await latestPosts(3, { env: 'production', dir })).toEqual([])
  })

  it('gives the one post there is, without its body', async () => {
    await writePosts([meta('only', '2026-04-01', false)])
    expect(await latestPosts(3, { env: 'production', dir })).toEqual([
      { slug: 'only', title: 'Post only', date: '2026-04-01', description: 'About only', draft: false },
    ])
  })

  it('gives the newest 3 of 4 posts', async () => {
    await writePosts([meta('a', '2026-01-01', false), meta('b', '2026-02-01', false), meta('c', '2026-03-01', false), meta('d', '2026-04-01', false)])
    expect(slugs(await latestPosts(3, { env: 'production', dir }))).toEqual(['d', 'c', 'b'])
  })
})

describe('content/blog', () => {
  it('parses every post file, and production lists exactly the ones that are not drafts', async () => {
    const development = await listPosts({ env: 'development' })
    expect(development.length).toBeGreaterThan(0)
    expect(await listPosts({ env: 'production' })).toEqual(development.filter((post) => !post.draft))
  })
})
