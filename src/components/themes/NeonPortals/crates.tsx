'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import { fillLabel } from '@/lib/cv/labels'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { Crate, Shard, SHARD_SHAPES } from './art'
import { useHud } from './hud'
import world from './world.module.css'

// A project as a wooden crate on the level, the platformer's way of hiding what is worth having: the
// crate shows the project's name stencilled on its label; a click (or Enter, or the spin) breaks it.
//
//   hit    0ms    the crate squashes under the blow
//   burst  140ms  it is gone, six planks fly out spinning, the project card pops up out of the spot with
//                 an overshoot, the crate counter in the HUD ticks
//   open   700ms  the card rests; focus is on it, so a keyboard reader carries on inside it
//
// Pattern: setTimeout phases on the crate's own state, the CSS keyed on data-crate. A crate broken
// stays broken (the HUD holds it), so a reveal plays once. Reduced motion and a World Select preview
// open every crate at once, with the score to match.

type CrateState = 'closed' | 'hit' | 'burst' | 'open'

const HIT_MS = 140
const BURST_MS = 700

// Where each plank flies, as a share of the crate box, and how far it turns.
const FLIGHT = [
  { dx: '-140%', dy: '-160%', spin: '-220deg' },
  { dx: '120%', dy: '-180%', spin: '260deg' },
  { dx: '-180%', dy: '-40%', spin: '-160deg' },
  { dx: '170%', dy: '-60%', spin: '190deg' },
  { dx: '-90%', dy: '-230%', spin: '-300deg' },
  { dx: '80%', dy: '-240%', spin: '320deg' },
]

/** The crate's phase: closed until broken, then through the burst to open. */
function useCrate(id: string, spin: number, order: number) {
  const { breakCrate, isBroken, offerCrate } = useHud()
  const preview = usePreview()
  const [state, setState] = useState<CrateState>(() => (isBroken(id) ? 'open' : 'closed'))
  // Broken by the visitor's own click or key, so the card it holds takes the focus once open.
  const [byHand, setByHand] = useState(false)

  useEffect(() => {
    offerCrate(id)
    if (preview || prefersReducedMotion()) {
      breakCrate(id)
      setState('open')
    }
  }, [id, preview, offerCrate, breakCrate])

  const strike = useCallback(() => setState((now) => (now === 'closed' ? 'hit' : now)), [])

  const strikeByHand = () => {
    setByHand(true)
    strike()
  }

  useEffect(() => {
    if (!spin) return
    const timer = window.setTimeout(strike, order * 160)
    return () => window.clearTimeout(timer)
  }, [spin, order, strike])

  useEffect(() => {
    if (state === 'hit') {
      const timer = window.setTimeout(() => {
        breakCrate(id)
        setState('burst')
      }, HIT_MS)
      return () => window.clearTimeout(timer)
    }
    if (state === 'burst') {
      const timer = window.setTimeout(() => setState('open'), BURST_MS)
      return () => window.clearTimeout(timer)
    }
  }, [state, id, breakCrate])

  return { state, strikeByHand, byHand }
}

function ClosedCrate({ slot, state, onStrike }: { slot: ProjectSlot; state: CrateState; onStrike: () => void }) {
  const { hud } = useLabels()
  const { project, years } = slot

  return (
    <button
      type="button"
      onClick={onStrike}
      aria-label={fillLabel(hud.breakCrate, { project: project.name })}
      className={`group relative block w-full focus:outline-none ${world.crateButton}`}
      data-crate={state}
    >
      <span className={`relative mx-auto block w-full max-w-[16rem] ${world.crateBody}`}>
        <Crate className="h-auto w-full" mark />
        <span className="absolute inset-x-[14%] bottom-[8%] rounded-md border-2 border-[color:var(--np-band)] bg-[color:var(--np-plank)] px-2 py-1 text-center">
          <span className="block truncate text-base font-black uppercase text-[color:var(--np-void)]">{project.name}</span>
          {years && <span className="block text-sm font-bold text-[color:var(--np-void)]">{years}</span>}
        </span>
      </span>
      <span className={`mx-auto mt-2 block h-3 w-3/4 rounded-[50%] bg-[color:var(--np-void)]/60 ${world.crateShadow}`} aria-hidden="true" />
    </button>
  )
}

function Shards() {
  return (
    <span className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {SHARD_SHAPES.map((d, i) => (
        <span
          key={d}
          className={`absolute left-[35%] top-[35%] h-[14%] w-[30%] ${world.shard}`}
          style={{ '--dx': FLIGHT[i].dx, '--dy': FLIGHT[i].dy, '--spin': FLIGHT[i].spin } as CSSProperties}
        >
          <Shard d={d} className="h-full w-full" />
        </span>
      ))}
    </span>
  )
}

function ProjectCard({ slot, focus }: { slot: ProjectSlot; focus: boolean }) {
  const labels = useLabels()
  const ref = useRef<HTMLElement>(null)
  const { project, years, links } = slot

  useEffect(() => {
    if (focus) ref.current?.focus()
  }, [focus])

  return (
    <article ref={ref} tabIndex={-1} aria-labelledby={`np-project-${project.id}`} className={`relative overflow-hidden rounded-2xl border-4 border-[color:var(--np-stone-dark)] bg-[color:var(--np-panel)] focus:outline-none ${world.card}`}>
      <div className="h-2 bg-[color:var(--np-orange)]" aria-hidden="true" />
      <div className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id={`np-project-${project.id}`} className={`text-2xl leading-tight ${world.display}`}>
            {project.name}
          </h3>
          {years && <span className="text-sm font-bold text-[color:var(--np-gold)]">{years}</span>}
        </div>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[color:var(--np-blue)]">{project.role}</p>
        <p className="mt-3 text-base text-[color:var(--np-white)]">{project.tagline}</p>
        {project.impact && (
          <p className="mt-3 rounded-lg border-l-4 border-[color:var(--np-green)] bg-[color:var(--np-void)]/50 px-3 py-2 text-base text-[color:var(--np-white)]">
            <span className="sr-only">{labels.cards.impact}: </span>
            {project.impact}
          </p>
        )}
        {project.techStack.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={labels.cards.technologiesUsed}>
            {project.techStack.map((tech) => (
              <li key={tech} className="rounded-md bg-[color:var(--np-seam)] px-2 py-0.5 text-sm text-[color:var(--np-white)]">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {links.length > 0 ? (
            links.map(({ kind, label, linkProps }) => (
              <a key={kind} {...linkProps} className={world.chunkyButton}>
                {label}
              </a>
            ))
          ) : (
            <p className="text-sm text-[color:var(--np-muted)]">{labels.links.noPublicLink}</p>
          )}
        </div>
      </div>
    </article>
  )
}

/** One project on the level: a crate until broken, then the card it held. */
export function ProjectCrate({ slot, spin, order }: { slot: ProjectSlot; spin: number; order: number }) {
  const { state, strikeByHand, byHand } = useCrate(slot.project.id, spin, order)

  if (state === 'closed' || state === 'hit') return <ClosedCrate slot={slot} state={state} onStrike={strikeByHand} />

  return (
    <div className="relative" data-crate={state}>
      {state === 'burst' && <Shards />}
      <div className={state === 'burst' ? world.popOut : ''}>
        <ProjectCard slot={slot} focus={byHand} />
      </div>
    </div>
  )
}
