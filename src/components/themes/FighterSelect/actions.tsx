import type { ReactNode } from 'react'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import type { SiteLinkId } from '@/lib/cv/siteLinks'
import look from './world.module.css'

// The world's buttons, flat arcade blocks with a hard black drop: email is the yellow primary action
// (the colour of a full life bar), LinkedIn, the CV and the portfolio player one blue on black.

const ARCADE_BUTTON = `inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-base uppercase shadow-[4px_4px_0_#000] motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fs-gold)] ${look.display}`

const GOLD_FILL = `${ARCADE_BUTTON} border-2 border-black bg-[color:var(--fs-hud-yellow)] text-[color:var(--fs-ink)]`
export const BLUE_OUTLINE = `${ARCADE_BUTTON} border-2 border-[color:var(--fs-p1-light)] bg-black text-[color:var(--fs-p1-light)]`

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: GOLD_FILL,
  linkedin: BLUE_OUTLINE,
  cv: BLUE_OUTLINE,
  engine: BLUE_OUTLINE,
}

// A link alone, or held in the frame class a row gives each of its buttons (the win screen's press).
function Framed({ frame, children }: { frame?: string; children: ReactNode }) {
  if (!frame) return children
  return <span className={frame}>{children}</span>
}

/** The hero's actions, then the site links named in `sites` (the engine one reads "Portfolio"), each in `frame` when given. */
export function ArcadeLinks({ actions, sites, frame }: { actions: readonly HeroActionSlot[]; sites: readonly SiteLinkId[]; frame?: string }) {
  const siteLinks = useSiteLinks('portfolio')
  return (
    <>
      {[...actions, ...sites.map((id) => siteLinks[id])].map((slot) => (
        <Framed key={slot.id} frame={frame}>
          <ContactLink slot={slot} className={CONTACT_LOOK[slot.id]} />
        </Framed>
      ))}
    </>
  )
}
