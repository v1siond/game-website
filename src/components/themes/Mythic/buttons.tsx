import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
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

// Email is the blood red action, LinkedIn the gold one.
const HERO_TONE: Record<HeroActionSlot['id'], SlabTone> = {
  email: 'blood',
  linkedin: 'gold',
}

/** The four ways to reach him, the same in the hero and at the last gate. */
export function ContactActions({ actions }: { actions: readonly HeroActionSlot[] }) {
  const labels = useLabels().actions
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={slabClass(HERO_TONE[action.id])}>
          {action.label}
        </a>
      ))}
      <Link href="/cv" className={slabClass('stone')}>
        {labels.cv}
      </Link>
      <Link href="/personal-projects/game-engine" aria-label={labels.viewEngine} className={slabClass('stone')}>
        {labels.engine}
      </Link>
    </>
  )
}
