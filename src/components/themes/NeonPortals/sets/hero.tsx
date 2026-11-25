import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp } from '../../shared/stageNodes'
import { sideOn, THREE_QUARTER } from '../motion'
import { AIR, BOUNCE, land, READY, REST } from '../sidePose'
import { seeded } from '../world'
import { Fortress, FlameTrail, PortalRing, Storm } from './cast'
import { Glow, Hero, heroOf, part, placeTo, type SetPiece } from './kit'

// The hero, the fall that starts the run (Crash 3 notes, the story [1] [39], the hub [45]): night over a
// jungle coast, and on the beach the round pad of the time machine with its first portal dark. 1 the
// clockmaker's sky fortress streaks down in flames and crashes beyond the surf; the living storm it held
// rises out of the wreck and dives into the portal. 2 he looks up at the trail it burned across the sky.
// 3 he leaps onto the pad and the first portal lights. The end frame: him on the pad, the portal glowing.

const START = 300
const PAD = { x: 462, y: 392 }
const PORTAL = { x: 552, y: 262, r: 78 }
const SKY_FROM = { x: -300, y: -330 }
const CRASH = { x: 420, y: 300 }
// The fortress's heading as it falls, in degrees, for its trail.
const HEADING = (Math.atan2(CRASH.y - SKY_FROM.y, CRASH.x - SKY_FROM.x) * 180) / Math.PI

const stars = (() => {
  const rand = seeded(11)
  return Array.from({ length: 46 }, () => ({ x: -500 + rand() * 1500, y: -420 + rand() * 680, r: 1 + rand() * 2.4, o: 0.35 + rand() * 0.6 }))
})()

