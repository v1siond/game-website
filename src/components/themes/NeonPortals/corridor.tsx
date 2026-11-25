'use client'

import { memo, useCallback, useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollStage } from '@/hooks/useScrollStage'
import { cssVars } from '@/lib/cssVars'
import { restingPlay, stagePlay, type Follower } from '@/lib/scroll/player'
import { decorArt, gateArt, ribArt, type PlaneArt } from './eras'
import { boxOf, coverAt, heroSpan, playAt, readAt, roomSpan, type SceneSpan } from './cover'
import { hubRunner, transitRunner, type Move } from './motion'
import { ERAS, type Era } from './palette'
import { HUB_ERA } from './plan'
import { applyPose, FIGURE_BOX, FIGURE_RASTER, Runner, runnerParts, type RunnerParts } from './runner'
import { SceneView, type SceneSpec } from './scenes'
import { uOf } from './sets/kit'
import {
  camAt,
  cameraPath,
  DF,
  FLOOR,
  layoutCorridor,
  planeView,
  railsPath,
  RASTER,
  roomAt,
  round2,
  scaleAt,
  settledCam,
  sparksFor,
  sparkView,
  troughAt,
  viewOf,
  type Corridor,
  type Keyframe,
  type Plane,
  type RoomGeometry,
  type RoomMarks,
  type RoomSpec,
  type View,
} from './world'
import css from './corridor.module.css'

// The stage: one fixed layer (aria-hidden) holding the machine's passage (the tunnel) and over it the set
// piece of each era (scenes.tsx, sets/), under the text layer that scrolls in normal flow and is never scaled
// or faded. The shared scroll stage engine (useScrollStage) measures the page on mount and resize and calls
// draw with the settled scroll position each frame while the art catches up with the scroll, then stops.
//
// draw turns that position into the camera's depth through the keyframes measured from the text layer, so
// between eras the camera flies down the tunnel, the runner ahead of it from behind, the warp sparks
// streaming past in the dark. As a room's gate plate comes up, the era's set piece zooms in out of the
// vanishing point until it fills the screen, holds while the room is read and zooms out past the camera as
// the section ends (cover.ts). The set piece in view plays its one to three actions at the shared scene
// player's pace (src/lib/scroll/player.ts): the scroll sets where the scene should be and the drawn scene
// follows it no faster than the scene itself, forward or back; while it is still catching up after the
// scroll has settled, draw tells the shared loop to keep drawing. He is drawn once: the tunnel's runner
// hides while a set piece is in view, which draws him itself. Under reduced motion there is no zoom and no
// play: the scene being read shows whole at its end frame.

/** Where on the screen a card's centre is read. */
const READING_LINE = 0.55
/** How far the tunnel dims in the gap between eras. */
const DARKEST = 0.88
const PHONE_QUERY = '(max-width: 767.98px)'

/** The runner in the tunnel: in the hub he waits, in the passage he runs into the screen. */
const tunnelRunner = (room: RoomGeometry | null, camZ: number): Move => (room ? transitRunner(camZ) : hubRunner(camZ))

interface Measured {
  view: View
  keyframes: Keyframe[]
  roomTops: number[]
  spans: SceneSpan[]
}

interface Drawn {
  era: Era | ''
  fog: number
  runner: boolean | null
}

/** A scene bound on the page: its node, its writer and its follower on the player. */
interface BoundScene {
  spec: SceneSpec
  el: HTMLElement
  write: (u: number) => void
  follower: Follower | null
  shown: boolean | null
}

const docTop = (el: Element, scrollY: number): number => el.getBoundingClientRect().top + scrollY

/** Reads one room's marks off the page: its top, transit, gate plate, each card's centre and its end. */
function marksOf(section: HTMLElement, scrollY: number): RoomMarks {
  const top = docTop(section, scrollY)
  const transit = section.querySelector<HTMLElement>('[data-transit]')!
  const gate = section.querySelector<HTMLElement>('[data-gate]')!
  const gateTop = docTop(gate, scrollY)
  return {
    top,
    transitEnd: top + transit.offsetHeight,
    gateTop,
    gateBottom: gateTop + gate.offsetHeight,
    items: [...section.querySelectorAll<HTMLElement>('[data-item]')].map((card) => docTop(card, scrollY) + card.offsetHeight / 2),
    bottom: top + section.offsetHeight,
  }
}

