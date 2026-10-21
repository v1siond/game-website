'use client'

import { useState } from 'react'
import type { Project } from '@/lib/cv/content'
import { ProjectList } from '@/components/cv/ProjectList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { VintagePoster } from './cards'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Featured Work as the parry board of a rubber hose run and gun. Every show poster carries a pink parry
// star pulsing on the beat. A click is the parry slap: a white cartoon glove pops out and slaps the star,
// the star bursts, the poster flashes pink for a few frames, freezes a beat and shakes, and one playing
// card of the super meter above the list flips face up. When every poster is parried the whole meter
// spins once, the full super. Parried posters stay parried.

function SuperCard({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 20 28" className={`h-9 w-7 ${world.inked} ${styles.superCard} ${full ? styles.superFull : ''}`} aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={18} height={26} rx={2} fill={full ? HOSE.paper : HOSE.redDark} />
      {full ? (
        <path d="M10 7 L12 12 L17 12 L13 15.5 L14.5 21 L10 17.5 L5.5 21 L7 15.5 L3 12 L8 12 Z" fill={HOSE.parry} />
      ) : (
        <rect x={4} y={4} width={12} height={20} rx={1} fill="none" stroke={HOSE.redDeep} strokeWidth={1} />
      )}
    </svg>
  )
}

// The white four finger glove that comes out of nowhere to slap the star, the cuff toward the poster.
function SlapHand() {
  return (
    <svg viewBox="0 0 32 32" className={`pointer-events-none absolute -left-6 -top-6 z-30 h-14 w-14 ${world.inked} ${styles.slapHand}`} aria-hidden="true" focusable="false">
      <rect x={18} y={18} width={10} height={8} rx={3} fill={HOSE.highlight} transform="rotate(-40 23 22)" />
      <path d="M4 14 Q4 6 12 6 Q20 6 21 13 Q22 19 16 21 Q8 23 5 19 Z" fill={HOSE.highlight} />
      <path d="M10 9 Q14 8 17 10 M9 13 Q13 12 17 14" fill="none" stroke={HOSE.ink} strokeWidth={1} />
      <path d="M3 13 Q0 10 3 8" fill={HOSE.highlight} />
    </svg>
  )
}

function ParryStar({ parried, onParry, name }: { parried: boolean; onParry: () => void; name: string }) {
  return (
    <button
      type="button"
      onClick={onParry}
      disabled={parried}
      aria-pressed={parried}
      aria-label={name}
      className="absolute -left-4 -top-4 z-20 flex h-11 w-11 items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className={`h-9 w-9 ${world.inked} ${parried ? styles.parryGone : styles.parryStar}`} aria-hidden="true" focusable="false">
        <path d="M12 1 L15 9 L23 9 L16.5 14 L19 22 L12 17 L5 22 L7.5 14 L1 9 L9 9 Z" fill={HOSE.parry} />
        <ellipse cx={10} cy={9} rx={2} ry={1.3} fill={HOSE.highlight} opacity={0.7} />
      </svg>
    </button>
  )
}

export function ParryBoard({ projects }: { projects: Project[] }) {
  const [parried, setParried] = useState<ReadonlySet<string>>(new Set())
  const parry = (id: string) => setParried((current) => new Set(current).add(id))
  const meterFull = projects.length > 0 && parried.size === projects.length
  const { hud } = useLabels()

  return (
    <div className={styles.scene}>
      <div className={`mb-6 flex justify-center gap-2 ${meterFull ? styles.superSpin : ''}`} role="img" aria-label={fillLabel(hud.parryMeter, { parried: parried.size, total: projects.length })}>
        {projects.map((project) => (
          <SuperCard key={project.id} full={parried.has(project.id)} />
        ))}
      </div>
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={`${MASONRY_ITEM} pl-4 pt-4`}
        renderProject={(slot) => {
          const isParried = parried.has(slot.project.id)

          return (
            <div className={`relative ${isParried ? styles.slap : ''}`}>
              <ParryStar parried={isParried} onParry={() => parry(slot.project.id)} name={slot.project.name} />
              {isParried && <SlapHand />}
              <VintagePoster {...slot} />
              {isParried && <span className={`pointer-events-none absolute inset-0 z-10 ${styles.pinkFlash}`} aria-hidden="true" />}
            </div>
          )
        }}
      />
    </div>
  )
}
