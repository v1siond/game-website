'use client'

import { useCallback, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { fillLabel } from '@/lib/cv/labels'
import type { SectionsOf } from '@/lib/cv/cvView'
import { Bandicoot, type BandicootPose } from './bandicoot'
import { Blast, Planks, PopUp, type BurstTone } from './burst'
import { CrateArt, type CrateKind } from './crateArt'
import { Fruit, Gem, MaskFace } from './pickups'
import { allCratesOpen, useScore } from './score'
import crates from './crateField.module.css'
import ui from './warped.module.css'

// The projects as the crates of a level (the time travel platformer, Warped, named in code only). Every
// project sits in a crate of one of the game's kinds, set by a fixed cycle down the list, and each kind
// opens its own way when clicked (or on Enter):
//   wood        squash, burst, one fruit
//   question    squash, burst, a handful of fruit
//   bounce      three hops, a fruit each, then it gives way
//   arrow       it launches up, then bursts at the top
//   tnt         lit: the 3, 2, 1 countdown on its face, then the blast
//   nitro       an instant green blast
//   metal       a clank (spin and fists do nothing), then he body slams it open
//   mask        burst, and a mask floats out to join him
//   checkpoint  burst, and the checkpoint ring spins up
// Over the field a strip shows him with two buttons, the way the game gives you two moves for crates:
// Spin opens every crate but the steel ones (a TNT caught in a spin blows at once), and Body slam
// opens the steel ones. The box counter in the strip and the score bar count them against the total;
// when the last one opens the counter turns into the gem and he dances. When the field scrolls in he
// runs into the strip from its left while the crates rise, and every crate the visitor breaks by hand
// makes him jump, the way he hops onto a crate to bust it.
// A crate opened by the visitor's own click hands focus to the card it held. Reduced motion and a
// World Select preview open every crate at once, with the score to match.

const CYCLE: readonly CrateKind[] = ['wood', 'question', 'bounce', 'tnt', 'arrow', 'metal', 'nitro', 'mask', 'wood', 'checkpoint']

type Strike = 'hand' | 'spin' | 'slam'
type CrateState = 'closed' | 'hit' | 'hop' | 'launch' | 'lit' | 'clank' | 'burst' | 'open'

interface Opening {
  /** The steps from the strike to the burst, each [state, ms it lasts]. */
  steps: ReadonlyArray<readonly [CrateState, number]>
  fruit: number
  tone: BurstTone
  blast?: 'tnt' | 'nitro' | 'slam'
}

const OPENING: Record<CrateKind, Opening> = {
  wood: { steps: [['hit', 140]], fruit: 1, tone: 'wood' },
  question: { steps: [['hit', 140]], fruit: 5, tone: 'wood' },
  bounce: { steps: [['hop', 900]], fruit: 3, tone: 'wood' },
  arrow: { steps: [['launch', 420]], fruit: 2, tone: 'wood' },
  tnt: { steps: [['lit', 1800]], fruit: 0, tone: 'tnt', blast: 'tnt' },
  nitro: { steps: [['hit', 60]], fruit: 0, tone: 'nitro', blast: 'nitro' },
  metal: { steps: [['clank', 360], ['hit', 380]], fruit: 2, tone: 'metal', blast: 'slam' },
  mask: { steps: [['hit', 140]], fruit: 1, tone: 'wood' },
  checkpoint: { steps: [['hit', 140]], fruit: 1, tone: 'wood' },
}

// A spin skips a TNT's fuse; the steel crate only answers to the slam.
const OPENS: Record<Strike, (kind: CrateKind) => boolean> = {
  hand: () => true,
  spin: (kind) => kind !== 'metal',
  slam: (kind) => kind === 'metal',
}

const BURST_MS = 700
const TNT_STEP_MS = 600
const CASCADE_MS = 140

const kindAt = (index: number): CrateKind => CYCLE[index % CYCLE.length]

function useCrate(id: string, kind: CrateKind, spin: number, slam: number, order: number) {
  const { offer, take, has, addFruit, addMask } = useScore()
  const preview = usePreview()
  const [state, setState] = useState<CrateState>(() => (has('crates', id) ? 'open' : 'closed'))
  const [byHand, setByHand] = useState(false)
  const opening = OPENING[kind]

  const score = useCallback(() => {
    if (!take('crates', id)) return
    addFruit(opening.fruit)
    if (kind === 'mask') addMask('crate')
  }, [take, id, addFruit, opening.fruit, kind, addMask])

  useEffect(() => {
    offer('crates', id)
    if (!preview && !prefersReducedMotion()) return
    score()
    setState('open')
  }, [id, preview, offer, score])

  const run = useCallback(
    (strike: Strike) => {
      if (!OPENS[strike](kind)) return
      const steps = strike === 'spin' && kind === 'tnt' ? [] : opening.steps
      setState((now) => (now === 'closed' ? (steps[0]?.[0] ?? 'burst') : now))
    },
    [kind, opening.steps],
  )

  const strikeByHand = () => {
    setByHand(true)
    run('hand')
  }

  useEffect(() => {
    if (!spin) return
    const timer = window.setTimeout(() => run('spin'), order * CASCADE_MS)
    return () => window.clearTimeout(timer)
  }, [spin, order, run])

  useEffect(() => {
    if (!slam) return
    const timer = window.setTimeout(() => run('slam'), 360)
    return () => window.clearTimeout(timer)
  }, [slam, run])

  // Walks the kind's steps to the burst, then the burst to open.
  useEffect(() => {
    if (state === 'closed' || state === 'open') return
    if (state === 'burst') {
      score()
      const timer = window.setTimeout(() => setState('open'), BURST_MS)
      return () => window.clearTimeout(timer)
    }
    const at = opening.steps.findIndex(([step]) => step === state)
    const next = opening.steps[at + 1]?.[0] ?? 'burst'
    const timer = window.setTimeout(() => setState(next), opening.steps[at]?.[1] ?? 0)
    return () => window.clearTimeout(timer)
  }, [state, opening.steps, score])

  return { state, strikeByHand, byHand }
}

/** The TNT's countdown digit while it is lit: 3, 2, 1. */
function useCountdown(lit: boolean) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!lit) return
    setCount(3)
    const timers = [1, 2].map((step) => window.setTimeout(() => setCount(3 - step), step * TNT_STEP_MS))
    return () => timers.forEach(window.clearTimeout)
  }, [lit])

  return lit ? count : undefined
}