const ART: Record<Plane['kind'], (era: Era, tw: number) => PlaneArt> = { rib: ribArt, gate: gateArt, decor: decorArt }

/** One plane, laid out at world size x its raster and placed by transform from draw. */
const PlaneView = memo(function PlaneView({ plane, tw, onMount }: { plane: Plane; tw: number; onMount: (key: string, el: HTMLDivElement | null) => void }) {
  const { w, h, viewBox, art } = ART[plane.kind](plane.era, tw)
  const raster = RASTER[plane.kind]
  return (
    <div ref={(el) => onMount(plane.key, el)} className={css.plane}>
      <svg viewBox={viewBox} width={round2(w * raster)} height={round2(h * raster)} focusable="false">
        {art}
      </svg>
    </div>
  )
})

interface Refs {
  root: HTMLDivElement | null
  heroInner: HTMLElement | null
  fog: HTMLDivElement | null
  dark: HTMLDivElement | null
  rails: SVGSVGElement | null
  railPath: SVGPathElement | null
  figure: HTMLDivElement | null
  runner: RunnerParts | null
  planes: Map<string, HTMLDivElement>
  sparks: HTMLElement[]
}

interface CorridorWorldProps {
  specs: RoomSpec[]
  /** The hero's fall, then one set piece per room, in page order. */
  scenes: SceneSpec[]
  /** The text layer: the hero and the rooms, each room a [data-room] section. */
  children: ReactNode
  className: string
  style: CSSProperties
}

/** The runner on the floor at the runner's depth, from behind. */
function placeRunner(refs: Refs, view: View, move: Move) {
  const s = scaleAt(view, DF)
  const k = Math.round((s / FIGURE_RASTER) * 1000) / 1000
  const anchorY = round2((-FIGURE_BOX.y / FIGURE_BOX.h) * 100)
  refs.figure!.style.transform = `translate3d(${Math.round(view.vpx)}px, ${Math.round(view.vpy + FLOOR * s)}px, 0) scale(${k}) translate(-50%, -${anchorY}%)`
  applyPose(refs.runner!, move)
}

/** Binds each scene's node and writer, and places its box on the screen. */
function bindScenes(root: HTMLElement, scenes: readonly SceneSpec[], view: View, foot: { x: number; y: number }): BoundScene[] {
  return scenes.flatMap((spec, i) => {
    const el = root.querySelector<HTMLElement>(`[data-np-scene="${spec.id}"]`)
    if (!el) return []
    const box = boxOf(view.vw, view.vh, i === 0 ? foot : null)
    el.querySelector('[data-np="box"]')?.setAttribute('transform', `translate(${round2(box.x)} ${round2(box.y)}) scale(${box.k.toFixed(4)})`)
    return [{ spec, el, write: spec.set.bind(el, spec.input), follower: null, shown: null }]
  })
}

const showScene = (scene: BoundScene, shown: boolean): void => {
  if (scene.shown === shown) return
  scene.shown = shown
  scene.el.style.visibility = shown ? 'visible' : 'hidden'
}

