import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, transformTo } from '../../shared/stageNodes'
import { fromBehind, fromFront, GUARD, IDLE, mixPose, runPose, tucked, YAW, type Move } from '../motion'
import { READY } from '../sidePose'
import { INK } from './cast'
import { along, Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, Puffs, puffsTo, shoulder, type HeroAt, type SetPiece } from './kit'

// Work, the chase (research notes, the prehistoric levels where a giant beast chases him over lava and
// fallen trees [11] [18]; the series' signature run reversed, at the viewer [35]): a swamp under a smoking
// volcano, giant ferns, a pool of lava across the near ground. 1 turn: he runs into the screen, the ground
// shakes, a horned beast the size of a house bursts out of the ferns ahead, and he skids and turns round
// (his back, his side, his front). 2 flee: he runs straight at the camera, his face to us, the beast filling
// the frame behind him. 3 leap: he double jumps the lava toward us and the beast stops at its edge. The end
// frame: him safe on the near bank facing us, the beast snorting across the lava.

const ROAD = { vx: 330, vy: 196, near: 455 }
const LAVA = { far: 95, near: 22 }
// His lane, and the beast's: a little apart, so both stand whole.
const HIS_X = 90
const BEAST_X = -110

/** His depth into the screen at `u`: in, back out at the camera, over the lava. */
function heroZ(u: number): number {
  if (u < 1) return lerp(200, 330, ramp(u, 0, 0.5))
  if (u < 2) return lerp(330, 112, ramp(u, 1, 2))
  if (u < 2.36) return lerp(112, 45, ramp(u, 2, 2.36))
  return lerp(45, -34, ramp(u, 2.36, 2.72))
}

/** The beast's depth: out of the ferns, after him, stopped at the lava's far edge. */
const beastZ = (u: number): number => (u < 1 ? lerp(900, 700, ramp(u, 0.45, 0.75)) : lerp(700, 150, ramp(u, 1, 2.45)))

/** His move at `u`, the stride at `phase`: his back running in, the skid, the turn round toward the beast's
 *  side, his front running out at us, the double jump and the landing. */
function moveAt(u: number, phase: number): Move {
  if (u < 0.5) return fromBehind(runPose(phase))
  if (u < 0.75) return fromBehind({ ...mixPose(runPose(phase), IDLE, ramp(u, 0.5, 0.6)), lean: -10 * bell(u, 0.5, 0.75) })
  if (u < 1) {
    const turn = ramp(u, 0.75, 0.98)
    return { pose: mixPose(IDLE, GUARD, turn), side: READY, yaw: lerp(YAW.back, -YAW.front, turn) }
  }
  if (u < 2) return fromFront(runPose(phase))
  if (u < 2.72) return fromFront(tucked(0))
  return fromFront(mixPose(tucked(0), GUARD, ramp(u, 2.72, 2.9)))
}

/** His height over a hop of the double jump. */
const hopHeight = (u: number): number => 80 * bell(u, 2, 2.36) + 110 * bell(u, 2.36, 2.72)

function Beast() {
  return (
    <g>
      <path d="M-180 -120 Q-170 -250 0 -262 Q170 -250 180 -120 Q160 -40 0 -36 Q-160 -40 -180 -120 Z" fill="#5a3a24" stroke={INK} strokeWidth={5} />
      <path d="M-160 -170 l18 -14 l10 18 l16 -16 l8 18 l18 -12 M60 -230 l16 -10 l8 16 l16 -12 l6 16 l18 -8" fill="none" stroke="#7a5236" strokeWidth={6} strokeLinecap="round" />
      <g data-np="beast-legs">
        <rect x={-120} y={-80} width={56} height={80} rx={14} fill="#4a2e1a" stroke={INK} strokeWidth={5} />
        <rect x={64} y={-80} width={56} height={80} rx={14} fill="#4a2e1a" stroke={INK} strokeWidth={5} />
        <path d="M-124 -6 h64 M60 -6 h64" stroke="#e8dcc0" strokeWidth={10} strokeLinecap="round" />
      </g>
      <path d="M-58 -186 C-120 -200 -168 -250 -150 -320 C-128 -268 -96 -236 -46 -222 Z M58 -186 C120 -200 168 -250 150 -320 C128 -268 96 -236 46 -222 Z" fill="#efe2c2" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-84 -210 Q-86 -96 0 -70 Q86 -96 84 -210 Q60 -240 0 -240 Q-60 -240 -84 -210 Z" fill="#7a4a2c" stroke={INK} strokeWidth={5} />
      <path d="M0 -236 L-10 -290 L10 -290 Z" fill="#efe2c2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-58 -196 L-24 -178 M58 -196 L24 -178" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={-40} cy={-170} rx={13} ry={9} fill="#ff3a2a" />
      <ellipse cx={40} cy={-170} rx={13} ry={9} fill="#ff3a2a" />
      <ellipse cx={-40} cy={-170} rx={5} ry={5} fill="#fff2b0" />
      <ellipse cx={40} cy={-170} rx={5} ry={5} fill="#fff2b0" />
      <path d="M-50 -126 Q0 -98 50 -126 Q40 -84 0 -80 Q-40 -84 -50 -126 Z" fill="#3a1410" stroke={INK} strokeWidth={4} />
      <path d="M-40 -120 L-46 -92 L-30 -112 M40 -120 L46 -92 L30 -112" fill="#efe2c2" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={-18} cy={-140} rx={8} ry={6} fill={INK} />
      <ellipse cx={18} cy={-140} rx={8} ry={6} fill={INK} />
    </g>
  )
}

