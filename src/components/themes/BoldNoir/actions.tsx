import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, type ContactLinkId } from '@/components/cv/SiteLinks'
import type { SiteLinkSlot } from '@/lib/cv/siteLinks'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV, and the
// link out to Nebulith.

export const NOIR_BUTTON =
  'inline-flex min-h-[44px] items-center justify-center border-[3px] px-5 py-2 text-lg uppercase tracking-widest transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none'

// Email is the red action, LinkedIn and the CV the outlined ones (paper on ink, ink on paper), Nebulith the
// solid paper one.
export const LOOK = {
  red: 'border-[color:var(--noir-red-plate)] bg-[color:var(--noir-red-plate)] text-[color:var(--noir-paper)]',
  outline: 'border-[color:var(--noir-paper)] bg-transparent text-[color:var(--noir-paper)] hover:bg-[color:var(--noir-paper)] hover:text-[color:var(--noir-ink)]',
  paper: 'border-[color:var(--noir-paper)] bg-[color:var(--noir-paper)] text-[color:var(--noir-ink)]',
  inkOutline: 'border-[color:var(--noir-ink)] bg-transparent text-[color:var(--noir-ink)] hover:bg-[color:var(--noir-ink)] hover:text-[color:var(--noir-paper)]',
}

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: `${NOIR_BUTTON} ${LOOK.red}`,
  linkedin: `${NOIR_BUTTON} ${LOOK.outline}`,
  cv: `${NOIR_BUTTON} ${LOOK.outline}`,
  engine: `${NOIR_BUTTON} ${LOOK.paper}`,
}

// On the index card's paper the outlined links are drawn in ink.
const ON_PAPER: Record<ContactLinkId, string> = {
  ...CONTACT_LOOK,
  linkedin: `${NOIR_BUTTON} ${LOOK.inkOutline}`,
  cv: `${NOIR_BUTTON} ${LOOK.inkOutline}`,
}

/** One of the world's contact links in its look: the hero's actions, the CV and the engine; `onPaper` when
 *  it sits on paper rather than ink. */
export function NoirLink({ slot, onPaper = false }: { slot: HeroActionSlot | SiteLinkSlot; onPaper?: boolean }) {
  return <ContactLink slot={slot} className={(onPaper ? ON_PAPER : CONTACT_LOOK)[slot.id]} />
}
