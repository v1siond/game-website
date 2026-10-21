import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { COLORS } from './palette'

// =============================================================================
// RECRUITER ACTIONS - arcade buttons
// =============================================================================
export const ARCADE_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-sm tracking-[0.2em] font-black uppercase transition-all hover:scale-105 focus:outline-none focus-visible:ring-4'

// Email is the gold primary action, LinkedIn and the CV the outlined ones.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    fontFamily: '"Impact", "Arial Black", sans-serif',
    background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.orange})`,
    color: COLORS.arcadeBlack,
    border: `2px solid ${COLORS.gold}`,
    boxShadow: `0 0 15px ${COLORS.gold}40`,
  },
  linkedin: {
    fontFamily: '"Impact", "Arial Black", sans-serif',
    background: 'transparent',
    border: `2px solid ${COLORS.specialBlue}`,
    color: COLORS.specialBlue,
    boxShadow: `0 0 10px ${COLORS.specialBlue}30`,
  },
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={ARCADE_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={ARCADE_BUTTON} style={HERO_ACTION_LOOK.linkedin}>
      CV
    </Link>
  )
}