function Fern({ flip = false }: { flip?: boolean }) {
  const fronds = [-60, -35, -12, 12, 35, 60]
  return (
    <g transform={flip ? 'scale(-1 1)' : undefined}>
      {fronds.map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 0 Q-20 -120 0 -240 Q20 -120 0 0 Z" fill="#2f6a3a" stroke="#1c4426" strokeWidth={3} />
          <path d="M0 -20 V-230" stroke="#1c4426" strokeWidth={3} />
        </g>
      ))}
    </g>
  )
}

function Swamp() {
  const lavaFar = along(LAVA.far, 0, ROAD)
  const lavaNear = along(LAVA.near, 0, ROAD)
  return (
    <>
      <path d="M140 196 L250 60 Q270 44 290 60 L400 196 Z" fill="#4a2e3a" />
      <path d="M252 60 Q270 30 288 60 Z" fill="#ff7a2a" />
      <path data-np="plume" d="M270 46 C240 0 300 -40 260 -110 C240 -150 300 -190 280 -240" fill="none" stroke="#6a5a6a" strokeWidth={34} strokeLinecap="round" opacity={0.6} />
      <path d="M-1500 196 H2100 V2000 H-1500 Z" fill="#5a6a3a" />
      <path d="M-1500 196 Q-200 176 330 196 T2100 192 V230 H-1500 Z" fill="#3e5a2e" />
      <path d={`M${ROAD.vx - 20} ${ROAD.vy} L${ROAD.vx + 20} ${ROAD.vy} L1000 2000 L-340 2000 Z`} fill="#7a6a4a" />
      {/* a fallen trunk far off */}
      <path d="M100 236 L250 222" stroke="#4a3020" strokeWidth={14} strokeLinecap="round" />
      <g data-np="ferns-l" transform="translate(150 240) scale(0.7)">
        <Fern />
      </g>
      <g data-np="ferns-r" transform="translate(470 240) scale(0.8)">
        <Fern flip />
      </g>
      <g transform="translate(-60 420) scale(1.3)">
        <Fern />
      </g>
      <g transform="translate(720 430) scale(1.4)">
        <Fern flip />
      </g>
      {/* the lava across the near ground */}
      <path d={`M-1500 ${lavaFar.y} Q330 ${lavaFar.y - 8} 2100 ${lavaFar.y} V${lavaNear.y} Q330 ${lavaNear.y + 10} -1500 ${lavaNear.y} Z`} fill="#ff5a1a" />
      <path d={`M-1500 ${lavaFar.y + 8} Q330 ${lavaFar.y} 2100 ${lavaFar.y + 8}`} fill="none" stroke="#ffd34d" strokeWidth={6} />
      <g data-np="lava-glow">
        <Glow r={160} x={330} y={(lavaFar.y + lavaNear.y) / 2} color="#ff8a3d" />
      </g>
      <path d={`M-1500 ${lavaNear.y} Q330 ${lavaNear.y + 10} 2100 ${lavaNear.y} V2000 H-1500 Z`} fill="#6a5a3a" />
    </>
  )
}

export const work: SetPiece = {
  script: [1300, 2000, 1500],
  focus: ROAD.vx,
  sky: ['#f08a4a', '#f4d48a'],
  art: () => (
    <>
      <g data-np="quake">
        <Swamp />
      </g>
      <g data-np="beast">
        <Beast />
        <Puffs name="snort" color="#e8e0d0" n={4} />
      </g>
      <Hero />
      <Guardian />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const quake = part(root, 'quake')
    const beast = part(root, 'beast')
    const legs = part(root, 'beast-legs')
    const fernL = part(root, 'ferns-l')
    const fernR = part(root, 'ferns-r')
    return (u) => {
      // the ground shakes from the beast's steps until he is over the lava
      const shake = ramp(u, 0.35, 0.5) * (1 - ramp(u, 2.4, 2.6))
      transformTo(quake, `translate(${(4 * shake * Math.sin(u * 90)).toFixed(1)} ${(3 * shake * Math.cos(u * 70)).toFixed(1)})`)
      // the ferns part as he bursts out of them
      const burst = ramp(u, 0.45, 0.65)
      transformTo(fernL, `translate(${150 - 40 * burst} 240) rotate(${-25 * burst}) scale(0.7)`)
      transformTo(fernR, `translate(${470 + 40 * burst} 240) rotate(${25 * burst}) scale(0.8)`)

      const bz = beastZ(u)
      const b = along(bz, BEAST_X, ROAD)
      const gallop = u < 2.45 ? Math.abs(Math.sin(u * 14)) * 10 : 0
      placeTo(beast, b.x, b.y - gallop * b.s, b.s * 0.95)
      fadeTo(beast, ramp(u, 0.45, 0.6))
      transformTo(legs, `translate(0 ${(-gallop).toFixed(1)})`)
      // at the lava's edge he snorts, twice
      const snort = Math.max(ramp(u, 2.5, 2.75), ramp(u, 2.75, 3))
      puffsTo(root, 'snort', 0, -110, u < 2.5 ? 0 : snort, 70, 4)

      const z = heroZ(u)
      const h = along(z, HIS_X, ROAD)
      const phase = u < 1 ? u * 12 : u * 16
      const at: HeroAt = { x: h.x, y: h.y - hopHeight(u) * h.s, s: h.s * 1.05, move: moveAt(u, phase) }
      pose(at)
      const [gx, gy] = shoulder(at.x, at.y, at.s, u < 1 ? 1 : -1)
      guard(gx, gy, u)
    }
  },
}
