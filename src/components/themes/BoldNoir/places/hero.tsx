import { fadeTo, fx } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, type Place } from '../case'
import { Canvas, FLOOR, Sleuth, placeSleuth } from '../street'
import { Sedan } from '../sedan'
import { noirJoints, setNoirPose, settle } from '../pose'

// The hero: a street of the 1947 city at night under the City Hall tower, his car at the kerb behind him. He
// settles his fedora on and turns to the street, then the car's red roof light and its headlight come on:
// the call is in, the case starts. Two actions from the page's first paint.

// He stands right of the hero's text on a wider screen, nearer the middle on a phone.
const heroX = (phone: boolean): number => (phone ? 860 : 1220)
// The car's rear bumper, left of him.
const carX = (phone: boolean): number => heroX(phone) - 620

export const hero: Place = {
  light: NOIR.paper,
  script: [1800, 1500],
  set: ({ phone }) => (
    <Canvas>
      <g transform={`translate(${carX(phone)} ${FLOOR})`}>
        <Sedan name="car" />
      </g>
    </Canvas>
  ),
  floor: ({ profession, phone }) => <Sleuth x={heroX(phone)} profession={profession} />,
  bind: (stage, { profession, phone }) => {
    const root = fx(stage, 'detective')
    const joints = root ? noirJoints(root) : null
    const beacon = fx(stage, 'car-beacon')
    const beam = fx(stage, 'car-beam')
    placeSleuth(root, heroX(phone))
    return (play) => {
      const lit = share(play, 1)
      if (joints) setNoirPose(joints, { ...settle(profession, share(play, 0)), head: -4 * share(play, 0) })
      // the roof light comes on in two flashes and stays lit, the headlight after it
      fadeTo(beacon, Math.max(Math.sin(Math.PI * 4 * Math.min(lit, 0.5)) ** 2, lit > 0.5 ? 1 : 0))
      fadeTo(beam, lit > 0.5 ? (lit - 0.5) * 2 : 0)
    }
  },
}
