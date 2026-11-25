'use client'

import { useMemo } from 'react'
import { Marcellus } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { LastFireContact, TopBar } from './SoulMap/chrome'
import { ShrineHero } from './SoulMap/hero'
import { CARVED, SOUL_VARS } from './SoulMap/palette'
import { PhoneView } from './SoulMap/ruins'
import { LAYER_MOTION, scenesOf, type SoulScene } from './SoulMap/scenes'
import { PlaceSection } from './SoulMap/sections'
import page from './SoulMap/page.module.css'

// The carved serif, Marcellus, the closest free face to the banner capitals the world was drawn for: the
// root carries its --soul-carved variable and CARVED reads it.
const soulCarved = Marcellus({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--soul-carved',
})

// Soul Map: his CV as one way through a ruined kingdom at dusk under ash, the world of the dark action game
// it comes from, one fire the only warm light in it. A big hero (the shrine where the fire catches, him in
// his armour, his name in carved capitals, the class menu where he picks a profession), then every section
// of the shown profession is one full screen place that rises from dark, holds while its cards scroll over
// it, and goes dark while the next one rises: the rest by the fire, the plunge off a ledge, the parry and
// riposte, the fog gate, the demon's arena, the great door, the bell tower, the shield knight, and the last
// fire with its chest at the end. In each he is the heavy knight side on, and the shared scene player plays
// its one to three of the game's moves at their own pace as the section arrives (the shared theatre): scroll
// up and it plays back. The text is plain HTML in the page flow over the fixed theatre of pictures, opaque
// from its first frame.
//
// Under reduced motion there is no theatre: each section carries its own picture, still, at its end frame.
// A phone frames the ruins from higher up (SoulMap/ruins PhoneView).

const PHONE_QUERY = '(max-width: 767.98px)'
// From lg the cards and the place sit side by side, so there the sections take turns: cards left, then right.
const SPLIT_QUERY = '(min-width: 1024px)'

const hasSlot = (scene: SoulScene): scene is SoulScene & { slot: SectionSlot } => scene.slot !== null

export default function SoulMapTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const split = useMediaQuery(SPLIT_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active, phone, split),
    [view, cv, labels, active, phone, split],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <PhoneView.Provider value={phone}>
      <div style={SOUL_VARS} className={`${page.root} ${reduced ? page.still : ''} ${CARVED} ${soulCarved.variable}`}>
        <SkipLink />
        {!reduced && (
          <Theatre theatreRef={theatreRef} className={page.theatre}>
            {scenes.map((scene) => (
              <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} />
            ))}
          </Theatre>
        )}
        <TopBar anchor={hero.anchor} />
        <main id="main-content" ref={textRef} className={page.main}>
          <ShrineHero scene={hero} still={reduced} />
          <ProfessionRegion>
            {scenes.filter(hasSlot).map((scene) => (
              <PlaceSection key={scene.id} scene={scene} still={reduced} />
            ))}
          </ProfessionRegion>
          <LastFireContact scene={contact} still={reduced} />
        </main>
        <footer className={page.footer}>
          <p className={page.copyright}>
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </PhoneView.Provider>
  )
}
