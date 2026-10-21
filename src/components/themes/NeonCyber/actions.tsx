import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'

// The world's three actions, in the hero and again on the incoming call: email, LinkedIn, the CV.
// Email is the lit primary action in HUD yellow, LinkedIn the data cyan outline, the CV the ice one.
// Each look names its hover tint as --lit; world.lit fades it in as an overlay (opacity only).

const ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[color:var(--neon-hud)] text-[color:var(--neon-ink)] [--lit:var(--neon-ice)]',
  linkedin: 'border border-[color:var(--neon-data)] text-[color:var(--neon-data)] [--lit:color-mix(in_srgb,var(--neon-data)_14%,transparent)]',
}

const HUD_BUTTON = `${world.cut} ${world.lit} inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm uppercase tracking-[0.2em]`

export function HeroAction({ action, className = '' }: { action: HeroActionSlot; className?: string }) {
  return (
    <a {...action.linkProps} className={`${HUD_BUTTON} ${ACTION_LOOK[action.id]} ${className}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${HUD_BUTTON} border border-[color:var(--neon-ice)] text-[color:var(--neon-ice)] [--lit:color-mix(in_srgb,var(--neon-ice)_12%,transparent)]`}>
      {actions.getCv}
    </Link>
  )
}
