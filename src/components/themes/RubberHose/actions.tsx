import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { CUPHEAD_COLORS } from './palette'

export const CARTOON_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider transition-all hover:scale-105'

// Email is the red primary action, LinkedIn and the CV the ink ones.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: CUPHEAD_COLORS.accentRedDark,
    color: CUPHEAD_COLORS.paperCream,
    border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
    fontFamily: 'serif',
    boxShadow: '3px 3px 0 #5a0000',
  },
  linkedin: {
    background: CUPHEAD_COLORS.inkBlack,
    color: CUPHEAD_COLORS.paperCream,
    border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
    fontFamily: 'serif',
    boxShadow: '3px 3px 0 #1a1510',
  },
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${CARTOON_BUTTON} hover:rotate-1`} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={`${CARTOON_BUTTON} hover:-rotate-1`} style={HERO_ACTION_LOOK.linkedin}>
      CV
    </Link>
  )
}
