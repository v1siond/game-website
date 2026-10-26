import { getAllCVData } from '@/lib/cv-data'
import { BLOG_PATH } from '@/lib/blog/links'
import { BlogFooterLinks, BlogToolbar, type BackLink } from '@/components/blog/BlogChrome'

// A /blog address with no post behind it (an unknown slug, or a draft in a production build).
export default async function BlogNotFound() {
  const { blog, navigation } = (await getAllCVData('en')).labels
  const links: BackLink[] = [
    { href: BLOG_PATH, label: blog.allPosts },
    { href: '/', label: blog.backHome },
  ]

  return (
    <>
      <BlogToolbar label={navigation.primaryNavigation} links={links} />
      <main className="mx-auto max-w-[850px] px-4 py-12 sm:px-8">
        <h1 className="text-3xl font-bold">{blog.notFound}</h1>
        <BlogFooterLinks links={links} />
      </main>
    </>
  )
}
