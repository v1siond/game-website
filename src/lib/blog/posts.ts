import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
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

// A folder git no longer holds (every post deleted) is no posts, any other read error stops the build.
const postFiles = async (dir: string): Promise<string[]> => {
  try {
    return (await readdir(dir)).filter((name) => name.endsWith('.md')).sort()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

const readPost = async (dir: string, name: string): Promise<Post> => postFrom(await readFile(join(dir, name), 'utf8'), `content/blog/${name}`)

const newestFirst = (a: Post, b: Post): number => b.date.localeCompare(a.date)

/** Every post the environment shows, newest first; drafts only in development. */
export async function listPosts({ env, dir = BLOG_DIR }: BlogOptions): Promise<Post[]> {
  const posts = await Promise.all((await postFiles(dir)).map((name) => readPost(dir, name)))
  return posts.filter((post) => showsDrafts(env) || !post.draft).sort(newestFirst)
}

/** The post at this slug when the environment shows it, else null (the page answers 404). */
export async function getPost(slug: string, options: BlogOptions): Promise<Post | null> {
  return (await listPosts(options)).find((post) => post.slug === slug) ?? null
}

/** The newest n posts the environment shows, without their bodies, for the home page. */
export async function latestPosts(n: number, options: BlogOptions): Promise<PostSummary[]> {
  return (await listPosts(options)).slice(0, n).map(summaryOf)
}
