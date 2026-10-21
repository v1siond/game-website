'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES } from './professions'
import { CVLink, HeroAction } from './actions'
import styles from './scenes.module.css'

// Neon Cyber's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - LevelStrip: the level pinned inside a shared LevelScene; he crosses it from the moment the section
//   enters to just before it leaves.
// - SceneItem: one entry arriving as part of the level, a terminal that boots or a billboard that lights.
// - ContactScene: the profession's closing corner, then the contact panel powers on.

export const LevelStrip = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} h-28 border-y border-pink-500/60 bg-[color:var(--neon-void)] sm:h-40`,
  heroAt: 'bottom-1 left-2',
})

export type SceneItemKind = 'terminal' | 'billboard'

// The frame lights up around the entry in its kind's colour.
function FrameOn({ className }: { className: string }) {
  return <div className={`pointer-events-none absolute -inset-1 ${styles.frameOn} ${className}`} aria-hidden="true" />
}

export const SceneItem = arrivalItem<SceneItemKind>({
  terminal: { frame: <FrameOn className="border border-cyan-400" />, arrival: styles.bootScreen },
  billboard: {
    frame: <FrameOn className="border-2 border-pink-500 shadow-[0_0_14px_color-mix(in_srgb,var(--neon-magenta)_50%,transparent)]" />,
    arrival: styles.billboardCopy,
  },
})

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="neon-contact-heading"
      corner={
        <div className={`relative h-44 overflow-hidden border border-cyan-400/60 bg-[color:var(--neon-void)] ${styles.tempo}`} aria-hidden="true">
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center sm:text-left ${scene.arrive}`}>
            <h2 id="neon-contact-heading" className="mb-3 font-mono text-xl tracking-wider text-cyan-400">
              Contact
            </h2>
            <p className="mb-6 font-mono text-sm text-pink-400">{line}</p>
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
