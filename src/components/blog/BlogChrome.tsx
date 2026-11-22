import Link from 'next/link'
import type { Labels } from '@/lib/cv/labels'
import { BLOG_PATH } from '@/lib/blog/links'

// The plain frame of /blog and its posts, the look of /cv: a white toolbar pinned to the top with the
// way back, and the same links again where a page ends. The toolbar's right padding keeps its links
// clear of the fixed Worlds button in the top right corner, as on /cv.

export type BackLink = { href: string; label: string }

/** The way back from a post or a missing one: every post, then the site. */
export const blogBackLinks = (blog: Labels['blog']): BackLink[] => [
  { href: BLOG_PATH, label: blog.allPosts },
  { href: '/', label: blog.backHome },
]

const TOOLBAR_LINK =
  'flex min-h-11 items-center gap-2 rounded px-1 py-1 text-sm text-gray-700 hover:text-black hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800'

export function BlogToolbar({ label, links }: Readonly<{ label: string; links: readonly BackLink[] }>) {
  return (
    <nav aria-label={label} className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[850px] flex-wrap items-center gap-x-6 gap-y-2 py-3 pl-4 pr-16 sm:pl-8 sm:pr-36 xl:pr-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={TOOLBAR_LINK}>
            <span aria-hidden="true">&larr;</span>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export function BlogFooterLinks({ links }: Readonly<{ links: readonly BackLink[] }>) {
  return (
    <p className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 items-center text-base text-blue-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
        >
          {link.label}
        </Link>
      ))}
    </p>
  )
}

/** The Draft mark beside a post's date; only drafts carry it, and drafts show only on the dev server. */
export function DraftMark({ label }: Readonly<{ label: string }>) {
  return <span className="rounded border border-amber-800 px-2 text-sm font-semibold text-amber-800">{label}</span>
}
