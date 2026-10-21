import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { skew } from './panels'

export const SKEW_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm tracking-wider font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black'

// Email is the solid red primary action, LinkedIn and the CV the outlined ones.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: { background: '#ff0033', color: '#000', border: '3px solid #ff0033' },
  linkedin: { background: 'transparent', border: '3px solid #ff0033', color: '#ff0033' },
}

export function HeroAction({ action, prefersReducedMotion }: { action: HeroActionSlot; prefersReducedMotion: boolean }) {
  return (
    <a
      {...action.linkProps}
      className={SKEW_BUTTON}
      style={{ ...HERO_ACTION_LOOK[action.id], transform: skew(prefersReducedMotion, -5) }}
    >
      <span style={{ display: 'inline-block', transform: skew(prefersReducedMotion, 5) }}>
        {action.label.toUpperCase()}
      </span>
    </a>
  )
}

export function CVLink({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <Link
      href="/cv"
      className={`${SKEW_BUTTON} hover:bg-red-900/20`}
      style={{ ...HERO_ACTION_LOOK.linkedin, transform: skew(prefersReducedMotion, -5) }}
    >
      <span style={{ display: 'inline-block', transform: skew(prefersReducedMotion, 5) }}>CV</span>
    </Link>
  )
}
