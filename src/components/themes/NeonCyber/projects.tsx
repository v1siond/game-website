'use client'

import { useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Project } from '@/lib/cv/content'
import { fillLabel } from '@/lib/cv/labels'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { projectCard, type ProjectCard as ProjectCardView } from '@/lib/cv/cvView'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useModalDialog } from '@/hooks/useModalDialog'
import { DATA_CHIPS, HUD_LINK } from './hud'
import world from './world.module.css'

// Projects as file cards, one each. Every card has Decrypt: a dialog that runs the decryption of the
// project's file once (the bar fills in steps) and then lifts the scramble of bytes off its text (its
// description, the commit backed details, its result). The file's text is in the dialog from the start,
// under the scramble, so a screen reader reads it whatever the bar shows; under reduced motion the file
// opens at once.

// A project's details, each behind the data prompt.
const PROMPT_LINES: MarkedLinesLook = {
  list: 'mt-3 space-y-1',
  line: 'flex gap-2 text-sm text-[color:var(--neon-ice)]',
  marker: (
    <span className="text-[color:var(--neon-hack)]" aria-hidden="true">
      {'>'}
    </span>
  ),
}

interface DecryptDialogProps {
  project: ProjectCardView
  open: boolean
  trigger: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

const fileHeadingId = (project: ProjectCardView): string => `nc-file-${project.id}`

/** The project's file: its description, the commit backed details and its result, with `children` over it. */
function ProjectFile({ project, children }: { project: ProjectCardView; children?: ReactNode }) {
  const { cards } = useLabels()
  return (
    <section className="relative mt-6 border-t border-[color-mix(in_srgb,var(--neon-chrome-red)_60%,transparent)] pt-4" aria-label={cards.details}>
      {project.description && <p className="text-sm text-[color:var(--neon-ice)]">{project.description}</p>}
      <MarkedLines items={project.details} label={cards.details} look={PROMPT_LINES} />
      {project.impact && (
        <p className="mt-3 text-sm text-[color:var(--neon-hud)]">
          <ImpactLabel />
          {project.impact}
        </p>
      )}
      {children}
    </section>
  )
}

/**
 * The dialog is always in the page, closed until Decrypt is pressed, so the server HTML carries every
 * project's file. The run mounts on each open, so every open decrypts once more.
 */
function DecryptDialog({ project, open, trigger, onClose }: DecryptDialogProps) {
  const dialogRef = useModalDialog(open, trigger)

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={fileHeadingId(project)}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={`${world.dialog} ${world.panel} m-auto w-[min(56rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto bg-[color:var(--neon-glass)] p-4 text-[color:var(--neon-ice)] sm:p-6`}
    >
      {open ? <DecryptRun project={project} onClose={onClose} /> : <ProjectFile project={project} />}
    </dialog>
  )
}

// The scramble over a locked file: the bytes of the project's name, as hex, repeated to fill the file.
const scrambleOf = (name: string): string => Array.from(name, (char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')

function DecryptRun({ project, onClose }: { project: ProjectCardView; onClose: () => void }) {
  const { cyber, actions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [done, setDone] = useState(false)
  const unlocked = done || reducedMotion
  const headingId = fileHeadingId(project)

  return (
    <>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--neon-data-text)]">{cyber.decrypt}</p>
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

      <div className="relative h-2 bg-[color-mix(in_srgb,var(--neon-hack)_15%,transparent)]" aria-hidden="true">
        <span className={`absolute inset-0 bg-[color:var(--neon-hack)] ${world.decrypting}`} data-open={unlocked} onAnimationEnd={() => setDone(true)} />
      </div>
      <p className="mt-2 min-h-6 text-sm uppercase tracking-wider text-[color:var(--neon-hack)]" aria-live="polite">
        {unlocked ? cyber.fileOpen : ''}
      </p>

      {/* the file: real text, under the scramble until it opens */}
      <ProjectFile project={project}>
        <div
          className={`${world.scramble} pointer-events-none absolute inset-0 top-4 overflow-hidden break-all bg-[color:var(--neon-glass)] text-sm leading-6 text-[color:var(--neon-hud-dim)]`}
          data-open={unlocked}
          aria-hidden="true"
        >
          {scrambleOf(project.name).repeat(40)}
        </div>
      </ProjectFile>
    </>
  )
}

function ProjectCard({ project: entry, links, noLink }: ProjectSlot) {
  const labels = useLabels()
  const { cyber, cards } = labels
  const project = useMemo(() => projectCard(entry, labels), [entry, labels])
  const [decrypting, setDecrypting] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <>
      <article className="border border-[color-mix(in_srgb,var(--neon-hack)_30%,transparent)] bg-[color:var(--neon-glass)] p-4">
        <header className="mb-2 flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-base text-[color:var(--neon-ice)]">
            <SlashBreaks text={project.name} />
          </h3>
          {project.years && <span className="shrink-0 text-sm text-[color:var(--neon-ash)]">{project.years}</span>}
        </header>
        <p className="text-sm text-[color:var(--neon-hud)]">{project.role}</p>
        <p className="mt-1 text-sm text-[color:var(--neon-ice)]">{project.tagline}</p>
        {project.impact && (
          <p className="mt-2 text-sm text-[color:var(--neon-hack)]">
            <ImpactLabel />
            {project.impact}
          </p>
        )}
        <TagList items={project.techStack} label={cards.technologiesUsed} look={{ ...DATA_CHIPS, list: 'mt-3 flex flex-wrap gap-1' }} />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            ref={trigger}
            type="button"
            onClick={() => setDecrypting(true)}
            aria-label={fillLabel(cyber.decryptOf, { project: project.name })}
            className={`${world.cut} min-h-[44px] bg-[color:var(--neon-hack)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-ink)] hover:bg-[color:var(--neon-ice)]`}
          >
            {cyber.decrypt}
          </button>
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className={HUD_LINK}
            >
              {label}
            </a>
          ))}
        </div>
        {noLink && <p className="mt-2 text-sm text-[color:var(--neon-ash)]">{noLink}</p>}
      </article>
      <DecryptDialog project={project} open={decrypting} trigger={trigger} onClose={() => setDecrypting(false)} />
    </>
  )
}

export function ProjectFiles({ projects }: { projects: Project[] }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={projects} className="grid gap-4" renderProject={(slot) => <ProjectCard {...slot} />} />
    </div>
  )
}
