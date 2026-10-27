// The wardrobe plate's count line, "Outfit n of 17": the place of a world in the tour. No DOM here.
import { TOUR_ORDER } from './nudge'

/** The world's place in TOUR_ORDER counted from 1, the outfit number; null for an id outside the tour. */
export function outfitPlace(id: string): number | null {
  const at = TOUR_ORDER.indexOf(id)
  if (at === -1) return null
  return at + 1
}
