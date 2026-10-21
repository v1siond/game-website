// The password terminal's rules, as plain functions the contact screen draws: a memory dump of junk
// characters with candidate words hidden in it, one of them the password. A wrong guess costs an attempt
// and answers with its likeness (letters in the right place); a closed bracket pair inside one row
// removes a dud or restores the attempts; at zero attempts the terminal locks until it is rebooted.
// The candidate words are his own tools (the tech stack), so the game spells his CV.

export type HackCell =
  | { kind: 'junk'; text: string }
  | { kind: 'word'; word: string }
  | { kind: 'bracket'; id: number; text: string }

export interface HackRow {
  address: string
  cells: HackCell[]
}

export interface HackBoard {
  rows: HackRow[]
  words: string[]
  password: string
}

export type BracketEffect = 'dud' | 'reset'

export interface HackLogEntry {
  kind: 'denied' | 'granted' | BracketEffect
  word: string
  likeness: number
}

export interface HackState {
  attempts: number
  removed: string[]
  usedBrackets: number[]
  log: HackLogEntry[]
  status: 'playing' | 'granted' | 'locked'
}

export type HackAction = { type: 'guess'; word: string } | { type: 'bracket'; id: number }

export const MAX_ATTEMPTS = 4
export const ROW_WIDTH = 12
const ROW_COUNT = 18
const MAX_WORDS = 8
const MIN_WORDS = 4
const WORD_LENGTHS = [4, 5, 6, 7, 8]
const JUNK = '!@#$%^&*-_+=|\\/:;,.?\'"'
const BRACKETS: ReadonlyArray<readonly [string, string]> = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
]
const BRACKET_ROWS = 4
const ADDRESS_BASE = 0xf000

/** A seeded generator (mulberry32), so one seed always builds the same board. */
function random(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const junk = (next: () => number, length: number): string =>
  Array.from({ length }, () => JUNK[Math.floor(next() * JUNK.length)]).join('')

/** Letters in the same place in both words. */
export const likeness = (guess: string, password: string): number =>
  [...guess].filter((letter, index) => password[index] === letter).length

/**
 * The words the board can hide: his tools spelled in plain capital letters, all of one length (the
 * length most of them share), at most eight. Fewer than four of one length is no game.
 */
export function candidateWords(tools: string[]): string[] {
  const plain = [...new Set(tools.map((tool) => tool.toUpperCase()).filter((tool) => /^[A-Z]+$/.test(tool)))]
  const byLength = WORD_LENGTHS.map((length) => plain.filter((word) => word.length === length))
  const richest = byLength.reduce((best, words) => (words.length >= best.length ? words : best), [])
  return richest.length >= MIN_WORDS ? richest.slice(0, MAX_WORDS) : []
}

const wordRow = (next: () => number, word: string): HackCell[] => {
  const before = Math.floor(next() * (ROW_WIDTH - word.length + 1))
  return [
    { kind: 'junk', text: junk(next, before) },
    { kind: 'word', word },
    { kind: 'junk', text: junk(next, ROW_WIDTH - word.length - before) },
  ]
}

const bracketRow = (next: () => number, id: number): HackCell[] => {
  const [open, close] = BRACKETS[id % BRACKETS.length]
  const inner = 1 + Math.floor(next() * 4)
  const before = Math.floor(next() * (ROW_WIDTH - inner - 2))
  return [
    { kind: 'junk', text: junk(next, before) },
    { kind: 'bracket', id, text: `${open}${junk(next, inner).replace(/[A-Z]/g, '.')}${close}` },
    { kind: 'junk', text: junk(next, ROW_WIDTH - inner - 2 - before) },
  ]
}

/** The board for these words, the same for the same seed; null when there are too few words to play. */
export function buildBoard(tools: string[], seed: number): HackBoard | null {
  const words = candidateWords(tools)
  if (words.length === 0) return null
  const next = random(seed)
  const step = Math.floor(ROW_COUNT / words.length)
  const wordAt = new Map(words.map((word, index) => [index * step + Math.floor(next() * step), word]))
  const free = Array.from({ length: ROW_COUNT }, (_, row) => row).filter((row) => !wordAt.has(row))
  const bracketAt = new Map(
    Array.from({ length: BRACKET_ROWS }, (_, id) => [free[Math.floor(((id + next()) * free.length) / BRACKET_ROWS)], id] as const),
  )
  const start = ADDRESS_BASE + Math.floor(next() * 0xe00)

  const cellsOf = (row: number): HackCell[] => {
    const word = wordAt.get(row)
    if (word) return wordRow(next, word)
    const bracket = bracketAt.get(row)
    if (bracket !== undefined) return bracketRow(next, bracket)
    return [{ kind: 'junk', text: junk(next, ROW_WIDTH) }]
  }

  const rows = Array.from({ length: ROW_COUNT }, (_, row): HackRow => ({
    address: `0x${(start + row * ROW_WIDTH).toString(16).toUpperCase()}`,
    cells: cellsOf(row),
  }))

  return { rows, words, password: words[Math.floor(next() * words.length)] }
}

export const initialHack = (): HackState => ({ attempts: MAX_ATTEMPTS, removed: [], usedBrackets: [], log: [], status: 'playing' })

/** Even pairs remove a dud, odd pairs restore the attempts. */
const bracketEffect = (id: number): BracketEffect => (id % 2 === 0 ? 'dud' : 'reset')

const guess = (state: HackState, board: HackBoard, word: string): HackState => {
  if (word === board.password) {
    return { ...state, status: 'granted', log: [...state.log, { kind: 'granted', word, likeness: word.length }] }
  }
  const attempts = state.attempts - 1
  return {
    ...state,
    attempts,
    status: attempts === 0 ? 'locked' : 'playing',
    log: [...state.log, { kind: 'denied', word, likeness: likeness(word, board.password) }],
  }
}

const firstDud = (state: HackState, board: HackBoard): string | undefined =>
  board.words.find((word) => word !== board.password && !state.removed.includes(word))

const bracket = (state: HackState, board: HackBoard, id: number): HackState => {
  const effect = bracketEffect(id)
  const dud = firstDud(state, board)
  const used = { ...state, usedBrackets: [...state.usedBrackets, id] }
  if (effect === 'reset' || !dud) {
    return { ...used, attempts: MAX_ATTEMPTS, log: [...state.log, { kind: 'reset', word: '', likeness: 0 }] }
  }
  return { ...used, removed: [...state.removed, dud], log: [...state.log, { kind: 'dud', word: dud, likeness: 0 }] }
}

const finished = (state: HackState): boolean => state.status !== 'playing'

/** The terminal's next state. Guesses and brackets do nothing once it is granted or locked; a reboot is a
 *  new board and a fresh initialHack. */
export function hackReducer(board: HackBoard) {
  return (state: HackState, action: HackAction): HackState => {
    if (finished(state)) return state
    if (action.type === 'guess') {
      if (state.removed.includes(action.word)) return state
      return guess(state, board, action.word)
    }
    if (state.usedBrackets.includes(action.id)) return state
    return bracket(state, board, action.id)
  }
}
