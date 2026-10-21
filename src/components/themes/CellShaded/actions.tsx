import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV, and the
// link out to Nebulith.

const COMIC_BUTTON = `inline-flex min-h-[44px] items-center justify-center border-4 border-[#141414] px-4 py-2 text-base uppercase tracking-wider transition-transform hover:-rotate-2 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:transform-none ${world.drop}`

// Email is the loud orange action, LinkedIn and the CV the white ones, Nebulith the sun yellow one.
const LOOK = {
  loud: 'bg-[#ff7a1a] text-[#141414]',
  plain: 'bg-white text-[#141414]',
  sun: 'bg-[#ffd23f] text-[#141414]',
}

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: LOOK.loud,
  linkedin: LOOK.plain,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${COMIC_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={`${COMIC_BUTTON} ${LOOK.plain}`}>
      CV
    </Link>
  )
}

export function EngineLink() {
  return (
    <Link href="/personal-projects/game-engine" className={`${COMIC_BUTTON} ${LOOK.sun}`}>
      Nebulith
    </Link>
  )
}
