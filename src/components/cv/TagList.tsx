import type { ReactNode } from 'react'

// A card's tags without a look: a job's skills, a project's technologies, a venture's services, every one.
// The one owner of the empty list guard and the list's accessible name; the world passes its classes and,
// when its tags carry one, the marker before each (drawn aria-hidden by the world).

export interface TagListLook {
  list: string
  tag: string
  marker?: ReactNode
}

export function TagList({ items, label, look }: { items: readonly string[]; label: string; look: TagListLook }) {
  if (items.length === 0) return null
  return (
    <ul className={look.list} aria-label={label}>
      {items.map((item) => (
        <li key={item} className={look.tag}>
          {look.marker}
          {item}
        </li>
      ))}
    </ul>
  )
}
