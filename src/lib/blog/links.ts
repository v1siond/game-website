import { shownDate, type PostMeta, type PostSummary } from './post'

// The addresses of the blog and the links a world's posts section shows. Every world reads its posts
// through postLinks, so the rule "no posts, no section" lives here once.

export const BLOG_PATH = '/blog'

export const postPath = (slug: PostMeta['slug']): string => `${BLOG_PATH}/${slug}`

export type PostLink = {
  href: string
  title: string
  /** YYYY-MM-DD, for the dateTime of a <time>. */
  date: string
  /** The date as the page prints it ("Oct 26, 2026"). */
  shownDate: string
}

/** One link per post, newest first as given, or null when there is no post (the section is not shown). */
export function postLinks(posts: readonly PostSummary[]): PostLink[] | null {
  if (posts.length === 0) return null
  return posts.map(({ slug, title, date }) => ({ href: postPath(slug), title, date, shownDate: shownDate(date) }))
}
