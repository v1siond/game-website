import type { Profession } from '@/lib/cv/professions'
import { framesOf, poseOf, type BandicootPose } from './rig'

const PROFESSIONS: Profession[] = ['engineer', 'drummer', 'fighter']
const POSE_NAMES: BandicootPose[] = ['idle', 'guard', 'run', 'spin', 'slide', 'jump', 'slam', 'dance', 'act', 'warp', 'ride', 'swim', 'angel', 'still']

// Clockwise is positive on screen and he faces right: a knee only folds back (shin at 0 or more) and an
// elbow only folds forward (forearm at 0 or less), in every frame of every pose.
describe('the bandicoot rig', () => {
  it.each(POSE_NAMES)('bends the knees back and the elbows forward in every frame of %s, in every outfit', (pose) => {
    PROFESSIONS.forEach((profession) => {
      framesOf(poseOf(pose, profession)).forEach((frame, index) => {
        const where = `${pose} ${profession} frame ${index}`
        expect([where, frame.shinNear >= 0, frame.shinFar >= 0]).toEqual([where, true, true])
        expect([where, frame.foreNear <= 0, frame.foreFar <= 0]).toEqual([where, true, true])
      })
    })
  })
})
