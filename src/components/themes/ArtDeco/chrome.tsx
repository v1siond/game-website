'use client'

import Link from 'next/link'
import { usePosts } from '@/components/blog/BlogProvider'
import { PostsGate } from '@/components/cv/PostsGate'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { BLOG_PATH, postLinks } from '@/lib/blog/links'
import { initialsOf } from '@/lib/cv/nameWords'
import { Stage } from '../shared/theatre/Stage'
import { DecoLinks, GOLD_OUTLINE } from './actions'
import { LAYER_MOTION, type DecoScene } from './scenes'
import page from './page.module.css'

// The page's fixed gauge bar and its end. The bar is a brass strip across the top with his initials, back
// to the top. The end is the way back up into morning: his latest posts on a brass panel, then the contact
// plate with his line and the ways to reach him, over the sphere surfacing at the tower's dock.

/** The gauge bar: his initials, back to the top of the page. */
export function GaugeBar({ anchor }: { anchor: string }) {
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a href={`#${anchor}`} className={page.brand}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

// The latest posts on the brass panel: each title a cream link with its date in mist, and the gold
// outline button to the whole list.
function DecoPosts() {
  const { blog } = useLabels()
  const links = postLinks(usePosts())
  if (!links) return null

  return (
    <>
      <ul className="divide-y divide-[color:var(--deco-brass-dark)]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="flex min-h-[44px] flex-col justify-center gap-1 py-3 text-[color:var(--deco-cream)] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <span className="text-lg underline decoration-[color:var(--deco-gold)] underline-offset-4">{link.title}</span>
              <time dateTime={link.date} className="shrink-0 text-sm uppercase tracking-wider text-[color:var(--deco-mist)]">
                {link.shownDate}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <Link href={BLOG_PATH} className={GOLD_OUTLINE}>
          {blog.allPosts}
        </Link>
      </div>
    </>
  )
}

/** The end of the page: the posts, then the contact plate, over the sphere at the tower's dock. */
export function RevivalContact({ scene, still }: { scene: DecoScene; still: boolean }) {
  const { sections, blog } = useLabels()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="deco-contact" className={page.goal}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <div className={page.goalCopy}>
        <PostsGate>
          <div className={page.panel}>
            <h2 className={`mb-4 text-xl uppercase tracking-[0.2em] ${page.title}`}>{blog.latestPosts}</h2>
            <DecoPosts />
          </div>
        </PostsGate>
        <RecruiterHero
          render={({ line, actions }) => (
            <div className={page.plate}>
              <h2 id="deco-contact" className={`text-2xl uppercase tracking-[0.3em] ${page.title}`}>
                {sections.contact}
              </h2>
              <p className="mt-4 text-base text-[color:var(--deco-cream)]">{line}</p>
              <nav className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label={sections.contact}>
                <DecoLinks actions={actions} sites={['cv']} />
              </nav>
            </div>
          )}
        />
      </div>
    </section>
  )
}
