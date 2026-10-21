import { Fragment } from 'react'
import { slashParts } from './slashParts'

// A company or project name that may wrap after each slash and nowhere else, so a long joined pair fits a
// narrow card without the browser cutting inside one of the names.
export function SlashBreaks({ text }: { text: string }) {
  return (
    <>
      {slashParts(text).map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </>
  )
}
