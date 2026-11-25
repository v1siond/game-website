'use client'

import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { easeInOut } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { MASTERS, ScrubFighter, type Rival } from './fighter'
import { PlaneShape } from './flight'
import { FS } from './palette'
import { headingTo, type Pin } from './route'
import { HOME, MapLand } from './worldMap'
import look from './world.module.css'

// The screen of the arcade run over every scene (theatre.tsx), the parts that carry the story from section
// to section:
// - the select board of the hero: eight portraits, the 1P cursor roaming and stopping on him, his slot
//   flashing and the small map with the first route lit;
// - the map hop: the world map, the plane flying the dotted route from his home pin to the dojo, then the map
//   zooming into the pin as the stage opens;
// - the ladder: the four masters in a column, their faces hidden as shadows of our own, the ones beaten
//   crossed out as his marker climbs past them, and the last one turning round when the marker reaches him;
// - the HUD: both life bars, the round clock, the round orbs and the masters crossed off, one HUD for the
//   whole run; his bar pulses red when it is nearly gone;
// - the calls, each on a navy plate so it reads over any stage, in our own words;
// - his ending's credits rising up the dawn sky with his roles as the staff lines, and the 2P panel that
//   waits for the visitor, a coin slot and a count clock.
// No caption narrates: no place names, titles or counts, only the fight's own voice (1P, the calls).
// Everything here is written by the scene's writer from its playhead, so it plays back on the way up.

/** The screen overlay's own units: the map's 400 by 160 with room above and below. */
const SCREEN = { w: 400, h: 225 }
const MAP_TOP = 32

/** Where the stages the plane flies to stand on the map, in the map's units: his home and the dojo. */
export const PINS = {
  home: [HOME.x, HOME.y],
  dojo: [318, 50],
} as const satisfies Record<string, Pin>

export type StagePin = keyof typeof PINS

const at = ([x, y]: Pin): Pin => [x, y + MAP_TOP]

/** A full screen overlay that keeps its whole picture in view on any screen; `fill` paints the sides too. */
function Overlay({ name, fill = FS.selectDeep, children }: { name: string; fill?: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${SCREEN.w} ${SCREEN.h}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <g data-fx={name} opacity="0">
        <rect x={-2000} y={-2000} width={4400} height={4400} fill={fill} />
        {children}
      </g>
    </svg>
  )
}

/** A fighter's head and shoulders cropped into a frame `w` by `h` at (x, y); `shadow` draws him as a shape
 *  with no face, filled with the night. */
function Portrait({ x, y, w, h, profession, rival, shadow }: { x: number; y: number; w: number; h: number; profession: Profession; rival?: Rival; shadow?: string }) {
  return (
    <svg x={x} y={y} width={w} height={h} viewBox="40 20 90 100" overflow="hidden">
      <g filter={shadow ? `url(#${shadow})` : undefined}>
        <ScrubFighter profession={profession} who={rival ? 'partner' : 'hero'} rival={rival} mirror={Boolean(rival)} poses={['stance']} />
      </g>
    </svg>
  )
}

/** The filter that turns a portrait into a shadow: every painted pixel the night's blue. */
function ShadowFilter({ id }: { id: string }) {
  return (
    <filter id={id}>
      <feFlood floodColor="#0b1030" />
      <feComposite in2="SourceAlpha" operator="in" />
    </filter>
  )
}

const useFilterId = (): string => `fs-shadow-${useId().replace(/:/g, '')}`

// ---- the select board ----

// The roster's eight slots, four by two: the cast as shadows and him in the slot the cursor stops on.
const ROSTER: readonly (Rival | null)[] = ['strangerA', 'school', 'heavy', 'reader', 'strangerB', null, 'acrobat', 'boxer']
const HIS_SLOT = ROSTER.indexOf(null)
const SLOT = { x: 18, y: 44, w: 50, h: 56, gap: 4 }
const slotAt = (i: number): Pin => [SLOT.x + (i % 4) * (SLOT.w + SLOT.gap), SLOT.y + Math.floor(i / 4) * (SLOT.h + SLOT.gap)]
// The slots the cursor roams before it stops on him.
const ROAM = [0, 1, 2, 6, HIS_SLOT] as const
// The small map, beside the roster and centred on its height.
const MINI = { x: 238, y: 73, w: 146, h: 58 }

