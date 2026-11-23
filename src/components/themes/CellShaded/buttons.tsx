import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import cel from './cel.module.css'

// The world's contact buttons: a heavy ink frame, a hard ink drop and the display lettering; they tilt up
// on hover and press flat into their drop on a click (cel.module.css, "buttons"). The tone picks the fill.

type InkTone = 'sun' | 'orange' | 'paper'

const TONE: Record<InkTone, string> = {
  sun: cel.btnSun,
  orange: cel.btnOrange,
  paper: cel.btnPaper,
}

const inkClass = (tone: InkTone) => `${cel.inkButton} ${TONE[tone]}`

// Email is the loud orange action, LinkedIn and the CV the paper ones, the engine the sun.
const CONTACT_TONE: Record<ContactLinkId, InkTone> = {
  email: 'orange',
  linkedin: 'paper',
  cv: 'paper',
  engine: 'sun',
}

/** The four ways to reach him, the same in the hero and at the station. */
export function ContactActions({ actions }: { actions: readonly HeroActionSlot[] }) {
  const { cv, engine } = useSiteLinks('engine')
  return (
    <>
      {[...actions, cv, engine].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={inkClass(CONTACT_TONE[slot.id])} />
      ))}
    </>
  )
}
