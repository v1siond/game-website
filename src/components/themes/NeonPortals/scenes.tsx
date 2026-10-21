'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage } from '@/components/scroll/stage'
import { arrivalItem, worldLane } from '@/components/scroll/arrivals'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PORTAL } from './palette'
import { PROFESSION_STAGES } from './professions'
import { CVLink, HeroActions } from './actions'
import styles from './scenes.module.css'

// Neon Portals' scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Lane: the lane pinned inside a shared LevelScene while the section scrolls by; he crosses it,
//   orange portal to blue, over the section's whole height.
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job steps out of an orange portal, a project, band or record line arrives through a violet tear.
// - ContactScene: the profession's closing corner, the exit portal opening behind him, then the panel.

export const Lane = worldLane({
  stages: PROFESSION_STAGES,
  Hero: HeroCharacter,
  className: `${styles.tempo} h-32 border-y border-[#2c2a3d] bg-[#07060f] sm:h-44`,
  heroAt: 'bottom-3 left-2',
})

export type SceneItemKind = 'portal' | 'tear'

function PortalFrame() {
  return (
    <div
      className={`pointer-events-none absolute -left-1.5 inset-y-0 w-3 rounded-[50%] border-2 border-[#ff9a00] bg-[#07060f] ${styles.portalRim}`}
      aria-hidden="true"
    />
  )
}

function TearFrame() {
  return (
    <>
      <div className={`pointer-events-none absolute -inset-1 border-2 border-[#b57bff] ${styles.tear}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute -inset-1 border-2 border-[#00a2ff] ${styles.crossed}`} aria-hidden="true" />
    </>
  )
}

export const SceneItem = arrivalItem<SceneItemKind>({
  portal: { frame: <PortalFrame />, arrival: styles.outOfPortal },
  tear: { frame: <TearFrame />, arrival: styles.outOfTear },
})

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="portals-contact-heading"
      corner={
        <div
          className={`relative h-44 overflow-hidden border border-[#2c2a3d] border-r-2 border-r-[#00a2ff] bg-[#07060f] ${styles.tempo}`}
          aria-hidden="true"
        >
          <div className="absolute inset-y-2 right-3 w-24">
            <svg viewBox="0 0 48 80" preserveAspectRatio="none" className={`h-full w-full ${styles.exitPortal}`} aria-hidden="true" focusable="false">
              <ellipse cx={24} cy={40} rx={21} ry={37} fill="#06223a" stroke={PORTAL.BLUE} strokeWidth={3} />
              <ellipse cx={24} cy={40} rx={13} ry={26} fill="none" stroke={PORTAL.BLUE} strokeWidth={1} opacity={0.5} />
            </svg>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#1c1b29]" />
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center sm:text-left ${scene.arrive}`}>
            <h2 id="portals-contact-heading" className="mb-3 text-xl uppercase tracking-[0.2em] text-[#00a2ff]">
              Contact
            </h2>
            <p className="mb-6 text-sm text-[#edebe4]">{line}</p>
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
