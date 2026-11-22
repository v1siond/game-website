import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks } from '@/components/cv/SiteLinks'
import world from './world.module.css'

// The world's three actions, in the hero and again on the incoming call: email, LinkedIn, the CV.
// Email is the lit primary action in HUD yellow, LinkedIn the data cyan outline, the CV the ice one.
// Each look names its hover tint as --lit; world.lit fades it in as an overlay (opacity only). The world
// draws no engine link.

const HUD_BUTTON = `${world.cut} ${world.lit} inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm uppercase tracking-[0.2em]`

const CONTACT_LOOK: Record<HeroActionSlot['id'] | 'cv', string> = {
  email: `${HUD_BUTTON} bg-[color:var(--neon-hud)] text-[color:var(--neon-ink)] [--lit:var(--neon-ice)]`,
  linkedin: `${HUD_BUTTON} border border-[color:var(--neon-data)] text-[color:var(--neon-data)] [--lit:color-mix(in_srgb,var(--neon-data)_14%,transparent)]`,
  cv: `${HUD_BUTTON} border border-[color:var(--neon-ice)] text-[color:var(--neon-ice)] [--lit:color-mix(in_srgb,var(--neon-ice)_12%,transparent)]`,
}

/** The hero's email and LinkedIn actions, then the CV link; `actionClassName` goes on the two actions only
 *  (the call's answers kick out a step when pointed at). */
export function ContactActions({ actions, actionClassName = '' }: { actions: readonly HeroActionSlot[]; actionClassName?: string }) {
  const { cv } = useSiteLinks()
  return (
    <>
      {actions.map((action) => (
        <ContactLink key={action.id} slot={action} className={`${CONTACT_LOOK[action.id]} ${actionClassName}`} />
      ))}
      <ContactLink slot={cv} className={CONTACT_LOOK.cv} />
    </>
  )
}
