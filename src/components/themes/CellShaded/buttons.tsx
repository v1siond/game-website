import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import cel from './cel.module.css'

// The world's buttons: a heavy ink frame, a hard ink drop and the display lettering; they tilt up on
// hover and press flat into their drop on a click (cel.module.css, "buttons"). The tone picks the fill.

export type InkTone = 'sun' | 'orange' | 'paper' | 'holo'

const TONE: Record<InkTone, string> = {
  sun: cel.btnSun,
  orange: cel.btnOrange,
  paper: cel.btnPaper,
  holo: cel.btnHolo,
}

const inkClass = (tone: InkTone) => `${cel.inkButton} ${TONE[tone]}`

type InkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: InkTone; children: ReactNode }

export function InkButton({ tone = 'sun', className = '', type = 'button', ...props }: InkButtonProps) {
  return <button type={type} className={`${inkClass(tone)} ${className}`} {...props} />
}

// Email is the loud orange action, LinkedIn the paper one.
const HERO_TONE: Record<HeroActionSlot['id'], InkTone> = {
  email: 'orange',
  linkedin: 'paper',
}

/** The four ways to reach him, the same in the hero and at the respawn station. */
export function ContactActions({ actions }: { actions: readonly HeroActionSlot[] }) {
  const labels = useLabels().actions
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={inkClass(HERO_TONE[action.id])}>
          {action.label}
        </a>
      ))}
      <Link href="/cv" className={inkClass('paper')}>
        {labels.cv}
      </Link>
      <Link href="/personal-projects/game-engine" aria-label={labels.viewEngine} className={inkClass('sun')}>
        {labels.engine}
      </Link>
    </>
  )
}
