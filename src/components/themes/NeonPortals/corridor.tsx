'use client'

import { memo, useCallback, useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollStage } from '@/hooks/useScrollStage'
import { cssVars } from '@/lib/cssVars'
import { fillLabel } from '@/lib/cv/labels'
import { decorArt, doorArt, gateArt, ribArt, vistaArt, type PlaneArt } from './eras'
import { doorStateAt, hubRunner, isFound, propStateAt, roomRunner, SETTLED_DOOR, SETTLED_PROP, settledRunner, type RunnerState } from './motion'
import { ERAS, type Era } from './palette'
import { HUB_ERA } from './plan'
import { partsOf, propArt, updateDoor, updateProp, type Parts } from './props'
import { applyPose, FIGURE_BOX, FIGURE_RASTER, Runner, runnerParts, type RunnerParts } from './runner'
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

// The stage: one fixed layer (aria-hidden) holding the tunnel, under the text layer that scrolls in normal
// flow and is never scaled or faded. The shared scroll stage engine (useScrollStage) measures the page on
// mount and resize and calls draw with the settled scroll position each frame while the art catches up
// with the scroll, then stops. draw turns that position into the camera's depth through the keyframes
// measured from the text layer (each card's centre on the reading line is the moment its prop meets the
// runner), and writes transforms and opacity only. Under reduced motion it draws at the scroll with no
// settle, and the tunnel shows the settled frame of the room being read: just inside its gate, every prop
// open, the runner holding the room's action. It changes only when the reader reaches the next room.

/** Where on the screen a card's centre meets its prop. */
const READING_LINE = 0.55
/** How far the tunnel dims in the gap between eras. */
const DARKEST = 0.88
const PHONE_QUERY = '(max-width: 767.98px)'

interface Measured {
  view: View
  keyframes: Keyframe[]
  roomTops: number[]
}

