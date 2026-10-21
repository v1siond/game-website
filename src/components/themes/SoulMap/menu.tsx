import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { CVData } from '@/lib/cv/content'
import { CARVED } from './palette'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// The game's menu pieces: the stone panel with its worn gold frame, the menu screen that fades open when
// the visitor reaches it, the section title set like an area's name (carved capitals between two thin
// rules), the item slots the tech stack fills, and the type sizes every card of the world shares.

export const CARD_TITLE = `${CARVED} text-base uppercase tracking-[0.14em] text-[color:var(--soul-text)]`
export const CARD_META = 'text-sm tracking-wide text-[color:var(--soul-text-soft)]'
export const CARD_BODY = 'text-sm leading-relaxed text-[color:var(--soul-text)]'
export const TAG = `${ashen.slot} inline-block px-2 py-0.5 text-sm text-[color:var(--soul-text-soft)]`

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${ashen.panel} p-5 ${className}`}>{children}</div>
}

// A menu screen: the panel fades open in place once it is on screen (souls.module.css .menu).
export function MenuPanel({ children }: { children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.15 })
  return (
    <div ref={ref} className={`${souls.menu} ${triggered ? souls.menuOn : ''}`}>
      <Panel>{children}</Panel>
    </div>
  )
}

export function AreaTitle({ id, title, className = '' }: { id?: string; title: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[color:var(--soul-glow-deep)]" aria-hidden="true" />
      <h2 id={id} className={`${CARVED} text-center text-xl uppercase tracking-[0.3em] text-[color:var(--soul-text)] sm:text-2xl`}>
        {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[color:var(--soul-glow-deep)]" aria-hidden="true" />
    </div>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="mb-6 mt-2 text-center text-sm italic text-[color:var(--soul-text-soft)]">{children}</p>
}

// The tech stack as an equipment screen: each category a group of item slots, the groups packed in
// masonry by their length, coming up one after another as the menu opens.
export function TechSlots({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <div className={souls.slotGroup}>
            <h3 className={`${CARVED} mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[color:var(--soul-glow)]`}>
              <span className="grayscale" aria-hidden="true">
                {category.icon}
              </span>
              {category.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5" aria-label={category.name}>
              {category.items.map((tech) => (
                <li key={tech} className={TAG}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  )
}
