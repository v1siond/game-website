'use client'

import { useMemo } from 'react'
import { Big_Shoulders, Bricolage_Grotesque } from 'next/font/google'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useYearNow } from '@/hooks/useYearNow'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Beacon, Ledger, Rail } from './EraPostcards/chrome'
import { useEraEngine } from './EraPostcards/engine'
import { HubHero } from './EraPostcards/hero'
import { PAGE_VARS } from './EraPostcards/palette'
import { scenesOf, type Scene } from './EraPostcards/scenes'
import { EraSection } from './EraPostcards/sections'
import { Theatre } from './EraPostcards/stage'
import css from './EraPostcards/page.module.css'

// The world's lettering: tall condensed display capitals for his name, the gate titles and the stamps
// (--ep-face), a grotesque for the reading text (--ep-body).
const eraFace = Big_Shoulders({ weight: ['700', '900'], subsets: ['latin'], display: 'swap', variable: '--ep-face' })
const eraBody = Bricolage_Grotesque({ weight: ['400', '600', '700'], subsets: ['latin'], display: 'swap', variable: '--ep-body' })

// Era Postcards: his CV as a scroll through the Chronoport, the time portal that opens on one era per part
// of the CV, every profession on one page. The page keeps the rhythm of the Rockstar VI site: a big hero,
// then every section is one full bleed era picture that rises from dark, holds while its text and cards
// scroll over it, and sinks back into dark while the next era rises. He is the time courier in each
// picture and does one thing per card of the section: lights a rune stone, passes a mile sign, opens a
// crate. Every motion is a function of the scroll position (engine.ts on the shared useScrollStage), drawn
// with the settle: stop and it comes to rest, scroll up and it plays back. The text is plain HTML in the
// page flow over the fixed theatre of pictures, opaque from its first frame, and settles with the art.
//
// The whole world renders on the server, the default world's contract (docs/CV-THEME-SYSTEM.md): every CV
// string is in the HTML and the hero's picture shows its first frame through CSS before the engine runs.
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

export default function EraPostcardsTheme() {
  const cv = useCVData()
  const labels = useLabels()
  const year = useYearNow()
  const reduced = useReducedMotion()
  const scenes = useMemo(() => scenesOf(cv, labels, year), [cv, labels, year])
  const { theatreRef, textRef } = useEraEngine(scenes, reduced)
  const gates = scenes.filter((scene): scene is Scene & { slot: NonNullable<Scene['slot']> } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  return (
    <div style={PAGE_VARS} className={`${css.root} ${reduced ? css.still : ''} ${eraFace.variable} ${eraBody.variable} [--focus-ring:var(--ep-portal)] [--focus-halo:var(--ep-ink)]`}>
      <SkipLink className={css.skip} />
      {!reduced && <Theatre scenes={scenes} theatreRef={theatreRef} />}
      <Ledger />
      <Rail scenes={scenes} />
      <div ref={textRef} className={css.text}>
        <main id="main-content" className={css.main}>
          <HubHero still={reduced} scene={scenes[0]} />
          {gates.map((scene) => (
            <EraSection key={scene.id} scene={scene} still={reduced} />
          ))}
          <Beacon scene={contact} still={reduced} />
        </main>
        <footer className={css.footer}>
          <CopyrightLine />
        </footer>
      </div>
    </div>
  )
}
