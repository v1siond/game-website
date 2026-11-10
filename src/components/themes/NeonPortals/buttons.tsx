import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ENGINE_LINK } from '@/lib/engineLink'
import css from './portals.module.css'

// The world's actions, in the hero and again at the save monitor: fat rounded buttons with a hard bottom
// edge. Email is the one lit in the fruit orange, the first action; the others are quiet white.

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: css.lit,
  linkedin: css.quiet,
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${css.button} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={`${css.button} ${css.quiet}`}>
      {actions.cv}
    </Link>
  )
}

export function DemoLink() {
  const { actions } = useLabels()
  return (
    <Link {...ENGINE_LINK} className={`${css.button} ${css.quiet}`}>
      {actions.playDemo}
    </Link>
  )
}
