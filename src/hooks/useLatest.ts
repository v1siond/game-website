'use client'

import { useLayoutEffect, useRef, type RefObject } from 'react'

/** The latest value of a render, held in a ref, for a callback, timer or effect that reads it without
 *  rerunning when it changes (a new callback each render never rebuilds an observer or restarts a clock).
 *  A layout effect writes it, never the render itself, so it is set before any layout effect, passive
 *  effect, timer or observer callback of that commit reads it. Next 15's own React has no useEffectEvent,
 *  so this is the stable pattern it stands for. */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