export function CorridorWorld({ specs, scenes, children, className, style }: CorridorWorldProps) {
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const corridor: Corridor = useMemo(() => layoutCorridor(specs, phone), [specs, phone])
  const sparks = useMemo(() => sparksFor(corridor.tw), [corridor.tw])

  const refs = useRef<Refs>({ root: null, heroInner: null, fog: null, dark: null, rails: null, railPath: null, figure: null, runner: null, planes: new Map(), sparks: [] }).current
  const measured = useRef<Measured | null>(null)
  const drawn = useRef<Drawn>({ era: '', fog: -1, runner: null }).current
  const bound = useRef<BoundScene[]>([])

  const onPlane = useCallback(
    (key: string, el: HTMLDivElement | null) => {
      if (!el) {
        refs.planes.delete(key)
        return
      }
      refs.planes.set(key, el)
    },
    [refs],
  )

  const measure = useCallback(
    (scrollY: number) => {
      const root = refs.root
      if (!root) return
      const view = viewOf(document.documentElement.clientWidth, window.innerHeight)
      const sections = [...root.querySelectorAll<HTMLElement>('[data-room]')]
      if (sections.length !== corridor.rooms.length) return
      const hero = root.querySelector<HTMLElement>('[data-worlds-hero]')!
      const maxScroll = document.documentElement.scrollHeight - view.vh
      const reading = view.vh * READING_LINE
      const marks = sections.map((section) => marksOf(section, scrollY))
      const path = cameraPath(corridor, marks, { heroHeight: hero.offsetHeight, reading, maxScroll })
      const page = { reading, vh: view.vh, maxScroll }
      const spans = [heroSpan(hero.offsetHeight, view.vh, view.phone), ...marks.map((mark, r) => roomSpan(mark, page, { phone: view.phone, last: r === marks.length - 1 }))]
      measured.current = { view, ...path, spans }
      refs.rails?.setAttribute('viewBox', `0 0 ${view.vw} ${view.vh}`)
      refs.railPath?.setAttribute('d', railsPath(view, corridor.tw))
      // Where his feet stand on screen, for the wardrobe plate under him in the hero.
      const foot = { x: view.vpx, y: view.vpy + FLOOR * scaleAt(view, DF) }
      root.style.setProperty('--np-vpx', `${Math.round(view.vpx)}px`)
      root.style.setProperty('--np-vpy', `${Math.round(view.vpy)}px`)
      root.style.setProperty('--np-foot-y', `${Math.round(foot.y)}px`)
      bound.current = bindScenes(root, scenes, view, foot)
    },
    [corridor, scenes, refs],
  )

  const setEra = useCallback(
    (era: Era) => {
      if (era === drawn.era) return
      drawn.era = era
      refs.root!.style.setProperty('--a1', ERAS[era].a1)
      refs.root!.style.setProperty('--a2', ERAS[era].a2)
    },
    [refs, drawn],
  )

  /** Draws every scene at `position`; true while the one in view still plays toward the scroll. */
  const drawScenes = useCallback(
    (position: number, spans: readonly SceneSpan[], view: View): { covered: boolean; playing: boolean } => {
      const now = performance.now()
      // the opening's radius once it reaches every corner of the screen
      const reach = Math.hypot(view.vw, view.vh)
      const read = reduced ? readAt(spans, position) : -1
      let covered = false
      let playing = false
      bound.current.forEach((scene, i) => {
        const span = spans[i]
        const cover = reduced ? { opacity: i === read ? 1 : 0, zoom: 1, reveal: 1 } : coverAt(span, position)
        const shown = cover.opacity > 0.001
        showScene(scene, shown)
        if (!shown) {
          scene.follower = null
          return
        }
        covered = true
        scene.el.style.opacity = cover.opacity.toFixed(3)
        scene.el.style.transform = cover.zoom === 1 ? '' : `scale(${cover.zoom.toFixed(4)})`
        scene.el.style.clipPath = cover.reveal >= 1 ? '' : `circle(${Math.round(cover.reveal * reach)}px at var(--np-vpx) var(--np-vpy))`
        const { script } = scene.spec.set
        if (reduced) {
          scene.write(uOf(restingPlay(script)))
          return
        }
        const run = stagePlay(scene.follower, script, playAt(span, position), now, true)
        scene.follower = run.follower
        playing ||= run.playing
        scene.write(uOf(run.play))
      })
      return { covered, playing }
    },
    [reduced],
  )

  const draw = useCallback(
    (position: number): boolean => {
      const m = measured.current
      if (!m || !refs.root || !refs.runner) return false
      const camZ = reduced ? settledCam(corridor, m.roomTops, position) : camAt(m.keyframes, position)
      const room = roomAt(corridor.rooms, camZ)
      setEra(room ? room.era : HUB_ERA)
      const trough = reduced ? 0 : troughAt(corridor.rooms, camZ)
      const fog = round2(1 - trough)
      if (fog !== drawn.fog) {
        drawn.fog = fog
        refs.fog!.style.opacity = String(fog)
        refs.dark!.style.opacity = String(round2(trough * DARKEST))
      }
      const lift = reduced ? 0 : Math.min(1, Math.max(0, position / m.view.vh))
      if (refs.heroInner) refs.heroInner.style.transform = `scale(${(1 - 0.1 * lift).toFixed(4)})`
      const { covered, playing } = drawScenes(position, m.spans, m.view)
      if (covered) {
        // the set piece in view draws him: the tunnel waits under it, his runner hidden
        if (drawn.runner !== false) refs.figure!.style.visibility = 'hidden'
        drawn.runner = false
        return playing
      }
      if (drawn.runner !== true) refs.figure!.style.visibility = 'visible'
      drawn.runner = true
      for (const plane of corridor.planes) drawPlane(plane, camZ)
      sparks.forEach((spark, i) => {
        const { transform, opacity } = sparkView(spark, m.view, camZ, trough)
        refs.sparks[i].style.transform = transform
        refs.sparks[i].style.opacity = String(opacity)
      })
      placeRunner(refs, m.view, tunnelRunner(room, camZ))
      return playing

      function drawPlane(plane: Plane, z: number) {
        const el = refs.planes.get(plane.key)
        if (!el) return
        const { transform, opacity } = planeView(plane, m!.view, z)
        const shown = opacity > 0.01
        el.style.visibility = shown ? 'visible' : 'hidden'
        if (!shown) return
        el.style.transform = transform
        el.style.opacity = String(opacity)
      }
    },
    [corridor, sparks, reduced, refs, drawn, setEra, drawScenes],
  )

  const mainRef = useScrollStage<HTMLDivElement>({ enabled: true, measure, draw, tauMs: reduced ? 0 : undefined, content: scenes })

  const setRoot = useCallback(
    (el: HTMLDivElement | null) => {
      refs.root = el
      refs.heroInner = el?.querySelector<HTMLElement>('[data-hero-inner]') ?? null
      mainRef(el)
    },
    [refs, mainRef],
  )

  const setRunner = useCallback(
    (svg: SVGSVGElement | null) => {
      refs.runner = svg ? runnerParts(svg) : null
    },
    [refs],
  )

  return (
    <div ref={setRoot} className={className} style={{ ...style, ...cssVars({ '--a1': ERAS.hub.a1, '--a2': ERAS.hub.a2 }) }}>
      <div className={css.stage} aria-hidden="true">
        <div ref={(el) => {
          refs.fog = el
        }} className={css.fog} />
        <svg ref={(el) => {
          refs.rails = el
        }} className={css.rails} focusable="false">
          <path ref={(el) => {
          refs.railPath = el
        }} className={css.rail} />
        </svg>
        <div className={css.layer}>
          {corridor.planes.map((plane) => (
            <PlaneView key={plane.key} plane={plane} tw={corridor.tw} onMount={onPlane} />
          ))}
        </div>
        <div ref={(el) => {
          refs.dark = el
        }} className={css.dark} />
        <div className={css.layer}>
          {sparks.map((spark, i) => (
            <i key={`${spark.z0}`} ref={(el) => {
              if (el) refs.sparks[i] = el
            }} className={css.spark} />
          ))}
        </div>
        <div className={css.scrim} />
        <div ref={(el) => {
          refs.figure = el
        }} className={css.figure}>
          <Runner ref={setRunner} />
        </div>
        {scenes.map((spec, i) => (
          <SceneView key={spec.id} spec={spec} first={i === 0} />
        ))}
      </div>
      {children}
    </div>
  )
}
