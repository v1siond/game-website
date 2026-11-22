import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCVData } from '@/lib/cv-data'
import type { Labels } from '@/lib/cv/labels'
import { blogOptions, listPosts } from '@/lib/blog/posts'
import { postPath } from '@/lib/blog/links'
import { shownDate, type Post } from '@/lib/blog/post'
import { blogMetadata } from '@/lib/seo'
import { BlogToolbar, DraftMark } from '@/components/blog/BlogChrome'

export async function generateMetadata(): Promise<Metadata> {
  return blogMetadata(await getAllCVData('en'))
}

function PostList({ posts, blog }: Readonly<{ posts: Post[]; blog: Labels['blog'] }>) {
  if (posts.length === 0) return <p className="text-lg">{blog.empty}</p>

  return (
    <ul className="divide-y divide-gray-200">
      {posts.map((post) => (
        <li key={post.slug} className="max-w-[40rem] py-6">
          <article>
            <p className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <time dateTime={post.date}>{shownDate(post.date)}</time>
              {post.draft && <DraftMark label={blog.draft} />}
            </p>
            <h2 className="mt-1 text-xl font-bold leading-snug">
              <Link
                href={postPath(post.slug)}
                className="inline-flex min-h-11 items-center text-blue-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-lg leading-relaxed text-gray-800">{post.description}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}

// Every post the build shows, newest first (drafts only on the dev server), from content/blog.
export default async function BlogIndex() {
  const [cv, posts] = await Promise.all([getAllCVData('en'), listPosts(blogOptions())])
  const { blog, sections, navigation } = cv.labels

  return (
    <>
      <BlogToolbar label={navigation.primaryNavigation} links={[{ href: '/', label: blog.backHome }]} />
      <main className="mx-auto max-w-[850px] px-4 py-8 sm:px-8">
        <h1 className="mb-2 border-b-2 border-black pb-4 text-3xl font-bold">{sections.posts}</h1>
        <PostList posts={posts} blog={blog} />
      </main>
    </>
  )
}