export function SelectBoard({ profession }: { profession: Profession }) {
  const shadow = useFilterId()
  const [hx, hy] = at(PINS.home)
  const [dx, dy] = at(PINS.dojo)
  return (
    // in the band above the page's own select panel, which rises from the lower half: on a wide screen the top
    // 40%, on a phone a full width band from 30% down, under the header once it has gone
    <svg
      viewBox={`0 0 ${SCREEN.w} ${SCREEN.h}`}
      preserveAspectRatio="xMidYMin meet"
      className="absolute inset-x-0 top-[30%] h-[27%] w-full lg:top-[3%] lg:h-[40%]"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <ShadowFilter id={shadow} />
      </defs>
      <g data-fx="board" opacity="0">
        <rect x={8} y={14} width={384} height={178} rx={4} fill={FS.selectDeep} opacity={0.82} stroke={FS.p1Light} strokeWidth={1.5} />
        {ROSTER.map((rival, i) => {
          const [x, y] = slotAt(i)
          return (
            <g key={`${rival ?? 'him'}-${i}`}>
              <rect x={x} y={y} width={SLOT.w} height={SLOT.h} fill={rival ? FS.panel : FS.select} stroke={FS.chrome} strokeWidth={1} />
              <Portrait x={x + 1} y={y + 1} w={SLOT.w - 2} h={SLOT.h - 2} profession={profession} rival={rival ?? undefined} shadow={rival ? shadow : undefined} />
            </g>
          )
        })}
        <rect data-fx="board-flash" x={slotAt(HIS_SLOT)[0]} y={slotAt(HIS_SLOT)[1]} width={SLOT.w} height={SLOT.h} fill={FS.flash} opacity="0" />
        <g data-fx="board-cursor">
          <rect x={-2} y={-2} width={SLOT.w + 4} height={SLOT.h + 4} fill="none" stroke={FS.p1Light} strokeWidth={3} />
          <rect x={SLOT.w / 2 - 9} y={-11} width={18} height={10} fill={FS.p1Light} stroke={FS.ink} strokeWidth={1} />
          <text x={SLOT.w / 2} y={-3} textAnchor="middle" fontSize={8} fill={FS.ink} className={look.display}>
            1P
          </text>
        </g>
        <g data-fx="board-map" opacity="0">
          <rect x={MINI.x} y={MINI.y} width={MINI.w} height={MINI.h} fill={FS.select} stroke={FS.flash} strokeWidth={1.2} />
          <svg x={MINI.x} y={MINI.y} width={MINI.w} height={MINI.h} viewBox={`0 ${MAP_TOP} ${SCREEN.w} 160`} preserveAspectRatio="xMidYMid slice">
            <g transform={`translate(0 ${MAP_TOP})`}>
              <MapLand />
            </g>
            <path data-fx="board-route" d={`M${hx} ${hy} L${dx} ${dy}`} fill="none" stroke={FS.gold} strokeWidth={5} strokeDasharray="1 1" pathLength={1} strokeDashoffset={1} />
            <circle cx={hx} cy={hy} r={8} fill={FS.p1} stroke={FS.ink} strokeWidth={2} />
            <circle cx={dx} cy={dy} r={9} fill={FS.gold} stroke={FS.ink} strokeWidth={2} />
          </svg>
        </g>
      </g>
    </svg>
  )
}

/** The board at its pick (0 to 1: in, the cursor roaming to him, the flash) and its declaration (0 to 1: the
 *  small map coming up and the route lighting). */
export function boardWriter(stage: HTMLElement): (pick: number, declare: number) => void {
  const board = fx(stage, 'board')
  const cursor = fx(stage, 'board-cursor')
  const flash = fx(stage, 'board-flash')
  const map = fx(stage, 'board-map')
  const route = fx(stage, 'board-route')
  return (pick, declare) => {
    fadeTo(board, ramp(pick, 0, 0.2))
    const roam = ramp(pick, 0.2, 0.8) * (ROAM.length - 1)
    const [x, y] = slotAt(ROAM[Math.min(ROAM.length - 1, Math.round(roam))])
    transformTo(cursor, `translate(${x} ${y})`)
    fadeTo(flash, 0.9 * bell(pick, 0.8, 1))
    fadeTo(map, ramp(declare, 0.35, 0.5))
    route?.setAttribute('stroke-dashoffset', (1 - ramp(declare, 0.45, 1)).toFixed(3))
  }
}

// ---- the map hop ----

