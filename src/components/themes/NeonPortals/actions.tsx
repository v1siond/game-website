import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'

// The world's actions, in the hero and again at the crystal: chunky rounded buttons with a hard bottom
// edge, pressed down a step on hover and click like the platformer's menu buttons. Email is lit in the
// fruit orange, the rest sit on stone.

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: world.chunkyLit,
  linkedin: world.chunkyStone,
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${world.chunkyButton} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${world.chunkyButton} ${world.chunkyStone}`}>
      {actions.getCv}
    </Link>
  )
}

export function DemoLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" className={`${world.chunkyButton} ${world.chunkyWarp}`}>
      {actions.playDemo}
    </Link>
  )
}
