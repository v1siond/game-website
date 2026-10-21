'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import type { Project } from '@/lib/cv/content'
import atomic from './atomic.module.css'

// Projects through the targeting system. The pointer or focus on a project locks the targeting on it:
// the section goes into its paused state (data-vats on the section: every other card drains to a dim
// tint, the page's ambient loops freeze through the root's :has rule in atomic.module.css), the corner
// brackets close in on the target and each of its parts (role, impact, tech, links) gets its tag, the
// way the game names each body part it can hit.
// A click (or the card's button) spends action points and plays the shot, in setTimeout phases:
//   aim    0 ms    the letterbox bars slide in and the target pushes toward the camera
//   hit    420 ms  the white flash and the target's hard shake
//   open   760 ms  the project's file opens on the tube (its own power on)
// With fewer points than a shot costs, the file opens at once without the slow motion; the points come
// back on a timer, shown as the bar and its number. Esc, the close button or the backdrop close the
// file and focus returns to the card's button.

const AP_TOTAL = 100
const AP_SHOT = 25
const AP_REFILL = 5
const AP_REFILL_MS = 400

type ShotPhase = 'aim' | 'hit'

const SHOT: ReadonlyArray<readonly [ShotPhase | 'open', number]> = [
  ['hit', 420],
  ['open', 760],
]

function useActionPoints() {
  const [points, setPoints] = useState(AP_TOTAL)

  useEffect(() => {
    if (points >= AP_TOTAL) return
    const timer = window.setTimeout(() => setPoints((left) => Math.min(AP_TOTAL, left + AP_REFILL)), AP_REFILL_MS)
    return () => window.clearTimeout(timer)
  }, [points])

  const spend = useCallback((): boolean => {
    if (points < AP_SHOT) return false
    setPoints(points - AP_SHOT)
    return true
  }, [points])

  return { points, spend }
}

function ActionPoints({ points }: { points: number }) {
  const { hud } = useLabels()
  const label = fillLabel(hud.apLeft, { left: points, total: AP_TOTAL })

  return (
    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-atomic-phosphor">
      <span>{hud.ap}</span>
      <span className={`relative block h-3 w-32 overflow-hidden border border-atomic-phosphor sm:w-44 ${atomic.apTrack}`} role="img" aria-label={label}>
        <span className={`absolute inset-y-0 left-0 w-full origin-left bg-atomic-phosphor ${atomic.apFill}`} style={{ '--ap': points / AP_TOTAL } as CSSProperties} />
      </span>
      <span aria-hidden="true">{label}</span>
    </div>
  )
}

/** A part of the card with its targeting tag, shown while the card is the target. */
function Part({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className={`absolute -right-2 top-0 border border-atomic-phosphor bg-atomic-glass px-1.5 text-sm uppercase tracking-widest text-atomic-phosphor ${atomic.partTag}`} aria-hidden="true">
        {tag}
      </span>
    </div>
  )
}

interface CardProps {
  slot: ProjectSlot
  index: number
  targeted: boolean
  phase: ShotPhase | null
  onTarget: (id: string | null) => void
  onFire: (slot: ProjectSlot, trigger: HTMLElement) => void
}

