// The code matrix of a project's breach, as plain data and rules (no React). The first pick comes from the
// top row, then the lit line alternates column, row, column; each pick fills a buffer slot; the file
// opens when the buffer ends with the whole sequence, and a full buffer without it is a miss. The
// matrix is drawn from the project's slug, so the same project always shows the same matrix, and the
// sequence is planted on a legal path, so every matrix can be solved within the buffer.

// The world's six bytes (its own set, not the source game's), shown as two hex digits.
const BYTES = [0x3a, 0x7e, 0xc2, 0x5d, 0x91, 0xe4] as const

export const MATRIX_SIZE = 5
export const SEQUENCE_LENGTH = 3
// Two spare slots: a wrong pick or two can be recovered from.
export const BUFFER_SIZE = SEQUENCE_LENGTH + 2

export type Axis = 'row' | 'column'

export interface Cell {
  row: number
  column: number
}

export interface BreachPuzzle {
  matrix: number[][]
  sequence: number[]
}

export interface BreachState {
  picks: Cell[]
  axis: Axis
  // The index of the lit row or column.
  line: number
}

export type BreachOutcome = 'open' | 'full' | 'running'

export const byteText = (byte: number): string => byte.toString(16).toUpperCase().padStart(2, '0')

/** A small seeded generator (mulberry32), so a slug always gives the same matrix. */
function seeded(seedText: string): () => number {
  let seed = [...seedText].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 2654435761) >>> 0, 1779033703)
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pickIndex = (random: () => number, count: number): number => Math.floor(random() * count)

/** Another index on the line, never `taken`. */
const otherIndex = (random: () => number, taken: number[]): number => {
  const free = Array.from({ length: MATRIX_SIZE }, (_, i) => i).filter((i) => !taken.includes(i))
  return free[pickIndex(random, free.length)]
}

/** A legal path of `length` cells: top row first, then alternating column and row, no cell twice. */
function plantPath(random: () => number, length: number): Cell[] {
  const path: Cell[] = [{ row: 0, column: pickIndex(random, MATRIX_SIZE) }]
  while (path.length < length) {
    const last = path[path.length - 1]
    const alongColumn = path.length % 2 === 1
    const next = alongColumn
      ? { row: otherIndex(random, path.filter((c) => c.column === last.column).map((c) => c.row)), column: last.column }
      : { row: last.row, column: otherIndex(random, path.filter((c) => c.row === last.row).map((c) => c.column)) }
    path.push(next)
  }
  return path
}

export function breachPuzzle(slug: string): BreachPuzzle {
  const random = seeded(slug)
  const matrix = Array.from({ length: MATRIX_SIZE }, () => Array.from({ length: MATRIX_SIZE }, () => BYTES[pickIndex(random, BYTES.length)]))
  const path = plantPath(random, SEQUENCE_LENGTH)
  const sequence = path.map(() => BYTES[pickIndex(random, BYTES.length)])
  path.forEach(({ row, column }, i) => {
    matrix[row][column] = sequence[i]
  })
  return { matrix, sequence }
}

export const BREACH_START: BreachState = { picks: [], axis: 'row', line: 0 }

const samePlace = (a: Cell, b: Cell): boolean => a.row === b.row && a.column === b.column

export function canPick(state: BreachState, cell: Cell): boolean {
  if (state.picks.length >= BUFFER_SIZE) return false
  if (state.picks.some((pick) => samePlace(pick, cell))) return false
  return state.axis === 'row' ? cell.row === state.line : cell.column === state.line
}

/** The state after picking `cell`; an illegal pick leaves the state as it was. */
export function pick(state: BreachState, cell: Cell): BreachState {
  if (!canPick(state, cell)) return state
  return state.axis === 'row'
    ? { picks: [...state.picks, cell], axis: 'column', line: cell.column }
    : { picks: [...state.picks, cell], axis: 'row', line: cell.row }
}

export const bufferBytes = (puzzle: BreachPuzzle, state: BreachState): number[] =>
  state.picks.map(({ row, column }) => puzzle.matrix[row][column])

/** How many leading bytes of the sequence the buffer ends with: a wrong byte drops the count. */
export function matched(puzzle: BreachPuzzle, state: BreachState): number {
  const buffer = bufferBytes(puzzle, state)
  const { sequence } = puzzle
  for (let count = Math.min(sequence.length, buffer.length); count > 0; count -= 1) {
    const tail = buffer.slice(buffer.length - count)
    if (tail.every((byte, i) => byte === sequence[i])) return count
  }
  return 0
}

export function outcome(puzzle: BreachPuzzle, state: BreachState): BreachOutcome {
  if (matched(puzzle, state) === puzzle.sequence.length) return 'open'
  if (state.picks.length >= BUFFER_SIZE) return 'full'
  return 'running'
}
