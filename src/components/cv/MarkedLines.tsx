import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

// Lines behind a world's marker without a look: a job's highlights, a project's details, the About
// highlights. The one owner of the empty list guard and the list's accessible name; the world passes its
// classes and its marker (drawn aria-hidden by the world), the way TechList and VentureList take theirs.

export interface MarkedLinesLook {
  list: string
  line: string
  marker: ReactNode
  /** The classes of the line's text, beside the marker. */
  text?: string
  /** The classes of a visible heading over the list, for a world that titles its lists with the label. */
  heading?: string
}

/** What one line adds to its item: a CSS variable per index, a data flag its CSS reads. */
export type MarkedLineProps = Pick<HTMLAttributes<HTMLLIElement>, 'className'> & {
  style?: CSSProperties
  [flag: `data-${string}`]: true | undefined
}

interface MarkedLinesProps {
  items: string[]
  label: string
  look: MarkedLinesLook
  /** `index` is the line's place in `items`; its className is added to the look's line. */
  lineProps?: (index: number) => MarkedLineProps
}

const NO_LINE_PROPS = (): MarkedLineProps => ({})

export function MarkedLines({ items, label, look, lineProps = NO_LINE_PROPS }: MarkedLinesProps) {
  if (items.length === 0) return null
  return (
    <>
      {look.heading && <h4 className={look.heading}>{label}</h4>}
      <ul className={look.list} aria-label={label}>
        {items.map((item, index) => {
          const { className = '', ...props } = lineProps(index)
          return (
            <li key={item} {...props} className={`${look.line} ${className}`.trim()}>
              {look.marker}
              <span className={look.text}>{item}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
