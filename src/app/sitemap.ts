import type { MetadataRoute } from 'next'
import { contentLastModified } from '@/lib/cv-data'
import { blogOptions, listPosts } from '@/lib/blog/posts'
import { BLOG_PATH, postPath } from '@/lib/blog/links'
import { postDay } from '@/lib/blog/post'
import { INDEXED_PATHS, absoluteUrl } from '@/lib/seo'

// Every CV page renders the content files, so each one last changed when the content did. The blog
// changed with its newest post (the list is newest first) and each post on its own date; drafts never
// reach a production build's list.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [lastModified, posts] = await Promise.all([contentLastModified(), listPosts(blogOptions())])
  const blogModified = posts.length > 0 ? postDay(posts[0].date) : lastModified

  return [
    ...INDEXED_PATHS.map((path) => ({ url: absoluteUrl(path), lastModified })),
    { url: absoluteUrl(BLOG_PATH), lastModified: blogModified },
    ...posts.map((post) => ({ url: absoluteUrl(postPath(post.slug)), lastModified: postDay(post.date) })),
  ]
}
