import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import ui from './warped.module.css'

// The world's actions, in the arrival and again at the level end: fat rounded buttons with a hard bottom
// edge that press down a step on hover and click, like the platformer's menu buttons. Email is lit in
// the fruit orange, LinkedIn in the time machine's teal, the CV on stone.

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: ui.lit,
  linkedin: ui.teal,
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
      {actions.getCv}
    </Link>
  )
}

export function DemoLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" className={`${ui.button} ${ui.gold}`}>
      {actions.playDemo}
    </Link>
  )
}
