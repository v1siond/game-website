'use client'

import { useCallback, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Profession } from '@/lib/cv/professions'
import type { FighterPose } from './poses'

// How each of his poses plays (fighter.module.css reads the values as CSS variables) and the small state
// of a fighter the visitor can push around: a special thrown on the stage, a step toward the pointer. A
// move cannot be cancelled once thrown, as in the arcade; it ends on the sprite's own animationend, so
// the timing lives once, in the motion table. Under reduced motion nothing is thrown and he holds his rest.

export type StripMode = 'pingpong' | 'forward' | 'backward'
export type BallKind = 'ki' | 'code'

export interface Motion {
  mode: StripMode
  cycleMs: number
  // The frame shown when motion is reduced: the one that reads as the move.
  key: number
  runs: number | 'infinite'
  ball?: BallKind
}

const MOTION: Record<Exclude<FighterPose, 'act'>, Motion> = {
  stance: { mode: 'pingpong', cycleMs: 480, key: 0, runs: 'infinite' },
  walk: { mode: 'forward', cycleMs: 600, key: 1, runs: 1 },
  walkBack: { mode: 'backward', cycleMs: 600, key: 1, runs: 1 },
  hadouken: { mode: 'forward', cycleMs: 1000, key: 2, runs: 1, ball: 'ki' },
  shoryuken: { mode: 'forward', cycleMs: 760, key: 2, runs: 1 },
  tatsumaki: { mode: 'forward', cycleMs: 360, key: 0, runs: 3 },
  win: { mode: 'forward', cycleMs: 520, key: 0, runs: 'infinite' },
}

const ACT_MOTION: Record<Profession, Motion> = {
  engineer: { mode: 'forward', cycleMs: 1600, key: 2, runs: 'infinite', ball: 'code' },
  drummer: { mode: 'forward', cycleMs: 520, key: 0, runs: 'infinite' },
  fighter: { mode: 'forward', cycleMs: 1300, key: 2, runs: 'infinite' },
}

export const motionFor = (pose: FighterPose, profession: Profession): Motion =>
  pose === 'act' ? ACT_MOTION[profession] : MOTION[pose]

export const SPECIALS = ['hadouken', 'shoryuken', 'tatsumaki'] as const
export type Special = (typeof SPECIALS)[number]

export const nextSpecial = (last: Special | null): Special =>
  SPECIALS[last === null ? 0 : (SPECIALS.indexOf(last) + 1) % SPECIALS.length]

// How far he may walk from his mark either way, in steps.
export const MAX_STEP = 2

export interface MoveState {
  playing: FighterPose | null
  last: Special | null
  step: number
}

export function startSpecial(state: MoveState): MoveState {
  if (state.playing) return state
  const move = nextSpecial(state.last)
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
  const [state, setState] = useState<MoveState>({ playing: intro, last: null, step: 0 })

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
