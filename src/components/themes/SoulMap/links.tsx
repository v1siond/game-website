import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import ashen from './ashen.module.css'

// The world's buttons, cut like the game's menu entries: carved capitals on dark stone between two thin
// gold rules, the lit highlight sweeping in behind the word on hover and focus. Email is the lit one (gold
// words), the others are plain.

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--soul-glow)]'

export const BUTTON = `${ashen.button} inline-flex min-h-[44px] items-center justify-center px-5 py-2 text-sm uppercase tracking-[0.24em] text-[color:var(--soul-text)] ${FOCUS}`

export const BUTTON_LIT = `${BUTTON} ${ashen.buttonLit} text-[color:var(--soul-glow)]`

const ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: BUTTON_LIT,
  linkedin: BUTTON,
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={ACTION_LOOK[action.id]}>
          {action.label}
        </a>
      ))}
    </>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={BUTTON}>
      {actions.resume}
    </Link>
  )
}

export function EngineLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" aria-label={actions.viewEngine} className={BUTTON}>
      {actions.engine}
    </Link>
  )
}
