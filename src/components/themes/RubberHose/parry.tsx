'use client'

import { useState } from 'react'
import type { Project } from '@/lib/cv/content'
import { ProjectList } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { VintagePoster } from './cards'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Featured Work as the parry board of a rubber hose run and gun. Every show poster carries a pink parry
// star pulsing on the beat; a click slaps it (the star bursts, the poster freezes a beat and shakes) and
// one playing card of the super meter above the list flips face up. Parried posters stay parried.

const PARRY_PINK = '#ff4fa3'

function SuperCard({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 20 28" className={`h-9 w-7 ${world.inked} ${styles.superCard} ${full ? styles.superFull : ''}`} aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={18} height={26} rx={2} fill={full ? HOSE.paper : HOSE.redDark} />
      {full && <path d="M10 7 L12 12 L17 12 L13 15.5 L14.5 21 L10 17.5 L5.5 21 L7 15.5 L3 12 L8 12 Z" fill={PARRY_PINK} />}
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
      aria-label={`Parry ${name}`}
      className="absolute -left-4 -top-4 z-20 flex h-11 w-11 items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className={`h-9 w-9 ${world.inked} ${parried ? styles.parryGone : styles.parryStar}`} aria-hidden="true" focusable="false">
        <path d="M12 1 L15 9 L23 9 L16.5 14 L19 22 L12 17 L5 22 L7.5 14 L1 9 L9 9 Z" fill={PARRY_PINK} />
        <ellipse cx={10} cy={9} rx={2} ry={1.3} fill={HOSE.highlight} opacity={0.7} />
      </svg>
    </button>
  )
}

export function ParryBoard({ projects }: { projects: Project[] }) {
  const [parried, setParried] = useState<ReadonlySet<string>>(new Set())
  const parry = (id: string) => setParried((current) => new Set(current).add(id))

  return (
    <div className={styles.scene}>
      <div className="mb-6 flex justify-center gap-2" role="img" aria-label={`${parried.size} of ${projects.length} parried`}>
        {projects.map((project) => (
          <SuperCard key={project.id} full={parried.has(project.id)} />
        ))}
      </div>
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={`${MASONRY_ITEM} pl-4 pt-4`}
        renderProject={(slot) => (
          <div className={`relative ${parried.has(slot.project.id) ? styles.slap : ''}`}>
            <ParryStar parried={parried.has(slot.project.id)} onParry={() => parry(slot.project.id)} name={slot.project.name} />
            <VintagePoster {...slot} />
          </div>
        )}
      />
    </div>
  )
}
