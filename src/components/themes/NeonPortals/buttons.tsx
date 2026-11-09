import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import ui from './warped.module.css'
import { ENGINE_LINK } from '@/lib/engineLink'

// The world's actions, in the arrival and again at the level end: fat rounded buttons with a glossy top
// and a hard bottom edge that press down a step on hover and click. Email is the one lit in the fruit
// orange, the first action; LinkedIn, the CV and the demo sit on castle stone so nothing competes with it.

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: ui.lit,
  linkedin: ui.stone,
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${ui.button} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${ui.button} ${ui.stone}`}>
      {actions.cv}
    </Link>
  )
}

export function DemoLink() {
  const { actions } = useLabels()
  return (
    <Link {...ENGINE_LINK} className={`${ui.button} ${ui.stone}`}>
      {actions.playDemo}
    </Link>
  )
}
