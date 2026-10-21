import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { PIPBOY_GREEN, TERMINAL_BG, VAULT_YELLOW } from './palette'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV.

export const TERMINAL_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-bold tracking-wider uppercase font-mono transition-all hover:scale-105 focus:outline-none focus-visible:ring-2'

// Email is the solid Pip-Boy green primary action, LinkedIn and the CV the outlined ones.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: { background: PIPBOY_GREEN, color: TERMINAL_BG, border: `2px solid ${PIPBOY_GREEN}`, boxShadow: `0 0 15px ${PIPBOY_GREEN}40` },
  linkedin: { background: TERMINAL_BG, border: `2px solid ${VAULT_YELLOW}`, color: VAULT_YELLOW },
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={TERMINAL_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={TERMINAL_BUTTON} style={HERO_ACTION_LOOK.linkedin}>
      CV
    </Link>
  )
}
