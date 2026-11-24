import { memo } from 'react'
import { DARK_FANTASY as P } from './palette'

// The pieces of the caverns his scenes use besides the foes (foes.tsx), in the same hand drawn ink: the spike
// pit he bounces across, the stone wall he clings to with the ledge on top, the cartographer's lectern with
// his quill and the map, his masks and soul vessel, the station bell and the great beetle that carries
// travellers between stations. Each is drawn round its own origin, the foot of the thing at y 0 unless its
// doc says otherwise, so a scene places it with one translate. What a scene moves inside one is a
// `data-fx` group.

const LINE = P.black

/** The spike pit, `width` wide: a dark drop under a row of pale spikes, their tips SPIKE_TIP above the floor. */
export const SPIKE_TIP = 54

export function SpikePit({ width }: { width: number }) {
  const count = Math.floor(width / 36)
  const step = width / count
  return (
    <g>
      <rect x={-12} y={-4} width={width + 24} height={120} fill={P.void} />
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M${r(i * step + 2)} 0 L${r(i * step + step / 2)} ${-SPIKE_TIP + (i % 2) * 10} L${r(i * step + step - 2)} 0 Z`}
          fill={P.bone}
          stroke={LINE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}
      <path d={`M-20 -4 L0 -4 L6 30 L-20 40 Z M${width + 20} -4 L${width} -4 L${width - 6} 30 L${width + 20} 40 Z`} fill={P.stoneDark} stroke={LINE} strokeWidth={3} />
    </g>
  )
}

const r = (n: number): number => Math.round(n * 10) / 10

/** A pit with no spikes, `width` wide: the drop he dashes over. */
export function Gap({ width }: { width: number }) {
  return (
    <g>
      <rect x={0} y={-4} width={width} height={120} fill={P.void} />
      <path d={`M-16 -4 L0 -4 L8 26 L-16 36 Z M${width + 16} -4 L${width} -4 L${width - 8} 26 L${width + 16} 36 Z`} fill={P.stoneDark} stroke={LINE} strokeWidth={3} />
    </g>
  )
}

/** The stone wall he clings to, `height` tall and WALL_W wide, standing on the floor with a ledge on top. */
const WALL_W = 120

export function Wall({ height }: { height: number }) {
  return (
    <g>
      <path d={`M0 0 L0 ${-height} L${WALL_W} ${-height} L${WALL_W} 0 Z`} fill={P.shellDark} stroke={LINE} strokeWidth={4} />
      {[0.2, 0.42, 0.66, 0.86].map((at) => (
        <path key={at} d={`M8 ${r(-height * at)} Q${WALL_W / 2} ${r(-height * at - 10)} ${WALL_W - 8} ${r(-height * at + 4)}`} fill="none" stroke={P.rim} strokeWidth={4} />
      ))}
      <path d={`M-30 ${-height} L${WALL_W + 20} ${-height} L${WALL_W + 10} ${-height + 22} L-20 ${-height + 22} Z`} fill={P.stoneGrey} stroke={LINE} strokeWidth={4} />
    </g>
  )
}

/** The cartographer's lectern, about 190 tall: the slanted desk on its post, the ink pot and its quill, and
 *  the rolled map on the desk ([data-fx="rolled"]) a scene takes away. */
export function Lectern() {
  return (
    <g>
      <ellipse cx={0} cy={-2} rx={60} ry={7} fill={P.black} opacity={0.35} />
      <path d="M-40 0 L40 0 L22 -16 L-22 -16 Z" fill={P.stoneDark} stroke={LINE} strokeWidth={3} />
      <rect x={-9} y={-150} width={18} height={136} fill={P.shellMid} stroke={LINE} strokeWidth={3} />
      <path d="M-70 -150 L70 -176 L74 -160 L-66 -134 Z" fill={P.shell} stroke={LINE} strokeWidth={3} />
      <ellipse cx={52} cy={-180} rx={12} ry={8} fill={P.voidDeep} stroke={LINE} strokeWidth={3} />
      <path d="M52 -184 C60 -214 78 -236 96 -246 C86 -226 70 -206 56 -184 Z" fill={P.bone} stroke={LINE} strokeWidth={2.5} />
      <path d="M54 -190 L84 -236" stroke={LINE} strokeWidth={1.5} />
      <g data-fx="rolled">
        <rect x={-50} y={-178} width={70} height={18} rx={9} transform="rotate(-10 -15 -169)" fill={P.bone} stroke={LINE} strokeWidth={3} />
      </g>
    </g>
  )
}

/** The map open, MAP_W by MAP_H round its middle: the paper and the caverns drawn on it in ink
 *  ([data-fx="ink"], drawn on by its stroke-dashoffset from MAP_INK to 0). */
export const MAP_W = 260
export const MAP_H = 170
export const MAP_INK = 900

const MAP_ROOMS = 'M-100 -40 L-60 -40 L-60 -10 L-20 -10 L-20 -50 L30 -50 L30 -20 L80 -20 L80 30 L40 30 L40 50 M-60 -10 L-60 40 L-10 40 L-10 10 L30 10 L30 -20 M-100 -40 L-100 20 L-80 20'

export function MapSheet() {
  return (
    <g>
      <path d={`M${-MAP_W / 2} ${-MAP_H / 2} L${MAP_W / 2} ${-MAP_H / 2 + 6} L${MAP_W / 2 - 4} ${MAP_H / 2} L${-MAP_W / 2 + 6} ${MAP_H / 2 - 4} Z`} fill={P.bone} stroke={LINE} strokeWidth={3} />
      <path data-fx="ink" d={MAP_ROOMS} fill="none" stroke={P.voidDeep} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={MAP_INK} strokeDashoffset={MAP_INK} />
      <circle data-fx="pin" cx={-34} cy={22} r={7} fill={P.infected} stroke={LINE} strokeWidth={2} opacity="0" />
    </g>
  )
}

/** One of his masks, about 44 tall: lit pale, or an empty dark outline. */
function Mask({ lit }: { lit: boolean }) {
  return (
    <g>
      <path d="M-14 -40 C-18 -46 -18 -52 -16 -58 C-12 -54 -10 -48 -8 -42 Z M14 -40 C18 -46 18 -52 16 -58 C12 -54 10 -48 8 -42 Z" fill={lit ? P.white : P.voidDeep} stroke={LINE} strokeWidth={2.5} />
      <ellipse cx={0} cy={-20} rx={15} ry={20} fill={lit ? P.white : P.voidDeep} stroke={lit ? LINE : P.silver} strokeWidth={2.5} />
      <ellipse cx={-6} cy={-20} rx={3.5} ry={6} fill={P.black} />
      <ellipse cx={6} cy={-20} rx={3.5} ry={6} fill={P.black} />
    </g>
  )
}

/** His masks and soul vessel as the game's corner shows them, drawn by him in the hall: the vessel on the
 *  left, its soul ([data-fx="soul"]) scaled up from the vessel's bottom as it fills, then `count` masks, the
 *  last one empty under its lit copy ([data-fx="mended"]) a Focus brings back. */
export function MasksAndVessel({ count }: { count: number }) {
  return (
    <g>
      <circle cx={0} cy={-34} r={38} fill={P.voidDeep} stroke={P.silver} strokeWidth={4} />
      <g data-fx="soul" transform="translate(0 -1) scale(0) translate(0 1)">
        <circle cx={0} cy={-34} r={33} fill={P.white} />
      </g>
      <circle cx={0} cy={-34} r={38} fill="none" stroke={LINE} strokeWidth={2} />
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${66 + i * 40} 0)`}>
          <Mask lit={i < count - 1} />
          {i === count - 1 && (
            <g data-fx="mended" opacity="0">
              <Mask lit />
            </g>
          )}
        </g>
      ))}
    </g>
  )
}

