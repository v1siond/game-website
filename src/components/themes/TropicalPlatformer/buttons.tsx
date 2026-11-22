import Link from 'next/link'
import type { ReactNode } from 'react'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import look from './jungle.module.css'
import { ENGINE_LINK } from '@/lib/engineLink'

// The jungle's controls. Every button is wood or sun gold, 44px tall at least, with the world's gold focus
// ring, in one of three sizes; `extra` holds its place and layout. In the hero and again on the contact
// sign, email is the sun gold primary and the rest are wooden. A status line under a run says where he is.

type ButtonTone = 'gold' | 'wood'
type ButtonSize = 'large' | 'small' | 'wide'

const TONE: Record<ButtonTone, string> = { gold: look.buttonGold, wood: look.buttonWood }
const SIZE: Record<ButtonSize, string> = { large: 'px-5 text-base', small: 'px-4 text-sm', wide: 'px-6 text-base' }

/** The classes of a jungle button. */
export const jungleButton = ({ tone, size, extra = '' }: { tone: ButtonTone; size: ButtonSize; extra?: string }): string =>
  `rounded-xl min-h-[44px] ${SIZE[size]} ${look.button} ${TONE[tone]} ${look.focus} ${extra}`

const LINK_LAYOUT = 'inline-flex items-center justify-center py-2.5'

export const GOLD_BUTTON = jungleButton({ tone: 'gold', size: 'large', extra: LINK_LAYOUT })
export const WOOD_BUTTON = jungleButton({ tone: 'wood', size: 'large', extra: LINK_LAYOUT })

/** The polite line under a run that says where he moved; `spaced` sets it off from the run above. */
export function StatusLine({ children, spaced = true }: { children: ReactNode; spaced?: boolean }) {
  return (
    <p role="status" className={`${spaced ? 'mt-2' : ''} min-h-[1.5rem] text-center text-base text-[color:var(--tp-sun-gold)] ${look.caption}`}>
      {children}
    </p>
  )
}

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: GOLD_BUTTON,
  linkedin: WOOD_BUTTON,
}

export function JungleAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function JungleCVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={WOOD_BUTTON}>
      {actions.cv}
    </Link>
  )
}

export function JunglePortfolioLink() {
  const { actions } = useLabels()
  return (
    <Link {...ENGINE_LINK} className={WOOD_BUTTON}>
      {actions.portfolio}
    </Link>
  )
}
