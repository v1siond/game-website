import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import type { SiteLinkId } from '@/lib/cv/siteLinks'
import look from './world.module.css'

// The world's buttons, typed labels on worn plates: email is the lit rust plate, LinkedIn, the CV and the
// portfolio the plain dark ones.

const PLATE = `inline-flex min-h-[44px] items-center justify-center border-2 px-4 py-2 text-sm uppercase motion-safe:transition-colors ${look.typed}`

const LIT = `${PLATE} border-[color:var(--sh-brass)] bg-[color:var(--sh-rust-plate)] text-[color:var(--sh-ivory)] hover:bg-[color:var(--sh-wood)]`
const PLAIN = `${PLATE} border-[color:var(--sh-wood)] bg-[color:var(--sh-paper)] text-[color:var(--sh-cream)] hover:border-[color:var(--sh-brass)]`

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: LIT,
  linkedin: PLAIN,
  cv: PLAIN,
  engine: PLAIN,
}

/** The hero's actions, then the site links named in `sites` (the engine one reads "Portfolio"). */
export function ContactPlates({ actions, sites }: { actions: readonly HeroActionSlot[]; sites: readonly SiteLinkId[] }) {
  const siteLinks = useSiteLinks('portfolio')
  return (
    <>
      {[...actions, ...sites.map((id) => siteLinks[id])].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={CONTACT_LOOK[slot.id]} />
      ))}
    </>
  )
}

// A small typed button inside a card, the plain plate at card scale.
export const CARD_BUTTON = `inline-flex min-h-[44px] items-center gap-2 border px-3 text-sm uppercase ${look.typed}`
