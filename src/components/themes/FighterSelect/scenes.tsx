'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { CabinetPanel } from './frames'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import look from './world.module.css'
import styles from './scenes.module.css'

// Fighter Select's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's stage under the match HUD, pinned inside a shared LevelScene while its
//   section scrolls by, framed like the cabinet screen.
// - SceneItem: one entry arriving as part of the match, on its own progress: a job steps in from player
//   two's side behind a red slash, a project, band or record line locks into its slot under the player
//   one cursor.
// - ContactScene: the final round, the two health bars sweep in from the corners over his closing
//   corner, then the contact panel arrives.

export const Strip = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} h-28 border-4 border-[color:var(--fs-gold)] bg-[color:var(--fs-night)] sm:h-40`,
  heroAt: 'bottom-1 left-2',
})

export type SceneItemKind = 'challenger' | 'portrait'

function SlashFrame() {
  return (
    <div
      className={`pointer-events-none absolute -inset-x-2 inset-y-3 -skew-x-12 bg-gradient-to-l from-[#ff2e4d] via-[#ff2e4d]/40 to-transparent ${styles.slash}`}
      aria-hidden="true"
    />
  )
}

function CursorFrame() {
  return (
    <div className={`pointer-events-none absolute -inset-1.5 border-2 border-[color:var(--fs-p1-light)] ${styles.cursor}`} aria-hidden="true">
      <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[color:var(--fs-p1-light)]" />
    </div>
  )
}

export const SceneItem = arrivalItem<SceneItemKind>({
  challenger: { frame: <SlashFrame />, arrival: styles.challenger },
  portrait: { frame: <CursorFrame />, arrival: styles.portrait },
})

// The two health bars of the final round, sweeping in from the corners above his corner.
function FinalRoundHud() {
  return (
    <div className="absolute inset-x-3 top-3 flex items-center gap-2" aria-hidden="true">
      <div className={`h-3 flex-1 border border-[color:var(--fs-gold)] bg-[color:var(--fs-health)] ${styles.barLeft}`} />
      <span className="h-3 w-3 rotate-45 bg-[color:var(--fs-gold)]" />
      <div className={`h-3 flex-1 border border-[color:var(--fs-gold)] bg-[color:var(--fs-health)] ${styles.barRight}`} />
    </div>
  )
}

const CONTACT_HEADING = headingId('fighter-select', 'Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div
          className={`relative h-44 overflow-hidden border-4 border-[color:var(--fs-gold)] bg-[color:var(--fs-night)] ${styles.tempo}`}
          aria-hidden="true"
        >
          <div className={`absolute inset-x-8 top-0 h-full bg-gradient-to-b from-[#ffd23f] to-transparent ${styles.spot}`} />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[color:var(--fs-p1)]" />
          <Corner />
          <FinalRoundHud />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <CabinetPanel accent="gold">
              <div className="text-center sm:text-left">
                <h2 id={CONTACT_HEADING} className={`mb-3 text-2xl uppercase ${look.display} ${look.roundCall}`}>
                  Contact
                </h2>
                <p className="mb-6 text-sm">{line}</p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                </div>
              </div>
            </CabinetPanel>
          </div>
        )}
      />
    </ContactStage>
  )
}