function Beach() {
  return (
    <>
      {stars.map((star) => (
        <circle key={`${star.x}${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="#fff" opacity={star.o} />
      ))}
      <circle cx={120} cy={-150} r={34} fill="#f4f0d8" />
      <circle cx={134} cy={-160} r={30} fill="#1a1440" />
      <path data-np="trail" d={`M${SKY_FROM.x} ${SKY_FROM.y} Q ${CRASH.x - 300} ${CRASH.y - 380} ${CRASH.x} ${CRASH.y}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} fill="none" stroke="#7a6a9a" strokeWidth={16} strokeLinecap="round" opacity={0.45} />
      {/* the sea, the surf and the beach */}
      <rect x={-1500} y={300} width={3600} height={70} fill="#122a52" />
      <path d="M-1500 300 H2100" stroke="#3d6aa8" strokeWidth={3} />
      <g data-np="flash" opacity={0}>
        <Glow r={120} x={CRASH.x} y={CRASH.y} color="#ff8a3d" />
        <circle cx={CRASH.x} cy={CRASH.y} r={26} fill="#ffe08a" />
      </g>
      <path data-np="smoke" d={`M${CRASH.x - 10} ${CRASH.y} C${CRASH.x - 30} ${CRASH.y - 60} ${CRASH.x + 20} ${CRASH.y - 90} ${CRASH.x} ${CRASH.y - 150}`} fill="none" stroke="#4a3a5a" strokeWidth={22} strokeLinecap="round" opacity={0} />
      <path d="M-1500 368 Q-600 352 0 364 T1200 362 T2100 366 V2000 H-1500 Z" fill="#4a3d63" />
      <path d="M-1500 360 Q-400 346 300 358 T2100 356" fill="none" stroke="#c6d8ff" strokeWidth={4} opacity={0.5} />
      {/* palms at the jungle's edge */}
      {[
        [40, 1],
        [170, 0.8],
      ].map(([x, s]) => (
        <g key={x} transform={`translate(${x} 380) scale(${s})`}>
          <path d="M0 0 Q10 -90 -6 -190" fill="none" stroke="#1a1030" strokeWidth={14} strokeLinecap="round" />
          <path d="M-6 -190 Q-70 -200 -110 -150 M-6 -190 Q60 -210 100 -160 M-6 -190 Q-40 -240 -90 -236 M-6 -190 Q30 -250 80 -240 M-6 -190 Q0 -150 -10 -110" fill="none" stroke="#1a1030" strokeWidth={12} strokeLinecap="round" />
        </g>
      ))}
      {/* the machine's pad and its first portal */}
      <rect x={PORTAL.x - 12} y={PORTAL.y + PORTAL.r * 1.05} width={24} height={60} fill="#2a2250" />
      <g transform={`translate(${PORTAL.x} ${PORTAL.y})`}>
        <PortalRing r={PORTAL.r} color="#5cf2ff" name="portal-light" />
      </g>
      <g data-np="gulp" opacity={0} transform={`translate(${PORTAL.x} ${PORTAL.y})`}>
        <Glow r={PORTAL.r * 1.4} color="#b88cff" />
      </g>
      <ellipse cx={PAD.x} cy={PAD.y + 4} rx={78} ry={16} fill="#1a1440" stroke="#5cf2ff" strokeWidth={4} />
      <ellipse cx={PAD.x} cy={PAD.y} rx={60} ry={10} fill="#2a2a6a" />
    </>
  )
}

export const hero: SetPiece = {
  script: [1800, 1200, 1600],
  sky: ['#0b0a2a', '#3a2160'],
  art: () => (
    <>
      <Beach />
      <g data-np="fortress">
        <g transform={`rotate(${HEADING.toFixed(1)})`}>
          <FlameTrail len={240} />
        </g>
        <Fortress />
      </g>
      <g data-np="storm" opacity={0}>
        <Storm />
      </g>
      <Hero figure />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const fortress = part(root, 'fortress')
    const storm = part(root, 'storm')
    const trail = part(root, 'trail')
    const flash = part(root, 'flash')
    const smoke = part(root, 'smoke')
    const light = part(root, 'portal-light')
    const gulp = part(root, 'gulp')
    return (u) => {
      // 1 the fall, the crash, the storm out of the wreck and into the portal
      const fall = ramp(u, 0.05, 0.6) ** 1.5
      placeTo(fortress, lerp(SKY_FROM.x, CRASH.x, fall), lerp(SKY_FROM.y, CRASH.y, fall), lerp(1, 0.3, fall))
      fadeTo(fortress, fall >= 1 ? 0 : 1)
      trail?.setAttribute('stroke-dashoffset', (1 - fall).toFixed(3))
      fadeTo(flash, bell(u, 0.56, 0.9))
      fadeTo(smoke, 0.6 * ramp(u, 0.6, 0.75))
      const rise = ramp(u, 0.62, 0.8)
      const dive = ramp(u, 0.8, 1)
      const stormX = dive > 0 ? lerp(CRASH.x + 10, PORTAL.x, dive) : CRASH.x + 10
      const stormY = dive > 0 ? lerp(120, PORTAL.y, dive) - 60 * Math.sin(Math.PI * dive) : lerp(CRASH.y, 120, rise)
      placeTo(storm, stormX, stormY, dive > 0 ? lerp(1, 0.12, dive) : lerp(0.3, 1, rise))
      fadeTo(storm, u < 0.62 || dive >= 1 ? 0 : 1)
      fadeTo(gulp, bell(u, 0.9, 1.4))
      // 3 the portal lights once he is on the pad
      fadeTo(light, lerp(0.15, 1, ramp(u, 2.6, 2.95)))

      // him: watching, flinching at the crash, then looking up at the trail, then the leap
      if (u < 2) {
        const flinch = bell(u, 0.6, 0.9)
        const look = ramp(u, 1.05, 1.5)
        const side = { ...mix(REST, { ...REST, armRight: -150, foreRight: -105 }, look), head: -24 * look, stretch: -0.08 * flinch }
        pose({ x: START + 18 * ramp(u, 1, 1.6), y: 400, move: sideOn(side, THREE_QUARTER) })
        return
      }
      const crouch = ramp(u, 2, 2.15)
      const air = ramp(u, 2.15, 2.72)
      const from = START + 18
      if (air <= 0) {
        pose({ x: from, y: 400, move: sideOn(mix(REST, BOUNCE, crouch), 1) })
        return
      }
      if (air < 1) {
        pose({ x: lerp(from, PAD.x, air), y: lerp(400, PAD.y, air) - 150 * Math.sin(Math.PI * air), move: sideOn(AIR, 1) })
        return
      }
      pose({ x: PAD.x, y: PAD.y, move: sideOn(land(ramp(u, 2.72, 3), READY), lerp(1, THREE_QUARTER, ramp(u, 2.8, 3))) })
    }
  },
}