function TargetCard({ slot, index, targeted, phase, onTarget, onFire }: CardProps) {
  const { hud, cards, links: linkLabels, actions } = useLabels()
  const { project, years, links } = slot
  const buttonRef = useRef<HTMLButtonElement>(null)
  const fire = () => buttonRef.current && onFire(slot, buttonRef.current)

  return (
    <article
      className={`relative cursor-crosshair p-5 ${atomic.panel} ${atomic.target}`}
      data-target={targeted || undefined}
      data-shot={targeted ? phase ?? undefined : undefined}
      style={{ '--i': index } as CSSProperties}
      onPointerEnter={() => onTarget(project.id)}
      onPointerLeave={() => onTarget(null)}
      onFocus={() => onTarget(project.id)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget as Node | null) && onTarget(null)}
      onClick={(event) => (event.target as HTMLElement).closest('a, button') === null && fire()}
    >
      <span className={atomic.brackets} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold uppercase tracking-wide text-atomic-phosphor">{project.name}</h3>
        {years && <span className="whitespace-nowrap text-sm text-atomic-yellow">{years}</span>}
      </div>
      <Part tag={hud.role}>
        <p className="mt-1 text-base font-bold text-atomic-yellow">{project.role}</p>
      </Part>
      <p className="mt-2 text-sm leading-relaxed text-atomic-ash">{project.tagline}</p>

      {project.impact && (
        <Part tag={cards.impact}>
          <p className="mt-3 border-l-4 border-atomic-phosphor pl-3 text-sm text-atomic-phosphor">{project.impact}</p>
        </Part>
      )}

      {project.techStack.length > 0 && (
        <Part tag={cards.tech}>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={cards.technologiesUsed}>
            {project.techStack.slice(0, 5).map((tech) => (
              <li key={tech} className="border border-atomic-phosphor/40 px-2 py-0.5 text-sm text-atomic-phosphor-dim">
                {tech}
              </li>
            ))}
          </ul>
        </Part>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button ref={buttonRef} type="button" onClick={fire} className={`relative min-h-[44px] border-2 border-atomic-phosphor px-3 text-sm font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow} ${atomic.focusRing}`}>
          <span className="relative">{actions.readFile}</span>
        </button>
        {links.map(({ kind, label, linkProps }) => (
          <a key={kind} {...linkProps} className={`inline-flex min-h-[44px] items-center px-2 text-sm uppercase tracking-widest text-atomic-phosphor underline-offset-4 hover:underline ${atomic.focusRing}`}>
            {label}
          </a>
        ))}
        {links.length === 0 && <span className="text-sm text-atomic-ash">{linkLabels.noPublicLink}</span>}
      </div>
    </article>
  )
}

function ProjectFile({ slot, onClose }: { slot: ProjectSlot; onClose: () => void }) {
  const { actions, cards } = useLabels()
  const { project, years, links } = slot
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = `atomic-file-${project.id}`

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: globalThis.KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-atomic-ink/80 p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className={`relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[1.2rem] p-6 sm:p-8 ${atomic.tube} ${atomic.powerOn}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={titleId} className={`text-2xl font-bold uppercase tracking-wide text-atomic-phosphor ${atomic.glow}`}>
              {project.name}
            </h3>
            <p className="mt-1 text-base text-atomic-yellow">{[project.role, years].filter(Boolean).join(' / ')}</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className={`relative min-h-[44px] shrink-0 border-2 border-atomic-phosphor px-3 text-sm font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow} ${atomic.focusRing}`}>
            <span className="relative">{actions.closeFile}</span>
          </button>
        </div>

        <p className="mt-4 text-base leading-relaxed text-atomic-phosphor">{project.description || project.tagline}</p>
        {project.impact && <p className="mt-4 border-l-4 border-atomic-phosphor pl-3 text-base text-atomic-phosphor">{project.impact}</p>}

        {project.details.length > 0 && (
          <ul className="mt-5 space-y-1" aria-label={cards.keyAchievements}>
            {project.details.map((detail) => (
              <li key={detail} className={`relative flex gap-2 px-2 py-1 text-sm text-atomic-phosphor ${atomic.pickRow}`}>
                <span className="relative" aria-hidden="true">
                  +
                </span>
                <span className="relative">{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {project.techStack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={cards.technologiesUsed}>
            {project.techStack.map((tech) => (
              <li key={tech} className="border border-atomic-phosphor/40 px-2 py-0.5 text-sm text-atomic-phosphor-dim">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {links.map(({ kind, label, linkProps }) => (
              <a key={kind} {...linkProps} className={`relative inline-flex min-h-[44px] items-center border-2 border-atomic-phosphor px-3 text-sm font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.menuRow} ${atomic.focusRing}`}>
                <span className="relative">{label}</span>
              </a>
            ))}
          </div>
        )}
        <span className={`pointer-events-none absolute inset-0 ${atomic.scanlines}`} aria-hidden="true" />
      </div>
    </div>
  )
}

interface Opened {
  slot: ProjectSlot
  trigger: HTMLElement
}

export function TargetingSystem({ projects }: { projects: Project[] }) {
  const { hud } = useLabels()
  const { points, spend } = useActionPoints()
  const [target, setTarget] = useState<string | null>(null)
  const [shot, setShot] = useState<{ id: string; phase: ShotPhase } | null>(null)
  const [opened, setOpened] = useState<Opened | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const onFire = useCallback(
    (slot: ProjectSlot, trigger: HTMLElement) => {
      if (shot) return
      if (prefersReducedMotion() || !spend()) {
        setOpened({ slot, trigger })
        return
      }
      setShot({ id: slot.project.id, phase: 'aim' })
      timers.current = SHOT.map(([phase, at]) =>
        window.setTimeout(() => {
          if (phase === 'open') {
            setShot(null)
            setOpened({ slot, trigger })
            return
          }
          setShot({ id: slot.project.id, phase })
        }, at),
      )
    },
    [shot, spend],
  )

  const onClose = useCallback(() => {
    opened?.trigger.focus()
    setOpened(null)
  }, [opened])

  const locked = shot?.id ?? target

  return (
    <div className="relative" data-vats={locked ? 'on' : undefined}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-atomic-phosphor-dim">{hud.targetHint}</p>
        <ActionPoints points={points} />
      </div>
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => (
          <TargetCard
            slot={slot}
            index={projects.indexOf(slot.project)}
            targeted={locked === slot.project.id}
            phase={shot?.id === slot.project.id ? shot.phase : null}
            onTarget={(id) => !shot && setTarget(id)}
            onFire={onFire}
          />
        )}
      />
      <span className={`pointer-events-none fixed inset-x-0 top-0 z-[70] h-[12vh] bg-atomic-ink ${atomic.letterboxTop}`} data-on={shot ? 'on' : undefined} aria-hidden="true" />
      <span className={`pointer-events-none fixed inset-x-0 bottom-0 z-[70] h-[12vh] bg-atomic-ink ${atomic.letterboxBottom}`} data-on={shot ? 'on' : undefined} aria-hidden="true" />
      <span className={`pointer-events-none fixed inset-0 z-[71] bg-atomic-cream ${atomic.shotFlash}`} data-on={shot?.phase === 'hit' ? 'on' : undefined} aria-hidden="true" />
      {opened && <ProjectFile slot={opened.slot} onClose={onClose} />}
    </div>
  )
}
