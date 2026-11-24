import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { lerp } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, still, stepPlace } from '../case'
import { Hood, hoodOf } from '../hood'
import { rest, slip, strike } from '../pose'

// Muay Thai: the brawl in the alley, the game's fist fight. A man of our own squares up to him and throws a
// wide swing; he slips under it on bent knees and comes back up in his guard; then his knee and the round
// kick out of it, and the man goes over backwards onto the cobbles. Slip, then knee and kick.

const FOE = 200
// The swing is thrown over this share of the first action, the slip under it.
const SWING = [0.25, 0.6] as const

function Alley() {
  return (
    <>
      {/* bins and a crate against the wall */}
      <rect x={380} y={-110} width={80} height={110} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="4" />
      <path d="M376 -110 H464" stroke={NOIR.ash} strokeWidth="8" />
      <rect x={-260} y={-90} width={100} height={90} fill={NOIR.coal} stroke={NOIR.smoke} strokeWidth="4" />
      <path d="M-260 -90 L-160 0 M-160 -90 L-260 0" stroke={NOIR.smoke} strokeWidth="4" />
    </>
  )
}

export const muayThai = stepPlace({
  light: NOIR.paper,
  script: [1500, 1800],
  back: () => (
    <>
      <Alley />
      <Hood name="brawler" facing={-1} />
    </>
  ),
  bind: (stage, { profession }) => {
    const brawler = hoodOf(stage, 'brawler')
    return (play) => {
      const swung = share(play, 0)
      const struck = share(play, 1)
      const swing = Math.sin(Math.PI * ramp(swung, ...SWING))
      // the knee rocks him, the kick sends him over backwards
      const rocked = Math.sin(Math.PI * ramp(struck, 0.15, 0.4))
      const over = ramp(struck, 0.5, 0.85)
      brawler({
        x: lerp(FOE + 30 * (1 - ramp(swung, 0, 0.25)), FOE + 70, over),
        lean: 14 * swing - 10 * rocked - 90 * over,
        arm: 110 * swing,
        legF: 10 * ramp(swung, 0, 0.25) * (1 - over),
        facing: -1,
      })
      if (struck === 0) return still(slip(profession, ramp(swung, SWING[0] - 0.05, SWING[1] + 0.15)))
      const blow = strike(profession, ramp(struck, 0, 0.6))
      return still(mix(blow, rest(profession), ramp(struck, 0.7, 1)))
    }
  },
})
