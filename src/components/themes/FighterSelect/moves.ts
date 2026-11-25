'use client'

import { useCallback, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { nextIn } from '@/lib/nextIn'
import type { Profession } from '@/lib/cv/professions'
import type { FighterPose } from './poses'

// How each of his poses plays (fighter.module.css reads the values as CSS variables) and the small state
// of a fighter the visitor can push around: a special thrown on the stage, a step toward the pointer. A
// move cannot be cancelled once thrown, as in the arcade; it ends on the sprite's own animationend, so
// the timing lives once, in the motion table. Under reduced motion nothing is thrown and he holds his rest.
// The poses he rests in (stance, win, his act) play a few runs, inside 5 s with the beats before them, and
// then hold their key frame (BD29).

export type StripMode = 'pingpong' | 'forward' | 'backward'
export type BallKind = 'ki' | 'code'

export interface Motion {
  mode: StripMode
  cycleMs: number
  // The frame shown when motion is reduced: the one that reads as the move.
  key: number
  runs: number
  ball?: BallKind
}

const MOTION: Record<Exclude<FighterPose, 'act'>, Motion> = {
  stance: { mode: 'pingpong', cycleMs: 480, key: 0, runs: 6 },
  walk: { mode: 'forward', cycleMs: 600, key: 1, runs: 1 },
  walkBack: { mode: 'backward', cycleMs: 600, key: 1, runs: 1 },
  fireball: { mode: 'forward', cycleMs: 1000, key: 2, runs: 1, ball: 'ki' },
  uppercut: { mode: 'forward', cycleMs: 760, key: 2, runs: 1 },
  spinKick: { mode: 'forward', cycleMs: 360, key: 0, runs: 3 },
  win: { mode: 'forward', cycleMs: 520, key: 0, runs: 2 },
  punch: { mode: 'forward', cycleMs: 420, key: 1, runs: 1 },
  hurt: { mode: 'forward', cycleMs: 480, key: 0, runs: 1 },
  // Played once, then the strip rests on its key frame: flat on the floor.
  down: { mode: 'forward', cycleMs: 720, key: 3, runs: 1 },
  guard: { mode: 'forward', cycleMs: 420, key: 1, runs: 1 },
  strong: { mode: 'forward', cycleMs: 460, key: 1, runs: 1 },
  roundhouse: { mode: 'forward', cycleMs: 640, key: 2, runs: 1 },
  throw: { mode: 'forward', cycleMs: 760, key: 2, runs: 1 },
  knee: { mode: 'forward', cycleMs: 560, key: 2, runs: 1 },
  jump: { mode: 'forward', cycleMs: 720, key: 2, runs: 1 },
  juggle: { mode: 'forward', cycleMs: 480, key: 0, runs: 1 },
  dizzy: { mode: 'pingpong', cycleMs: 640, key: 0, runs: 3 },
  bow: { mode: 'forward', cycleMs: 900, key: 2, runs: 1 },
  crouch: { mode: 'pingpong', cycleMs: 480, key: 0, runs: 2 },
  sweep: { mode: 'forward', cycleMs: 560, key: 2, runs: 1 },
  climb: { mode: 'forward', cycleMs: 640, key: 0, runs: 2 },
}

const ACT_MOTION: Record<Profession, Motion> = {
  engineer: {
    mode: 'forward',
    cycleMs: 1600,
    key: 2,
    runs: 2,
    ball: 'code',
  },
  drummer: { mode: 'forward', cycleMs: 520, key: 0, runs: 6 },
  fighter: { mode: 'forward', cycleMs: 1300, key: 2, runs: 2 },
}

/** How long his win pose plays at the end of a bout, every run of it. */
export const WIN_MS = MOTION.win.cycleMs * MOTION.win.runs

export const motionFor = (pose: FighterPose, profession: Profession): Motion => (pose === 'act' ? ACT_MOTION[profession] : MOTION[pose])

export const SPECIALS = ['fireball', 'uppercut', 'spinKick'] as const
export type Special = (typeof SPECIALS)[number]

// How far he may walk from his mark either way, in steps.
export const MAX_STEP = 2

export interface MoveState {
  playing: FighterPose | null
  last: Special | null
  step: number
}

export function startSpecial(state: MoveState): MoveState {
  if (state.playing) return state
  const move = nextIn(SPECIALS, state.last)
  return { ...state, playing: move, last: move }
}

export function startWalk(state: MoveState, direction: 1 | -1): MoveState {
  if (state.playing) return state
  const step = Math.max(-MAX_STEP, Math.min(MAX_STEP, state.step + direction))
  if (step === state.step) return state
  return { ...state, playing: direction > 0 ? 'walk' : 'walkBack', step }
}

export const endMove = (state: MoveState): MoveState => (state.playing ? { ...state, playing: null } : state)

export function useMoves(rest: FighterPose, intro: FighterPose | null = null) {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState<MoveState>({
    playing: intro,
    last: null,
    step: 0,
  })

  const special = useCallback(() => {
    if (!reducedMotion) setState(startSpecial)
  }, [reducedMotion])

  const walk = useCallback(
    (direction: 1 | -1) => {
      if (!reducedMotion) setState((current) => startWalk(current, direction))
    },
    [reducedMotion],
  )

  const end = useCallback(() => setState(endMove), [])

  return {
    pose: reducedMotion ? rest : (state.playing ?? rest),
    step: reducedMotion ? 0 : state.step,
    special,
    walk,
    end,
  }
}