export function MapHop({ from, to }: { from: StagePin; to: StagePin }) {
  const [fx0, fy0] = at(PINS[from])
  const [tx, ty] = at(PINS[to])
  return (
    <Overlay name="map">
      <g data-fx="map-zoom">
        <g transform={`translate(0 ${MAP_TOP})`}>
          <MapLand />
        </g>
        <path d={`M${fx0} ${fy0} L${tx} ${ty}`} fill="none" stroke={FS.flash} strokeWidth={1.4} strokeDasharray="2 3" />
        <circle cx={fx0} cy={fy0} r={3} fill={FS.p2} stroke={FS.ink} strokeWidth={1} />
        <circle cx={tx} cy={ty} r={4.2} fill={FS.gold} stroke={FS.ink} strokeWidth={1.2} />
        <g data-fx="plane">
          <PlaneShape />
        </g>
      </g>
    </Overlay>
  )
}

// The hop's parts of its action: the plane flies, then the map zooms into the pin and opens on the stage.
const FLY = [0.08, 0.68] as const
const OPEN = [0.7, 1] as const

/** The hop at `t` of its action (1 once the fight is on). */
export function hopWriter(stage: HTMLElement, from: StagePin, to: StagePin): (t: number) => void {
  const map = fx(stage, 'map')
  const zoom = fx(stage, 'map-zoom')
  const plane = fx(stage, 'plane')
  const a = at(PINS[from])
  const b = at(PINS[to])
  const heading = headingTo(a, b)
  return (t) => {
    const flown = easeInOut(ramp(t, ...FLY))
    transformTo(plane, `translate(${r1(lerp(a[0], b[0], flown))} ${r1(lerp(a[1], b[1], flown))}) rotate(${heading})`)
    const open = ramp(t, ...OPEN)
    const scale = 1 + 4 * open * open
    transformTo(zoom, `translate(${r1(b[0] * (1 - scale))} ${r1(b[1] * (1 - scale))}) scale(${scale.toFixed(3)})`)
    fadeTo(map, 1 - ramp(t, 0.82, 1))
  }
}

// ---- the ladder of the four masters ----

const ROW = { x: 130, w: 150, h: 40, gap: 48, bottom: 176 }
const rowY = (i: number): number => ROW.bottom - i * ROW.gap
const LAST = MASTERS.length - 1

/** The ladder's climb: the row his marker starts beside (-1 below the first) and the row it climbs to. */
export interface Climb {
  from: number
  to: number
}

export function Ladder({ profession, climb }: { profession: Profession; climb: Climb }) {
  const shadow = useFilterId()
  return (
    <Overlay name="ladder">
      <defs>
        <ShadowFilter id={shadow} />
      </defs>
      {MASTERS.map((rival, i) => (
        <g key={rival} transform={`translate(${ROW.x} ${rowY(i)})`}>
          <rect width={ROW.w} height={ROW.h} fill={FS.panel} stroke={i === climb.to ? FS.gold : FS.chrome} strokeWidth={2} />
          <g data-fx={`ladder-shadow-${i}`}>
            <Portrait x={4} y={1} w={36} h={38} profession={profession} rival={rival} shadow={shadow} />
          </g>
          {i === LAST && (
            <g data-fx="ladder-face" opacity="0">
              <Portrait x={4} y={1} w={36} h={38} profession={profession} rival={rival} />
            </g>
          )}
          <path
            data-fx={`ladder-x-${i}`}
            opacity={i < climb.from ? 1 : 0}
            d={`M4 4 L${ROW.w - 4} ${ROW.h - 4} M${ROW.w - 4} 4 L4 ${ROW.h - 4}`}
            stroke={FS.p2}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      ))}
      <g data-fx="ladder-marker">
        <path d="M0 0 L-12 -8 V8 Z" fill={FS.p1} stroke={FS.flash} strokeWidth={1.5} />
        <text x={-34} y={5} fontSize={13} fill={FS.flash} className={look.display}>
          1P
        </text>
      </g>
    </Overlay>
  )
}

/** The board at `t` of its action: his marker climbs row by row, each master it passes crossed out as it
 *  goes, the one at the top turning his face round when it arrives, then the board opens on the stage. */
