'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { fillLabel } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Profession } from '@/lib/cv/professions'
import { Actor, useCourse } from './actor'
import { cssVars } from './art'
import { BigSwitch } from './blocks'
import type { Course } from './course'
import { PAPER_CARD, Playfield, Region } from './region'
import { Pipe, type Zone } from './world'
import side from './side.module.css'
import { JOURNAL_SERIF, TRAIL } from './palette'
import map from './map.module.css'
import { SlashBreaks } from '@/components/cv/SlashBreaks'

// Projects as switch palaces, the overworld's coloured switch blocks: each project has its own switch in
// one of four colours, taken in turn. Its tech stack stands under it as outlined blocks, dashed and empty.
// Pressing the switch squashes it flat, fills every outlined block solid one after another in the
// switch's colour, and opens the message box from its centre with the project's details, the way the
// palace explains what the switch did. A project with more than one link has a red tile: its extra links
// are its secret exits.
//
// Above the palaces is the stretch he crosses (research images 04, 12, 20): he runs in, jumps onto the
// big switch and stomps it flat, which fills every palace's blocks at once, then hops onto the pipe at
// the end and sinks down it, out of sight, toward the underground room of the next section. The big
// switch is also a button that fills or empties every palace's blocks.

interface SwitchColour {
  fill: string
  /** Text on the solid fill (ink on gold, white on the darker three). */
  text: string
  svg: string
  shade: string
}

const SWITCH_COLOURS: readonly SwitchColour[] = [
  { fill: 'bg-[color:var(--ap-gold)]', text: 'text-[color:var(--ap-ink)]', svg: TRAIL.GOLD, shade: '#9a6a14' },
  { fill: 'bg-[color:var(--ap-forest)]', text: 'text-white', svg: TRAIL.FOREST, shade: TRAIL.CANOPY },
  { fill: 'bg-[color:var(--ap-route)]', text: 'text-white', svg: TRAIL.ROUTE, shade: '#6e1f12' },
  { fill: 'bg-[color:var(--ap-blue)]', text: 'text-white', svg: TRAIL.BLUE, shade: '#1f3f78' },
]

const LINK = 'inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[color:var(--ap-ink)] px-3 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none'

/** The switch block: a squat block with its stud on top, squashed flat once pressed. */
function SwitchBlock({ colour }: { colour: SwitchColour }) {
  return (
    <svg viewBox="0 0 48 40" className="h-10 w-12" aria-hidden="true" focusable="false">
      <rect x={4} y={30} width={40} height={8} rx={2} fill={TRAIL.STONE_DARK} stroke={TRAIL.INK} strokeWidth={2} />
      <g className={map.switchCap}>
        <rect x={8} y={8} width={32} height={22} rx={4} fill={colour.svg} stroke={TRAIL.INK} strokeWidth={2.4} />
        <rect x={12} y={12} width={10} height={5} rx={2} fill={TRAIL.PAGE} opacity={0.6} />
        <rect x={18} y={2} width={12} height={7} rx={2} fill={colour.shade} stroke={TRAIL.INK} strokeWidth={2} />
        <path d="M24 16 L30 22 H18 Z" fill={colour.shade} />
      </g>
    </svg>
  )
}

type SwitchPose = 'run' | 'jump' | 'stomp' | 'hop' | 'sink' | 'gone'

const COURSE: Course<SwitchPose> = {
  start: { x: -20, lift: 0 },
  legs: [
    { pose: 'run', frame: 'run', path: 'line', to: { x: 30, lift: 0 }, ms: 560 },
    { pose: 'jump', frame: 'jump', path: 'arc', to: { x: 44, lift: 40 }, ms: 380, peak: 44 },
    { pose: 'stomp', frame: 'stomp', path: 'line', to: { x: 44, lift: 16 }, ms: 160, ease: 'ease-in' },
    { pose: 'hop', frame: 'jump', path: 'arc', to: { x: 80, lift: 52 }, ms: 460, peak: 40 },
    { pose: 'sink', frame: 'stand', path: 'line', to: { x: 80, lift: -90 }, ms: 700, ease: 'ease-in' },
  ],
  rest: { pose: 'gone', frame: 'stand' },
}

function PipeScene({ profession, onStomp }: { profession: Profession; onStomp: () => void }) {
  const course = useCourse(COURSE)
  const stomped = course.past('jump')

  useEffect(() => {
    if (stomped) onStomp()
  }, [stomped, onStomp])

  return <Actor motion={course.motion} profession={profession} onAnimationEnd={course.onOwnAnimationEnd} />
}

