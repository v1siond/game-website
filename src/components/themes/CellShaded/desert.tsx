import { createContext, useContext, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import { GRIT, Lines, Shade } from './ink'
import { CEL } from './palette'
import { CommandoSprite, SPRITE_VIEW } from './sprite'
import cel from './cel.module.css'

// The drawing kit of the wasteland behind the page, drawn like a comic book in thick ink with hatching on
// every shadow side and grit scratched over the ground (research notes, Look: dusty tan, ochre and rust under
// a washed out sky, cold at the dig and the coast, salt white on the flats, snow and steel at the vault).
// Every scene is a stack of SVG layers on one 1600 by 1000 canvas anchored to its bottom centre (xMidYMax
// slice) on a wide screen; a phone frames it from y 280 down past its foot (PHONE_VIEW), so it sees about x
// 520 to 1080 with the ground half way down the screen, and the ground and the sky's low band run on below the
// canvas to fill it. The layers: the sky of the scene's land with its sketched clouds and its pale sun or
// stars, the far ridge, the near rise, the ground he walks, and in front the scrub, the scrap at the frame's
// outer edge and the dust. He is the commando (sprite.tsx) drawn into the canvas and posed by the scene's
// writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the ground: his soles and every prop stand on it. */
export const FLOOR = 880
/** How far the ground runs on below the canvas, for a phone's taller view. */
const BELOW = 500
const VIEW = `0 0 ${W} ${H}`
const PHONE_VIEW = `0 280 ${W} 1200`

/** Whether the scene's canvas is framed for a phone; its layers are drawn inside the scene's own value. */
export const PhoneView = createContext(false)

/** His drawn height on the canvas, about a third of the view. */
export const FIGURE_H = 300
const FIGURE_W = (FIGURE_H * SPRITE_VIEW.width) / SPRITE_VIEW.height

/** What lies at the frame's outer edge: a wrecked car by a scrap fence, heaps of scrap, salt poles, ice. */
type Edge = 'wreck' | 'scrap' | 'poles' | 'ice'

/** A scene's land: its sky and the haze it fades to, its far ridge, near rise and ground with their shadow
 *  sides, its light (a pale sun or the stars) and what lies at its edge. */
export interface Land {
  sky: string
  haze: string
  ridge: string
  ridgeShade: string
  rise: string
  riseShade: string
  ground: string
  groundShade: string
  light: 'sun' | 'stars'
  edge: Edge
}

export const LANDS = {
  badlands: { sky: CEL.dustSky, haze: CEL.haze, ridge: CEL.mesa, ridgeShade: CEL.mesaShade, rise: CEL.dune, riseShade: CEL.duneShade, ground: CEL.ground, groundShade: CEL.groundShade, light: 'sun', edge: 'wreck' },
  mine: { sky: CEL.noonDust, haze: CEL.noonHaze, ridge: CEL.mesa, ridgeShade: CEL.mesaShade, rise: CEL.dune, riseShade: CEL.duneShade, ground: CEL.ground, groundShade: CEL.groundShade, light: 'sun', edge: 'wreck' },
  dig: { sky: CEL.duskSky, haze: CEL.duskHaze, ridge: CEL.duskRidge, ridgeShade: CEL.duskRidgeShade, rise: CEL.duskGround, riseShade: CEL.duskGroundShade, ground: CEL.duskGround, groundShade: CEL.duskGroundShade, light: 'sun', edge: 'scrap' },
  coast: { sky: CEL.coastSky, haze: CEL.coastHaze, ridge: CEL.coastRidge, ridgeShade: CEL.coastRidgeShade, rise: CEL.coastGround, riseShade: CEL.coastGroundShade, ground: CEL.coastGround, groundShade: CEL.coastGroundShade, light: 'sun', edge: 'scrap' },
  salt: { sky: CEL.saltSky, haze: CEL.saltHaze, ridge: CEL.saltRidge, ridgeShade: CEL.saltRidgeShade, rise: CEL.salt, riseShade: CEL.saltShade, ground: CEL.salt, groundShade: CEL.saltShade, light: 'sun', edge: 'poles' },
  vault: { sky: CEL.vaultSky, haze: CEL.vaultHaze, ridge: CEL.vaultRidge, ridgeShade: CEL.vaultRidgeShade, rise: CEL.snow, riseShade: CEL.snowShade, ground: CEL.snow, groundShade: CEL.snowShade, light: 'sun', edge: 'ice' },
  night: { sky: CEL.nightHigh, haze: CEL.nightLow, ridge: CEL.nightRidge, ridgeShade: CEL.nightHigh, rise: CEL.nightGround, riseShade: CEL.nightGroundShade, ground: CEL.nightGround, groundShade: CEL.nightGroundShade, light: 'stars', edge: 'wreck' },
} as const satisfies Record<string, Land>

/** The half of the screen a scene plays on: right of its section's cards, or left of them. */
export type Side = 'right' | 'left'

export function Canvas({ children, inked = true }: { children: ReactNode; inked?: boolean }) {
  const phone = useContext(PhoneView)
  return (
    <svg viewBox={phone ? PHONE_VIEW : VIEW} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} className={inked ? cel.inked : undefined} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const STARS = [
  [120, 90], [300, 200], [460, 60], [640, 160], [820, 80], [980, 220], [1140, 110], [1320, 60], [1480, 180], [220, 320], [760, 300], [1400, 320],
]

// Long wisps of cloud, sketched: a pale fill under a thin ink line, the underside hatched.
const CLOUDS = [
  'M120 210 Q220 170 360 190 Q470 160 560 200 Q470 222 330 220 Q220 236 120 210 Z',
  'M900 120 Q1020 84 1160 106 Q1260 90 1340 124 Q1240 142 1110 136 Q990 150 900 120 Z',
  'M640 330 Q720 306 820 318 Q900 306 960 334 Q880 350 780 346 Q700 356 640 330 Z',
]

/** The sky of the land: its colour washed into the haze on the horizon, the sketched clouds, a pale sun with
 *  its hatched side, or the stars at night. */
export function Sky({ land }: { land: Land }) {
  const id = `cel-sky-${land.sky.slice(1)}`
  return (
    <Canvas inked={false}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={land.sky} />
          <stop offset="0.62" stopColor={land.haze} />
        </linearGradient>
      </defs>
      <rect x={-200} width={W + 400} height={H + BELOW} fill={`url(#${id})`} />
      {land.light === 'sun' && (
        <g>
          <circle cx={1250} cy={200} r={70} fill={CEL.paper} opacity={0.85} stroke={CEL.ink} strokeWidth="3" />
          <path d="M1290 143 A70 70 0 0 1 1290 257 A80 80 0 0 0 1290 143 Z" fill={CEL.ink} opacity={0.25} />
        </g>
      )}
      {land.light === 'sun' &&
        CLOUDS.map((d) => (
          <g key={d}>
            <path d={d} fill={CEL.paper} opacity={0.5} stroke={CEL.ink} strokeWidth="2" strokeOpacity="0.55" />
          </g>
        ))}
      {land.light === 'stars' && STARS.map(([x, y], i) => <circle key={`${x}-${y}`} cx={x} cy={y} r={i % 3 ? 3 : 5} fill={CEL.paper} />)}
    </Canvas>
  )
}

const RIDGE = 'M-200 1000 L-200 600 L-60 560 L40 470 L180 500 L260 430 L420 520 L560 500 L640 420 L760 470 L900 440 L1000 520 L1120 460 L1240 480 L1340 400 L1480 470 L1600 450 L1800 520 L1800 1000 Z'
const RIDGE_SHADE = 'M40 470 L180 500 L120 640 L20 620 Z M640 420 L760 470 L700 620 L600 600 Z M1340 400 L1480 470 L1420 640 L1320 620 Z M1000 520 L1120 460 L1080 620 L980 610 Z'
const RIDGE_CRACKS = 'M260 430 L240 520 L270 600 M900 440 L880 520 M1240 480 L1220 560 L1250 620 M420 520 L400 600'

/** The far ridge: jagged rock, its shadow faces hatched, cracks inked down it. */
export function Ridge({ land }: { land: Land }) {
  return (
    <Canvas>
      <g className={cel.heavy}>
        <path d={RIDGE} fill={land.ridge} />
      </g>
      <Shade d={RIDGE_SHADE} fill={land.ridgeShade} />
      <Lines d={RIDGE_CRACKS} width={2.5} />
    </Canvas>
  )
}

/** The near rise rolling under the ridge, its far slope in shade. */
export function Rise({ land }: { land: Land }) {
  return (
    <Canvas>
      <g className={cel.heavy}>
        <path d="M-200 1000 L-200 760 Q100 700 400 748 Q700 800 1000 728 Q1300 680 1800 756 L1800 1000 Z" fill={land.rise} />
      </g>
      <Shade d="M1000 728 Q1300 680 1800 756 L1800 800 Q1300 730 1000 770 Z" fill={land.riseShade} />
    </Canvas>
  )
}

/** The ground he walks: its ink edge, a band of shade, the grit and the cracks and tracks across it. */
export function Ground({ land }: { land: Land }) {
  return (
    <Canvas>
      <g className={cel.heavy}>
        <rect x={-200} y={FLOOR} width={W + 400} height={H + BELOW - FLOOR} fill={land.ground} />
      </g>
      <Shade d={`M-200 ${FLOOR + 70} H${W + 200} V${H + BELOW} H-200 Z`} fill={land.groundShade} opacity={0.3} />
      <rect x={-200} y={FLOOR} width={W + 400} height={H + BELOW - FLOOR} fill={GRIT} opacity={0.5} data-bare />
      <Lines d="M-40 920 L40 902 L90 930 M520 944 L600 912 L660 938 M1160 926 L1230 906 L1300 932 M200 975 Q700 955 1400 980" width={2.5} />
    </Canvas>
  )
}

// What stands at the outer edge of the scene's half, drawn round its foot at x 0, the half's middle to its
// right (mirrored for the left half: none of it is lettered).
const EDGES: Record<Edge, ReactNode> = {
  wreck: (
    <g>
      {/* a scrap fence of odd sheets, then a wrecked car nose down in the dirt */}
      {[-150, -100, -40, 20, 80].map((x, i) => (
        <path key={x} d={`M${x} 0 L${x + 4} ${-210 - (i % 3) * 30} L${x + 58} ${-200 - (i % 2) * 40} L${x + 56} 0 Z`} fill={i % 2 ? CEL.sheet : CEL.rust} />
      ))}
      <Lines d="M-130 -120 l20 4 M-20 -150 l16 -6 M60 -90 l22 2" />
      <path d="M-120 0 L-110 -70 L-40 -110 L80 -104 L140 -60 L150 0 Z" fill={CEL.rust} />
      <Shade d="M-120 0 L-110 -70 L-60 -96 L-70 0 Z" fill={CEL.rock} cross />
      <path d="M-30 -104 L-10 -150 L70 -146 L80 -104 Z" fill={CEL.sheetShade} />
      <circle cx={-60} cy={-6} r={30} fill={CEL.ink} />
      <circle cx={100} cy={-4} r={30} fill={CEL.ink} />
    </g>
  ),
  scrap: (
    <g>
      <path d="M-180 0 L-140 -150 L-60 -220 L20 -170 L90 -260 L160 -140 L200 0 Z" fill={CEL.sheetShade} />
      <Shade d="M20 -170 L90 -260 L160 -140 L200 0 L60 0 Z" cross />
      <path d="M-120 -120 L-20 -160 M30 -60 L120 -100 M-60 -40 L40 -30" stroke={CEL.rust} strokeWidth="10" data-bare />
      <circle cx={-90} cy={-40} r={34} fill={CEL.ink} />
      <circle cx={-90} cy={-40} r={12} fill={CEL.steel} />
    </g>
  ),
  poles: (
    <g>
      {[-80, 60].map((x) => (
        <g key={x}>
          <rect x={x - 6} y={-300} width={12} height={300} fill={CEL.plankShade} />
          <rect x={x - 40} y={-290} width={80} height={10} fill={CEL.plankShade} />
        </g>
      ))}
      <Lines d="M-120 -286 Q-10 -250 100 -286" width={2} />
    </g>
  ),
  ice: (
    <g>
      <path d="M-160 0 L-120 -260 L-60 -340 L-20 -200 L40 -300 L100 -120 L140 0 Z" fill={CEL.vaultRidge} />
      <Shade d="M-60 -340 L-20 -200 L-40 0 L-120 0 L-120 -260 Z" fill={CEL.vaultRidgeShade} />
      <path d="M-140 0 Q-60 -40 20 -10 Q90 -40 150 0 Z" fill={CEL.snow} />
    </g>
  ),
}

const SCRUB = 'M0 0 L-30 -70 M0 0 L0 -90 M0 0 L34 -64 M0 0 L-50 -36 M0 0 L56 -30'

/** In front: the land's edge art at the outer edge of the scene's half (none on a phone, whose view does not
 *  reach the edges), a tuft of scrub at each corner and the dust blowing across; the writer drifts the dust. */
export function Front({ land, side, phone }: { land: Land; side: Side; phone: boolean }) {
  const edge = side === 'right' ? 'translate(1580 980) scale(0.6)' : 'translate(20 980) scale(-0.6 0.6)'
  return (
    <Canvas>
      {!phone && (
        <g transform={edge} className={cel.heavy}>
          {EDGES[land.edge]}
        </g>
      )}
      {[
        [40, 1.2],
        [1560, 1.3],
      ].map(([x, size]) => (
        <path key={x} d={SCRUB} transform={`translate(${x} 1000) scale(${size})`} fill="none" stroke={CEL.scrubShade} strokeWidth="9" strokeLinecap="round" data-bare />
      ))}
      <g data-fx="drift" opacity="0">
        {[180, 520, 900, 1260].map((x, i) => (
          <circle key={x} cx={x} cy={820 + (i % 2) * 40} r={14 + (i % 3) * 6} fill={land.rise} />
        ))}
      </g>
    </Canvas>
  )
}

/** The dust drifts this far across a scene. */
const DUST_DRIFT = 260

/** Blows the dust across the scene over its script, `played` 0 to 1 of it, in and out. */
export function dustWriter(stage: ParentNode): (played: number) => void {
  const dust = fx(stage, 'drift')
  return (played) => {
    transformTo(dust, `translate(${(played * DUST_DRIFT).toFixed(1)} 0)`)
    // a gust that blows through and is gone, so the scene's end frame holds only the scene
    fadeTo(dust, 0.5 * Math.sin(Math.PI * played))
  }
}

/** Which way he faces: 1 to the right, -1 to the left (the stop laid out the other way round). */
export type Dir = 1 | -1

const figureAt = (x: number, lift: number, dir: Dir): string =>
  `translate(${(x - (dir * FIGURE_W) / 2).toFixed(1)} ${(FLOOR - lift - FIGURE_H * (SPRITE_VIEW.soles / SPRITE_VIEW.height)).toFixed(1)})${dir === 1 ? '' : ' scale(-1 1)'}`

/** Him on the ground at `x` (his centre), in a profession's kit, facing `dir`; the scene's writer moves and
 *  poses him. */
export function Commando({ x, profession, dir }: { x: number; profession: Profession; dir: Dir }) {
  return (
    <g data-fx="commando" transform={figureAt(x, 0, dir)}>
      <CommandoSprite profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

/** Moves him to `x` on the ground, `lift` above it, facing `dir`. */
export const placeCommando = (node: Element | null, x: number, lift: number, dir: Dir): void => transformTo(node, figureAt(x, lift, dir))
