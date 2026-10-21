import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { CT_COLORS } from './palette'

// Email is the lit primary command, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: `linear-gradient(180deg, ${CT_COLORS.portalBlue}, ${CT_COLORS.portalPurple})`,
    border: `3px solid ${CT_COLORS.white}`,
    color: CT_COLORS.white,
  },
  linkedin: {
    border: `3px solid ${CT_COLORS.portalBlue}`,
    color: CT_COLORS.portalBlueBright,
    background: CT_COLORS.voidDark,
  },
}

export const COMMAND_BUTTON =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm tracking-widest transition-all hover:scale-105 focus:outline-none focus:ring-2'

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={COMMAND_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      <span aria-hidden="true">◈</span>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link
      href="/cv"
      className={COMMAND_BUTTON}
      style={{ border: `3px solid ${CT_COLORS.gold}`, color: CT_COLORS.gold, background: CT_COLORS.voidDark }}
    >
      <span aria-hidden="true">◈</span>
      CV
    </Link>
  )
}
