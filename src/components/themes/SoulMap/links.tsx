import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import ashen from './ashen.module.css'

// The world's buttons, cut like the game's menu entries: carved capitals on dark stone between two thin
// gold rules, the lit highlight sweeping in behind the word on hover and focus. Email is the lit one (gold
// words), the others are plain. The focus ring is the site's global one, in the world's gold.

export const BUTTON = `${ashen.button} inline-flex min-h-[44px] items-center justify-center px-5 py-2 text-sm uppercase tracking-[0.24em] text-[color:var(--soul-text)]`

export const BUTTON_LIT = `${BUTTON} ${ashen.buttonLit} text-[color:var(--soul-glow)]`

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: BUTTON_LIT,
  linkedin: BUTTON,
  cv: BUTTON,
  engine: BUTTON,
}

/** The hero's actions (none under the last fire, whose messages are its own), then the CV and the engine. */
export function ContactButtons({ actions = [] }: { actions?: readonly HeroActionSlot[] }) {
  const { cv, engine } = useSiteLinks('engine')
  return (
    <>
      {[...actions, cv, engine].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={CONTACT_LOOK[slot.id]} />
      ))}
    </>
  )
}
