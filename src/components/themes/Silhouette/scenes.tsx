'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelArt } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_SKY, PROFESSION_STAGES, Sky } from './stages'
import { CVLink, HeroActions } from './actions'
import { SHADE, TYPEWRITER } from './palette'
import styles from './scenes.module.css'

// Silhouette's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, and reduced motion or a World Select preview shows the final frame at once.
//
// - Lane: the silhouette strip pinned inside a shared LevelScene while the section scrolls by; he walks
//   it over the section's whole height.
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job or a record line walks out of the fog (the veil thins and drifts off), a project or a band
//   catches the light (a rim runs along its top edge as it rises).
// - ContactScene: under the profession's sky the fog lifts and the two black rocks part on his corner,
//   then the panel comes in.

const STRIP_FRAME = 'h-32 border-y-2 border-[color:var(--sh-black)] bg-[color:var(--sh-black)] sm:h-44'

export const Lane = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} ${STRIP_FRAME}`,
  heroAt: 'bottom-3 left-2',
})

export type SceneItemKind = 'fog' | 'light'

function FogVeil() {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[color:var(--sh-fog)] via-[color:var(--sh-edge)] to-transparent ${styles.veil}`}
      aria-hidden="true"
    />
  )
}

function RimLight() {
  return <div className={`pointer-events-none absolute inset-x-0 -top-0.5 z-10 h-0.5 bg-[color:var(--sh-rim)] ${styles.rimSweep}`} aria-hidden="true" />
}

export const SceneItem = arrivalItem<SceneItemKind>({
  fog: { frame: <FogVeil />, arrival: styles.emerge },
  light: { frame: <RimLight />, arrival: styles.rise },
})

// The two black rocks framing his corner; each slides out to its side as the scene plays.
function PartingRocks() {
  return (
    <>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-1/2 ${styles.rockLeft}`}>
        <path d="M0 0 H520 Q470 30 540 52 Q480 76 560 100 H0 Z" fill={SHADE.black} />
      </LevelArt>
      <LevelArt className={`absolute inset-y-0 right-0 h-full w-1/2 ${styles.rockRight}`}>
        <path d="M600 0 H90 Q140 28 60 50 Q130 78 40 100 H600 Z" fill={SHADE.black} />
      </LevelArt>
    </>
  )
}

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]
  const light = PROFESSION_SKY[profession]

  return (
    <ContactStage
      headingId="silhouette-contact-heading"
      corner={
        <div className={`relative h-44 overflow-hidden border-y-2 border-[color:var(--sh-black)] ${styles.tempo}`} aria-hidden="true">
          <Sky light={light} />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[color:var(--sh-black)]" />
          <Corner />
          <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--sh-fog)] to-transparent ${styles.fogLift}`} />
          <PartingRocks />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center sm:text-left ${scene.arrive}`}>
            <h2
              id="silhouette-contact-heading"
              className={`mb-3 text-xl font-normal uppercase tracking-[0.3em] text-[color:var(--sh-heading)] ${TYPEWRITER}`}
            >
              Contact
            </h2>
            <p className="mb-6 text-sm text-[color:var(--sh-muted)]">{line}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
              <HeroActions actions={actions} />
              <CVLink />
            </div>
          </div>
        )}
      />
    </ContactStage>
  )
}
