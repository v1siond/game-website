'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { useScrollStage, type StageMetrics } from '@/hooks/useScrollStage'
import { heroState, itemsReached, layerTransform, leadOf, stageOpacity, stageState, veilOpacity, type StageSpan, type StageState } from '@/lib/scroll/stage'
import { LAYER_MOTION, type Scene } from './scenes'
import type { EraWriter, Layer } from './eras/era'

// The world's side of the scroll stage engine (src/hooks/useScrollStage.ts): it binds every stage of the
// theatre once (its layers, its veil, the era's writer), measures each section and the reading line of
// each counted card on load and resize, and per frame writes only each visible stage's opacity, its veil,
// its layers' transforms and its era's props and pose. The ledger's place and count and the rail's current
// mark change only when the leading scene or its count does.
//
// The text settles with the art: the page scroll stays native (scrollbar, keyboard, find in page, screen
// readers and touch momentum are the browser's own) and the text layer, main with the footer under it, is drawn where the settled
// position puts it, a translateY of the lag (scrollY minus the drawn position) written in the same frame
// as the stages. So art and text trail the wheel or the finger together and come to rest together, about
// half a second after it stops. At rest the transform is cleared, so nothing is left translated. The
// measures subtract the lag written at the time, so a resize mid settle reads the boxes where the layout
// puts them.

// Under this many px of lag the text is drawn at the scroll, with no transform.
const TEXT_REST_PX = 0.5

// A card counts as reached once its top crosses this share of the screen from the top.
const READ_LINE = 0.62
// On a phone the layers zoom and lift this share of the desktop motion.
const PHONE_MOTION = 0.6
// The hero's whole stage shrinks by this much over the first screen (the Rockstar hero), more on a phone.
const HERO_SHRINK = 0.1
const HERO_SHRINK_PHONE = 0.15

/** The counted cards of a section: the items of the list or the facts its frame marks with data-era-items. */
const ITEMS = '[data-era-items="list"] > ul > li, [data-era-items="facts"] > dl > div'

interface Bound {
  scene: Scene
  stage: HTMLElement
  veil: HTMLElement
  layers: Array<{ el: HTMLElement; layer: Layer }>
  write: EraWriter
  section: HTMLElement | null
  rail: Element | null
  span: StageSpan
  triggers: number[]
  shown: boolean
}

const bind = (theatre: HTMLElement, scene: Scene): Bound => {
  const stage = theatre.querySelector<HTMLElement>(`[data-stage="${scene.id}"]`)!
  return {
    scene,
    stage,
    veil: stage.querySelector<HTMLElement>('[data-veil]')!,
    layers: Array.from(stage.querySelectorAll<HTMLElement>('[data-layer]'), (el) => ({ el, layer: el.dataset.layer as Layer })),
    write: scene.era.bind(stage, scene.input),
    section: document.querySelector<HTMLElement>(`[data-scene="${scene.id}"]`),
    rail: document.querySelector(`[data-rail="${scene.id}"]`),
    span: { top: 0, bottom: 0 },
    triggers: [],
    shown: false,
  }
}

const stateOf = (bound: Bound, position: number, viewport: number, last: boolean): StageState =>
  bound.scene.id === 'hero' ? heroState(position, viewport) : stageState(bound.span, position, viewport, { last })

const show = (bound: Bound, visible: boolean): void => {
  if (bound.shown === visible) return
  bound.shown = visible
  bound.stage.style.visibility = visible ? 'visible' : 'hidden'
}

/** The refs of the theatre, the text layer and the ledger's two lines; the engine runs while motion is allowed. */
export function useEraEngine(scenes: readonly Scene[], words: Labels['eras'], reduced: boolean) {
  const theatreRef = useRef<HTMLDivElement>(null)
  const placeRef = useRef<HTMLSpanElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const bound = useRef<Bound[]>([])
  const lead = useRef<{ id: string; reached: number }>({ id: '', reached: -1 })
  const text = useRef<HTMLElement | null>(null)
  const lagNow = useRef(0)

  useLayoutEffect(() => {
    const theatre = theatreRef.current
    bound.current = reduced || !theatre ? [] : scenes.map((scene) => bind(theatre, scene))
    lead.current = { id: '', reached: -1 }
  }, [scenes, reduced])

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

  const mark = useCallback(
    (leader: Bound, reachedCount: number) => {
      if (leader.scene.id !== lead.current.id) {
        bound.current.find((each) => each.scene.id === lead.current.id)?.rail?.removeAttribute('aria-current')
        leader.rail?.setAttribute('aria-current', 'location')
        if (placeRef.current) placeRef.current.textContent = words[leader.scene.place]
        lead.current = { id: leader.scene.id, reached: -1 }
      }
      if (reachedCount === lead.current.reached) return
      lead.current.reached = reachedCount
      const line = leader.scene.count ? fillLabel(words[leader.scene.count], { count: reachedCount, total: leader.scene.input.count }) : ''
      if (countRef.current) countRef.current.textContent = line
    },
    [words],
  )

  const draw = useCallback(
    (position: number, lag: number, { viewport, phone }: StageMetrics) => {
      settleText(lag)
      const all = bound.current
      const visibilities = all.map((each, i) => {
        const { vis, progress } = stateOf(each, position, viewport, i === all.length - 1)
        show(each, vis > 0)
        if (vis <= 0) return 0
        each.stage.style.opacity = stageOpacity(vis).toFixed(3)
        each.veil.style.opacity = veilOpacity(vis).toFixed(3)
        if (each.scene.id === 'hero') each.stage.style.transform = `scale(${(1 - (phone ? HERO_SHRINK_PHONE : HERO_SHRINK) * progress).toFixed(4)})`
        for (const { el, layer } of each.layers) el.style.transform = layerTransform(LAYER_MOTION[layer], progress, phone ? PHONE_MOTION : 1)
        each.write(progress, itemsReached(each.triggers, position, viewport))
        return vis
      })
      if (all.length === 0) return
      const leader = all[leadOf(visibilities)]
      mark(leader, Math.floor(itemsReached(leader.triggers, position, viewport) + 0.001))
    },
    [mark, settleText],
  )

  const stageRef = useScrollStage<HTMLElement>({ enabled: !reduced, measure, draw, content: scenes })
  const textRef = useCallback(
    (element: HTMLElement | null) => {
      text.current = element
      stageRef(element)
    },
    [stageRef],
  )
  return { theatreRef, textRef, placeRef, countRef }
}
