'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import { JOURNAL_SERIF, TRAIL } from './palette'
import styles from './scenes.module.css'

// Adventure Paths' scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, and reduced motion or a World Select preview shows the final frame at once.
//
// - Lane: the trail strip pinned inside a shared LevelScene while the section scrolls by; he travels it
//   over the section's whole height.
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job or a record line is a stop on the route (the pin drops, the route runs down to it, the page
//   walks in), a project or a band is a find that rises from the ground under a gold glint.
// - ContactScene: the temple door's compass turns and the door sinks into the floor, showing the
//   profession's corner, then the panel.

export const Lane = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} h-36 rounded-sm border-2 border-[color:var(--ap-edge)] bg-[color:var(--ap-night)] sm:h-48`,
  heroAt: 'bottom-3 left-2',
})

export type SceneItemKind = 'stop' | 'find'

function RouteStop() {
  return (
    <div className="pointer-events-none absolute -left-4 inset-y-0 w-3" aria-hidden="true">
      <div className={`absolute left-1/2 top-3 bottom-0 w-0.5 -translate-x-1/2 bg-[color:var(--ap-route)] ${styles.routeDown}`} />
      <div className={`absolute left-0 top-0 h-3 w-3 rounded-full border-2 border-[color:var(--ap-parchment)] bg-[color:var(--ap-route)] ${styles.pinDrop}`} />
    </div>
  )
}

function Glint() {
  return (
    <div
      className={`pointer-events-none absolute -inset-1 z-10 rounded-sm border-2 border-[color:var(--ap-gold)] ${styles.glint}`}
      aria-hidden="true"
    />
  )
}

export const SceneItem = arrivalItem<SceneItemKind>({
  stop: { frame: <RouteStop />, arrival: styles.walkIn },
  find: { frame: <Glint />, arrival: styles.unearth },
})

// The temple door over his corner: a carved stone slab whose compass turns, then the slab sinks.
function TempleDoor() {
  return (
    <div className={`absolute inset-0 border-x-8 border-[color:var(--ap-stone-dark)] bg-[color:var(--ap-stone)] ${styles.templeDoor}`}>
      <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2" focusable="false">
        <circle cx={50} cy={50} r={44} fill="none" stroke={TRAIL.STONE_DARK} strokeWidth={4} />
        <g className={styles.compass}>
          <circle cx={50} cy={50} r={34} fill={TRAIL.STONE_DARK} />
          <path d="M50 18 L57 50 L50 82 L43 50 Z" fill={TRAIL.PARCHMENT} />
          <path d="M50 18 L57 50 L43 50 Z" fill={TRAIL.ROUTE} />
          <path d="M18 50 L50 44 L82 50 L50 56 Z" fill={TRAIL.STONE} />
          <circle cx={50} cy={50} r={4} fill={TRAIL.GOLD} />
        </g>
      </svg>
    </div>
  )
}

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="trail-contact-heading"
      corner={
        <div className={`relative h-44 overflow-hidden rounded-sm border-2 border-[color:var(--ap-edge)] bg-[color:var(--ap-night)] ${styles.tempo}`} aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[color:var(--ap-bark)]" />
          <Corner />
          <TempleDoor />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center sm:text-left ${scene.arrive}`}>
            <h2 id="trail-contact-heading" className={`mb-2 text-2xl font-bold text-[color:var(--ap-gold)] ${JOURNAL_SERIF}`}>
              Contact
            </h2>
            <p className="mb-6 text-base text-[color:var(--ap-parchment)]">{line}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
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
