'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'
import { useScrollStage, type StageMetrics } from '@/hooks/useScrollStage'
import { heroState, itemsReached, layerTransform, stageOpacity, stageState, veilOpacity, type LayerMotion, type StageSpan } from '@/lib/scroll/stage'

// A world's theatre on the shared scroll stage engine (src/hooks/useScrollStage.ts): one fixed full screen
// stage per scene (the hero, each section, the contact), each in layers that push in across the scene and a
// black veil it fades into. It binds every stage once, measures each section ([data-scene]) and the reading
// line of each counted card ([data-stage-items]) on load and resize, and per frame writes only each visible
// stage's opacity, its veil, its layers' transforms and the scene's own writer, which poses the world's
// figure and props from the scene's progress and the cards reached. The first scene is the hero. The text
// layer settles with the art: it is drawn at the settled position, the lag written as a translate and cleared
// at rest, so pictures and cards come to rest together (as Era Postcards' settleText).

/** A scene's per frame writer: `progress` 0 when its stage starts to rise, 1 when it has sunk; `reached`
 *  how many of its counted cards have crossed the reading line, fractional. It only writes. */
export type StageWriter = (progress: number, reached: number) => void

/** Finds the nodes a scene moves inside its stage, once, and returns its writer. */
export type StageBinder = (stage: HTMLElement) => StageWriter

export interface TheatreScene {
  id: string
  bind: StageBinder
  /** How many cards the scene counts: the settled frame shows them all reached. */
  count: number
}

/** Each layer's push in across its scene, by the layer's name. */
export type LayerMotions = Readonly<Record<string, LayerMotion>>

/** The counted cards of a section: the top level items of the lists inside [data-stage-items], or its facts. */
const ITEMS = '[data-stage-items] li:not(li li), [data-stage-items] dl > div'

// A card counts as reached once its top crosses this share of the screen from the top.
const READ_LINE = 0.62
// On a phone the layers zoom and lift this share of the desktop motion.
const PHONE_MOTION = 0.6
// The hero's whole stage shrinks by this much over the first screen, more on a phone.
const HERO_SHRINK = 0.1
const HERO_SHRINK_PHONE = 0.15
// Under this lag in px the text is drawn at the scroll.
const TEXT_REST_PX = 0.5

/** The progress a settled stage is drawn at: the middle of its scene, its picture at rest. */
export const SETTLED_PROGRESS = 0.5

interface Bound {
  id: string
  hero: boolean
  stage: HTMLElement
  veil: HTMLElement | null
  layers: Array<{ el: HTMLElement; motion: LayerMotion }>
  write: StageWriter
  section: HTMLElement | null
  span: StageSpan
  triggers: number[]
  shown: boolean
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
    veil: stage.querySelector<HTMLElement>('[data-veil]'),
    layers: movingLayers(stage, motion),
    write: scene.bind(stage),
    section: document.querySelector<HTMLElement>(`[data-scene="${scene.id}"]`),
    span: { top: 0, bottom: 0 },
    triggers: [],
    shown: false,
  }
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

  const draw = useCallback((position: number, lag: number, { viewport, phone }: StageMetrics) => {
    settleText(lag)
    const all = bound.current
    all.forEach((each, i) => {
      const { vis, progress } = each.hero ? heroState(position, viewport) : stageState(each.span, position, viewport, { last: i === all.length - 1 })
      show(each, vis > 0)
      if (vis <= 0) return
      each.stage.style.opacity = stageOpacity(vis).toFixed(3)
      if (each.veil) each.veil.style.opacity = veilOpacity(vis).toFixed(3)
      if (each.hero) each.stage.style.transform = `scale(${(1 - (phone ? HERO_SHRINK_PHONE : HERO_SHRINK) * progress).toFixed(4)})`
      for (const layer of each.layers) layer.el.style.transform = layerTransform(layer.motion, progress, phone ? PHONE_MOTION : 1)
      each.write(progress, itemsReached(each.triggers, position, viewport))
    })
  }, [settleText])

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
