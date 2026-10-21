'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import type { Project } from '@/lib/cv/content'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { BREACH_START, BUFFER_SIZE, MATRIX_SIZE, breachPuzzle, bufferBytes, byteText, canPick, matched, outcome, pick, type BreachOutcome } from './breach'
import { DataChip, HudPanel } from './hud'
import { Scannable } from './scanner'
import { MercSprite } from './merc'
import world from './world.module.css'

// Projects as gigs, in a masonry of cards. Every card has Breach: a dialog with the project's code
// matrix (./breach.ts), its buffer and its sequence. The first pick comes from the lit top row, then the
// lit line turns to the picked column, then to the picked row, and so on; when the buffer ends with the
// whole sequence the project's file opens (its description, the commit backed details, its result). A
// full buffer without it can be tried again, and Open now skips the hack. The file's text is in the
// dialog from the start, under a scramble of bytes that lifts when it opens, so a screen reader reads it
// whatever the matrix shows; under reduced motion the file opens at once.

const ROWS = Array.from({ length: MATRIX_SIZE }, (_, i) => i)

type CellLook = 'taken' | 'legal' | 'idle'

const CELL_LOOK: Record<CellLook, string> = {
  taken: `${world.picked} text-[color:var(--neon-ash)] line-through`,
  legal: 'text-[color:var(--neon-hud)] hover:bg-[color-mix(in_srgb,var(--neon-hud)_22%,transparent)]',
  idle: 'text-[color:var(--neon-ash)]',
}

function cellLook(taken: boolean, legal: boolean): CellLook {
  if (taken) return 'taken'
  if (legal) return 'legal'
  return 'idle'
}

const STATUS_TEXT: Record<BreachOutcome, (cyber: Labels['cyber']) => string> = {
  running: () => '',
  open: (cyber) => cyber.fileOpen,
  full: (cyber) => cyber.bufferFull,
}

const STATUS_TONE: Record<BreachOutcome, string> = {
  running: 'text-[color:var(--neon-ash)]',
  open: 'text-[color:var(--neon-hack)]',
  full: 'text-[color:var(--neon-chrome-red)]',
}

