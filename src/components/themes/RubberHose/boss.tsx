import { r1 } from '../shared/stageNodes'
import { HOSE } from './palette'

// The boss of the fight: a runaway circus steam calliope on four wheels, as tall as the tent pole, drawn
// side on and facing left at him. A painted red wagon with gold scrolls, a row of brass pipes and a steam
// whistle on top, a keyboard along its front, two pie cut eyes (the era's own, no face from any game), and
// a piston arm with a valve wheel for a hand. Every part a scene moves is a data-fx group, written by the
// scene's writer (scenes.tsx): the lift on its scissor stilts for the tall form, the pipes growing, the
// side doors opening on the boiler, the pipes drooping at the knockout. The Musician's phase bolts a bass
// drum to its front in place of the piston, the Martial Artist's swaps the piston for a boxing glove on a
// spring.
//
// Local units: the origin is the ground under the wagon's middle, y up is negative; the stage places and
// scales the whole group.

const INK = HOSE.ink
const LINE = 5

/** What the boss carries in a scene: the piston arm, the bass drum or the glove on a spring. */
export type BossKit = 'piston' | 'drum' | 'glove'

/** The pipes, left to right: x and height. */
export const PIPES: ReadonlyArray<readonly [number, number]> = [
  [-40, 90],
  [-5, 120],
  [30, 150],
  [65, 130],
  [100, 105],
]

/** Where the wagon's top sits before it rises. */
export const WAGON_TOP = -260

/** The piston arm's shoulder on the wagon's front. */
export const SHOULDER: readonly [number, number] = [-150, -150]

/** The stilts stand on the axles and reach this high when the wagon is up. */
export const STILTS_FOOT = -60
export const STILTS = 110

/** The pink of the things he can slap away: the parry cue. */
export const PARRY_PINK = '#ff5fa2'

