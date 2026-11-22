'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useZoneStageContext } from '@/hooks/useZoneStage'
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

/**
 * A scene's one move: played once when the scene (the element `ref` is set on) first shows `threshold` of
 * itself, from the section trigger's entry, and again on replay; its take restarts the sprite and the props.
 */
export function useSceneMove(move: Move, threshold: number) {
  const sequence = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const { play } = sequence
  const { ref } = useSectionTrigger({ threshold, onEnter: () => play(move) })

  const replay = useCallback(() => play(move), [play, move])
  return { ...sequence, ref, replay, ms: MOVES[move].ms }
}

/**
 * One turn at a time, in the list's order: each item that scrolls in is entered, and the next entered item
 * takes its turn a gap after the last one (a fight per job, a reach per tech group). Take counts the turns
 * played; `onTurn` is called from the queue's clock as each turn starts, so the scene plays its move then.
 * Under reduced motion every item is done from the start and no turn is taken.
 */
export function useTurnQueue(items: readonly { id: string }[], gapMs: number, onTurn: () => void) {
  const { reduced } = useZoneStageContext()
  const [entered, setEntered] = useState<ReadonlySet<string>>(new Set())
  const [done, setDone] = useState<readonly string[]>([])
  const lastTurn = useRef(0)
  const next = items.find((item) => entered.has(item.id) && !done.includes(item.id))

  // The latest onTurn, held in a ref a layout effect writes, so a new one each render never resets the clock.
  const turnRef = useRef(onTurn)
  useLayoutEffect(() => {
    turnRef.current = onTurn
  })

  const enter = useCallback((id: string) => {
    setEntered((current) => (current.has(id) ? current : new Set(current).add(id)))
  }, [])

  useEffect(() => {
    if (!next || reduced) return
    const wait = Math.max(0, lastTurn.current + gapMs - Date.now())
    const timer = window.setTimeout(() => {
      lastTurn.current = Date.now()
      setDone((current) => [...current, next.id])
      turnRef.current()
    }, wait)
    return () => window.clearTimeout(timer)
  }, [next, reduced, gapMs])

  const isDone = (id: string) => reduced || done.includes(id)
  return { enter, isDone, take: done.length, count: reduced ? items.length : done.length }
}
