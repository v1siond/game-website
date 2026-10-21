'use client'

import { useCallback, useEffect, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { MOVES, type Move } from './rig'
import type { SpriteMotion } from './sprite'

// A scene's prop moving in time with one of his moves: the prop's keyframes (offsets 0 to 1) play over
// the move's length from rig.ts each time the take changes, so the foe he lifts or the blade he throws
// keeps to his hands. Take 0 is nothing played yet; reduced motion plays nothing and the scene shows its
// end state through its own markup.

export function useTrack(ref: RefObject<Element | null>, frames: Keyframe[], ms: number, take: number) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || take === 0 || reduced || typeof element.animate !== 'function') return
    const animation = element.animate(frames, { duration: ms, fill: 'forwards' })
    return () => animation.cancel()
  }, [ref, frames, ms, take, reduced])
}

/** A scene's one move: played once when the scene starts and again on replay; its take keys the sprite and the props. */
export function useSceneMove(move: Move, start: boolean) {
  const sequence = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const { play } = sequence

  useEffect(() => {
    if (start) play(move)
  }, [start, move, play])

  const replay = useCallback(() => play(move), [play, move])
  return { ...sequence, replay, ms: MOVES[move].ms }
}
