import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cache } from 'react'
import { postFrom, summaryOf, type Post, type PostSummary } from './post'

// The one loader of the blog: every page, the sitemap, llms.txt and the home page read the posts here.
// Decap edits the files (locally through decap-server, in production as commits), and the pages are
// built from them, so a published post shows on the next build.

const BLOG_DIR = join(process.cwd(), 'content', 'blog')

export type BlogOptions = {
  /** The caller's process.env.NODE_ENV: drafts are listed only in 'development'. */
  env: string | undefined
  /** Where the post files are; content/blog unless a test points elsewhere. */
  dir?: string
}

/** The options of a page or route served by this build: drafts follow the build's own environment. */
export const blogOptions = (): BlogOptions => ({ env: process.env.NODE_ENV })

const showsDrafts = (env: BlogOptions['env']): boolean => env === 'development'

const isMissing = (error: unknown): boolean => (error as NodeJS.ErrnoException).code === 'ENOENT'

// A folder git no longer holds (every post deleted) is no posts, any other read error stops the build.
const postFiles = async (dir: string): Promise<string[]> => {
  try {
    return (await readdir(dir)).filter((name) => name.endsWith('.md')).sort()
  } catch (error) {
    if (isMissing(error)) return []
    throw error
  }
}

const readPost = async (dir: string, name: string): Promise<Post> => postFrom(await readFile(join(dir, name), 'utf8'), `content/blog/${name}`)

// The post file of one slug, or null when there is none; any other read error stops the build.
const readPostAt = async (dir: string, name: string): Promise<Post | null> => {
  try {
    return await readPost(dir, name)
  } catch (error) {
    if (isMissing(error)) return null
    throw error
  }
}

const newestFirst = (a: Post, b: Post): number => b.date.localeCompare(a.date)

// The loaders are cached per request (react cache, keyed on these strings), so a page's metadata and its
// body read the posts once between them.
const postsIn = cache(async (env: BlogOptions['env'], dir: string): Promise<Post[]> => {
  const posts = await Promise.all((await postFiles(dir)).map((name) => readPost(dir, name)))
  return posts.filter((post) => showsDrafts(env) || !post.draft).sort(newestFirst)
})

// Only the letters, digits and dashes a post slug is made of, so no slug names a path outside the folder.
const SLUG = /^[a-z0-9-]+$/

const postIn = cache(async (slug: string, env: BlogOptions['env'], dir: string): Promise<Post | null> => {
  if (!SLUG.test(slug)) return null
  const post = await readPostAt(dir, `${slug}.md`)
  if (!post || post.slug !== slug) return null
  if (post.draft && !showsDrafts(env)) return null
  return post
})

/** Every post the environment shows, newest first; drafts only in development. */
export async function listPosts({ env, dir = BLOG_DIR }: BlogOptions): Promise<Post[]> {
  return postsIn(env, dir)
}

/** The post at this slug when the environment shows it, else null (the page answers 404). Reads only
 *  that slug's file. */
export async function getPost(slug: string, { env, dir = BLOG_DIR }: BlogOptions): Promise<Post | null> {
  return postIn(slug, env, dir)
}

/** The newest n posts the environment shows, without their bodies, for the home page. */
export async function latestPosts(n: number, options: BlogOptions): Promise<PostSummary[]> {
  return (await listPosts(options)).slice(0, n).map(summaryOf)
}
