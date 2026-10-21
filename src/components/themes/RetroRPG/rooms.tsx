'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { useZoneStage } from '@/hooks/useZoneStage'
import { usePreview } from '@/themes/PreviewContext'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MONO, PIXEL, RPG } from './palette'
import { FOCUS } from './actions'
import { DUMMY, FLOWER, KEEPER, KEEPER_PAW, MONSTER, PORTRAIT_OPEN, PORTRAIT_SHUT, SENTRY, type PixelSprite } from './npcs'
import { RoomOpen } from './play'
import { Soul } from './soul'
import { Actor, PixelArt } from './walker'
import type { Zone } from './overworld'
import rooms from './rooms.module.css'

// The overworld rooms: every section opens with him in a small room of the zone it belongs to, doing that
// room's event, and only then does the section's content show (Dark Fantasy's reveal rule, in this game's
// language). Ten different events, one per section, each its own art and beat:
//
//   About       the encounter: the heart steps beside Check, the monster shakes, the bio types, it is spared
//   Experience  he walks up to the snowy booth, the dog sentry pops up with the "!" and talks in each job box
//   Tech stack  he walks in to the shop counter, the keeper waves; pointing at an item makes the keeper hop
//   Projects    he walks over three floor switches, each clicks, the spike row sinks, the projects rise
//   Ventures    he walks the pastel street, each shop door opens as he passes, a taxi drives by
//   Bands       he walks the waterfall bridge, one echo flower per band lights and rings as he passes
//   Muay Thai   he steps in to the training dummy and lands three knees, a slash per hit
//
// Pattern: one phase table per room (walk, act, done in ms) on the shared zone stage (useZoneStage hands
// the room's zone to the overworld backdrop and says when it is first seen); the phase is data-room, read by
// rooms.module.css, every move a steps() keyframe. Reduced motion and a World Select preview open on done.
// Each room is one SVG on a 320 by 80 grid (him on his own 20 by 30 grid inside it), drawn crisp.

type RoomPhase = 'idle' | 'walk' | 'act' | 'done'

interface Beat {
  act: number
  done: number
}

function useRoom(zone: Zone, beat: Beat) {
  const { ref, on, reduced } = useZoneStage(zone)
  const preview = usePreview()
  const [take, setTake] = useState(0)
  const [room, setRoom] = useState<RoomPhase>('idle')
  const [shown, setShown] = useState(false)
  const skip = reduced || preview
  if (room === 'done' && !shown) setShown(true)

  useEffect(() => {
    if (skip) {
      setRoom('done')
      return
    }
    if (!on) return
    setRoom('walk')
    const timers = [window.setTimeout(() => setRoom('act'), beat.act), window.setTimeout(() => setRoom('done'), beat.done)]
    return () => timers.forEach(window.clearTimeout)
  }, [on, skip, take, beat.act, beat.done])

  return { ref, room, shown, take, replay: () => setTake((n) => n + 1) }
}

const STRIP = 'block h-auto w-full'

interface RoomProps {
  zone: Zone
  beat: Beat
  /** The room's art, him included; drawn on the 320 by 80 grid. */
  art: ReactNode
  /** A line over the room's floor, in the page (Check in the encounter). */
  overlay?: ReactNode
  /** The replay button's words; no button without them. */
  replay?: string
  className?: string
  children: ReactNode
}

