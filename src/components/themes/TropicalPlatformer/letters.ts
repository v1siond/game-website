// The hidden letters of the jobs: the first four letters of his first name, spread over the job
// platforms the way the source spreads its four letters over a level (the first on the first card, the
// last on the last, the others evenly between). Fewer cards than letters: the letters go round the cards.

export const LETTER_COUNT = 4

/** The letters to collect: the start of the first word of his name, upper case. */
export function nameLetters(name: string): string[] {
  const first = name.trim().split(/\s+/)[0] ?? ''
  return Array.from(first.slice(0, LETTER_COUNT).toUpperCase())
}

/** For each letter, the index of the card that holds it. */
export function letterCards(letters: number, cards: number): number[] {
  if (cards === 0) return []
  if (letters === 1) return [0]
  return Array.from({ length: letters }, (_, i) => (cards >= letters ? Math.round((i * (cards - 1)) / (letters - 1)) : i % cards))
}
