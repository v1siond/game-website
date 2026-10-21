'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, atClass } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { RestPoint } from './art'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import world from './world.module.css'
import styles from './scenes.module.css'

// Soul Map's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's level, pinned inside a shared LevelScene while its section scrolls by, framed
//   as a room of the map with its glowing wall.
// - SceneItem: one entry arriving as part of the level, on its own progress: a job or a record line is a
//   room whose outline is drawn before the fog over it lifts, a project or a band a find that drifts in
//   along a glowing path.
// - ContactScene: the last rest point. The three rooms of the map above it light one by one, its lantern
//   comes on behind the profession's corner, then the contact panel arrives.

export const Strip = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} h-28 sm:h-40 ${world.room}`,
  heroAt: 'bottom-1 left-2',
})

export type SceneItemKind = 'room' | 'find'

function RoomFrame() {
  return <div className={`pointer-events-none absolute -inset-1.5 border border-[var(--soul-glow)] ${styles.roomFrame}`} aria-hidden="true" />
}

function FindFrame() {
  return (
    <div
      className={`pointer-events-none absolute -top-1.5 left-0 h-[3px] w-full bg-gradient-to-r from-[var(--soul-glow)] to-transparent ${styles.pathLine}`}
      aria-hidden="true"
    />
  )
}

export const SceneItem = arrivalItem<SceneItemKind>({
  room: { frame: <RoomFrame />, arrival: styles.enterRoom },
  find: { frame: <FindFrame />, arrival: styles.alongPath },
})

const CONTACT_HEADING = headingId('soul', 'Contact')

// The three rooms of the map above the last rest point, lit in turn as the scene plays.
const CONTACT_ROOMS = [
  { place: 'left-[18%]', at: 0.15 },
  { place: 'left-[42%]', at: 0.3 },
  { place: 'left-[66%]', at: 0.45 },
]

function ContactMap() {
  return (
    <>
      <span className={`absolute left-[18%] top-[1.9rem] block h-[2px] w-[56%] ${world.zonePath}`} />
      {CONTACT_ROOMS.map(({ place, at }) => (
        <span key={place} className={`absolute top-6 block h-4 w-6 border border-[var(--soul-glow)] bg-[var(--soul-glow-deep)] ${place} ${scene.lightAt} ${atClass(at)}`} />
      ))}
    </>
  )
}

export function ContactScene({ profession }: { profession: Profession }) {
  const { sections } = useLabels()
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div className={`relative h-44 overflow-hidden bg-[var(--soul-deep)] ${world.room} ${styles.tempo}`} aria-hidden="true">
          <ContactMap />
          <RestPoint className={`absolute right-2 top-1 h-14 w-14 ${atClass(0.55)}`} lit={scene.lightAt} />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[var(--soul-rock)]" />
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <div className={`relative p-6 ${world.room}`}>
              <h2 id={CONTACT_HEADING} className={`mb-3 text-2xl uppercase text-[var(--soul-glow)] ${world.lettering} ${world.title}`}>
                {sections.contact}
              </h2>
              <p className="mb-6 text-base text-[var(--soul-text-soft)]">{line}</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </div>
            </div>
          </div>
        )}
      />
    </ContactStage>
  )
}
