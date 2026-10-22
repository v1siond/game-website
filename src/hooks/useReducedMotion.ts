'use client'

import { matchesMedia, useMediaQuery } from './useMediaQuery'

// The one reduced motion check for every world, read through the shared media query reader.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** A one off read for code that decides at the moment of an event, outside render. */
export const prefersReducedMotion = (): boolean => matchesMedia(REDUCED_MOTION_QUERY)

export const useReducedMotion = (): boolean => useMediaQuery(REDUCED_MOTION_QUERY)