function Wheel({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} -42)`}>
      <circle r={40} fill={HOSE.gold} stroke={INK} strokeWidth={LINE} />
      {[0, 45, 90, 135].map((a) => (
        <path key={a} d="M-36 0 H36" stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
      ))}
      <circle r={9} fill={HOSE.red} stroke={INK} strokeWidth={3} />
    </g>
  )
}

function Pipe({ i, x, h }: { i: number; x: number; h: number }) {
  return (
    <g data-fx={`boss-pipe-${i}`}>
      <rect x={x - 13} y={WAGON_TOP - h} width={26} height={h} rx={6} fill={HOSE.gold} stroke={INK} strokeWidth={4} />
      <path d={`M${x - 13} ${WAGON_TOP - h + 18} h26`} stroke={INK} strokeWidth={3} />
      <rect x={x - 5} y={WAGON_TOP - h + 30} width={10} height={18} rx={5} fill={INK} />
      <g data-fx={`boss-puff-${i}`} opacity={0}>
        <circle cx={x} cy={WAGON_TOP - h - 26} r={22} fill={HOSE.highlight} stroke={INK} strokeWidth={3} />
        <circle cx={x + 16} cy={WAGON_TOP - h - 44} r={14} fill={HOSE.highlight} stroke={INK} strokeWidth={3} />
      </g>
    </g>
  )
}

function Arm({ kit }: { kit: BossKit }) {
  if (kit === 'glove')
    return (
      <g data-fx="boss-arm" transform={`translate(${SHOULDER[0]} ${SHOULDER[1]})`}>
        <path data-fx="boss-spring" d="M0 0 l-14 -16 l-14 32 l-14 -32 l-14 32 l-14 -32 l-14 32 l-14 -16" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <g data-fx="boss-glove" transform="translate(-100 0)">
          <path d="M0 -30 Q-46 -36 -50 0 Q-46 36 0 30 Q12 0 0 -30 Z" fill={PARRY_PINK} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
          <path d="M-18 -26 Q-32 -6 -18 8" fill="none" stroke={INK} strokeWidth={3} />
          <rect x={-2} y={-22} width={18} height={44} rx={6} fill={HOSE.paper} stroke={INK} strokeWidth={4} />
        </g>
      </g>
    )
  return (
    <g data-fx="boss-arm" transform={`translate(${SHOULDER[0]} ${SHOULDER[1]})`}>
      <rect x={-120} y={-11} width={124} height={22} rx={10} fill={HOSE.paperDark} stroke={INK} strokeWidth={LINE} />
      <rect x={-60} y={-16} width={30} height={32} rx={4} fill={HOSE.gold} stroke={INK} strokeWidth={4} />
      <g transform="translate(-128 0)">
        <circle r={30} fill={HOSE.highlight} stroke={INK} strokeWidth={LINE} />
        {[0, 60, 120].map((a) => (
          <path key={a} d="M-26 0 H26" stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
        ))}
        <circle r={7} fill={HOSE.red} stroke={INK} strokeWidth={3} />
      </g>
    </g>
  )
}

function Drum() {
  return (
    <g data-fx="boss-drum" transform="translate(-196 -150)">
      <ellipse rx={36} ry={78} fill={HOSE.red} stroke={INK} strokeWidth={LINE} />
      <ellipse cx={-14} rx={30} ry={70} fill={HOSE.paper} stroke={INK} strokeWidth={LINE} />
      <path data-fx="boss-split" d="M-14 -60 L-6 -30 L-20 -4 L-6 22 L-16 58" fill="none" stroke={INK} strokeWidth={4} opacity={0} />
    </g>
  )
}

function Wagon() {
  return (
    <>
      <rect x={-160} y={WAGON_TOP} width={320} height={200} rx={20} fill={HOSE.red} stroke={INK} strokeWidth={LINE} />
      {/* the boiler behind the side doors */}
      <circle data-fx="boss-heart" cx={40} cy={-160} r={54} fill={HOSE.orange} stroke={INK} strokeWidth={LINE} opacity={0} />
      <path data-fx="boss-crack" d="M20 -206 L34 -176 L18 -160 L40 -136 L30 -112" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={0} />
      <g data-fx="boss-door-l">
        <rect x={-14} y={-232} width={54} height={140} rx={6} fill={HOSE.redDark} stroke={INK} strokeWidth={4} />
        <path d="M-2 -210 q14 22 0 44 q-14 22 0 44" fill="none" stroke={HOSE.gold} strokeWidth={4} />
      </g>
      <g data-fx="boss-door-r">
        <rect x={40} y={-232} width={54} height={140} rx={6} fill={HOSE.redDark} stroke={INK} strokeWidth={4} />
        <path d="M82 -210 q-14 22 0 44 q14 22 0 44" fill="none" stroke={HOSE.gold} strokeWidth={4} />
      </g>
      {/* the gold trim and the keyboard along the front */}
      <path d={`M-160 ${WAGON_TOP + 22} H160`} stroke={HOSE.gold} strokeWidth={6} />
      <path d="M-160 -82 H160" stroke={HOSE.gold} strokeWidth={6} />
      <g data-fx="boss-keys">
        <rect x={-150} y={-118} width={120} height={26} fill={HOSE.highlight} stroke={INK} strokeWidth={4} />
        {[-136, -118, -100, -82, -64, -46].map((x) => (
          <rect key={x} x={x} y={-118} width={8} height={15} fill={INK} />
        ))}
      </g>
      {/* the pie cut eyes, and the crossed out ones of the knockout */}
      <g data-fx="boss-eyes">
        {[-120, -78].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={-196} rx={16} ry={26} fill={HOSE.highlight} stroke={INK} strokeWidth={4} />
            <ellipse cx={x - 4} cy={-192} rx={8} ry={15} fill={INK} />
            <path d={`M${x - 4} -194 l5 -8 l-6 0 Z`} fill={HOSE.highlight} />
          </g>
        ))}
        <path d="M-142 -234 L-100 -222 M-58 -222 L-96 -230" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      </g>
      <g data-fx="boss-xeyes" opacity={0}>
        {[-120, -78].map((x) => (
          <path key={x} d={`M${x - 12} -208 l24 24 M${x + 12} -208 l-24 24`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        ))}
      </g>
    </>
  )
}

/** The calliope with `kit`, its parts in their first frame. */
export function Calliope({ kit }: { kit: BossKit }) {
  return (
    <>
      <ellipse cx={0} cy={0} rx={190} ry={18} fill={INK} opacity={0.25} />
      {/* the scissor stilts of the tall form, folded flat until it rises */}
      <g data-fx="boss-stilts" transform={scaleYFrom(STILTS_FOOT, 0.001)}>
        {[-90, 90].map((x) => (
          <path key={x} d={`M${x - 40} ${STILTS_FOOT} l80 ${-STILTS} M${x + 40} ${STILTS_FOOT} l-80 ${-STILTS}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        ))}
      </g>
      {[-110, 110].map((x) => (
        <Wheel key={x} x={x} />
      ))}
      <g data-fx="boss-lift">
        <g data-fx="boss-body">
          <g data-fx="boss-pipes">
            {PIPES.map(([x, h], i) => (
              <Pipe key={x} i={i} x={x} h={h} />
            ))}
            <g data-fx="boss-whistle" transform={`translate(-110 ${WAGON_TOP})`}>
              <rect x={-14} y={-60} width={28} height={60} rx={8} fill={HOSE.paperDark} stroke={INK} strokeWidth={4} />
              <path d="M-14 -40 h28" stroke={INK} strokeWidth={3} />
            </g>
          </g>
          <Wagon />
          {kit === 'drum' ? <Drum /> : <Arm kit={kit} />}
        </g>
      </g>
    </>
  )
}

/** A group scaled `s` up or down from the line y, the rest of its transform before it. */
export const scaleYFrom = (y: number, s: number, before = ''): string => `${before} translate(0 ${r1(y)}) scale(1 ${s.toFixed(3)}) translate(0 ${r1(-y)})`.trim()

/** A group turned `deg` round the point x y. */
export const turnAbout = (deg: number, x: number, y: number): string => `rotate(${deg.toFixed(1)} ${r1(x)} ${r1(y)})`
