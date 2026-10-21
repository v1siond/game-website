'use client'

import { useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { useRun } from './run'
import { SOUL } from './palette'
import { BUTTON, BUTTON_LIT } from './links'
import { CARD_BODY, CARD_META, CARD_TITLE, Hint, TAG } from './menu'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// Each project waits on a summon sign burnt into the stone, the game's way of calling another player's
// spirit into the world. When the visitor reaches it the sign's ring lights, a column of gold light
// rises out of it, and his phantom gathers inside, up off one knee in the smith's gear; the project's
// card rises with him out of the light, he stands by it a moment, then fades home and the sign dims.
// Pick up is the game's own verb for what he brought: the item box at the bottom of the screen names the
// project and what it gave (its impact, or its tagline), the souls counter climbs, and the card keeps a
// "picked up" mark. Under reduced motion the sign lies lit and the card is there, no phantom.

const PICK_UP_SOULS = 400
// The phantom rises (respawn, 1.4 s), stands by the project, then is sent home (.phantomHome).
const RISE_MS = 1400
const STAND_MS = 1800
const FADE_MS = 900

function SummonSign({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 120 24" className={`absolute inset-x-0 bottom-0 mx-auto h-6 w-32 ${souls.sigil} ${lit ? souls.sigilLit : ''}`} aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={12} rx={50} ry={9} fill="none" stroke={SOUL.glow} strokeWidth={1.4} />
      <ellipse cx={60} cy={12} rx={34} ry={5.6} fill="none" stroke={SOUL.glowDeep} strokeWidth={1} />
      <path d="M18 12 Q40 2 60 12 Q80 22 102 12 M60 4 V20 M42 6 L78 18 M78 6 L42 18" fill="none" stroke={SOUL.glow} strokeWidth={0.9} opacity={0.8} />
    </svg>
  )
}

function SummonedPhantom({ summoned }: { summoned: boolean }) {
  const reduced = useReducedMotion()
  const script = usePoseScript('idle')
  const { play } = script
  const [home, setHome] = useState(false)

  useEffect(() => {
    if (!summoned || reduced) return
    play([
      { pose: 'respawn', ms: RISE_MS },
      { pose: 'idle', ms: STAND_MS },
      { pose: 'idle', ms: FADE_MS, effect: () => setHome(true) },
    ])
  }, [summoned, reduced, play])

  return (
    <div className="relative h-28" aria-hidden="true">
      <SummonSign lit={summoned} />
      {summoned && !reduced && (
        <>
          <span className={`absolute bottom-2 left-1/2 h-24 w-14 -translate-x-1/2 ${souls.summonColumn} ${home ? souls.phantomHome : ''}`} />
          <div className={`absolute bottom-2 left-1/2 h-24 w-[3.75rem] -translate-x-1/2 ${souls.phantomGather} ${home ? souls.phantomHome : ''}`}>
            <Knight key={script.key} gear="engineer" pose={script.pose} spirit="summon" className="h-full w-full" />
          </div>
        </>
      )}
    </div>
  )
}

function PickUp({ project, picked, onPick }: { project: Project; picked: boolean; onPick: () => void }) {
  const run = useRun()
  const { souls: words } = useLabels()

  const pickUp = () => {
    if (picked) return
    onPick()
    run.found(project.name, project.impact || project.tagline)
    run.earn(PICK_UP_SOULS)
  }

  return (
    <button
      type="button"
      onClick={pickUp}
      disabled={picked}
      aria-label={picked ? `${project.name}: ${words.pickedUp}` : fillLabel(words.pickUpOf, { project: project.name })}
      className={picked ? BUTTON : BUTTON_LIT}
    >
      {picked ? words.pickedUp : words.pickUp}
    </button>
  )
}

function ItemCard({ project, years, links }: ProjectSlot) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const [picked, setPicked] = useState(false)

  return (
    <article ref={ref} className={`${souls.item} ${triggered ? souls.itemOn : ''} ${picked ? souls.itemPicked : ''}`}>
      <SummonedPhantom summoned={triggered} />
      <div className={`${souls.itemCard} ${ashen.panel} -mt-2 p-5`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={`min-w-0 ${CARD_TITLE}`}>
            <SlashBreaks text={project.name} />
          </h3>
          {years && <span className={`whitespace-nowrap ${CARD_META}`}>{years}</span>}
        </div>
        <p className="mt-1 text-sm text-[color:var(--soul-glow)]">{project.role}</p>
        <p className={`mt-1 ${CARD_META}`}>{project.tagline}</p>
        {project.impact && <p className={`mt-3 border-l-2 border-[color:var(--soul-ember)] pl-3 ${CARD_BODY}`}>{project.impact}</p>}
        {project.techStack.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <li key={tech} className={TAG}>
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <PickUp project={project} picked={picked} onPick={() => setPicked(true)} />
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={BUTTON}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

export function ItemProjects({ projects }: { projects: Project[] }) {
  const { souls: words } = useLabels()
  return (
    <>
      <Hint>{words.itemHint}</Hint>
      <ProjectList projects={projects} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderProject={(slot) => <ItemCard {...slot} />} />
    </>
  )
}
