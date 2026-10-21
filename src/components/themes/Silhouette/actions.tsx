import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'

// Silhouette's buttons, on the offset block (world.module.css): email is lit fog white, LinkedIn, the CV
// and the engine are outlined in it.

const BUTTON = `${world.button} inline-flex min-h-[44px] items-center justify-center px-4 py-1.5 text-sm uppercase tracking-[0.2em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)]`

const LIT = 'bg-[color:var(--sh-text)] text-[color:var(--sh-black)]'
const OUTLINED = 'border-2 border-[color:var(--sh-text)] bg-[color:var(--sh-void)] text-[color:var(--sh-text)] hover:bg-[color:var(--sh-glow)] hover:text-[color:var(--sh-black)]'

const ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: LIT,
  linkedin: OUTLINED,
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${BUTTON} ${ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${BUTTON} ${OUTLINED}`}>
      {actions.resume.toLowerCase()}
    </Link>
  )
}

export function PlayLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" className={`${BUTTON} ${LIT}`}>
      {actions.enter.toLowerCase()}
    </Link>
  )
}
