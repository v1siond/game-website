'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import { NO_PUBLIC_LINK } from '@/components/cv/sectionText'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { PROFESSION_ORDER } from '@/lib/cv/professions'
import { GlassStar, HitStar } from './backdrop'
import { HeroCharacter } from './character'
import { NOIR } from './palette'
import world from './world.module.css'

// The finisher a project open plays, then the project's finish card. The phases follow the game's
// sequence, compressed from its 8 s to 1.9 s so a reader is not kept waiting:
//   0      a dust cloud wipes the screen and hides the change of scene
//   220    the flat red field is there under it; 420 it cracks
//   480    three of him in solid black leap out of frame, the first one hops first, 110 ms apart
//   1060   the screen shakes, the field shatters, the shards fly past the camera
//   1320   streaks cross the screen, impact stars pop
//   1700   one bright flash clears the board
//   1900   the finish: he drops onto the red and black field, the card zooms in with a shake, the glass
//          star drifts behind
// Pattern: hybrid. The rush is one CSS timeline of delays from the moment it mounts; one setTimeout
// swaps the rush for the finish. Any click, key or Escape during the rush skips straight to the finish,
// under reduced motion the dialog opens on the finish. The native <dialog> with showModal keeps focus
// inside and the page inert; closing hands focus back to the card that opened it.

type Phase = 'rush' | 'finish'

const RUSH_MS = 1900

// The shards of the field, each flying off in its own direction, in a 100 by 100 box.
const SHARDS = [
  { points: '0,0 38,0 22,34', dx: '-40vw', dy: '-30vh', spin: '-50deg' },
  { points: '38,0 100,0 70,30 22,34', dx: '30vw', dy: '-40vh', spin: '35deg' },
  { points: '100,0 100,52 70,30', dx: '45vw', dy: '-10vh', spin: '70deg' },
  { points: '0,0 22,34 46,58 0,70', dx: '-45vw', dy: '10vh', spin: '-30deg' },
  { points: '22,34 70,30 100,52 46,58', dx: '10vw', dy: '-5vh', spin: '25deg' },
  { points: '0,70 46,58 60,100 0,100', dx: '-30vw', dy: '40vh', spin: '-65deg' },
  { points: '46,58 100,52 100,100 60,100', dx: '35vw', dy: '35vh', spin: '45deg' },
]

const STREAKS = [
  { angle: '-18deg', place: 'top-[22%]' },
  { angle: '-8deg', place: 'top-[38%]' },
  { angle: '-24deg', place: 'top-[54%]' },
  { angle: '-12deg', place: 'top-[70%]' },
]
const IMPACTS = ['left-[22%] top-[30%]', 'right-[18%] top-[48%]', 'left-[40%] bottom-[20%]']

// The dust cloud: overlapping puffs in a wide band, flat smoke and ash.
const PUFFS = [
  { cx: 40, cy: 50, r: 46 },
  { cx: 100, cy: 30, r: 40 },
  { cx: 110, cy: 78, r: 44 },
  { cx: 170, cy: 50, r: 50 },
  { cx: 230, cy: 26, r: 36 },
  { cx: 240, cy: 80, r: 40 },
  { cx: 290, cy: 50, r: 44 },
]

function Rush() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${world.shake}`}>
        <div className={`absolute inset-0 bg-[color:var(--noir-red)] ${world.field}`} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {SHARDS.map(({ points, dx, dy, spin }, i) => (
            <polygon
              key={points}
              points={points}
              fill={i % 3 ? NOIR.red : NOIR.redDeep}
              stroke={NOIR.ink}
              strokeWidth={0.6}
              className={world.shard}
              style={{ '--i': i, '--dx': dx, '--dy': dy, '--spin': spin } as CSSProperties}
            />
          ))}
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${world.crack}`}>
          <path d="M22 34 L38 0 M22 34 L0 70 M22 34 L70 30 L100 0 M70 30 L100 52 M46 58 L60 100 M46 58 L100 52 M22 34 L46 58" stroke={NOIR.ink} strokeWidth={0.8} fill="none" />
        </svg>
        <div className="absolute inset-x-0 bottom-[12%] flex items-end justify-center gap-[6vw]">
          {PROFESSION_ORDER.map((profession, i) => (
            <div key={profession} className={i === 0 ? world.hop : world.leap} style={{ '--i': i } as CSSProperties}>
              <HeroCharacter profession={profession} className={`h-[38vh] w-[25vh] ${world.silhouette}`} />
            </div>
          ))}
        </div>
      </div>

      {STREAKS.map(({ angle, place }, i) => (
        <div
          key={place}
          className={`absolute left-0 h-3 w-[70vw] bg-[color:var(--noir-paper)] ${place} ${world.streak}`}
          style={{ '--i': i, '--a': angle } as CSSProperties}
        />
      ))}
      {IMPACTS.map((place, i) => (
        <div key={place} className={`absolute h-28 w-28 ${place} ${world.impact}`} style={{ '--i': i } as CSSProperties}>
          <HitStar className="h-full w-full" fill={NOIR.paper} edge={NOIR.ink} />
        </div>
      ))}

      <svg viewBox="0 0 320 100" preserveAspectRatio="none" className={`absolute inset-y-0 -left-1/4 h-full w-[150%] ${world.dust}`}>
        {PUFFS.map(({ cx, cy, r }) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={cx % 20 ? NOIR.smoke : NOIR.ash} />
        ))}
      </svg>

      <div className={`absolute inset-0 bg-[color:var(--noir-paper)] ${world.flash}`} />
    </div>
  )
}

