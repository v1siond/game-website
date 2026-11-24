'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'
import { useScrollStage, type StageMetrics } from '@/hooks/useScrollStage'
import { crossOf, headingOf, stagePlay, type Follower, type Heading } from '@/lib/scroll/player'
import { heroState, layerTransform, stageState, type StageSpan, type StageState } from '@/lib/scroll/stage'
import { LAYER_MOTION, type Scene } from './scenes'
import type { EraWriter, Layer } from './eras/era'

// The world's side of the scroll stage engine (src/hooks/useScrollStage.ts): it binds every stage of the
// theatre once (its layers, the era's writer), measures each section on load and resize, and per frame
// writes only each visible stage's opacity, its layers' transforms and its era's props and pose. The era of
// the stage the page is in plays its script by the scroll, forward and back, at no more than its own speed
// (src/lib/scroll/player.ts), every other stage resting where the scroll puts it; while that one has not caught
// up with the scroll the engine draws every frame, scrolled or not (its draw asks the shared loop for them). Bound
// again, a stage keeps what the page shows: its visibility is read off the DOM and its era rests where the
// scroll puts it. On the way down each stage dissolves in
// over the one before it and the one under it is hidden once it is whole, so the screen never dips to dark; on
// the way back the page cuts to the stage it returns to (crossOf, src/lib/scroll/player.ts). The rail's
// current mark changes only when the leading scene does.
//
// The text settles with the art: the page scroll stays native (scrollbar, keyboard, find in page, screen
// readers and touch momentum are the browser's own) and the text layer, main with the footer under it, is drawn where the settled
// position puts it, a translateY of the lag (scrollY minus the drawn position) written in the same frame
// as the stages. So art and text trail the wheel or the finger together and come to rest together, about
// a second after it stops. At rest the transform is cleared, so nothing is left translated. The
// measures subtract the lag written at the time, so a resize mid settle reads the boxes where the layout
// puts them.

// Under this many px of lag the text is drawn at the scroll, with no transform.
const TEXT_REST_PX = 0.5

// On a phone the layers zoom and lift this share of the desktop motion.
const PHONE_MOTION = 0.6

interface Bound {
  scene: Scene
  stage: HTMLElement
  layers: Array<{ el: HTMLElement; layer: Layer }>
  write: EraWriter
  section: HTMLElement | null
  rail: Element | null
  span: StageSpan
  shown: boolean
  follower: Follower | null
}

const bind = (theatre: HTMLElement, scene: Scene): Bound | null => {
  const stage = theatre.querySelector<HTMLElement>(`[data-stage="${scene.id}"]`)
  if (!stage) return null
  return {
    scene,
    stage,
    layers: Array.from(stage.querySelectorAll<HTMLElement>('[data-layer]'), (el) => ({ el, layer: el.dataset.layer as Layer })),
    write: scene.era.bind(stage, scene.input),
    section: document.querySelector<HTMLElement>(`[data-scene="${scene.id}"]`),
    rail: document.querySelector(`[data-rail="${scene.id}"]`),
    span: { top: 0, bottom: 0 },
    // a stage bound again keeps the visibility the page shows, so the first draw hides it if it must
    shown: stage.style.visibility === 'visible',
    follower: null,
  }
}

const stateOf = (bound: Bound, position: number, viewport: number, last: boolean, phone: boolean): StageState =>
  bound.scene.id === 'hero' ? heroState(position, viewport, { phone }) : stageState(bound.span, position, viewport, { last, phone })

const show = (bound: Bound, visible: boolean): void => {
  if (bound.shown === visible) return
  bound.shown = visible
  bound.stage.style.visibility = visible ? 'visible' : 'hidden'
}

/** The refs of the theatre and the text layer; the engine runs while motion is allowed. */
export function useEraEngine(scenes: readonly Scene[], reduced: boolean) {
  const theatreRef = useRef<HTMLDivElement>(null)
  const bound = useRef<Bound[]>([])
  const lead = useRef('')
  const text = useRef<HTMLElement | null>(null)
  const lagNow = useRef(0)
  const heading = useRef<Heading>('down')

  useLayoutEffect(() => {
    const theatre = theatreRef.current
    bound.current = reduced || !theatre ? [] : scenes.flatMap((scene) => bind(theatre, scene) ?? [])
    lead.current = ''
  }, [scenes, reduced])

  const measure = useCallback((scrollY: number) => {
    const origin = scrollY - lagNow.current
    for (const each of bound.current) {
      const box = each.section?.getBoundingClientRect()
      each.span = box ? { top: box.top + origin, bottom: box.bottom + origin } : { top: 0, bottom: 0 }
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

  const mark = useCallback((leader: Bound) => {
    if (leader.scene.id === lead.current) return
    bound.current.find((each) => each.scene.id === lead.current)?.rail?.removeAttribute('aria-current')
    leader.rail?.setAttribute('aria-current', 'location')
    lead.current = leader.scene.id
  }, [])

  const draw = useCallback(
    (position: number, lag: number, metrics: StageMetrics): boolean => {
      const { viewport, phone } = metrics
      settleText(lag)
      const all = bound.current
      const now = performance.now()
      const states = all.map((each, i) => stateOf(each, position, viewport, i === all.length - 1, phone))
      heading.current = headingOf(lag, heading.current)
      const cross = crossOf(
        states.map((state) => state.vis),
        heading.current,
      )
      let playing = false
      all.forEach((each, i) => {
        const { shown, opacity } = cross.layers[i]
        show(each, shown)
        if (!shown) {
          each.follower = null
          return
        }
        // Only the stage the page is in plays at its own pace; the others rest where the scroll puts them.
        const run = stagePlay(each.follower, each.scene.era.script, states[i].play, now, i === cross.lead)
        each.follower = run.follower
        playing ||= run.playing
        each.stage.style.opacity = opacity.toFixed(3)
        for (const { el, layer } of each.layers) el.style.transform = layerTransform(LAYER_MOTION[layer], states[i].progress, phone ? PHONE_MOTION : 1)
        each.write(states[i].progress, run.play)
      })
      if (all.length > 0) mark(all[cross.lead])
      // A scene has not caught up with the scroll: the loop draws again next frame, whether or not the page scrolls.
      return playing
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
  return { theatreRef, textRef }
}
