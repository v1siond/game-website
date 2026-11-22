import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, type ContactLinkId } from '@/components/cv/SiteLinks'
import type { SiteLinkSlot } from '@/lib/cv/siteLinks'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact scene: email, LinkedIn, the CV, and the
// link out to Nebulith, each an ink framed poster button that tips as the pointer lands on it.

const CARTOON_BUTTON = `inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm uppercase tracking-wider transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:transform-none ${world.button} ${world.lettering}`

// Email and Nebulith are the red actions, LinkedIn and the CV the ink ones.
const LOOK = {
  red: `${CARTOON_BUTTON} hover:rotate-1 ${world.buttonRed}`,
  ink: `${CARTOON_BUTTON} hover:-rotate-1 ${world.buttonInk}`,
}

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: LOOK.red,
  linkedin: LOOK.ink,
  cv: LOOK.ink,
  engine: LOOK.red,
}

/** One of the world's contact links in its look: the hero's actions, the CV and the engine. */
export function HoseLink({ slot }: { slot: HeroActionSlot | SiteLinkSlot }) {
  return <ContactLink slot={slot} className={CONTACT_LOOK[slot.id]} />
}
