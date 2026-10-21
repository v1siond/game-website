'use client'

import type { ReactNode } from 'react'
import { useScrollScene } from '@/hooks/useScrollScene'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { SceneLines } from '@/lib/scroll/progress'
import type { Profession } from '@/lib/cv/professions'
import { TravelScene } from '@/components/scroll/TravelScene'
import { HeroCharacter } from './character'
import { PORTAL } from './palette'
import { PROFESSION_STAGES, type LaneZone } from './professions'
import { CVLink, HeroActions } from './actions'
import styles from './scenes.module.css'

// Neon Portals' scroll scenes on the shared engine (useScrollScene): scroll position moves the scene,
// once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - LevelScene: a section whose lane stays pinned while the section scrolls by; he crosses the lane,
//   orange portal to blue, over the section's whole height (the section measuring lives in TravelScene).
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job steps out of an orange portal, a project, band or record line arrives through a violet tear.
// - ContactScene: the profession's closing corner, the exit portal opening behind him, then the panel.

export function LevelScene({ children }: { children: ReactNode }) {
  return (
    <TravelScene>
      <div className={styles.scene}>{children}</div>
    </TravelScene>
  )
}

export function Lane({ profession, zone }: { profession: Profession; zone: LaneZone }) {
  const { Lane: Stage, pose, travel, Companion } = PROFESSION_STAGES[profession]

  return (
    <div className={`${styles.lane} mb-4 border-y border-[#2c2a3d] bg-[#07060f]`} aria-hidden="true">
      <Stage zone={zone} />
      <div className={`${styles.track} ${pose}`}>
        <div className={`absolute inset-0 ${travel}`}>
          <div className="absolute bottom-3 left-2">
            <HeroCharacter profession={profession} className={styles.hero} />
          </div>
          {Companion && <Companion />}
        </div>
      </div>
    </div>
  )
}

// Each entry plays as it crosses the lower part of the screen.
const ITEM_LINES: SceneLines = { start: 0.95, end: 0.65 }

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

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; body: string }> = {
  portal: { Frame: PortalFrame, body: styles.outOfPortal },
  tear: { Frame: TearFrame, body: styles.outOfTear },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { ref, phase } = useScrollScene<HTMLDivElement>(ITEM_LINES)
  const { Frame, body } = ITEM_LOOK[kind]

  return (
    <div ref={ref} data-scene-phase={phase} className={`relative h-full ${styles.scene}`}>
      <Frame />
      <div className={`relative h-full ${body}`}>{children}</div>
    </div>
  )
}

const CONTACT_LINES: SceneLines = { start: 0.95, end: 0.4 }

export function ContactScene({ profession }: { profession: Profession }) {
  const { ref, phase } = useScrollScene<HTMLElement>(CONTACT_LINES)
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <section
      ref={ref}
      data-scene-phase={phase}
      aria-labelledby="portals-contact-heading"
      className={`relative z-20 px-4 py-16 sm:px-6 ${styles.scene}`}
    >
      <div className="mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-[16rem_1fr]">
        <div className="relative h-44 overflow-hidden border border-[#2c2a3d] border-r-2 border-r-[#00a2ff] bg-[#07060f]" aria-hidden="true">
          <div className="absolute inset-y-2 right-3 w-24">
            <svg viewBox="0 0 48 80" preserveAspectRatio="none" className={`h-full w-full ${styles.exitPortal}`} aria-hidden="true" focusable="false">
              <ellipse cx={24} cy={40} rx={21} ry={37} fill="#06223a" stroke={PORTAL.BLUE} strokeWidth={3} />
              <ellipse cx={24} cy={40} rx={13} ry={26} fill="none" stroke={PORTAL.BLUE} strokeWidth={1} opacity={0.5} />
            </svg>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#1c1b29]" />
          <Corner />
        </div>
        <RecruiterHero
          render={({ line, actions }) => (
            <div className={`text-center sm:text-left ${styles.arrive}`}>
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
      </div>
    </section>
  )
}