function TechBlocks({ items, colour, pressed, label }: { items: string[]; colour: SwitchColour; pressed: boolean; label: string }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item, index) => (
        <li key={item} className="relative px-2 py-1 text-sm font-semibold" style={cssVars({ '--i': index })}>
          <span className="absolute inset-0 rounded-sm border-2 border-dashed border-[color:var(--ap-ink-soft)]" aria-hidden="true" />
          <span className={`absolute inset-0 rounded-sm border-2 border-[color:var(--ap-ink)] ${colour.fill} ${map.block}`} data-solid={pressed} aria-hidden="true" />
          <span className={`relative ${pressed ? colour.text : 'text-[color:var(--ap-ink)]'}`}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** The message box the switch opens: the project's story, from its centre outward. */
function MessageBox({ project, id }: { project: Project; id: string }) {
  const { cards } = useLabels()
  return (
    <div id={id} className={`mt-4 rounded-sm border-4 border-double border-[color:var(--ap-ink)] bg-[color:var(--ap-ink)] p-4 text-[color:var(--ap-page)] ${map.messageBox}`}>
      {project.description && <p className="text-sm">{project.description}</p>}
      {project.details.length > 0 && (
        <ul className="mt-2 space-y-1.5" aria-label={cards.details}>
          {project.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-2 w-2 shrink-0 bg-[color:var(--ap-lantern)]" aria-hidden="true" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SwitchPalace({ slot, colour, filled }: { slot: ProjectSlot; colour: SwitchColour; filled: boolean }) {
  const { project, years, links } = slot
  const { cards, trail } = useLabels()
  const [pressed, setPressed] = useState(false)
  const boxId = `trail-project-${project.id}`
  const [main, ...secret] = links

  return (
    <article className={PAPER_CARD}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}><SlashBreaks text={project.name} /></h3>
          <p className="text-sm font-semibold text-[color:var(--ap-route)]">{project.role}</p>
          {years && <p className="text-sm text-[color:var(--ap-ink-soft)]">{years}</p>}
        </div>
        <button
          type="button"
          aria-pressed={pressed}
          aria-expanded={pressed}
          aria-controls={pressed ? boxId : undefined}
          aria-label={fillLabel(trail.pressSwitch, { name: project.name })}
          onClick={() => setPressed((now) => !now)}
          className={`shrink-0 rounded-sm p-1 ${map.switch}`}
        >
          <SwitchBlock colour={colour} />
        </button>
      </div>
      <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{project.tagline}</p>
      {project.impact && <p className="mt-2 text-sm font-semibold text-[color:var(--ap-forest)]">{project.impact}</p>}
      <TechBlocks items={project.techStack} colour={colour} pressed={pressed || filled} label={cards.technologiesUsed} />
      {pressed && <MessageBox project={project} id={boxId} />}
      {main && (
        <div className="mt-4 flex flex-wrap gap-2">
          <a {...main.linkProps} className={`${LINK} bg-[color:var(--ap-gold)] text-[color:var(--ap-ink)]`}>
            {main.label}
          </a>
          {secret.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={`${LINK} bg-[color:var(--ap-route)] text-white`}>
              <span className="h-3 w-3 rounded-full border-2 border-white bg-[color:var(--ap-route)]" aria-hidden="true" />
              {label}
              <span className="text-sm font-normal">{trail.secretExit}</span>
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export function SwitchPalaces({ projects, profession }: { projects: Project[]; profession: Profession }) {
  const { sections, trail } = useLabels()
  const { ref, on } = useZoneStage<Zone>('plains')
  const [filled, setFilled] = useState(false)
  const fill = useCallback(() => setFilled(true), [])
  const colourOf = (project: Project) => SWITCH_COLOURS[projects.indexOf(project) % SWITCH_COLOURS.length]

  return (
    <Region title={sections.projects} hint={trail.switchHint} stageRef={ref} on={on}>
      <Playfield>
        <button
          type="button"
          aria-pressed={filled}
          aria-label={trail.pressBigSwitch}
          onClick={() => setFilled((now) => !now)}
          className={`${side.bigSwitch} rounded-sm`}
        >
          <BigSwitch />
        </button>
        <div className={side.pipe} aria-hidden="true">
          <Pipe className="h-full w-full" />
        </div>
        {on && <PipeScene profession={profession} onStomp={fill} />}
      </Playfield>
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => <SwitchPalace slot={slot} colour={colourOf(slot.project)} filled={filled} />}
      />
    </Region>
  )
}
