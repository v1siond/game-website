'use client'

import { useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { CARD_BUTTON, CVLink, HeroAction } from './actions'
import { PANEL_HEADING, sectionHeadingId } from './panels'
import { useStageState } from './stage'
import horror from './horror.module.css'
import look from './world.module.css'

// Contact as the safe room. Behind the page he runs from the pursuer down the last corridor, gets through
// the safe door and shuts it, the pursuer pounds on it and goes, and inside he sits at the typewriter
// (./stage). Here the typewriter has typed his line on the paper, and Save spends one of three ink
// ribbons, the genre's limited save, and he types again behind the page. The ways to reach him are under
// the paper.

const RIBBONS = 3

function SaveDesk({ line }: { line: string }) {
  const { horror: words } = useLabels()
  const { save } = useStageState()
  const [ribbons, setRibbons] = useState(RIBBONS)
  const saved = ribbons < RIBBONS

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
      <div className="relative overflow-hidden bg-[color:var(--sh-ivory)] p-4">
        <p className={`text-base text-[color:var(--sh-void)] ${look.typed}`}>{line}</p>
        <span className={`${horror.typeCover} ${horror.typeCoverPaper} ${horror.typeIn}`} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            setRibbons((left) => Math.max(left - 1, 0))
            save()
          }}
          disabled={ribbons === 0}
          title={words.saveHint}
          className={`${CARD_BUTTON} justify-center border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame)] enabled:hover:border-[color:var(--sh-flame)] disabled:opacity-60`}
        >
          {words.save}
        </button>
        <p className={`text-sm text-[color:var(--sh-cream)] ${look.typed}`}>{fillLabel(words.inkRibbons, { count: ribbons })}</p>
        <p className={`text-sm text-[color:var(--sh-fine)] ${look.typed}`} role="status">
          {saved ? words.saved : ''}
        </p>
        <p className="text-sm italic text-[color:var(--sh-fog)]">{words.saveHint}</p>
      </div>
    </div>
  )
}

const HEADING = sectionHeadingId('Contact')

export function SafeRoom() {
  const { sections, horror: words, navigation } = useLabels()

  return (
    <section aria-labelledby={HEADING} className="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
      <div className={`p-4 sm:p-6 ${look.panel}`}>
        <h2 id={HEADING} className={PANEL_HEADING}>
          {sections.contact}
        </h2>
        <p className={`text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`}>{words.safeRoom}</p>

        <RecruiterHero
          render={({ line, actions }) => (
            <>
              <SaveDesk line={line} />
              <nav className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap" aria-label={navigation.contactAndCv}>
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </nav>
            </>
          )}
        />
      </div>
    </section>
  )
}
