import Link from 'next/link'
import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import atomic from './atomic.module.css'
import { ENGINE_LINK } from '@/lib/engineLink'

// The world's actions as rows of the terminal's menu: the green text on the glass, and under the
// pointer or focus the row inverts (the phosphor bar fills in from the left, the text turns glass dark),
// the way the wrist terminal marks its pick. Email, LinkedIn, the CV and the link out to Nebulith, in the
// hero and again on the contact terminal. Beside them the world's other controls and list pieces: the
// outlined phosphor button, the tag chip and the "+" objective row.

export const MENU_ROW = `relative flex min-h-[44px] w-full items-center gap-3 px-3 text-left text-base font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow}`

/** The outlined phosphor button (a file's Read, Close and links, the terminal's Reboot); its label sits in a
 *  `relative` span over the bar that fills in under the pointer. */
export const PHOSPHOR_BUTTON = `relative min-h-[44px] border-2 border-atomic-phosphor px-3 text-sm font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow}`

/** A technology or skill tag in a card's list. */
export function AtomicChip({ children }: { children: ReactNode }) {
  return <li className="border border-atomic-phosphor/40 px-2 py-0.5 text-sm text-atomic-phosphor-dim-text">{children}</li>
}

/** An objective row: a "+" and the text, inverting under the pointer like a menu pick. */
export function PlusRow({ children }: { children: ReactNode }) {
  return (
    <li className={`relative flex gap-2 px-2 py-1 text-sm text-atomic-phosphor ${atomic.pickRow}`}>
      <span className="relative" aria-hidden="true">
        +
      </span>
      <span className="relative">{children}</span>
    </li>
  )
}

function Row({ children }: { children: ReactNode }) {
  return (
    <>
      <span className={atomic.menuCaret} aria-hidden="true">
        &gt;
      </span>
      <span className="relative">{children}</span>
    </>
  )
}

/** The four actions, one menu row each. A second copy on the page takes its own label so the two navs differ. */
export function ActionMenu({ className = '', label }: { className?: string; label?: string }) {
  const { actions, navigation } = useLabels()

  return (
    <RecruiterHero
      render={(hero) => (
        <nav aria-label={label ?? navigation.contactAndCv} className={className}>
          <ul className="space-y-1">
            {hero.actions.map((action) => (
              <li key={action.id}>
                <a {...action.linkProps} className={MENU_ROW}>
                  <Row>{action.label}</Row>
                </a>
              </li>
            ))}
            <li>
              <Link href="/cv" className={MENU_ROW}>
                <Row>{actions.cv}</Row>
              </Link>
            </li>
            <li>
              <Link {...ENGINE_LINK} className={MENU_ROW} aria-label={actions.viewEngine}>
                <Row>{actions.engine}</Row>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    />
  )
}