export function ladderWriter(stage: HTMLElement, { from, to }: Climb): (t: number) => void {
  const board = fx(stage, 'ladder')
  const marker = fx(stage, 'ladder-marker')
  const crosses = MASTERS.map((_, i) => fx(stage, `ladder-x-${i}`))
  const face = fx(stage, 'ladder-face')
  const topShadow = fx(stage, `ladder-shadow-${LAST}`)
  return (t) => {
    const climbed = lerp(from, to, easeInOut(ramp(t, 0.1, 0.65)))
    transformTo(marker, `translate(${ROW.x - 6} ${r1(rowY(climbed) + ROW.h / 2)})`)
    crosses.forEach((cross, i) => fadeTo(cross, i < from ? 1 : i < to ? ramp(climbed, i + 0.5, i + 0.9) : 0))
    const turn = to === LAST ? ramp(t, 0.62, 0.78) : 0
    fadeTo(face, turn)
    fadeTo(topShadow, 1 - turn)
    fadeTo(board, 1 - ramp(t, 0.84, 1))
  }
}

// ---- the HUD ----

const BAR = { w: 236, h: 18, y: 26 }
const P1_X = 12
const P2_X = 600 - 12 - BAR.w

// The masters' plate under the clock on the ladder: four boxes centred on the HUD, a plate round them.
const PIP = { size: 24, step: 30, y: 84 }
const PIPS_X = 300 - (PIP.step * (MASTERS.length - 1) + PIP.size) / 2
const PLATE = { x: PIPS_X - 15, w: PIP.step * (MASTERS.length - 1) + PIP.size + 30, y: 74, h: 44 }

/** The HUD over a fight: both life bars, the round clock between them, two round orbs each and, on the
 *  ladder, the four masters crossed off under the clock. The scrap yard's clock is its own. */
export function Hud({ rival = 'RIVAL', ladder = false }: { rival?: string; ladder?: boolean }) {
  return (
    <svg
      viewBox={`0 0 600 ${ladder ? PLATE.y + PLATE.h + 4 : PLATE.y}`}
      className="absolute left-1/2 top-[64px] w-[min(94vw,580px)] -translate-x-1/2 lg:left-auto lg:right-[3vw] lg:translate-x-0"
      aria-hidden="true"
      focusable="false"
    >
      {[P1_X, P2_X].map((x, side) => (
        <g key={x}>
          <rect x={x} y={BAR.y} width={BAR.w} height={BAR.h} fill={FS.hudRed} stroke={FS.ink} strokeWidth={3} />
          <rect data-fx={`life-${side}`} x={x} y={BAR.y} width={BAR.w} height={BAR.h} fill={FS.hudYellow} />
          <rect x={x} y={BAR.y} width={BAR.w} height={BAR.h} fill="none" stroke={FS.flash} strokeWidth={2} />
          <text x={side ? x + BAR.w : x} y={BAR.y - 6} textAnchor={side ? 'end' : 'start'} fontSize={15} fill={FS.flash} stroke={FS.ink} strokeWidth={3} paintOrder="stroke" className={look.display}>
            {side ? rival : '1P'}
          </text>
          {[0, 1].map((k) => (
            <circle key={k} data-fx={side ? undefined : `orb-${k}`} cx={side ? x + 10 + k * 20 : x + BAR.w - 10 - k * 20} cy={BAR.y + BAR.h + 12} r={7} fill={FS.panel} stroke={FS.gold} strokeWidth={2} />
          ))}
        </g>
      ))}
      <rect data-fx="life-warn" x={P1_X} y={BAR.y} width={BAR.w} height={BAR.h} fill={FS.p2} opacity="0" />
      <rect x={272} y={6} width={56} height={50} rx={4} fill={FS.night} stroke={FS.gold} strokeWidth={3} />
      <text data-fx="hud-clock" x={300} y={45} textAnchor="middle" fontSize={34} fill={FS.gold} className={look.face}>
        99
      </text>
      {ladder && (
        <>
          <rect x={PLATE.x} y={PLATE.y} width={PLATE.w} height={PLATE.h} rx={6} fill={FS.night} stroke={FS.gold} strokeWidth={3} />
          {MASTERS.map((master, i) => (
            <g key={master} transform={`translate(${PIPS_X + i * PIP.step} ${PIP.y})`}>
              <rect width={PIP.size} height={PIP.size} fill={FS.panel} stroke={FS.chrome} strokeWidth={2} />
              <path data-fx={`pip-${i}`} opacity="0" d="M4 4 L20 20 M20 4 L4 20" stroke={FS.p2} strokeWidth={4} strokeLinecap="round" />
            </g>
          ))}
        </>
      )}
    </svg>
  )
}

// ---- the calls, the credits and the open 2P slot ----

export type CallId = 'round' | 'ko' | 'bonus' | 'wrecked'

