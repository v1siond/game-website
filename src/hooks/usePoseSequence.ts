'use client'

import { useCallback, useEffect, useState, type AnimationEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { advancePose, hasArrived, playMove, poseOf, settleMove, START, stepEntrance, type MovePolicy, type PoseState } from './poseSequence'

// The one entrance, rest and one shot move sequence for every world's figure. The world owns the
// poses and the motion; this owns only when each pose shows. An entrance pose ends when the caller
// says so (usually the animationend of the element that moves); a move ends the same way, or after
// moveMs. With a still pose, reduced motion shows it and takes no moves; a world that stills its
// figure in its own CSS leaves still out and the sequence runs as it is.

export interface PoseSequenceOptions<P extends string> {
  /** Poses played once, in order, before the rest. */
  entrance: readonly P[]
  /** The pose held after the entrance; it may change from render to render. */
  rest: P
  /** Shown in place of everything under reduced motion, which then takes no moves. */
  still?: P
  /** A move ends on its own after this many ms; without it the caller ends it. */
  moveMs?: number
  /** When a move is taken (default once the entrance is over). */
  policy?: MovePolicy
}

export interface PoseSequence<P extends string> {
  pose: P
  arrived: boolean
  /** The one shot move playing, if any. */
  move: P | null
  /** Bumped on every taken move: key the sprite on it to replay a repeated move. */
  take: number
  play: (move: P) => void
  /** What was showing has played out: ends a move, else steps the entrance. */
  advance: () => void
  /** Ends the move playing, never the entrance. */
  settle: () => void
  /** Steps the entrance on the animationend of the element itself, ignoring its children's animations. */
  onOwnAnimationEnd: (event: AnimationEvent<Element>) => void
}

export function usePoseSequence<P extends string>({ entrance, rest, still, moveMs, policy = 'arrived' }: PoseSequenceOptions<P>): PoseSequence<P> {
  const stillPose = useReducedMotion() ? still : undefined
  const [state, setState] = useState<PoseState<P>>(START)
  const length = entrance.length

  useEffect(() => {
    if (state.move === null || moveMs === undefined) return
    const timer = window.setTimeout(() => setState(settleMove), moveMs)
    return () => window.clearTimeout(timer)
  }, [state.move, state.take, moveMs])

  const play = useCallback(
    (move: P) => {
      if (stillPose !== undefined) return
      setState((now) => playMove(now, move, policy, length))
    },
    [stillPose, policy, length],
  )
  const advance = useCallback(() => setState((now) => advancePose(now, length)), [length])
  const settle = useCallback(() => setState(settleMove), [])
  const onOwnAnimationEnd = useCallback(
    (event: AnimationEvent<Element>) => {
      if (event.target !== event.currentTarget) return
      setState((now) => stepEntrance(now, length))
    },
    [length],
  )

  if (stillPose !== undefined) return { pose: stillPose, arrived: true, move: null, take: state.take, play, advance, settle, onOwnAnimationEnd }

  return {
    pose: poseOf(state, entrance, rest),
    arrived: hasArrived(state, length),
    move: state.move,
    take: state.take,
    play,
    advance,
    settle,
    onOwnAnimationEnd,
  }
}