function ClosedCrate({ slot, kind, state, onStrike }: { slot: ProjectSlot; kind: CrateKind; state: CrateState; onStrike: () => void }) {
  const { hud, warp } = useLabels()
  const countdown = useCountdown(state === 'lit')
  const { project, years } = slot
  const word = kind === 'tnt' ? warp.tnt : warp.nitro

  return (
    <button
      type="button"
      onClick={onStrike}
      aria-label={fillLabel(hud.breakCrate, { project: project.name })}
      className={`group relative block w-full focus:outline-none ${crates.crate}`}
      data-crate={state}
      data-kind={kind}
    >
      <span className={`relative mx-auto block w-full max-w-[15rem] ${crates.body}`}>
        <CrateArt kind={kind} label={word} countdown={countdown} className="h-auto w-full" />
      </span>
      <span className="mx-auto mt-2 block w-[85%] max-w-[14rem] rounded-md border-2 border-[color:var(--np-void)] bg-[color:var(--np-plank-lit)] px-2 py-1 text-center">
        <span className="block truncate text-base font-black uppercase text-[color:var(--np-void)]">{project.name}</span>
        {years && <span className="block text-sm font-bold text-[color:var(--np-void)]">{years}</span>}
      </span>
    </button>
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
    <article ref={ref} tabIndex={-1} aria-labelledby={`np-project-${project.id}`} className={`relative overflow-hidden ${ui.panel} focus:outline-none`}>
      <div className="h-2 bg-[color:var(--np-orange)]" aria-hidden="true" />
      <div className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id={`np-project-${project.id}`} className={`text-2xl leading-tight ${ui.display}`}>
            {project.name}
          </h3>
          {years && <span className="text-sm font-bold text-[color:var(--np-gold)]">{years}</span>}
        </div>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[color:var(--np-teal)]">{project.role}</p>
        <p className="mt-3 text-base text-[color:var(--np-white)]">{project.tagline}</p>
        {project.impact && (
          <p className="mt-3 rounded-lg border-l-4 border-[color:var(--np-green)] bg-[color:var(--np-void)] px-3 py-2 text-base text-[color:var(--np-white)]">
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
              <a key={kind} {...linkProps} className={`${ui.button} ${ui.stone}`}>
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

/** What pops out of a crate's spot as it bursts. */
function Prize({ kind }: { kind: CrateKind }) {
  if (kind === 'mask') return <MaskFace className="h-full w-full" feathers={4} />
  if (kind === 'tnt' || kind === 'nitro') return null
  return <Fruit className="h-full w-full" />
}

interface ProjectCrateProps {
  slot: ProjectSlot
  index: number
  spin: number
  slam: number
  onHit: () => void
}

function ProjectCrate({ slot, index, spin, slam, onHit }: ProjectCrateProps) {
  const kind = kindAt(index)
  const { state, strikeByHand, byHand } = useCrate(slot.project.id, kind, spin, slam, index)
  const opening = OPENING[kind]
  const strike = () => {
    strikeByHand()
    onHit()
  }

  if (state !== 'burst' && state !== 'open') return <ClosedCrate slot={slot} kind={kind} state={state} onStrike={strike} />

  return (
    <div className="relative" data-crate={state}>
      {state === 'burst' && (
        <>
          <Planks tone={opening.tone} />
          {opening.blast && <Blast tone={opening.blast} />}
          <PopUp className="left-[40%] top-[-6%] z-20 h-12 w-12">
            <Prize kind={kind} />
          </PopUp>
        </>
      )}
      <div className={state === 'burst' ? crates.cardPop : ''}>
        <ProjectCard slot={slot} focus={byHand} />
      </div>
    </div>
  )
}

const MOVE_MS = 1000

type Move = 'spin' | 'slam' | 'jump'

/** A move he plays over his resting pose; the count replays it when the same move comes again. */
interface Played {
  move: Move
  count: number
}

/** What he does at rest: the run in while the field rises, then the idle, or the dance once all are open. */
function restingPose(arrived: boolean, gem: boolean): BandicootPose {
  if (!arrived) return 'run'
  return gem ? 'dance' : 'idle'
}

interface MoveStripProps {
  onSpin: () => void
  onSlam: () => void
  played: Played | null
}

/** The strip over the field: him, the two moves, the box counter. */
function MoveStrip({ onSpin, onSlam, played }: MoveStripProps) {
  const { hud, warp } = useLabels()
  const { score } = useScore()
  const { ref, triggered } = useSectionTrigger()
  const [arrived, setArrived] = useState(false)
  const gem = allCratesOpen(score)
  const pose: BandicootPose = played?.move ?? restingPose(arrived, gem)
  const { crates: opened } = score.counts
  const total = score.totals.crates

  const arrive = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget) return
    setArrived(true)
  }

  return (
    <div ref={ref} className={`mb-8 flex flex-wrap items-center gap-4 overflow-hidden p-4 ${ui.panel}`}>
      <span className={`relative block h-24 w-16 shrink-0 ${triggered ? crates.runIn : crates.offStage}`} onAnimationEnd={arrive} aria-hidden="true">
        {played?.move === 'slam' && <Blast tone="slam" />}
        <Bandicoot key={played?.count ?? 0} profession="engineer" pose={pose} className="h-full w-full" />
      </span>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onSpin} className={`${ui.button} ${ui.lit}`}>
          {warp.spin}
        </button>
        <button type="button" onClick={onSlam} className={`${ui.button} ${ui.steel}`}>
          {warp.bodySlam}
        </button>
      </div>
      <p className="flex items-center gap-2 rounded-full border-4 border-[color:var(--np-void)] bg-[color:var(--np-void)] px-3 py-1">
        <span className="block h-8 w-8" aria-hidden="true">
          {gem ? <Gem className={`h-full w-full ${ui.award}`} /> : <CrateArt kind="wood" className="h-full w-full" />}
        </span>
        <span className={`text-xl tabular-nums text-[color:var(--np-white)] ${ui.chunk}`} aria-hidden="true">
          {opened}/{total}
        </span>
        <span className="sr-only">
          {fillLabel(hud.crateScore, { count: opened, total })}
          {gem && ` ${hud.gemAwarded}`}
        </span>
      </p>
      <p className="basis-full text-base text-[color:var(--np-muted)]">{warp.crateHint}</p>
    </div>
  )
}

export function CrateField({ projects }: { projects: SectionsOf<'engineer'>['projects'] }) {
  const [spin, setSpin] = useState(0)
  const [slam, setSlam] = useState(0)
  const [played, setPlayed] = useState<Played | null>(null)

  useEffect(() => {
    if (!played) return
    const timer = window.setTimeout(() => setPlayed(null), MOVE_MS)
    return () => window.clearTimeout(timer)
  }, [played])

  const play = (move: Move) => setPlayed((now) => ({ move, count: (now?.count ?? 0) + 1 }))

  return (
    <>
      <MoveStrip
        played={played}
        onSpin={() => {
          setSpin((count) => count + 1)
          play('spin')
        }}
        onSlam={() => {
          setSlam((count) => count + 1)
          play('slam')
        }}
      />
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => {
          const index = projects.indexOf(slot.project)
          return (
            <div className={ui.rise} style={{ '--i': index } as CSSProperties}>
              <ProjectCrate slot={slot} index={index} spin={spin} slam={slam} onHit={() => play('jump')} />
            </div>
          )
        }}
      />
    </>
  )
}
