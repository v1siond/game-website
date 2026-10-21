import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { COLORS } from './palette'
import { GemIcon, WoodenCrate } from './icons'

// Tropical Platformer: the crate buttons for email, LinkedIn and the CV.

// ============================================================================
// HERO ACTIONS - crate buttons for Email, LinkedIn and the CV
// ============================================================================
export const CRATE_BUTTON =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 font-black tracking-widest transition-all hover:scale-105'

// Email is the orange primary action, LinkedIn and the CV the wooden crates.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: `linear-gradient(180deg, ${COLORS.crashOrangeDark}, #a33f00)`,
    border: `4px solid ${COLORS.maskYellow}`,
    color: '#fff',
    boxShadow: '0 5px 0 #663000, inset 0 2px 0 rgba(255,255,255,0.2)',
    textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
    fontFamily: 'Impact, sans-serif',
    borderRadius: '6px',
  },
  linkedin: {
    background: `linear-gradient(180deg, ${COLORS.crateWood}, #5c2d0c)`,
    border: `4px solid ${COLORS.cratePeru}`,
    color: '#fff',
    boxShadow: '0 5px 0 #3a2010, inset 0 2px 0 rgba(255,255,255,0.2)',
    textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
    fontFamily: 'Impact, sans-serif',
    borderRadius: '6px',
  },
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={CRATE_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.id === 'email' ? <GemIcon size={20} color="yellow" /> : <WoodenCrate size={20} />}
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={CRATE_BUTTON} style={HERO_ACTION_LOOK.linkedin}>
      <WoodenCrate size={20} />
      CV
    </Link>
  )
}