interface BreachDialogProps {
  project: Project
  trigger: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

function BreachDialog({ project, trigger, onClose }: BreachDialogProps) {
  const { cyber, actions, cards } = useLabels()
  const reducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const puzzle = useMemo(() => breachPuzzle(project.slug || project.id), [project])
  const [state, setState] = useState(BREACH_START)
  const [skipped, setSkipped] = useState(false)
  const result = outcome(puzzle, state)
  const unlocked = skipped || reducedMotion || result === 'open'
  const buffer = bufferBytes(puzzle, state)
  const done = matched(puzzle, state)
  const shown: BreachOutcome = unlocked ? 'open' : result

  useEffect(() => {
    const dialog = dialogRef.current
    const opener = trigger.current
    dialog?.showModal()
    return () => {
      dialog?.close()
      opener?.focus()
    }
  }, [trigger])

  const headingId = `nc-breach-${project.id}`
  const scramble = puzzle.matrix.flat().map(byteText).join(' ')

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={`${world.dialog} ${world.panel} m-auto w-[min(56rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto bg-[color:var(--neon-glass)] p-4 text-[color:var(--neon-ice)] sm:p-6`}
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--neon-chrome-red)]">{cyber.breach}</p>
          <h2 id={headingId} className="text-lg uppercase tracking-[0.15em] text-[color:var(--neon-hud)]">
            {project.name}
          </h2>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className={`${world.cut} min-h-[44px] min-w-[44px] border border-[color:var(--neon-ice)] px-3 text-sm uppercase hover:bg-[color-mix(in_srgb,var(--neon-ice)_12%,transparent)]`}
          aria-label={fillLabel(actions.close, { name: project.name })}
        >
          <span aria-hidden="true">X</span>
        </button>
      </header>

      <p className="mb-4 text-sm text-[color:var(--neon-ash)]">{cyber.breachHint}</p>

      <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <div>
          <p className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-data)]" id={`${headingId}-matrix`}>
            {cyber.matrix}
          </p>
          <div className="relative mx-auto w-fit border border-[color-mix(in_srgb,var(--neon-data)_50%,transparent)] bg-[color:var(--neon-ink)]">
            {result === 'running' && !unlocked && (
              <span
                className={`${world.band} pointer-events-none absolute bg-[color-mix(in_srgb,var(--neon-data)_16%,transparent)]`}
                data-axis={state.axis}
                style={{ '--line': state.line } as CSSProperties}
                aria-hidden="true"
              />
            )}
            <div className="relative grid grid-cols-5" role="group" aria-labelledby={`${headingId}-matrix`}>
              {ROWS.map((row) =>
                ROWS.map((column) => {
                  const cell = { row, column }
                  const taken = state.picks.some((p) => p.row === row && p.column === column)
                  const legal = !unlocked && canPick(state, cell)
                  const look = cellLook(taken, legal)
                  const code = byteText(puzzle.matrix[row][column])
                  return (
                    <button
                      key={`${row}-${column}`}
                      type="button"
                      disabled={!legal}
                      onClick={() => setState((current) => pick(current, cell))}
                      aria-label={fillLabel(cyber.code, {
                        code,
                        row: row + 1,
                        column: column + 1,
                      })}
                      className={`h-11 w-11 text-sm sm:h-12 sm:w-12 ${CELL_LOOK[look]}`}
                    >
                      {code}
                    </button>
                  )
                }),
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-data)]">{cyber.buffer}</p>
            <ol className="flex flex-wrap gap-2" aria-label={cyber.buffer}>
              {Array.from({ length: BUFFER_SIZE }, (_, slot) => (
                <li
                  key={slot}
                  className="flex h-10 w-10 items-center justify-center border border-dashed border-[color-mix(in_srgb,var(--neon-hud)_60%,transparent)] text-sm text-[color:var(--neon-hud)]"
                >
                  {buffer[slot] === undefined ? '' : byteText(buffer[slot])}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-data)]">{cyber.sequence}</p>
            <ol className="flex flex-wrap gap-2" aria-label={cyber.sequence}>
              {puzzle.sequence.map((byte, i) => (
                <li
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center border text-sm ${
                    i < done || unlocked
                      ? 'border-[color:var(--neon-hack)] bg-[color-mix(in_srgb,var(--neon-hack)_14%,transparent)] text-[color:var(--neon-hack)]'
                      : 'border-[color-mix(in_srgb,var(--neon-ice)_40%,transparent)] text-[color:var(--neon-ice)]'
                  }`}
                >
                  {byteText(byte)}
                </li>
              ))}
            </ol>
          </div>
          <p className={`min-h-6 text-sm uppercase tracking-wider ${STATUS_TONE[shown]}`} aria-live="polite">
            {STATUS_TEXT[shown](cyber)}
          </p>
          <div className="flex flex-wrap gap-2">
            {result === 'full' && !unlocked && (
              <button
                type="button"
                onClick={() => setState(BREACH_START)}
                className={`${world.cut} min-h-[44px] border border-[color:var(--neon-hud)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-hud)] hover:bg-[color-mix(in_srgb,var(--neon-hud)_12%,transparent)]`}
              >
                {cyber.retry}
              </button>
            )}
            {!unlocked && (
              <button
                type="button"
                onClick={() => setSkipped(true)}
                className={`${world.cut} min-h-[44px] border border-[color:var(--neon-ice)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-ice)] hover:bg-[color-mix(in_srgb,var(--neon-ice)_12%,transparent)]`}
              >
                {cyber.openNow}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* the file: real text, under the scramble until it opens */}
      <section className="relative mt-6 border-t border-[color-mix(in_srgb,var(--neon-chrome-red)_60%,transparent)] pt-4" aria-label={cards.details}>
        <p className="text-sm text-[color:var(--neon-ice)]">{project.description}</p>
        {project.details.length > 0 && (
          <ul className="mt-3 space-y-1">
            {project.details.map((detail) => (
              <li key={detail} className="flex gap-2 text-sm text-[color:var(--neon-ice)]">
                <span className="text-[color:var(--neon-hack)]" aria-hidden="true">
                  {'>'}
                </span>
                {detail}
              </li>
            ))}
          </ul>
        )}
        {project.impact && <p className="mt-3 text-sm text-[color:var(--neon-hud)]">{project.impact}</p>}
        <div
          className={`${world.scramble} pointer-events-none absolute inset-0 top-4 overflow-hidden break-all bg-[color:var(--neon-glass)] text-sm leading-6 text-[color:var(--neon-hud-dim)]`}
          data-open={unlocked}
          aria-hidden="true"
        >
          {scramble.repeat(12)}
        </div>
      </section>
    </dialog>
  )
}

function GigCard({ project, years, links }: ProjectSlot) {
  const labels = useLabels()
  const { cyber, sections } = labels
  const [breaching, setBreaching] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Scannable kind="project" title={sections.projects} fact={project.role}>
        <article className="border border-[color-mix(in_srgb,var(--neon-hack)_30%,transparent)] bg-[color:var(--neon-glass)] p-4">
          <header className="mb-2 flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-base text-[color:var(--neon-ice)]">
              <SlashBreaks text={project.name} />
            </h3>
            {years && <span className="shrink-0 text-sm text-[color:var(--neon-ash)]">{years}</span>}
          </header>
          <p className="text-sm text-[color:var(--neon-hud)]">{project.role}</p>
          <p className="mt-1 text-sm text-[color:var(--neon-ice)]">{project.tagline}</p>
          {project.impact && <p className="mt-2 text-sm text-[color:var(--neon-hack)]">{project.impact}</p>}
          {project.techStack.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1" aria-label={labels.cards.technologiesUsed}>
              {project.techStack.slice(0, 5).map((tech) => (
                <DataChip key={tech}>{tech}</DataChip>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              ref={trigger}
              type="button"
              onClick={() => setBreaching(true)}
              aria-label={fillLabel(cyber.breachOf, { project: project.name })}
              className={`${world.cut} min-h-[44px] bg-[color:var(--neon-hack)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-ink)] hover:bg-[color:var(--neon-ice)]`}
            >
              {cyber.breach}
            </button>
            {links.map(({ kind, label, linkProps }) => (
              <a
                key={kind}
                {...linkProps}
                className={`${world.cut} inline-flex min-h-[44px] items-center border border-[color:var(--neon-use)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-use)] hover:bg-[color-mix(in_srgb,var(--neon-use)_14%,transparent)]`}
              >
                {label}
              </a>
            ))}
          </div>
          {links.length === 0 && <p className="mt-2 text-sm text-[color:var(--neon-ash)]">{labels.links.noPublicLink}</p>}
        </article>
      </Scannable>
      {breaching && <BreachDialog project={project} trigger={trigger} onClose={() => setBreaching(false)} />}
    </>
  )
}

// Him at the head of the gigs, jacked into his deck, the glyphs climbing off it while he breaches.
function JackedIn() {
  const reduced = useReducedMotion()
  return (
    <span className="block w-12 sm:w-14" aria-hidden="true">
      <MercSprite profession="engineer" motion={reduced ? 'still' : 'hack'} className="h-auto w-full" />
    </span>
  )
}

export function Gigs({ projects }: { projects: Project[] }) {
  const { sections } = useLabels()
  return (
    <HudPanel title={sections.projects} tools={<JackedIn />}>
      <ProjectList projects={projects} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderProject={(slot) => <GigCard {...slot} />} />
    </HudPanel>
  )
}
