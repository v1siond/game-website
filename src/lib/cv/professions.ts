// The three professions every world shows, in selector order. The ids are the ones the code and the
// data use; what a visitor reads for each is its label (labels.professions in content/cv/labels.json).

export type Profession = 'engineer' | 'drummer' | 'fighter'

// Left to right: Musician, System Engineer, Martial Artist. The engineer sits in the centre.
export const PROFESSION_ORDER: readonly Profession[] = ['drummer', 'engineer', 'fighter']

export const DEFAULT_PROFESSION: Profession = 'engineer'

export function isProfession(value: unknown): value is Profession {
  return typeof value === 'string' && (PROFESSION_ORDER as readonly string[]).includes(value)
}

// `?profession=<id>` forces a profession on load (preview capture and shared links).
export function professionFromSearch(search: string): Profession | null {
  const value = new URLSearchParams(search).get('profession')
  return isProfession(value) ? value : null
}

// What a page load opens on: `?profession=` first, then the pick made earlier in this visit (the CV is its
// own root layout, so going there and back reloads the page). Null means the default.
export function professionOnLoad(search: string, visitPick: string | null): Profession | null {
  const forced = professionFromSearch(search)
  if (forced) return forced
  return isProfession(visitPick) ? visitPick : null
}

// The neighbour one slot left (-1) or right (1), wrapping at both ends, for arrow key moves.
export function stepProfession(current: Profession, step: -1 | 1): Profession {
  const count = PROFESSION_ORDER.length
  const index = PROFESSION_ORDER.indexOf(current)
  return PROFESSION_ORDER[(index + step + count) % count]
}
