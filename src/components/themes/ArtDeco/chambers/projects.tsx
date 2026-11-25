import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas } from '../city'
import { Crawler } from '../cast'
import { aim, study } from '../pose'

// Projects: the camera. A gallery under a vaulted ceiling, crates stacked below. Something long limbed
// clings to the ceiling over him. He raises his plate camera to it; the flash freezes it white, and a study
// card slides out of the camera filled in; then it drops, misses him and scuttles off along the wall. The
// end frame is the study card in his hand and the ceiling empty.

// The crawler clings here (its ceiling point), drops to the floor here, and runs off to here.
const CLING = { x: 300, y: -720 }
const LAND = 360
const GONE = 760

/** The vaulted ceiling: brass ribs springing from both sides into pointed deco arches over the gallery. */
function Vault() {
  return (
    <Canvas>
      <path d="M-200 0 H1800 V160 H-200 Z" fill={C.cabinetMid} />
      {[-100, 300, 700, 1100, 1500].map((x) => (
        <g key={x}>
          <path d={`M${x - 200} 300 Q${x - 200} 160 ${x} 160 Q${x + 200} 160 ${x + 200} 300`} fill="none" stroke={C.brassMid} strokeWidth="10" />
          <path d={`M${x - 200} 300 V880 M${x + 200} 300 V880`} stroke={C.brassDark} strokeWidth="14" />
          <path d={`M${x - 140} 300 Q${x - 140} 210 ${x} 210 Q${x + 140} 210 ${x + 140} 300`} fill="none" stroke={C.brassLine} strokeWidth="5" />
        </g>
      ))}
      <path d="M-200 160 H1800" stroke={C.gold} strokeWidth="4" />
    </Canvas>
  )
}

/** Two crates stacked, lettered with a stencilled number only. */
function Crates() {
  return (
    <g>
      <rect x={0} y={-110} width={130} height={110} fill={C.cabinetTop} stroke={C.brassDark} strokeWidth="4" />
      <path d="M0 -110 L130 0 M130 -110 L0 0" stroke={C.brassLine} strokeWidth="5" />
      <rect x={30} y={-200} width={100} height={90} fill={C.cabinetTop} stroke={C.brassDark} strokeWidth="4" />
      <path d="M50 -170 H110 M50 -140 H96" stroke={C.brassDark} strokeWidth="6" />
    </g>
  )
}

export const projects = fightChamber({
  light: C.mist,
  script: [1300, 1500, 1800],
  room: { mid: () => <Vault /> },
  back: () => (
    <>
      <g transform="translate(420 0)">
        <Crates />
      </g>
      <g data-fx="clinger" transform={`translate(${CLING.x} ${CLING.y})`}>
        <Crawler name="crawler" />
      </g>
      <g data-fx="frozen" opacity="0" transform={`translate(${CLING.x} ${CLING.y})`}>
        <ellipse cx={-10} cy={70} rx={160} ry={70} fill={C.ivory} opacity="0.5" />
      </g>
    </>
  ),
  front: () => (
    <g data-fx="whiteout" opacity="0">
      <rect x={-1400} y={-1100} width={2800} height={1400} fill={C.ivory} />
    </g>
  ),
  bind: (stage, { profession }) => {
    const clinger = fx(stage, 'clinger')
    const frozen = fx(stage, 'frozen')
    const whiteout = fx(stage, 'whiteout')
    return (play) => {
      const aimed = share(play, 0)
      const flashed = share(play, 1)
      const scattered = share(play, 2)
      // the flash goes off and lights the thing frozen on the ceiling, then the light ebbs
      const flash = bell(flashed, 0, 0.3)
      fadeTo(whiteout, 0.55 * flash)
      fadeTo(frozen, ramp(flashed, 0.05, 0.15) * (1 - ramp(flashed, 0.6, 0.9)))
      // it drops, turned over in the fall so it lands crouched on the same limbs, then runs off along the wall
      const fall = ramp(scattered, 0.1, 0.4)
      const run = ramp(scattered, 0.45, 1)
      const x = lerp(CLING.x, LAND, fall) + (GONE - LAND) * run
      const y = lerp(CLING.y, 0, fall * fall)
      const turn = 1 - 2 * ramp(scattered, 0.15, 0.35)
      transformTo(clinger, `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1 ${turn.toFixed(3)})`)
      fadeTo(clinger, 1 - ramp(run, 0.8, 1))
      if (flashed === 0) return { pose: aim(profession, aimed), ahead: 0, lift: 0 }
      // the study card slides out of the camera filled in as the flash ebbs
      if (scattered === 0) return { pose: { ...aim(profession, 1), flash, card: ramp(flashed, 0.5, 0.9) }, ahead: 0, lift: 0 }
      // he flinches back from the drop, then reads the card
      const flinch = bell(scattered, 0.25, 0.55)
      return { pose: { ...study(profession, ramp(scattered, 0.3, 0.8)), card: 1, lean: -6 * flinch }, ahead: -30 * flinch, lift: 0 }
    }
  },
})