function Room({ zone, beat, art, overlay, replay, className = '', children }: RoomProps) {
  const { ref, room, shown, take, replay: again } = useRoom(zone, beat)

  return (
    <div ref={ref} data-room={room} data-shown={shown} className={className}>
      <div className="relative mb-6 overflow-hidden border-4 border-[color:var(--rpg-border)] bg-[color:var(--rpg-void)]" aria-hidden="true">
        <svg key={take} viewBox="0 0 320 80" className={STRIP} shapeRendering="crispEdges" focusable="false">
          {art}
        </svg>
        {overlay}
      </div>
      {replay && (
        <div className="-mt-3 mb-6 flex justify-end">
          <button
            type="button"
            onClick={again}
            className={`min-h-[44px] border-[3px] border-[color:var(--rpg-orange)] bg-[color:var(--rpg-void)] px-3 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-orange)] hover:border-[color:var(--rpg-gold)] hover:text-[color:var(--rpg-gold)] ${PIXEL} ${FOCUS}`}
          >
            {replay}
          </button>
        </div>
      )}
      <RoomOpen.Provider value={shown}>
        <div className={rooms.gated}>{children}</div>
      </RoomOpen.Provider>
    </div>
  )
}

/** Him on the floor of a room: the walk's start, end, length and steps as the room's own fixed classes. */
function Walker({ profession, acts, className }: { profession: Profession; acts?: boolean; className: string }) {
  return (
    <g className={`${rooms.actor} ${className}`}>
      <Actor profession={profession} walk="right" rest="right" acts={acts} />
    </g>
  )
}

/** A sprite scaled up by a whole number, so its pixels stay square on the room's grid. */
function Big({ sprite, x, y, scale = 2, className }: { sprite: PixelSprite; x: number; y: number; scale?: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <PixelArt sprite={sprite} className={className} />
    </g>
  )
}

const goldOf = (sprite: PixelSprite): PixelSprite => ({ ...sprite, colours: { ...sprite.colours, W: RPG.gold } })

// ---------------------------------------------------------------- About

export function EncounterRoom({ children }: { children: ReactNode }) {
  const labels = useLabels()
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.void} />
      <rect x="0" y="74" width="320" height="1" fill={RPG.borderShade} />
      <g className={rooms.monster}>
        <g className={rooms.monsterShake}>
          <Big sprite={MONSTER} x={176} y={30} scale={3} className={rooms.monsterBob} />
        </g>
      </g>
      <g className={rooms.spareable}>
        <Big sprite={goldOf(MONSTER)} x={176} y={30} scale={3} />
      </g>
    </>
  )
  const overlay = (
    <p className={`absolute bottom-2 left-3 flex items-center gap-2 text-sm text-[color:var(--rpg-text)] sm:bottom-4 sm:left-6 sm:text-base ${MONO}`}>
      <Soul className={`h-3.5 w-4 ${rooms.checkHeart}`} />
      <span className={rooms.checkWord}>* {labels.rpg.check}</span>
    </p>
  )

  return (
    <Room zone="ruins" beat={{ act: 700, done: 1500 }} art={art} overlay={overlay} replay={labels.rpg.checkAgain}>
      {children}
    </Room>
  )
}

// ---------------------------------------------------------------- Experience

function Pines() {
  const trees = [8, 40, 72, 104, 136, 168, 200]
  return (
    <>
      {trees.map((x) => (
        <g key={x}>
          <path d={`M${x + 12} 2 L${x + 24} 30 H${x} Z`} fill={RPG.pine} />
          <path d={`M${x + 12} 2 L${x + 18} 16 H${x + 6} Z`} fill={RPG.pineLit} />
          <rect x={x + 10} y={2} width={4} height={3} fill={RPG.snowCap} />
        </g>
      ))}
    </>
  )
}

/** The bang over the sentry: white pixels in a black bubble. */
function Bang({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className={rooms.bang}>
      <path d="M2 0 H7 V1 H8 V9 H7 V10 H5 V12 H4 V10 H2 V9 H1 V1 H2 Z" fill={RPG.void} />
      <rect x={4} y={2} width={1} height={5} fill={RPG.text} />
      <rect x={4} y={8} width={1} height={1} fill={RPG.text} />
    </g>
  )
}

