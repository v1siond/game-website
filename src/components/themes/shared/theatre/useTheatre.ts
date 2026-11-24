'use client'

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useScrollStage, type StageMetrics } from '@/hooks/useScrollStage'
import { IDLE_FOLLOWER, crossOf, follow, sceneEnd, type Follower, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { heroState, itemsReached, layerTransform, stageState, type LayerMotion, type StageSpan } from '@/lib/scroll/stage'

// A world's theatre on the shared scroll stage engine (src/hooks/useScrollStage.ts): one fixed full screen
// stage per scene (the hero, each section, the contact), each in layers that push in across the scene. Each
// stage dissolves in over the one before it as its section arrives and the one under it is hidden once it is
// whole, so the screen never dips to dark (crossOf, src/lib/scroll/player.ts). It binds every stage once,
// measures each section ([data-scene]) and the reading line of each counted card ([data-stage-items]) on load
// and resize, and per frame writes only each visible stage's opacity, its layers' transforms and the scene's
// own writer, which poses the world's figure and props from the scene's progress, the cards reached and, for
// a scene with a script, its playhead: the scroll plays the script, forward on the way down and back on the
// way up, at no more than its own speed (src/lib/scroll/player.ts); while a scene has not caught up with the
// scroll the engine draws every frame.
// The first scene is the hero. The text layer settles with the art: it is drawn at the settled position, the
// lag written as a translate and cleared at rest, so pictures and cards come to rest together (as Era
// Postcards' settleText).

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

/** Where a scene with `script` rests: its end frame, the one reduced motion and a scroll back show. */
export const restingPlay = (script: SceneScript | undefined): Playhead => sceneEnd(script ?? [])

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

interface Bound {
  id: string
  hero: boolean
  stage: HTMLElement
  layers: Array<{ el: HTMLElement; motion: LayerMotion }>
  write: StageWriter
  section: HTMLElement | null
  span: StageSpan
  triggers: number[]
  shown: boolean
  script: SceneScript | undefined
  follower: Follower
}

/** Every layer of a stage with its motion; a layer with no motion stays still. */
export const movingLayers = (stage: HTMLElement, motion: LayerMotions): Array<{ el: HTMLElement; motion: LayerMotion }> =>
  Array.from(stage.querySelectorAll<HTMLElement>('[data-layer]'), (el) => ({ el, motion: motion[el.dataset.layer ?? ''] })).filter((layer) => layer.motion)

const bind = (theatre: HTMLElement, scene: TheatreScene, index: number, motion: LayerMotions): Bound | null => {
  const stage = theatre.querySelector<HTMLElement>(`[data-stage="${scene.id}"]`)
  if (!stage) return null
  return {
    id: scene.id,
    hero: index === 0,
    stage,
    layers: movingLayers(stage, motion),
    write: scene.bind(stage),
    section: document.querySelector<HTMLElement>(`[data-scene="${scene.id}"]`),
    span: { top: 0, bottom: 0 },
    triggers: [],
    shown: false,
    script: scene.script,
    follower: IDLE_FOLLOWER,
  }
}

/** A scene's playhead at `now`, following the scroll's `played` share of it at no more than its own speed;
 *  true in `playing` while it has not caught up. */
const playOf = (bound: Bound, played: number, now: number): { play: Playhead; playing: boolean } => {
  if (!bound.script) return { play: restingPlay(undefined), playing: false }
  const { follower, play, playing } = follow(bound.follower, bound.script, played, now)
  bound.follower = follower
  return { play, playing }
}

const show = (bound: Bound, visible: boolean): void => {
  if (bound.shown === visible) return
  bound.shown = visible
  bound.stage.style.visibility = visible ? 'visible' : 'hidden'
}

/** The theatre's ref and the text layer's ref (it holds every section); the engine runs while motion is allowed. */
export function useTheatre(scenes: readonly TheatreScene[], motion: LayerMotions, reduced: boolean) {
  const theatreRef = useRef<HTMLDivElement>(null)
  const bound = useRef<Bound[]>([])
  const text = useRef<HTMLElement | null>(null)
  const lagNow = useRef(0)
  const frame = useRef(0)

  useLayoutEffect(() => {
    const theatre = theatreRef.current
    bound.current = reduced || !theatre ? [] : scenes.flatMap((scene, i) => bind(theatre, scene, i, motion) ?? [])
  }, [scenes, motion, reduced])

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
    function drawFrame(position: number, lag: number, metrics: StageMetrics) {
      const { viewport, phone } = metrics
      settleText(lag)
      const all = bound.current
      const now = performance.now()
      const states = all.map((each, i) => (each.hero ? heroState(position, viewport, { phone }) : stageState(each.span, position, viewport, { last: i === all.length - 1, phone })))
      const { layers } = crossOf(states.map((state) => state.vis))
      let playing = false
      all.forEach((each, i) => {
        const { shown, opacity } = layers[i]
        show(each, shown)
        const { play, playing: runs } = playOf(each, states[i].play, now)
        playing ||= runs
        if (!shown) return
        each.stage.style.opacity = opacity.toFixed(3)
        for (const layer of each.layers) layer.el.style.transform = layerTransform(layer.motion, states[i].progress, phone ? PHONE_MOTION : 1)
        each.write(states[i].progress, itemsReached(each.triggers, position, viewport), play)
      })
      // A scene has not caught up with the scroll: draw again next frame, whether or not the page scrolls.
      cancelAnimationFrame(frame.current)
      frame.current = playing ? requestAnimationFrame(() => drawFrame(position, lag, metrics)) : 0
    },
    [settleText],
  )

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const stageRef = useScrollStage<HTMLElement>({ enabled: !reduced, measure, draw, content: scenes })
  const textRef = useCallback(
    (element: HTMLElement | null) => {
      text.current = element
      stageRef(element)
    },
    [stageRef],
  )
  return { theatreRef, textRef }
}
