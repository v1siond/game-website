import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCVData } from '@/lib/cv-data'
import { blogOptions, getPost, listPosts } from '@/lib/blog/posts'
import { renderMarkdown } from '@/lib/blog/markdown'
import { BLOG_PATH } from '@/lib/blog/links'
import { shownDate, type Post } from '@/lib/blog/post'
import { blogMetadata, blogPostingJsonLd, jsonLdHtml } from '@/lib/seo'
import { BlogFooterLinks, BlogToolbar, DraftMark, type BackLink } from '@/components/blog/BlogChrome'

type Props = Readonly<{ params: Promise<{ slug: string }> }>

// One page per post the build shows, rendered at build time. Another slug still reaches postAt, whose
// notFound() renders the blog's own 404 inside the blog layout.
export const dynamicParams = true

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await listPosts(blogOptions())).map((post) => ({ slug: post.slug }))
}

// The post at the address, or the 404 page.
const postAt = async (params: Props['params']): Promise<Post> => {
  const post = await getPost((await params).slug, blogOptions())
  if (!post) notFound()
  return post
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [cv, post] = await Promise.all([getAllCVData('en'), postAt(params)])
  return blogMetadata(cv, post)
}

export default async function PostPage({ params }: Props) {
  const post = await postAt(params)
  const cv = await getAllCVData('en')
  const { blog, navigation } = cv.labels
  const html = await renderMarkdown(post.body, { codeLabel: blog.codeExample })
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
          <header className="max-w-[40rem] border-b-2 border-black pb-4">
            <h1 className="text-[clamp(1.75rem,6vw,2.25rem)] font-bold leading-tight">{post.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-3 text-base text-gray-600">
              <time dateTime={post.date}>{shownDate(post.date)}</time>
              {post.draft && <DraftMark label={blog.draft} />}
            </p>
          </header>
          {/* The HTML renderMarkdown built from the post's own Markdown, raw HTML left out. */}
          <div className="post-body mt-8 max-w-[40rem]" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <BlogFooterLinks links={links} />
      </main>
    </>
  )
}
