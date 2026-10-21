import Link from 'next/link'
import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import atomic from './atomic.module.css'

// The world's actions as rows of the terminal's menu: the green text on the glass, and under the
// pointer or focus the row inverts (the phosphor bar fills in from the left, the text turns glass dark),
// the way the wrist terminal marks its pick. Email, LinkedIn, the CV and the link out to Nebulith, in the
// hero and again on the contact terminal.

export const MENU_ROW = `relative flex min-h-[44px] w-full items-center gap-3 px-3 text-left text-base font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow} ${atomic.focusRing}`

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

/** The four actions, one menu row each. */
export function ActionMenu({ className = '' }: { className?: string }) {
  const { actions, navigation } = useLabels()

  return (
    <RecruiterHero
      render={(hero) => (
        <nav aria-label={navigation.contactAndCv} className={className}>
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
              <Link href="/personal-projects/game-engine" className={MENU_ROW} aria-label={actions.viewEngine}>
                <Row>{actions.engine}</Row>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    />
  )
}
