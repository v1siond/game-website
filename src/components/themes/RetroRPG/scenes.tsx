'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { CORNER_SKY, PROFESSION_STAGES } from './stages'
import { CVLink, HeroActions } from './actions'
import { PIXEL } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Retro RPG's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, and reduced motion or a World Select preview shows the final frame at once.
//
// - Lane: the overworld strip, framed like the game screen, pinned inside a shared LevelScene while the
//   section scrolls by; he walks it over the section's whole height.
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job or a record line opens as a dialogue window with the gold cursor beside it, a project or a band
//   snaps into the menu from the right.
// - ContactScene: the closing window opens in steps on his profession's corner, then the panel comes in.

const STRIP_FRAME = `h-32 overflow-hidden sm:h-44 ${world.frame}`

export const Lane = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} ${STRIP_FRAME}`,
  heroAt: 'bottom-3 left-2',
})

export type SceneItemKind = 'dialogue' | 'menu'

function DialogueCursor() {
  return (
    <span className={`absolute -left-4 top-4 text-sm text-[color:var(--rpg-gold)] ${styles.cursor}`} aria-hidden="true">
      ▶
    </span>
  )
}

export const SceneItem = arrivalItem<SceneItemKind>({
  dialogue: { frame: <DialogueCursor />, arrival: styles.unfold },
  menu: { frame: null, arrival: styles.snapIn },
})

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="rpg-contact-heading"
      corner={
        <div className={`relative h-44 overflow-hidden ${world.frame} ${styles.tempo} ${styles.unfold}`} aria-hidden="true">
          <div className={`absolute inset-0 bg-gradient-to-b ${CORNER_SKY[profession]}`} />
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`p-5 text-center sm:text-left ${world.window} ${scene.arrive}`}>
            <h2 id="rpg-contact-heading" className={`mb-3 text-base uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}>
              Contact
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[color:var(--rpg-muted)]">{line}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-start">
              <HeroActions actions={actions} />
              <CVLink />
            </div>
          </div>
        )}
      />
    </ContactStage>
  )
}
