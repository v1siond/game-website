import type { ReactNode } from 'react'

// The world's type and card faces. Names and counts are the game's fat cartoon capitals (Luckiest Guy,
// --np-face); the reading text is a round sans (Nunito, --np-body). A card is one of the game's objects
// with a plain face, never text on the art: the crate's inner panel (cream planks in a wood frame), the
// warp sphere's glass, the time trial's black board.

export const FACE = 'font-[family-name:var(--np-face)] font-normal'
export const BODY = 'font-[family-name:var(--np-body)]'

/** The crate's inner panel: cream planks inside a wood frame with the crate's hard drop. */
export const PANEL =
  'relative rounded-md border-4 border-[color:var(--np-wood)] bg-[color:var(--np-cream)] p-4 text-[color:var(--np-ink)] shadow-[0_5px_0_var(--np-wood-dark)]'

/** The time trial's black board: gold and white on black. */
export const BOARD = 'rounded-md border-2 border-[color:var(--np-seam)] bg-[color:var(--np-board)] text-[color:var(--np-white)]'

/** A card's name, in the game's capitals, the wood text twin on the cream face. */
export const CARD_TITLE = `${FACE} text-xl leading-tight tracking-wide text-[color:var(--np-wood-text)]`

/** A plain line of a card's facts on the cream face. */
export const CARD_LINE = 'text-sm font-semibold text-[color:var(--np-ink-soft)]'

interface ListProps {
  items: readonly string[]
  label: string
  className?: string
}

/** Every tag of a card, none cut: the tech of a job, a project, a venture's services. */
export function Tags({ items, label, className = '' }: ListProps) {
  if (items.length === 0) return null
  return (
    <ul className={`mt-3 flex flex-wrap gap-1.5 ${className}`} aria-label={label}>
      {items.map((item) => (
        <li key={item} className="rounded-sm border-2 border-[color:var(--np-wood-dark)] bg-[color:var(--np-tag)] px-2 py-0.5 text-sm font-semibold text-[color:var(--np-ink)]">
          {item}
        </li>
      ))}
    </ul>
  )
}

/** A card's points, each behind a small berry: a job's highlights, a project's details. */
export function Points({ items, label, className = '' }: ListProps) {
  if (items.length === 0) return null
  return (
    <ul className={`mt-3 space-y-1.5 ${className}`} aria-label={label}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[color:var(--np-ink)] bg-[color:var(--np-berry)]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** A line of facts with a heading of its own, for the fields a card shows under its title. */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="mt-2 text-sm leading-relaxed">
      <span className="font-bold">{label}: </span>
      {children}
    </p>
  )
}
