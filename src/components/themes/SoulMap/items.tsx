'use client'

import { useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { useRun } from './run'
import { BUTTON, BUTTON_LIT } from './links'
import { CARD_BODY, CARD_META, CARD_TITLE, Hint, TAG } from './menu'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// The projects lie about like the game's items: a white glint on the stone, each swelling on its own
// phase, until the visitor comes near; then the glint flares and the item's card rises out of it. Pick up
// is the game's own verb: the glint flares a last time and goes out, the item box at the bottom of the
// screen names the project and what it gave (its impact, or its tagline), the souls counter climbs, and
// the card keeps a "picked up" mark. An item is picked up once.

const PICK_UP_SOULS = 400

function Glint() {
  return (
    <div className={`${souls.glint} relative mx-auto h-10 w-10`} aria-hidden="true">
      <span className={`${souls.glintHalo} absolute inset-0 rounded-full bg-[color:var(--soul-fog)]`} />
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--soul-flame-core)]" />
      <span className={`${souls.glintRay} absolute left-[calc(50%-0.5px)] top-0 h-full w-px bg-[color:var(--soul-fog)]`} />
      <span className={`${souls.glintRay} absolute left-0 top-[calc(50%-0.5px)] h-px w-full bg-[color:var(--soul-fog)]`} />
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
      <Glint />
      <div className={`${souls.itemCard} ${ashen.panel} -mt-3 p-5`}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className={CARD_TITLE}>{project.name}</h3>
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