interface Drawn {
  era: Era | ''
  fog: number
  room: string
  tally: string
  planes: Map<string, string>
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

const artOf = (plane: Plane, tw: number): PlaneArt => {
  if (plane.prop) return propArt(plane.prop.kind, plane.era, plane.prop.meta)
  const ART: Record<Exclude<Plane['kind'], 'prop'>, (era: Era, tw: number) => PlaneArt> = { rib: ribArt, gate: gateArt, door: doorArt, vista: vistaArt, decor: decorArt }
  return ART[plane.kind as Exclude<Plane['kind'], 'prop'>](plane.era, tw)
}

/** One plane, laid out at world size x its raster and placed by transform from draw. */
const PlaneView = memo(function PlaneView({ plane, tw, onMount }: { plane: Plane; tw: number; onMount: (key: string, el: HTMLDivElement | null) => void }) {
  const { w, h, viewBox, art } = artOf(plane, tw)
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
  hudRoom: HTMLSpanElement | null
  hudTally: HTMLSpanElement | null
  planes: Map<string, { el: HTMLDivElement; parts: Parts }>
  sparks: HTMLElement[]
}

interface CorridorWorldProps {
  specs: RoomSpec[]
  /** Each room's title, for the HUD. */
  titles: string[]
  /** The text layer: the hero and the rooms, each room a [data-room] section. */
  children: ReactNode
  className: string
  style: CSSProperties
}

/** The runner on the floor at the runner's depth, stepped `x` across toward a prop. */
function placeRunner(refs: Refs, view: View, { pose, x }: RunnerState) {
  const s = scaleAt(view, DF)
  const k = Math.round((s / FIGURE_RASTER) * 1000) / 1000
  const anchorY = round2((-FIGURE_BOX.y / FIGURE_BOX.h) * 100)
  refs.figure!.style.transform = `translate3d(${Math.round(view.vpx + x * s)}px, ${Math.round(view.vpy + FLOOR * s)}px, 0) scale(${k}) translate(-50%, -${anchorY}%)`
  applyPose(refs.runner!, pose)
}

export function CorridorWorld({ specs, titles, children, className, style }: CorridorWorldProps) {
  const labels = useLabels()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const corridor: Corridor = useMemo(() => layoutCorridor(specs, phone), [specs, phone])
  const sparks = useMemo(() => sparksFor(corridor.tw), [corridor.tw])
  const total = useMemo(() => corridor.rooms.reduce((sum, room) => sum + room.items.length, 0), [corridor])

  const refs = useRef<Refs>({ root: null, heroInner: null, fog: null, dark: null, rails: null, railPath: null, figure: null, runner: null, hudRoom: null, hudTally: null, planes: new Map(), sparks: [] }).current
  const measured = useRef<Measured | null>(null)
  const drawn = useRef<Drawn>({ era: '', fog: -1, room: '', tally: '', planes: new Map() }).current

  const onPlane = useCallback(
    (key: string, el: HTMLDivElement | null) => {
      if (!el) {
        refs.planes.delete(key)
        drawn.planes.delete(key)
        return
      }
      refs.planes.set(key, { el, parts: partsOf(el) })
    },
    [refs, drawn],
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
      const path = cameraPath(
        corridor,
        sections.map((section) => marksOf(section, scrollY)),
        { heroHeight: hero.offsetHeight, reading: view.vh * READING_LINE, maxScroll },
      )
      measured.current = { view, ...path }
      refs.rails?.setAttribute('viewBox', `0 0 ${view.vw} ${view.vh}`)
      refs.railPath?.setAttribute('d', railsPath(view, corridor.tw))
      // Where his feet stand on screen, for the wardrobe plate under him in the hero.
      const foot = view.vpy + FLOOR * scaleAt(view, DF)
      root.style.setProperty('--np-vpx', `${Math.round(view.vpx)}px`)
      root.style.setProperty('--np-vpy', `${Math.round(view.vpy)}px`)
      root.style.setProperty('--np-foot-y', `${Math.round(foot)}px`)
      drawn.planes.clear()
    },
    [corridor, refs, drawn],
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

  const setHud = useCallback(
    (room: RoomGeometry | null, foundAt: number) => {
      const index = room ? corridor.rooms.indexOf(room) : -1
      const name = index < 0 ? labels.warp.hub : titles[index]
      if (name !== drawn.room && refs.hudRoom) {
        drawn.room = name
        refs.hudRoom.textContent = name
      }
      const found = corridor.rooms.reduce((sum, r) => sum + r.items.filter((item) => isFound(item, foundAt)).length, 0)
      const tally = fillLabel(labels.navigation.findTally, { found, total })
      if (tally === drawn.tally || !refs.hudTally) return
      drawn.tally = tally
      refs.hudTally.textContent = tally
    },
    [corridor, labels, titles, total, refs, drawn],
  )

  const draw = useCallback(
    (position: number) => {
      const m = measured.current
      if (!m || !refs.root || !refs.runner) return
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
      for (const plane of corridor.planes) drawPlane(plane, camZ)
      sparks.forEach((spark, i) => {
        const { transform, opacity } = sparkView(spark, m.view, camZ, trough)
        refs.sparks[i].style.transform = transform
        refs.sparks[i].style.opacity = String(opacity)
      })
      placeRunner(refs, m.view, reduced ? settledRunner(room) : room ? roomRunner(room, camZ) : hubRunner(camZ))
      // Under reduced motion the room on screen counts as found whole.
      setHud(room, reduced && room ? room.vista : camZ)
      const lift = reduced ? 0 : Math.min(1, Math.max(0, position / m.view.vh))
      if (refs.heroInner) refs.heroInner.style.transform = `scale(${(1 - 0.1 * lift).toFixed(4)})`

      function drawPlane(plane: Plane, z: number) {
        const held = refs.planes.get(plane.key)
        if (!held) return
        const { transform, opacity } = planeView(plane, m!.view, z)
        const shown = opacity > 0.01
        held.el.style.visibility = shown ? 'visible' : 'hidden'
        if (!shown) return
        held.el.style.transform = transform
        held.el.style.opacity = String(opacity)
        if (plane.prop) {
          const state = reduced ? SETTLED_PROP : propStateAt(corridor.rooms[plane.prop.room].items[plane.prop.item], z)
          const key = `${round2(state.open)}|${round2(state.amount)}|${round2(state.beat)}|${round2(state.swing)}`
          if (drawn.planes.get(plane.key) === key) return
          drawn.planes.set(plane.key, key)
          updateProp(plane.prop.kind, held.parts, state)
          return
        }
        if (plane.kind !== 'door') return
        const owner = corridor.rooms.find((r) => r.door === plane.z)!
        const state = reduced || !room ? SETTLED_DOOR : doorStateAt(owner, plane.z, z)
        const key = `${round2(state.slide)}|${state.lamps}`
        if (drawn.planes.get(plane.key) === key) return
        drawn.planes.set(plane.key, key)
        updateDoor(held.parts, state)
      }
    },
    [corridor, sparks, reduced, refs, drawn, setEra, setHud],
  )

  const mainRef = useScrollStage<HTMLDivElement>({ enabled: true, measure, draw, tauMs: reduced ? 0 : undefined })

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
        }} className={css.figure} data-worlds-figure="">
          <Runner ref={setRunner} />
        </div>
      </div>
      {children}
      <p className={css.hud} aria-hidden="true">
        <span ref={(el) => {
          refs.hudRoom = el
        }} className="font-bold" />
        <span ref={(el) => {
          refs.hudTally = el
        }} />
      </p>
    </div>
  )
}
