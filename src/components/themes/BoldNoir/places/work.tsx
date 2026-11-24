import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, still, stepPlace } from '../case'
import { call, write } from '../pose'

// Work: a corner of the city with the police call box on its post, the line to the station. He opens its
// door and lifts the receiver to his ear while its lamp on top lights red, then hangs it up and writes the
// lead into his notebook, the pencil working down the page. The call, then the notebook.

const BOX = 120

function CallBox() {
  return (
    <>
      <rect x={BOX - 7} y={-150} width={14} height={150} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="3" />
      <rect x={BOX - 34} y={-250} width={68} height={100} rx={6} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="4" />
      <path d={`M${BOX - 30} -270 L${BOX} -290 L${BOX + 30} -270 Z`} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="3" />
      <circle cx={BOX} cy={-262} r={9} fill={NOIR.redDeep} stroke={NOIR.ink} strokeWidth="2" />
      <g data-fx="lamp" opacity="0">
        <circle cx={BOX} cy={-262} r={34} fill={NOIR.red} opacity="0.3" />
        <circle cx={BOX} cy={-262} r={9} fill={NOIR.red} />
      </g>
      {/* inside: the receiver on its hook, shown while the door is open and he has not taken it */}
      <rect x={BOX - 26} y={-242} width={52} height={84} fill={NOIR.ink} />
      <g data-fx="hook">
        <path d={`M${BOX - 6} -230 Q${BOX - 12} -200 ${BOX - 6} -172`} stroke={NOIR.fog} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      {/* the door, swung open toward him on its left hinge */}
      <g data-fx="door">
        <rect x={BOX - 30} y={-246} width={60} height={92} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="3" />
        <path d={`M${BOX - 18} -230 H${BOX + 18} M${BOX - 18} -218 H${BOX + 18} M${BOX - 18} -206 H${BOX + 18}`} stroke={NOIR.smoke} strokeWidth="3" />
      </g>
    </>
  )
}

export const work = stepPlace({
  light: NOIR.paper,
  script: [1700, 1900],
  back: () => <CallBox />,
  bind: (stage, { profession }) => {
    const door = fx(stage, 'door')
    const hook = fx(stage, 'hook')
    const lamp = fx(stage, 'lamp')
    return (play) => {
      const called = share(play, 0)
      const written = share(play, 1)
      const open = ramp(called, 0, 0.3) * (1 - ramp(written, 0.15, 0.35))
      // the door turns on its hinge: drawn narrower as it opens toward him
      transformTo(door, `translate(${BOX - 30} 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(${-(BOX - 30)} 0)`)
      fadeTo(hook, called < 0.35 || written > 0.12 ? 1 : 0)
      fadeTo(lamp, ramp(called, 0.3, 0.45) * (1 - ramp(written, 0, 0.15)))
      return still(written > 0 ? write(written) : call(profession, called))
    }
  },
})