export function SentryRoom({ profession, children }: { profession: Profession; children: ReactNode }) {
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.snow} />
      <rect y="0" width="320" height="34" fill={RPG.snowShade} />
      <Pines />
      <rect y="74" width="320" height="6" fill={RPG.snowShade} />
      {/* the booth: snow roof on two posts, the sentry behind its counter */}
      <rect x="236" y="10" width="64" height="8" fill={RPG.snowCap} />
      <rect x="240" y="18" width="56" height="3" fill={RPG.woodDark} />
      <rect x="240" y="21" width="4" height="50" fill={RPG.wood} />
      <rect x="292" y="21" width="4" height="50" fill={RPG.wood} />
      <Big sprite={SENTRY} x={256} y={32} className={rooms.sentry} />
      <rect x="236" y="50" width="64" height="20" fill={RPG.wood} />
      <rect x="236" y="50" width="64" height="3" fill={RPG.woodDark} />
      <Bang x={276} y={14} />
      <Walker profession={profession} className="[--walk-from:-24px] [--walk-ms:1400ms] [--walk-steps:10] [--walk-to:200px] [--walk-y:44px]" />
    </>
  )

  return (
    <Room zone="snow" beat={{ act: 1400, done: 2000 }} art={art}>
      {children}
    </Room>
  )
}

/** The sentry's face in a job box, its mouth flapping while the box speaks. */
export function SentryPortrait() {
  return (
    <svg viewBox="0 0 16 14" className="h-14 w-16 shrink-0 sm:h-[70px] sm:w-20" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <PixelArt sprite={PORTRAIT_SHUT} />
      <rect x="5" y="9" width="6" height="4" fill={RPG.void} className={rooms.mouthOpen} />
      <PixelArt sprite={PORTRAIT_OPEN} className={rooms.mouthOpen} />
    </svg>
  )
}

/** A job box speaks under the pointer too: the class that lets the portrait talk again. */
export const TALKS = rooms.talks

// ---------------------------------------------------------------- Tech stack

export function ShopRoom({ profession, children }: { profession: Profession; children: ReactNode }) {
  const boards = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300]
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.shopWood} />
      {boards.map((x) => (
        <rect key={x} x={x} y="0" width="1" height="60" fill={RPG.shopDark} />
      ))}
      {/* a shelf with a jar and a bone, the floor */}
      <rect x="24" y="20" width="56" height="3" fill={RPG.shopDark} />
      <rect x="32" y="10" width="8" height="10" fill={RPG.dogPink} />
      <rect x="54" y="15" width="16" height="3" fill={RPG.shopPale} />
      <rect y="60" width="320" height="20" fill={RPG.shopDark} />
      <g className={rooms.keeper}>
        <Big sprite={KEEPER} x={176} y={20} />
        <Big sprite={KEEPER_PAW} x={170} y={22} className={rooms.paw} />
      </g>
      {/* the counter: a pale box with a hand painted stripe */}
      <rect x="150" y="44" width="88" height="22" fill={RPG.shopBoard} />
      <rect x="150" y="44" width="88" height="2" fill={RPG.shopPale} />
      <rect x="160" y="54" width="68" height="2" fill={RPG.gold} />
      <Walker profession={profession} className="[--walk-from:-24px] [--walk-ms:1200ms] [--walk-steps:8] [--walk-to:118px] [--walk-y:46px]" />
    </>
  )

  return (
    <Room zone="water" beat={{ act: 1200, done: 1800 }} art={art} className={rooms.shop}>
      {children}
    </Room>
  )
}

/** An item line in the shop menu: pointing at it makes the keeper hop. */
export const ITEM = rooms.item

// ---------------------------------------------------------------- Projects

// He walks from -24 to 236 in 1800 ms; each switch clicks the moment his feet reach it.
const SWITCHES = [
  { x: 82, at: '[--click-at:675ms]' },
  { x: 142, at: '[--click-at:1100ms]' },
  { x: 202, at: '[--click-at:1520ms]' },
]
const SPIKE_ROWS = [40, 48, 56, 64]

