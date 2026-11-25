import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks, type ContactLinkId } from '@/components/cv/SiteLinks'
import u from './underworld.module.css'

// The world's buttons: carved capitals on a gold, blood or stone slab with a dark drop under it; they
// lift on hover and press into the drop on a click (underworld.module.css, "buttons").

export type SlabTone = 'gold' | 'blood' | 'stone'

const TONE: Record<SlabTone, string> = {
  gold: u.btnGold,
  blood: u.btnBlood,
  stone: u.btnStone,
}

export const slabClass = (tone: SlabTone) => `${u.btn} ${TONE[tone]}`

type SlabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: SlabTone; children: ReactNode }

export function SlabButton({ tone = 'gold', className = '', type = 'button', ...props }: SlabButtonProps) {
  return <button type={type} className={`${slabClass(tone)} ${className}`} {...props} />
}

// Email is the blood red action, LinkedIn the gold one, the CV and the engine stone.
const HERO_TONE: Record<ContactLinkId, SlabTone> = {
  email: 'blood',
  linkedin: 'gold',
  cv: 'stone',
  engine: 'stone',
}

/** The four ways to reach him, the same in the hero and at the last gate. */
export function ContactActions({ actions }: { actions: readonly HeroActionSlot[] }) {
  const siteLinks = useSiteLinks('engine')
  return (
    <>
      {[...actions, siteLinks.cv, siteLinks.engine].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={slabClass(HERO_TONE[slot.id])} />
      ))}
    </>
  )
}