/** Our own words over the fights: no line of the game's. */
const CALL_TEXT: Record<CallId, string> = {
  round: 'BOUT ONE',
  ko: 'DOWN!',
  bonus: 'SCRAP YARD',
  wrecked: 'WRECKED',
}

/** A call on its navy plate, drawn round its centre. */
function Call({ id }: { id: CallId }) {
  const text = CALL_TEXT[id]
  const width = 90 + text.length * 40
  return (
    <g data-fx={`call-${id}`} opacity="0">
      <rect x={-width / 2} y={-48} width={width} height={86} rx={8} fill={FS.navy} stroke={FS.gold} strokeWidth={5} />
      <text y={22} textAnchor="middle" fontSize={64} fill={FS.gold} stroke={FS.ink} strokeWidth={2} paintOrder="stroke" className={look.display}>
        {text}
      </text>
    </g>
  )
}

/** The calls a scene makes, over the fight on a wide screen and in the middle on a phone. */
export function Calls({ calls }: { calls: readonly CallId[] }) {
  return (
    <svg viewBox="-400 -150 800 300" className="absolute left-1/2 top-[26%] w-[min(94vw,760px)] -translate-x-1/2 lg:left-[70%]" aria-hidden="true" focusable="false">
      {calls.map((id) => (
        <Call key={id} id={id} />
      ))}
    </svg>
  )
}

// The staff lines of his ending: each of his roles, and a small frame of the thing he works with.
type Tool = 'terminal' | 'drum' | 'glove'
const TOOL_ART: Record<Tool, ReactNode> = {
  terminal: (
    <>
      <rect x={-16} y={-12} width={32} height={22} rx={2} fill={FS.night} stroke={FS.chrome} strokeWidth={2} />
      <path d="M-10 -5 L-4 0 L-10 5 M-1 5 H8" fill="none" stroke={FS.health} strokeWidth={2.4} strokeLinecap="round" />
    </>
  ),
  drum: (
    <>
      <rect x={-14} y={-6} width={28} height={16} fill={FS.p2} stroke={FS.ink} strokeWidth={2} />
      <ellipse cy={-6} rx={14} ry={4} fill={FS.gi} stroke={FS.ink} strokeWidth={2} />
      <path d="M-14 -16 L2 -8 M14 -16 L-2 -8" stroke={FS.gold} strokeWidth={2.4} strokeLinecap="round" />
    </>
  ),
  glove: (
    <>
      <path d="M-12 8 V-6 Q-12 -14 -2 -14 H6 Q14 -14 14 -4 V8 Z" fill={FS.p2} stroke={FS.ink} strokeWidth={2} />
      <rect x={-12} y={8} width={26} height={7} fill={FS.gi} stroke={FS.ink} strokeWidth={2} />
    </>
  ),
}
const TOOLS: readonly Tool[] = ['terminal', 'drum', 'glove']

export interface Staff {
  name: string
  roles: readonly string[]
}