function FinishCard({ slot, onClose }: { slot: ProjectSlot; onClose: () => void }) {
  const { project, years, links } = slot

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <rect width={100} height={100} fill={NOIR.red} />
          <polygon points="0,62 100,30 100,100 0,100" fill={NOIR.ink} />
        </svg>
        <div className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-40">
          <GlassStar className={`h-full w-full ${world.drift}`} />
        </div>
        <div className={`absolute bottom-0 left-[4%] hidden md:block ${world.finishDrop}`}>
          <HeroCharacter profession="engineer" className={`h-[70vh] w-[46vh] ${world.silhouette}`} />
        </div>
      </div>

      <article className={`relative w-full max-w-2xl p-6 sm:p-8 ${world.slab} ${world.finish}`}>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label={`Close ${project.name}`}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-[color:var(--noir-red)] text-2xl text-[color:var(--noir-paper)] transition-transform hover:rotate-12 hover:scale-110 motion-reduce:transition-none"
        >
          <span aria-hidden="true">X</span>
        </button>
        <h2 id="all-out-title" className="pr-14 text-4xl leading-none tracking-wide sm:text-5xl">
          {project.name}
        </h2>
        <p className={`mt-2 text-base font-bold text-[color:var(--noir-paper)] ${world.copy}`}>
          {project.role}
          {years && <span className="text-[color:var(--noir-fog)]"> | {years}</span>}
        </p>
        <p className={`mt-4 text-base text-[color:var(--noir-paper)] ${world.copy}`}>{project.tagline}</p>
        {project.description && <p className={`mt-3 text-sm text-[color:var(--noir-paper-dim)] ${world.copy}`}>{project.description}</p>}
        {project.impact && (
          <p className={`mt-4 inline-block px-3 py-1 text-base font-bold ${world.heading} ${world.copy}`}>{project.impact}</p>
        )}
        {project.details.length > 0 && (
          <ul className="mt-4 space-y-1.5" aria-label="Details">
            {project.details.map((detail) => (
              <li key={detail} className={`flex items-start gap-2 text-sm text-[color:var(--noir-paper-dim)] ${world.copy}`}>
                <span className="mt-1 block h-2.5 w-2.5 flex-shrink-0 rotate-45 bg-[color:var(--noir-red)]" aria-hidden="true" />
                {detail}
              </li>
            ))}
          </ul>
        )}
        {project.techStack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.techStack.map((tech) => (
              <li key={tech} className={`px-2 py-0.5 text-sm font-bold ${world.chip} ${world.copy}`}>
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.kind}
                {...link.linkProps}
                className="inline-flex min-h-[44px] items-center border-[3px] border-[color:var(--noir-paper)] bg-[color:var(--noir-paper)] px-5 py-2 text-lg uppercase tracking-widest text-[color:var(--noir-ink)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                {link.label}
              </a>
            ))
          ) : (
            <p className={`text-sm text-[color:var(--noir-fog)] ${world.copy}`}>{NO_PUBLIC_LINK}</p>
          )}
        </div>
      </article>
    </div>
  )
}

interface AllOutProps {
  slot: ProjectSlot
  trigger: HTMLElement
  onClose: () => void
}

export function AllOutAttack({ slot, trigger, onClose }: AllOutProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'finish' : 'rush'))

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => {
      dialog.close()
      trigger.focus()
    }
  }, [trigger])

  useEffect(() => {
    if (phase !== 'rush') return
    const timer = window.setTimeout(() => setPhase('finish'), RUSH_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  const skip = () => setPhase('finish')

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="all-out-title"
      className={`fixed inset-0 ${world.allOut}`}
      onCancel={(event) => {
        event.preventDefault()
        if (phase === 'rush') skip()
        else onClose()
      }}
      onClick={phase === 'rush' ? skip : undefined}
      onKeyDown={phase === 'rush' ? skip : undefined}
    >
      {phase === 'rush' ? (
        <>
          <Rush />
          <h2 id="all-out-title" className="sr-only">
            {slot.project.name}
          </h2>
        </>
      ) : (
        <div className="h-full overflow-y-auto overscroll-contain">
          <FinishCard slot={slot} onClose={onClose} />
        </div>
      )}
    </dialog>
  )
}
