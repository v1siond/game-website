import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import type { Chamber } from '../chamber'
import { Canvas, Survivor, placeSurvivor } from '../city'
import { decoJoints, lift, setDecoPose } from '../pose'

// The hero: the bathysphere station's lobby at the bottom of the sea. Beyond the great window, between his
// sign and the vending machine, the bathysphere rides its rails down from the surface as the page starts
// to scroll and docks over him, its porthole lit; he waits on the lobby floor in his kit and raises the
// plasmid hand to it as it arrives.

const SPHERE = { x: 780, y: 420, r: 90 }
// The sphere starts this far up its rails and docks over this share of the hero's scroll.
const DESCENT = 560
const DOCKED_BY = 0.7
const HERO_X = 780

const sphereAt = (progress: number): string => `translate(0 ${(-DESCENT * (1 - ramp(progress, 0, DOCKED_BY))).toFixed(1)})`

/** The rails, its cable and the bathysphere on them, beyond the window. */
function Descent() {
  return (
    <Canvas>
      <path d={`M${SPHERE.x - 70} 150 V780 M${SPHERE.x + 70} 150 V780`} stroke={C.brassDark} strokeWidth="6" opacity="0.8" />
      {[260, 380, 500, 620, 740].map((y) => (
        <path key={y} d={`M${SPHERE.x - 70} ${y} H${SPHERE.x + 70}`} stroke={C.brassDark} strokeWidth="3" opacity="0.5" />
      ))}
      <g data-fx="sphere" transform={sphereAt(0)}>
        <path d={`M${SPHERE.x} -400 V${SPHERE.y - SPHERE.r}`} stroke={C.steelShade} strokeWidth="5" />
        <circle cx={SPHERE.x} cy={SPHERE.y} r={SPHERE.r} fill={C.brassMid} stroke={C.brassRimDark} strokeWidth="6" />
        <circle cx={SPHERE.x} cy={SPHERE.y} r={SPHERE.r - 18} fill="none" stroke={C.gold} strokeWidth="3" />
        <circle cx={SPHERE.x + 10} cy={SPHERE.y - 6} r={40} fill={C.goldBright} stroke={C.boltHead} strokeWidth="8" />
        <circle cx={SPHERE.x + 10} cy={SPHERE.y - 6} r={110} fill={C.goldBright} opacity="0.14" />
        {Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4).map((angle) => (
          <circle key={angle} cx={SPHERE.x + Math.cos(angle) * (SPHERE.r - 9)} cy={SPHERE.y + Math.sin(angle) * (SPHERE.r - 9)} r={5} fill={C.boltHead} />
        ))}
      </g>
    </Canvas>
  )
}

export const hero: Chamber = {
  light: C.waterGlow,
  set: () => <Descent />,
  floor: ({ profession }) => <Survivor x={HERO_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const sphere = fx(stage, 'sphere')
    const root = fx(stage, 'survivor')
    const joints = root ? decoJoints(root) : null
    placeSurvivor(root, HERO_X)
    return (progress) => {
      transformTo(sphere, sphereAt(progress))
      if (joints) setDecoPose(joints, lift(profession, 0.55 * ramp(progress, 0.35, DOCKED_BY)))
    }
  },
}
