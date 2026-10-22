import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ENGINE_LINK } from '@/lib/engineLink'

// Adventure Paths' buttons: email is the route red, LinkedIn the forest green, the CV and the engine are
// parchment trail signs.

const BUTTON =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border-2 px-4 py-2 text-sm font-bold tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0.5 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ap-gold)]'

const ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'border-[color:var(--ap-ink)] bg-[color:var(--ap-route)] text-white',
  linkedin: 'border-[color:var(--ap-moss)] bg-[color:var(--ap-forest)] text-[color:var(--ap-parchment)]',
}

const SIGN = 'border-[color:var(--ap-edge)] bg-[color:var(--ap-parchment)] text-[color:var(--ap-ink)]'

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${BUTTON} ${ACTION_LOOK[action.id]}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${BUTTON} ${SIGN}`}>
      {actions.cv}
    </Link>
  )
}

export function PlayLink() {
  const { actions } = useLabels()
  return (
    <Link {...ENGINE_LINK} className={`${BUTTON} ${SIGN}`}>
      {actions.play}
    </Link>
  )
}