/** His ending's credits: his roles as the staff lines, each beside a small photo frame, rising up the sky. */
export function Credits({ staff }: { staff: Staff }) {
  return (
    <svg viewBox="-300 -40 600 300" className="absolute left-1/2 top-[14%] w-[min(92vw,600px)] -translate-x-1/2 lg:left-[70%]" aria-hidden="true" focusable="false">
      <g data-fx="credits" opacity="0">
        <text y={0} textAnchor="middle" fontSize={34} fill={FS.flash} stroke={FS.ink} strokeWidth={4} paintOrder="stroke" className={look.face}>
          STAFF
        </text>
        {staff.roles.map((role, i) => (
          <g key={role} transform={`translate(0 ${50 + i * 62})`}>
            <rect x={-250} y={-26} width={52} height={48} fill={FS.panel} stroke={FS.gold} strokeWidth={3} />
            <g transform="translate(-224 -2)">{TOOL_ART[TOOLS[i % TOOLS.length]]}</g>
            <text x={-180} y={-4} fontSize={22} fill={FS.gold} stroke={FS.ink} strokeWidth={4} paintOrder="stroke" className={look.display}>
              {role.toUpperCase()}
            </text>
            <text x={-180} y={20} fontSize={20} fill={FS.flash} stroke={FS.ink} strokeWidth={4} paintOrder="stroke" className={look.display}>
              {staff.name.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

/** The 2P side lit for the visitor: a coin slot and the count clock. */
export function OpenSlot() {
  return (
    <svg viewBox="0 0 300 114" className="absolute bottom-[8%] left-1/2 w-[min(80vw,340px)] -translate-x-1/2 lg:left-auto lg:right-[4vw] lg:translate-x-0" aria-hidden="true" focusable="false">
      <g data-fx="slot" opacity="0">
        <rect x={4} y={4} width={292} height={106} rx={8} fill={FS.navy} stroke={FS.p2} strokeWidth={5} />
        <text x={150} y={40} textAnchor="middle" fontSize={18} fill={FS.p2} className={look.display}>
          2P
        </text>
        <rect x={60} y={52} width={44} height={46} rx={4} fill={FS.panel} stroke={FS.chrome} strokeWidth={3} />
        <rect x={78} y={60} width={8} height={30} rx={2} fill={FS.ink} stroke={FS.gold} strokeWidth={2} />
        <rect x={180} y={50} width={60} height={50} rx={4} fill={FS.night} stroke={FS.gold} strokeWidth={3} />
        <text data-fx="slot-clock" x={210} y={88} textAnchor="middle" fontSize={36} fill={FS.gold} className={look.face}>
          9
        </text>
      </g>
    </svg>
  )
}

/** What the screen shows at a moment of a scene. */
export interface ScreenFrame {
  /** The round clock, or the scrap yard's; none hides nothing, it holds. */
  seconds?: number
  /** Both life bars, 0 to 1. */
  life?: { hero: number; rival: number }
  /** How strongly his nearly empty bar flashes red (0 to 1). */
  warn?: number
  /** Round orbs he has won. */
  orbs?: number
  /** Masters crossed off on the HUD. */
  crossed?: number
  shown: Partial<Record<CallId, number>>
  /** The ending: the credits risen (0 to 1), the 2P slot lit (0 to 1) and its clock. */
  credits?: number
  slot?: number
  slotSeconds?: number
}

/** The writer of the HUD, the calls, the credits and the 2P slot: each call's share shown (0 to 1) slams in
 *  from a little larger; the credits rise into place. */
export function screenWriter(stage: HTMLElement, calls: readonly CallId[]) {
  const clock = fx(stage, 'hud-clock')
  const bars = [fx(stage, 'life-0'), fx(stage, 'life-1')]
  const warnBar = fx(stage, 'life-warn')
  const orbs = [fx(stage, 'orb-0'), fx(stage, 'orb-1')]
  const pips = MASTERS.map((_, i) => fx(stage, `pip-${i}`))
  const credits = fx(stage, 'credits')
  const slot = fx(stage, 'slot')
  const slotClock = fx(stage, 'slot-clock')
  const nodes = new Map(calls.map((id) => [id, fx(stage, `call-${id}`)]))
  const shown = { clock: '', slot: '' }
  const text = (node: Element | null, key: keyof typeof shown, value: string) => {
    if (!node || shown[key] === value) return
    shown[key] = value
    node.textContent = value
  }
  return (frame: ScreenFrame) => {
    if (frame.seconds !== undefined) text(clock, 'clock', String(Math.max(0, Math.ceil(frame.seconds))).padStart(2, '0'))
    const life = frame.life ?? { hero: 1, rival: 1 }
    bars[0]?.setAttribute('width', r1(BAR.w * life.hero).toString())
    bars[1]?.setAttribute('width', r1(BAR.w * life.rival).toString())
    bars[1]?.setAttribute('x', r1(P2_X + BAR.w * (1 - life.rival)).toString())
    warnBar?.setAttribute('width', r1(BAR.w * life.hero).toString())
    fadeTo(warnBar, frame.warn ?? 0)
    orbs.forEach((orb, i) => orb?.setAttribute('fill', (frame.orbs ?? 0) > i ? FS.gold : FS.panel))
    pips.forEach((pip, i) => fadeTo(pip, (frame.crossed ?? 0) > i ? 1 : 0))
    nodes.forEach((node, id) => {
      const share = frame.shown[id] ?? 0
      fadeTo(node, share)
      transformTo(node, `scale(${(1 + 0.25 * (1 - share)).toFixed(3)})`)
    })
    fadeTo(credits, ramp(frame.credits ?? 0, 0, 0.3))
    transformTo(credits, `translate(0 ${r1(120 * (1 - easeInOut(frame.credits ?? 0)))})`)
    fadeTo(slot, frame.slot ?? 0)
    if (frame.slotSeconds !== undefined) text(slotClock, 'slot', String(Math.max(0, Math.ceil(frame.slotSeconds))))
  }
}
