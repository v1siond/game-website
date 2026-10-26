import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllCVData } from '@/lib/cv-data'
import { getPost, listPosts } from '@/lib/blog/posts'
import { renderMarkdown } from '@/lib/blog/markdown'
import { BLOG_PATH } from '@/lib/blog/links'
import { shownDate, type Post } from '@/lib/blog/post'
import { blogMetadata, blogPostingJsonLd, jsonLdHtml } from '@/lib/seo'
import { BlogFooterLinks, BlogToolbar, DraftMark, type BackLink } from '@/components/blog/BlogChrome'

type Props = Readonly<{ params: Promise<{ slug: string }> }>

// One page per post the build shows, rendered at build time; any other slug is the 404 page.
export const dynamicParams = false

const options = () => ({ env: process.env.NODE_ENV })

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await listPosts(options())).map((post) => ({ slug: post.slug }))
}

// The post at the address, or the 404 page.
const postAt = async (params: Props['params']): Promise<Post> => {
  const post = await getPost((await params).slug, options())
  if (!post) notFound()
  return post
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [cv, post] = await Promise.all([getAllCVData('en'), postAt(params)])
  return blogMetadata(cv, post)
}

function Cover({ post }: Readonly<{ post: Post }>) {
  if (!post.cover) return null
  return (
    <Image
      src={post.cover}
      alt={post.coverAlt ?? ''}
      width={0}
      height={0}
      sizes="(min-width: 850px) 786px, 100vw"
      priority
      className="mt-6 h-auto w-full rounded-md border border-gray-300"
    />
  )
}

export default async function PostPage({ params }: Props) {
  const post = await postAt(params)
  const [cv, html] = await Promise.all([getAllCVData('en'), renderMarkdown(post.body)])
  const { blog, navigation } = cv.labels
  const links: BackLink[] = [
    { href: BLOG_PATH, label: blog.allPosts },
    { href: '/', label: blog.backHome },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(blogPostingJsonLd(cv, post)) }} />
      <BlogToolbar label={navigation.primaryNavigation} links={links} />
      <main className="mx-auto max-w-[850px] px-4 py-8 sm:px-8">
        <article>
          <header className="max-w-[72ch] border-b-2 border-black pb-4">
            <h1 className="text-[clamp(1.75rem,6vw,2.25rem)] font-bold leading-tight">{post.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-3 text-base text-gray-600">
              <time dateTime={post.date}>{shownDate(post.date)}</time>
              {post.draft && <DraftMark label={blog.draft} />}
            </p>
          </header>
          <Cover post={post} />
          {/* The HTML renderMarkdown built from the post's own Markdown, raw HTML left out. */}
          <div className="post-body mt-8 max-w-[72ch]" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <BlogFooterLinks links={links} />
      </main>
    </>
  )
}
