'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES } from './stages'
import { DoorLeaf } from './art'
import { CVLink, HeroAction } from './actions'
import { CORNER_MARKS, PANEL_HEADING, sectionHeadingId } from './panels'
import look from './world.module.css'
import styles from './scenes.module.css'

// Survival Horror's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's room of the house, pinned inside a shared LevelScene while its section
//   scrolls by, framed like a fixed camera shot.
// - SceneItem: one entry arriving as part of the room, on its own progress: a job is a document his
//   light sweeps across before it settles out of the dark, a project, band or record line an item laid
//   into the item box as its corner marks close in.
// - ContactScene: the save room at the end of the page; its door swings open on the profession's
//   corner under the lamp, then the contact panel arrives.

export const Strip = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} h-28 border-4 border-[color:var(--sh-wood)] bg-[color:var(--sh-void)] sm:h-40`,
  heroAt: 'bottom-1 left-2',
})

export type SceneItemKind = 'document' | 'item'

function SweepFrame() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-y-0 -left-1/4 w-3/4 ${styles.sweep}`} />
    </div>
  )
}

function ItemBoxFrame() {
  return (
    <div className={`pointer-events-none absolute -inset-1.5 ${styles.corners}`} aria-hidden="true">
      {CORNER_MARKS.map((place) => (
        <span key={place} className={`absolute h-4 w-4 border-[color:var(--sh-flame)] ${place}`} />
      ))}
    </div>
  )
}

export const SceneItem = arrivalItem<SceneItemKind>({
  document: { frame: <SweepFrame />, arrival: styles.document },
  item: { frame: <ItemBoxFrame />, arrival: styles.item },
})

const CONTACT_HEADING = sectionHeadingId('Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { sections } = useLabels()
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div className={`relative h-44 overflow-hidden border-4 border-[color:var(--sh-wood)] bg-[color:var(--sh-void)] ${styles.tempo}`} aria-hidden="true">
          <div className={`absolute inset-0 ${styles.roomBeyond}`} />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[color:var(--sh-wood)]" />
          <Corner />
          <DoorLeaf side="left" />
          <DoorLeaf side="right" />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`p-6 ${look.panel} ${scene.arrive}`}>
            <h2 id={CONTACT_HEADING} className={PANEL_HEADING}>
              {sections.contact}
            </h2>
            <p className="mb-6 text-base text-[color:var(--sh-cream)]">{line}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <HeroAction key={action.id} action={action} />
              ))}
              <CVLink />
            </div>
          </div>
        )}
      />
    </ContactStage>
  )
}
