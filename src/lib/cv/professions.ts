// The three professions every world shows, in selector order. The ids are the ones the code and the
// data already use; the labels are what a visitor reads.

export type Profession = 'engineer' | 'drummer' | 'fighter'

// Left to right: Musician, System Engineer, Martial Artist. The engineer sits in the centre.
export const PROFESSION_ORDER: readonly Profession[] = ['drummer', 'engineer', 'fighter']

export const DEFAULT_PROFESSION: Profession = 'engineer'

export const PROFESSION_LABELS: Readonly<Record<Profession, string>> = {
  drummer: 'Musician',
  engineer: 'System Engineer',
  fighter: 'Martial Artist',
}

export function isProfession(value: unknown): value is Profession {
  return typeof value === 'string' && (PROFESSION_ORDER as readonly string[]).includes(value)
}

// `?profession=<id>` forces a profession on load (preview capture and shared links).
export function professionFromSearch(search: string): Profession | null {
  const value = new URLSearchParams(search).get('profession')
  return isProfession(value) ? value : null
}

// The neighbour one slot left (-1) or right (1), wrapping at both ends, for arrow key moves.
export function stepProfession(current: Profession, step: -1 | 1): Profession {
  const count = PROFESSION_ORDER.length
  const index = PROFESSION_ORDER.indexOf(current)
  return PROFESSION_ORDER[(index + step + count) % count]
}
