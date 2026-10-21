import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { MARIO_COLORS } from './palette'
import { QuestionBlock } from './icons'

export const PRESS_START = '"Press Start 2P", monospace'

// Email is the red primary block, LinkedIn the green pipe one.
export const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`,
    border: `3px solid ${MARIO_COLORS.groundBrown}`,
    color: '#FFF',
    boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
  },
  linkedin: {
    background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
    border: `3px solid ${MARIO_COLORS.pipeMid}`,
    color: '#FFF',
    boxShadow: `0 4px 0 ${MARIO_COLORS.pipeDark}`,
  },
}

export const MARIO_BUTTON =
  'mario-button inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm tracking-wider rounded transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400'

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={MARIO_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link
      href="/cv"
      className={MARIO_BUTTON}
      style={{
        background: `linear-gradient(180deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionDark})`,
        border: `3px solid ${MARIO_COLORS.groundBrown}`,
        color: MARIO_COLORS.groundDarkest,
        boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
      }}
    >
      <QuestionBlock size={16} hit />
      CV
    </Link>
  )
}