export function PuzzleRoom({ profession, children }: { profession: Profession; children: ReactNode }) {
  const labels = useLabels()
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.heatGround} />
      <rect width="320" height="12" fill={RPG.slate} />
      <rect y="12" width="320" height="22" fill={RPG.heatRock} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 40 + (i % 2) * 12} y="22" width="18" height="4" fill={RPG.heatDeep} />
      ))}
      <rect x="0" y="34" width="320" height="2" fill={RPG.heatDeep} />
      {/* two vents puffing steam */}
      <rect x="30" y="66" width="12" height="4" fill={RPG.heatDeep} />
      <rect x="31" y="56" width="10" height="6" fill={RPG.snowCap} className={rooms.steam} />
      <rect x="31" y="56" width="10" height="6" fill={RPG.snowCap} className={rooms.steam} />
      {SWITCHES.map(({ x, at }) => (
        <g key={x}>
          <rect x={x} y="68" width="16" height="6" fill={RPG.borderShade} />
          <rect x={x + 2} y="69" width="12" height="4" fill={RPG.gold} className={`${rooms.switchLit} ${at}`} />
        </g>
      ))}
      <g className={rooms.spikes}>
        <rect x="262" y="38" width="22" height="36" fill={RPG.heatDeep} />
        {SPIKE_ROWS.map((y) => (
          <g key={y}>
            <path d={`M264 ${y + 6} L267 ${y} L270 ${y + 6} Z`} fill={RPG.muted} />
            <path d={`M273 ${y + 6} L276 ${y} L279 ${y + 6} Z`} fill={RPG.muted} />
          </g>
        ))}
      </g>
      <Walker profession={profession} className="[--walk-from:-24px] [--walk-ms:1800ms] [--walk-steps:12] [--walk-to:236px] [--walk-y:44px]" />
    </>
  )

  return (
    <Room zone="heat" beat={{ act: 1800, done: 2300 }} art={art} replay={labels.rpg.resetPuzzle}>
      {children}
    </Room>
  )
}

// ---------------------------------------------------------------- Ventures

// Three shop fronts; he walks from -24 to 300 in 2000 ms and each door opens as he reaches it.
const FRONTS = [
  { x: 12, at: '[--open-at:400ms]' },
  { x: 118, at: '[--open-at:1060ms]' },
  { x: 224, at: '[--open-at:1720ms]' },
]

export function StreetRoom({ profession, children }: { profession: Profession; children: ReactNode }) {
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.townGrass} />
      {FRONTS.map(({ x, at }) => (
        <g key={x}>
          <rect x={x} y="4" width="84" height="8" fill={RPG.townRoof} />
          <rect x={x + 4} y="12" width="76" height="46" fill={RPG.townWall} />
          <rect x={x + 4} y="12" width="76" height="3" fill={RPG.townMint} />
          <rect x={x + 12} y="22" width="14" height="12" fill={RPG.waterWall} />
          <rect x={x + 58} y="22" width="14" height="12" fill={RPG.waterWall} />
          <rect x={x + 34} y="34" width="16" height="24" fill={RPG.void} />
          <rect x={x + 34} y="34" width="16" height="24" fill={RPG.shopWood} className={`${rooms.door} ${at}`} />
        </g>
      ))}
      <rect y="58" width="320" height="4" fill={RPG.townRoof} />
      <rect y="70" width="320" height="10" fill={RPG.borderShade} />
      <g className={rooms.taxi}>
        <rect x="0" y="70" width="26" height="7" fill={RPG.taxi} />
        <rect x="6" y="66" width="14" height="5" fill={RPG.taxi} />
        <rect x="3" y="76" width="5" height="4" fill={RPG.void} />
        <rect x="18" y="76" width="5" height="4" fill={RPG.void} />
      </g>
      <Walker profession={profession} className="[--walk-from:-24px] [--walk-ms:2000ms] [--walk-steps:14] [--walk-to:300px] [--walk-y:34px]" />
    </>
  )

  return (
    <Room zone="town" beat={{ act: 2000, done: 2100 }} art={art}>
      {children}
    </Room>
  )
}

