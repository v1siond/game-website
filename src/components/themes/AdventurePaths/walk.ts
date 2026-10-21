'use client'

import { useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { pointAt, type Point, type Trail } from './trail'

// His walk on a map, the way an overworld marker travels: node to node along the dotted trail at one
// steady pace, never cutting across, turning to face the way he goes, and stepping in two frames while
// he moves. One requestAnimationFrame loop writes one transform on one element per frame; React never
// re-renders during the walk. Under reduced motion he is placed on the last stop at once.
//
// The marker element is a box laid over the whole map (absolute, inset 0), so a translate in percent of
// its own size is a percent of the map, and the figure inside hangs from its top left corner.

/** One stretch of a walk: along `trail` from one distance to another (backward when `to` < `from`). */
export interface WalkLeg {
  trail: Trail
  from: number
  to: number
}

interface MapBox {
  width: number
  height: number
  /** Map units a second. */
  speed: number
  /** Called with his point each time he is placed, so a camera can follow him. */
  follow?: (point: Point) => void
}

const legLength = (leg: WalkLeg): number => Math.abs(leg.to - leg.from)

/** Where the walk stands after `travelled` map units, and whether that step heads left (undefined at a
 *  standstill, where he keeps the way he faced). */
export function walkPosition(legs: readonly WalkLeg[], travelled: number): { point: Point; left?: boolean } {
  let remaining = travelled
  for (const leg of legs) {
    const length = legLength(leg)
    if (remaining <= length || leg === legs[legs.length - 1]) {
      const along = leg.from + Math.sign(leg.to - leg.from) * Math.min(remaining, length)
      const ahead = pointAt(leg.trail, along + Math.sign(leg.to - leg.from))
      const point = pointAt(leg.trail, along)
      return { point, left: ahead[0] === point[0] ? undefined : ahead[0] < point[0] }
    }
    remaining -= length
  }
  return { point: [0, 0] }
}

export function useTrailWalker({ width, height, speed, follow }: MapBox) {
  const markerRef = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const place = useCallback(
    ([x, y]: Point, left?: boolean) => {
      const marker = markerRef.current
      if (!marker) return
      marker.style.transform = `translate3d(${((x / width) * 100).toFixed(3)}%, ${((y / height) * 100).toFixed(3)}%, 0)`
      if (left !== undefined) marker.dataset.facing = left ? 'left' : 'right'
      follow?.([x, y])
    },
    [width, height, follow],
  )

  const stop = useCallback(() => {
    window.cancelAnimationFrame(frame.current)
    frame.current = 0
    if (markerRef.current) markerRef.current.dataset.walking = 'false'
  }, [])

  /** Walks the legs in turn, then calls `onArrive`. A new walk cancels the one under way. */
  const walk = useCallback(
    (legs: readonly WalkLeg[], onArrive: () => void = () => undefined) => {
      stop()
      const total = legs.reduce((sum, leg) => sum + legLength(leg), 0)
      if (legs.length === 0 || total === 0 || prefersReducedMotion()) {
        if (legs.length > 0) place(walkPosition(legs, total).point)
        onArrive()
        return
      }

      const marker = markerRef.current
      if (marker) marker.dataset.walking = 'true'
      const started = performance.now()
      const tick = (now: number) => {
        const travelled = Math.min(((now - started) / 1000) * speed, total)
        const { point, left } = walkPosition(legs, travelled)
        place(point, left)
        if (travelled < total) {
          frame.current = window.requestAnimationFrame(tick)
          return
        }
        stop()
        onArrive()
      }
      frame.current = window.requestAnimationFrame(tick)
    },
    [place, speed, stop],
  )

  useEffect(() => stop, [stop])

  return { markerRef, place, walk }
}
