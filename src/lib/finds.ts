// The find counter's state, without React: the ids a visitor has found, per group. A world counts what
// a visitor finds as they read (a level reached, an item picked up) and shows it against a total it
// knows. Read through FindProvider (src/components/themes/shared/finds.tsx).

export type Finds = Readonly<Record<string, ReadonlySet<string>>>

export interface FindCount {
  found: number
  total: number
}

export const NO_FINDS: Finds = {}

const EMPTY: ReadonlySet<string> = new Set()

/** The state with `id` found in `group`. A repeat returns the same state, so a reducer bails out. */
export function addFind(finds: Finds, id: string, group: string): Finds {
  const found = finds[group] ?? EMPTY
  if (found.has(id)) return finds
  return { ...finds, [group]: new Set(found).add(id) }
}

/** Found against total in one group; `full` (the world drawn in its final state) counts all as found. */
export function countIn(finds: Finds, group: string, total = 0, full = false): FindCount {
  if (full) return { found: total, total }
  return { found: finds[group]?.size ?? 0, total }
}
