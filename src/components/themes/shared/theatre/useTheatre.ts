'use client'

import { startTransition, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useScrollStage, type StageMetrics } from '@/hooks/useScrollStage'
import { crossOf, nearOf, stagePlay, wayOf, type Follower, type Way, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { heroState, itemsReached, layerTransform, stageState, type LayerMotion, type StageSpan } from '@/lib/scroll/stage'

// A world's theatre on the shared scroll stage engine (src/hooks/useScrollStage.ts): one fixed full screen
// stage per scene (the hero, each section, the contact), each in layers that push in across the scene. On the
// way down each stage dissolves in over the one before it as its section arrives and the one under it is
// hidden once it is whole, so the screen never dips to dark; on the way back the page cuts to the stage it
// returns to, so two scenes and their casts are never left one over the other (crossOf, src/lib/scroll/player.ts). It binds every stage once,
// measures each section ([data-scene]) and the reading line of each counted card ([data-stage-items]) on load
// and resize, and per frame writes only each visible stage's opacity, its layers' transforms and the scene's
// own writer, which poses the world's figure and props from the scene's progress, the cards reached and, for
// a scene with a script, its playhead: the scroll plays the script of the stage the page is in, forward on the
// way down and back on the way up, at no more than its own speed (src/lib/scroll/player.ts), and every other
// stage rests where the scroll puts it; while that scene has not caught up with the scroll the engine draws
// every frame (its draw asks the shared loop for them). Bound again (a profession switch), a stage keeps what
// the page shows: its visibility is read off the DOM and its scene rests where the scroll puts it.
// The first scene is the hero. The text layer settles with the art: it is drawn at the settled position, the
// lag written as a translate and cleared at rest, so pictures and cards come to rest together (as Era
// Postcards' settleText).
// A world with stages too big to build all at once gives a reach: the theatre then builds only the stages on
// screen and those within that many scenes of the one the page is in (nearOf), the next one ahead in a
// transition, so React builds it between frames; a stage the scroll jumps to before it is built is built and
// drawn before that frame paints. A stage built late is hidden until drawn and drawn where the scroll puts
// it, as a stage that was off screen is, so the scenes play as they do with every stage built.

/** A scene's per frame writer: `progress` 0 when its stage starts to rise, 1 when its section has gone by;
 *  `reached` how many of its counted cards have crossed the reading line, fractional; `play` where its
 *  script is (none: its first frame). It only writes. */
export type StageWriter = (progress: number, reached: number, play?: Playhead) => void

/** Finds the nodes a scene moves inside its stage, once, and returns its writer. */
export type StageBinder = (stage: HTMLElement) => StageWriter

export interface TheatreScene {
  id: string
  bind: StageBinder
  /** How many cards the scene counts: the settled frame shows them all reached. */
  count: number
  /** The scene's actions, played by the scroll at no more than their own speed; none for a scene the scroll drives directly. */
  script?: SceneScript
}

/** Each layer's push in across its scene, by the layer's name. */
export type LayerMotions = Readonly<Record<string, LayerMotion>>

/** The counted cards of a section: the top level items of the lists inside [data-stage-items], or its facts. */
const ITEMS = '[data-stage-items] li:not(li li), [data-stage-items] dl > div'

// A card counts as reached once its top crosses this share of the screen from the top.
const READ_LINE = 0.62
// On a phone the layers zoom and lift this share of the desktop motion.
const PHONE_MOTION = 0.6
// Under this lag in px the text is drawn at the scroll.
const TEXT_REST_PX = 0.5

/** The progress a settled stage is drawn at: the middle of its scene, its picture at rest. */
export const SETTLED_PROGRESS = 0.5

/** A scene's stage as built: its node, its moving layers and its writer. */
interface Built {
  stage: HTMLElement
  layers: Array<{ el: HTMLElement; motion: LayerMotion }>
  write: StageWriter
}

interface Bound {
  id: string
  hero: boolean
  scene: TheatreScene
  /** None while the stage is not built (a theatre with a reach). */
  built: Built | null
  section: HTMLElement | null
  span: StageSpan
  triggers: number[]
  shown: boolean | null
  script: SceneScript | undefined
  follower: Follower | null
}

/** Every layer of a stage with its motion; a layer with no motion stays still. */
export const movingLayers = (stage: HTMLElement, motion: LayerMotions): Array<{ el: HTMLElement; motion: LayerMotion }> =>
  Array.from(stage.querySelectorAll<HTMLElement>('[data-layer]'), (el) => ({ el, motion: motion[el.dataset.layer ?? ''] })).filter((layer) => layer.motion)

const stageOf = (theatre: HTMLElement, id: string): HTMLElement | null => theatre.querySelector<HTMLElement>(`[data-stage="${id}"]`)

const build = (stage: HTMLElement | null, scene: TheatreScene, motion: LayerMotions): Built | null =>
  stage && { stage, layers: movingLayers(stage, motion), write: scene.bind(stage) }

const bind = (theatre: HTMLElement, scene: TheatreScene, index: number, motion: LayerMotions): Bound => {
  return {
    id: scene.id,
    hero: index === 0,
    scene,
    built: build(stageOf(theatre, scene.id), scene, motion),
    section: document.querySelector<HTMLElement>(`[data-scene="${scene.id}"]`),
    span: { top: 0, bottom: 0 },
    triggers: [],
    // unknown until the first draw writes it: the CSS shows the first stage by itself and a stage bound again
    // keeps what it showed, so the first draw always writes, whatever the page restored
    shown: null,
    script: scene.script,
    follower: null,
  }
}

const show = (bound: Bound, { stage }: Built, visible: boolean): void => {
  if (bound.shown === visible) return
  bound.shown = visible
  stage.style.visibility = visible ? 'visible' : 'hidden'
}

const sameList = (a: readonly number[], b: readonly number[]): boolean => a.length === b.length && a.every((n, i) => n === b[i])

/** The stages built before the first draw: the first one and those within reach of it. */
const firstNear = (count: number, reach: number): number[] => nearOf(crossOf(Array.from({ length: count }, () => 0)), reach)

/**
 * The theatre's ref, the text layer's ref (it holds every section) and `built`, whether the world renders a
 * scene's stage: every one, or with a `reach` only those the theatre names. The engine runs while motion is
 * allowed.
 */
export function useTheatre(scenes: readonly TheatreScene[], motion: LayerMotions, reduced: boolean, reach?: number) {
  const theatreRef = useRef<HTMLDivElement>(null)
  const bound = useRef<Bound[]>([])
  const text = useRef<HTMLElement | null>(null)
  const lagNow = useRef(0)
  const way = useRef<Way | null>(null)
  // With a reach: the stages built, the ones last asked for, whether a build before the paint is queued, and the
  // last draw (its arguments and the stages it showed), drawn again once a stage it showed unbuilt is built.
  const [near, setNear] = useState<readonly number[]>(() => (reach === undefined ? [] : firstNear(scenes.length, reach)))
  const asked = useRef(near)
  const urgent = useRef(false)
  const last = useRef<{ args: [number, number, StageMetrics]; shown: boolean[] } | null>(null)

  useLayoutEffect(() => {
    const theatre = theatreRef.current
    const all = reduced || !theatre ? [] : scenes.map((scene, i) => bind(theatre, scene, i, motion))
    // every stage is built unless the theatre has a reach, so with none a scene with no stage is left out
    bound.current = reach === undefined ? all.filter((each) => each.built) : all
  }, [scenes, motion, reduced, reach])

  // The theatre names the stages near the page: built in a transition, or before this frame paints when the
  // frame shows one not yet built.
  const ask = useCallback((next: number[], shown: boolean[]) => {
    const missing = shown.some((on, i) => on && !bound.current[i].built)
    if (!missing && sameList(next, asked.current)) return
    asked.current = next
    if (!missing) return startTransition(() => setNear(next))
    if (urgent.current) return
    urgent.current = true
    queueMicrotask(() => {
      urgent.current = false
      flushSync(() => setNear(asked.current))
    })
  }, [])

  // The boxes are read off the text layer as drawn, so its translate (the lag) is taken back out.
  const measure = useCallback((scrollY: number, { viewport }: StageMetrics) => {
    const origin = scrollY - lagNow.current
    for (const each of bound.current) {
      const box = each.section?.getBoundingClientRect()
      each.span = box ? { top: box.top + origin, bottom: box.bottom + origin } : { top: 0, bottom: 0 }
      each.triggers = Array.from(each.section?.querySelectorAll(ITEMS) ?? [], (item) => item.getBoundingClientRect().top + origin - READ_LINE * viewport)
    }
  }, [])

  // The text layer drawn at the settled position: the lag as a translate, cleared at rest.
  const settleText = useCallback((lag: number) => {
    const node = text.current
    const shown = Math.abs(lag) < TEXT_REST_PX ? 0 : lag
    if (!node || shown === lagNow.current) return
    lagNow.current = shown
    node.style.transform = shown ? `translate3d(0,${shown.toFixed(1)}px,0)` : ''
  }, [])

  const draw = useCallback(
    (position: number, lag: number, metrics: StageMetrics): boolean => {
      const { viewport, phone } = metrics
      settleText(lag)
      const all = bound.current
      const now = performance.now()
      const states = all.map((each, i) => (each.hero ? heroState(position, viewport, { phone }) : stageState(each.span, position, viewport, { last: i === all.length - 1, phone })))
      // the way the page goes, from the scroll's own travel (where the drawing is plus its lag)
      way.current = wayOf(position + lag, way.current)
      const { layers, lead } = crossOf(
        states.map((state) => state.vis),
        way.current.heading,
      )
      let playing = false
      all.forEach((each, i) => {
        const { built } = each
        // a stage not built yet is drawn once it is
        if (!built) return
        const { shown, opacity } = layers[i]
        show(each, built, shown)
        if (!shown) {
          each.follower = null
          return
        }
        // the stage the page is in plays at its own pace; every other one rests where the scroll puts it
        const run = stagePlay(each.follower, each.script, states[i].play, now, i === lead)
        each.follower = run.follower
        playing ||= run.playing
        const { play } = run
        built.stage.style.opacity = opacity.toFixed(3)
        for (const layer of built.layers) layer.el.style.transform = layerTransform(layer.motion, states[i].progress, phone ? PHONE_MOTION : 1)
        built.write(states[i].progress, itemsReached(each.triggers, position, viewport), play)
      })
      if (reach !== undefined) {
        const shown = layers.map((layer) => layer.shown)
        last.current = { args: [position, lag, metrics], shown }
        ask(nearOf({ layers, lead }, reach), shown)
      }
      // A scene has not caught up with the scroll: the loop draws again next frame, whether or not the page scrolls.
      return playing
    },
    [settleText, reach, ask],
  )

  // A stage built or let go since the last commit: one built is hidden until drawn, or drawn now when the last
  // frame showed it, so it never paints its first frame; one let go is forgotten.
  useLayoutEffect(() => {
    const theatre = theatreRef.current
    if (reach === undefined || !theatre) return
    let redraw = false
    bound.current.forEach((each, i) => {
      const stage = stageOf(theatre, each.id)
      if (stage === (each.built?.stage ?? null)) return
      each.built = build(stage, each.scene, motion)
      each.shown = null
      each.follower = null
      if (!each.built) return
      if (last.current?.shown[i]) redraw = true
      else show(each, each.built, false)
    })
    if (redraw && last.current) draw(...last.current.args)
  }, [near, reach, motion, draw])

  const stageRef = useScrollStage<HTMLElement>({ enabled: !reduced, measure, draw, content: scenes })
  const textRef = useCallback(
    (element: HTMLElement | null) => {
      text.current = element
      stageRef(element)
    },
    [stageRef],
  )
  const built = useCallback((index: number) => reach === undefined || near.includes(index), [reach, near])
  return { theatreRef, textRef, built }
}
