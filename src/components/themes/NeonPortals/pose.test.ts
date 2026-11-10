import { CLIPS, JOINTS, REST, poseAt, type ClipName } from './pose'

const NAMES = Object.keys(CLIPS) as ClipName[]

describe('his clips', () => {
  it.each(NAMES)('%s lasts 5 seconds or less', (name) => {
    expect(CLIPS[name].seconds).toBeLessThanOrEqual(5)
  })

  it.each(NAMES)('%s starts at its first key', (name) => {
    const clip = CLIPS[name]
    const first = poseAt(clip, 0)
    expect(first.lift).toBeCloseTo(clip.keys[0].pose.lift ?? REST.lift, 6)
  })

  it('holds a one shot clip on its last key once it is over', () => {
    const clip = CLIPS.hop
    const last = clip.keys[clip.keys.length - 1].pose
    expect(poseAt(clip, clip.seconds + 3).lift).toBeCloseTo(last.lift ?? REST.lift, 6)
  })

  it('wraps a looping clip, so one turn later he is in the same pose', () => {
    const clip = CLIPS.idle
    expect(poseAt(clip, clip.seconds + 0.3)).toEqual(poseAt(clip, 0.3))
  })

  it('eases between two keys, halfway in time is halfway in pose', () => {
    const clip = CLIPS.hop
    const [a, b] = clip.keys
    const mid = poseAt(clip, ((a.at + b.at) / 2) * clip.seconds)
    expect(mid.lift).toBeCloseTo(((a.pose.lift ?? REST.lift) + (b.pose.lift ?? REST.lift)) / 2, 6)
  })

  it('fills every joint, also the ones a key leaves out', () => {
    const pose = poseAt(CLIPS.spin, 0.2)
    expect(Object.keys(pose.joints).sort()).toEqual([...JOINTS].sort())
  })

  // The walk rule: the legs step by lifting the stepping knee toward the hip, never by swinging one leg behind
  // the hip while the other goes forward, so they never pass each other.
  it.each(['run', 'swim'] as const)('%s never swings a thigh behind the hip', (name) => {
    const clip = CLIPS[name]
    for (let step = 0; step <= 40; step += 1) {
      const { joints } = poseAt(clip, (step / 40) * clip.seconds)
      expect(Math.min(joints.thighL[0], joints.thighR[0])).toBeGreaterThanOrEqual(0)
    }
  })
})
