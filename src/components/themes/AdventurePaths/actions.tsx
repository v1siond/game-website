import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'

// Adventure Paths' buttons: email is the route red, LinkedIn the forest green, the CV and the engine are
// parchment trail signs.

const BUTTON =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border-2 px-4 py-2 text-sm font-bold tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0.5 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ap-gold)]'

const SIGN = 'border-[color:var(--ap-edge)] bg-[color:var(--ap-parchment)] text-[color:var(--ap-ink)]'

const CONTACT_LOOK: Record<ContactLinkId, string> = {
  email: `${BUTTON} border-[color:var(--ap-ink)] bg-[color:var(--ap-route-plate)] text-white`,
  linkedin: `${BUTTON} border-[color:var(--ap-moss)] bg-[color:var(--ap-forest-plate)] text-[color:var(--ap-parchment)]`,
  cv: `${BUTTON} ${SIGN}`,
  engine: `${BUTTON} ${SIGN}`,
}

/** The hero's two actions, then the CV sign and the engine sign, which reads "Play". */
export function ContactSigns({ actions }: { actions: readonly HeroActionSlot[] }) {
  const { cv, engine } = useSiteLinks('play')
  return (
    <>
      {[...actions, cv, engine].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={CONTACT_LOOK[slot.id]} />
      ))}
    </>
  )
}
