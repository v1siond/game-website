import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import type { SiteLinkId } from '@/lib/cv/siteLinks'
import world from './world.module.css'

// Silhouette's buttons, on the offset block (world.module.css): email and the engine are lit fog white,
// LinkedIn and the CV are outlined in it.

const BUTTON = `${world.button} inline-flex min-h-[44px] items-center justify-center px-4 py-1.5 text-sm uppercase tracking-[0.2em]`

const LIT = `${BUTTON} bg-[color:var(--sh-text)] text-[color:var(--sh-black)]`
const OUTLINED = `${BUTTON} border-2 border-[color:var(--sh-text)] bg-[color:var(--sh-void)] text-[color:var(--sh-text)] hover:bg-[color:var(--sh-glow)] hover:text-[color:var(--sh-black)]`

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: LIT,
  linkedin: OUTLINED,
  cv: OUTLINED,
  engine: LIT,
}

/** The hero's actions, then the site links named in `sites` (the engine one reads "Enter"). */
export function ContactButtons({ actions, sites }: { actions: readonly HeroActionSlot[]; sites: readonly SiteLinkId[] }) {
  const siteLinks = useSiteLinks('enter')
  return (
    <>
      {[...actions, ...sites.map((id) => siteLinks[id])].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={CONTACT_LOOK[slot.id]} />
      ))}
    </>
  )
}