// ---------------------------------------------------------------- Bands

const BRIDGE_FROM = -24
const BRIDGE_TO = 300
const BRIDGE_MS = 2200

/** Where each band's flower stands on the bridge and when his feet reach it. */
export function flowerSpots(count: number): Array<{ x: number; at: number }> {
  if (count <= 0) return []
  const gap = 280 / Math.max(count, 1)
  return Array.from({ length: count }, (_, index) => {
    const x = Math.round(20 + gap * index + gap / 2 - 3)
    return { x, at: Math.round(((x - 10 - BRIDGE_FROM) / (BRIDGE_TO - BRIDGE_FROM)) * BRIDGE_MS) }
  })
}

interface BridgeRoomProps {
  profession: Profession
  /** How many bands, one flower each. */
  count: number
  /** The band under the pointer, whose flower rings again; its take replays the ring. */
  ringing: { index: number; take: number } | null
  children: ReactNode
}

export function BridgeRoom({ profession, count, ringing, children }: BridgeRoomProps) {
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.waterFloor} />
      <rect width="320" height="30" fill={RPG.waterWall} />
      {[6, 14, 22].map((y) => (
        <path key={y} d={`M0 ${y} q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke={RPG.waterLine} strokeWidth="1" />
      ))}
      <rect y="66" width="320" height="8" fill={RPG.shopDark} />
      {[0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 272, 288, 304].map((x) => (
        <rect key={x} x={x} y="66" width="1" height="8" fill={RPG.waterFloor} />
      ))}
      <rect y="74" width="320" height="6" fill={RPG.void} />
      {flowerSpots(count).map(({ x, at }, index) => (
        <g key={x} className={ringing?.index === index ? rooms.ringing : ''} style={{ ['--ring-at' as string]: `${at}ms` }}>
          <g transform={`translate(${x} 38) scale(2)`}>
            <PixelArt sprite={{ ...FLOWER, colours: { ...FLOWER.colours, C: RPG.waterLine, c: RPG.waterLine } }} />
            <PixelArt sprite={FLOWER} className={rooms.flowerLit} />
          </g>
          <circle key={ringing?.index === index ? ringing.take : 0} cx={x + 7} cy={44} r={6} fill="none" stroke={RPG.glow} strokeWidth="1" className={rooms.ring} />
        </g>
      ))}
      <Walker profession={profession} className="[--walk-from:-24px] [--walk-ms:2200ms] [--walk-steps:16] [--walk-to:300px] [--walk-y:38px]" />
    </>
  )

  return (
    <Room zone="water" beat={{ act: BRIDGE_MS, done: BRIDGE_MS + 100 }} art={art}>
      {children}
    </Room>
  )
}

// ---------------------------------------------------------------- Muay Thai

export function SparRoom({ profession, children }: { profession: Profession; children: ReactNode }) {
  const labels = useLabels()
  const art = (
    <>
      <rect width="320" height="80" fill={RPG.void} />
      <rect y="74" width="320" height="1" fill={RPG.borderShade} />
      <g className={rooms.dummy}>
        <Big sprite={DUMMY} x={196} y={10} scale={4} />
      </g>
      <rect x="186" y="34" width="56" height="3" fill={RPG.soul} className={rooms.slash} transform="rotate(-20 214 36)" />
      <Walker profession={profession} acts className="[--walk-from:-24px] [--walk-ms:600ms] [--walk-steps:4] [--walk-to:166px] [--walk-y:44px]" />
    </>
  )

  return (
    <Room zone="heat" beat={{ act: 600, done: 2100 }} art={art} replay={labels.rpg.sparAgain}>
      {children}
    </Room>
  )
}

/** A part of the page that hands its zone to the backdrop while it is in view (the hero, the save point). */
export function ZoneArea({ zone, children }: { zone: Zone; children: ReactNode }) {
  const { ref } = useZoneStage(zone)
  return <div ref={ref}>{children}</div>
}
