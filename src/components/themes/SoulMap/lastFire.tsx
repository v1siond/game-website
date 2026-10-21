'use client'

import { useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { Bonfire } from './bonfire'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { useRun } from './run'
import { BUTTON_LIT, CVLink, EngineLink } from './links'
import { AreaTitle } from './menu'
import { CARVED } from './palette'
import souls from './souls.module.css'

// Contact is the last fire at the end of the road, still unlit, with his email and LinkedIn written on
// the floor beside it as the game's orange messages. Kindle lights it: the flame climbs the sword, the
// gold banner shows, and he sits down by it in the gear of the profession on show. The messages are the
// links themselves.

const KINDLE_SOULS = 500
// Two heavy strides to the fire (knight.module.css), the length of the slide that carries him there
// (.atFire), then he lowers himself down beside it.
const WALK_MS = 2400

export function LastFire({ profession }: { profession: Profession }) {
  const run = useRun()
  const { sections, souls: words } = useLabels()
  const [lit, setLit] = useState(false)
  const script = usePoseScript('idle')
  const id = headingId('soul', sections.contact)

  const kindle = () => {
    if (lit) return
    setLit(true)
    run.announce('kindled', words.kindled)
    run.earn(KINDLE_SOULS)
    run.rest()
    script.play([{ pose: 'walk', ms: WALK_MS }], 'sit')
  }

  return (
    <section className="relative px-4 pb-16 pt-12 sm:px-6" aria-labelledby={id}>
      <div className="mx-auto max-w-4xl">
        <AreaTitle id={id} title={sections.contact} />
        <div className="relative mx-auto mt-8 h-64 max-w-xl sm:h-72">
          <div className={`absolute inset-x-0 bottom-0 h-24 rounded-[50%] ${souls.lastGround}`} aria-hidden="true" />
          <div className="absolute bottom-6 left-1/2 h-44 w-40 -ml-20">
            <Bonfire state={lit ? 'lit' : 'out'} className="h-full w-full" />
          </div>
          <div className={`absolute bottom-7 left-[18%] aspect-[60/96] h-40 sm:left-[22%] ${lit ? souls.atFire : ''}`}>
            <Knight key={script.key} gear={profession} pose={script.pose} className="h-full w-full" />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          {lit ? null : (
            <>
              <p className="text-sm italic text-[color:var(--soul-text-soft)]">{words.kindleHint}</p>
              <button type="button" onClick={kindle} className={BUTTON_LIT}>
                {words.kindle}
              </button>
            </>
          )}
        </div>

        <RecruiterHero
          render={({ line, actions }) => (
            <div className="mt-8 text-center">
              <ul className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
                {actions.map((action) => (
                  <li key={action.id} className={`${souls.slab} p-4`}>
                    <a
                      {...action.linkProps}
                      className={`${souls.inscription} ${CARVED} block min-h-[44px] break-words text-lg text-[color:var(--soul-message)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--soul-glow)]`}
                    >
                      <span className="block text-sm uppercase tracking-[0.24em] text-[color:var(--soul-text-soft)]">{action.label}</span>
                      {action.value}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[color:var(--soul-text-soft)]">{line}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <CVLink />
                <EngineLink />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
