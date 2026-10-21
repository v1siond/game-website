import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { RAPTURE_COLORS } from './palette'

export const DECO_BUTTON = 'inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm tracking-wider'

// Email is the gold primary action, LinkedIn the outlined one.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: RAPTURE_COLORS.gold,
    color: RAPTURE_COLORS.deepSea,
    border: `2px solid ${RAPTURE_COLORS.goldBright}`,
  },
  linkedin: {
    background: 'transparent',
    border: `2px solid ${RAPTURE_COLORS.gold}`,
    color: RAPTURE_COLORS.gold,
  },
}

export function HeroAction({ action, reducedMotion }: { action: HeroActionSlot; reducedMotion: boolean }) {
  return (
    <a
      {...action.linkProps}
      className={`${DECO_BUTTON} ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
      style={HERO_ACTION_LOOK[action.id]}
    >
      {action.label.toUpperCase()}
    </a>
  )
}

export function CVLink({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Link
      href="/cv"
      className={`${DECO_BUTTON} ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
      style={HERO_ACTION_LOOK.linkedin}
    >
      CV
    </Link>
  )
}