/** The station bell, about 230 tall, on its iron post; the bell ([data-fx="station-bell"]) swings at its hook
 *  (0, -200). */
export function StationBell() {
  return (
    <g>
      <ellipse cx={0} cy={-3} rx={40} ry={6} fill={P.black} opacity={0.35} />
      <path d="M-6 0 L-6 -210 L44 -210 L44 -198 L6 -198 L6 0 Z" fill={P.shellMid} stroke={LINE} strokeWidth={3} />
      <g data-fx="station-bell" transform="rotate(0 30 -198)">
        <line x1={30} y1={-198} x2={30} y2={-186} stroke={LINE} strokeWidth={3} />
        <path d="M10 -130 C10 -160 16 -186 30 -186 C44 -186 50 -160 50 -130 L56 -122 L4 -122 Z" fill={P.brass} stroke={LINE} strokeWidth={3} />
        <circle cx={30} cy={-118} r={5} fill={P.copper} stroke={LINE} strokeWidth={2} />
      </g>
    </g>
  )
}

/** The great beetle, about 420 wide and 300 tall, facing left toward him: a domed shell with a cushioned seat
 *  on its back, a horned head, six legs (`data-fx="beetle-legs-a"` and `-b"` step in turn). */
export const Beetle = memo(function Beetle() {
  const legs = (set: number[], name: string) => (
    <g data-fx={name}>
      {set.map((x) => (
        <path key={x} d={`M${x} -90 L${x - 22} -40 L${x - 10} 0`} fill="none" stroke={LINE} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </g>
  )
  return (
    <g>
      <ellipse cx={20} cy={-4} rx={220} ry={14} fill={P.black} opacity={0.4} />
      {legs([-80, 40, 150], 'beetle-legs-a')}
      {legs([-30, 90, 200], 'beetle-legs-b')}
      <path d="M-150 -80 C-150 -250 210 -270 230 -100 C236 -70 200 -60 160 -60 L-120 -60 C-144 -60 -152 -66 -150 -80 Z" fill={P.shell} stroke={LINE} strokeWidth={5} />
      <path d="M-90 -200 C-20 -240 100 -240 170 -180" fill="none" stroke={P.shellMid} strokeWidth={10} opacity={0.9} />
      <path d="M40 -238 L40 -80" stroke={P.shellDark} strokeWidth={5} />
      <path d="M-40 -232 C-20 -262 40 -262 70 -236 L70 -222 L-40 -222 Z" fill={P.infectedDark} stroke={LINE} strokeWidth={4} />
      <ellipse cx={-178} cy={-110} rx={56} ry={50} fill={P.bugMask} stroke={LINE} strokeWidth={5} />
      <path d="M-200 -150 C-236 -200 -250 -240 -230 -276 C-218 -240 -200 -206 -180 -158 Z" fill={P.bone} stroke={LINE} strokeWidth={4} />
      <path d="M-160 -156 C-150 -210 -130 -240 -100 -262 C-108 -226 -126 -196 -144 -152 Z" fill={P.bone} stroke={LINE} strokeWidth={4} />
      <ellipse cx={-196} cy={-110} rx={9} ry={13} fill={P.black} />
      <ellipse cx={-168} cy={-112} rx={8} ry={12} fill={P.black} />
    </g>
  )
})

/** The light that rises over the bench as he rests, about 300 tall over its foot. */
export function BenchLight() {
  return (
    <g>
      <path d="M-120 0 L-50 -330 L50 -330 L120 0 Z" fill={P.spiritGold} opacity={0.18} />
      <ellipse cx={0} cy={-8} rx={130} ry={20} fill={P.spiritGold} opacity={0.35} />
    </g>
  )
}
