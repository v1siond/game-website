import { Fragment, type ReactNode } from 'react'
import { nameWords } from './nameWords'

// His name set one unbreakable word at a time: a narrow screen can wrap it between the words, never inside
// one. A world that draws the name letter by letter passes `letter`; its index counts from the start of the
// whole name (the gap included), so a reveal staggered by letter runs on from one word into the next. A
// world that marks the gap between words (a star, a wider space in a flex row) passes `gap`.

interface NameWordsProps {
  name: string
  letter?: (letter: string, index: number) => ReactNode
  gap?: ReactNode
  wordClassName?: string
}

const drawnWord = (word: string, start: number, letter: NameWordsProps['letter']): ReactNode =>
  letter ? Array.from(word, (char, i) => <Fragment key={i}>{letter(char, start + i)}</Fragment>) : word

export function NameWords({ name, letter, gap = ' ', wordClassName = '' }: NameWordsProps) {
  return (
    <>
      {nameWords(name).map(({ word, start }, index) => (
        <Fragment key={start}>
          {index > 0 && gap}
          <span className={`whitespace-nowrap ${wordClassName}`}>{drawnWord(word, start, letter)}</span>
        </Fragment>
      ))}
    </>
  )
}
