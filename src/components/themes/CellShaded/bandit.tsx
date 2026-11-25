import { hop } from '@/lib/motion/arc'

// How the desert throws what he beats: a raider, a car, a flyer knocked away from him.

/** A target flung away from him over `t`: up on an arc of `height`, `distance` back, turned over as it goes. */
export const flung = (t: number, distance: number, height: number): string =>
  `translate(${(distance * t).toFixed(1)} ${(-hop(t, height)).toFixed(1)}) rotate(${(95 * t).toFixed(1)})`
