export interface NameWord {
  word: string
  /** Where the word's first letter sits in the name as written, so letter indexes run across the whole name. */
  start: number
}

/** The words of a name in order, split on any run of spaces. */
export const nameWords = (name: string): NameWord[] =>
  Array.from(name.matchAll(/\S+/g), (match) => ({ word: match[0], start: match.index ?? 0 }))

/** His initials, a world's HUD mark: the first letter of each word of the name. */
export const initialsOf = (name: string): string =>
  nameWords(name)
    .map(({ word }) => word.charAt(0))
    .join('')
