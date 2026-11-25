import { JOINTS, MOVES, RANGE, REST, plantedDrop, poseAt, resolveKeys, type Move } from './rig'

const MOVE_NAMES = Object.keys(MOVES) as Move[]

describe('his rig', () => {
  it('keeps every joint at rest inside its human range', () => {
    JOINTS.forEach((joint) => {
      const [low, high] = RANGE[joint]
      expect(REST[joint]).toBeGreaterThanOrEqual(low)
      expect(REST[joint]).toBeLessThanOrEqual(high)
    })
  })

  it.each(MOVE_NAMES)('bends the elbows only forward and the knees only back in every key of %s', (move) => {
    resolveKeys(move).forEach(({ at, pose }) => {
      JOINTS.forEach((joint) => {
        const [low, high] = RANGE[joint]
        const where = `${move} at ${at} ${joint} ${pose[joint]}`
        expect([where, pose[joint] >= low && pose[joint] <= high]).toEqual([where, true])
      })
    })
  })

  it.each(MOVE_NAMES)('runs the keys of %s in order from 0 to 1', (move) => {
    const times = resolveKeys(move).map(({ at }) => at)
    expect(times[0]).toBe(0)
    expect(times[times.length - 1]).toBe(1)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })

  it('stands on the floor at rest, and drops the hips when the knees bend', () => {
    expect(Math.abs(plantedDrop({ ...REST, thighNear: 0, shinNear: 0, thighFar: 0, shinFar: 0 }))).toBeLessThan(0.001)
    expect(plantedDrop({ ...REST, thighNear: -60, shinNear: 85, thighFar: -10, shinFar: 75 })).toBeGreaterThan(8)
  })

  it.each(MOVE_NAMES)('poses %s at its first key at 0 and its last at 1, and past the end it holds the last', (move) => {
    const keys = resolveKeys(move)
    expect(poseAt(move, 0)).toEqual(keys[0].pose)
    expect(poseAt(move, 1)).toEqual(keys[keys.length - 1].pose)
    expect(poseAt(move, 1.5)).toEqual(keys[keys.length - 1].pose)
  })

  it('has a move for every verb of the run, the storm sea to the mountain of the gods', () => {
    const run = ['walk', 'roll', 'swing', 'thrust', 'leap', 'haul', 'horn', 'climb', 'crank', 'open', 'guard', 'draw', 'wrench', 'shoulder', 'clinch', 'knee', 'tear', 'glide', 'raise']
    expect([...MOVE_NAMES].sort()).toEqual([...run].sort())
  })

  it('poses a move between two keys with every joint between their angles', () => {
    const keys = resolveKeys('swing')
    const [a, b] = [keys[1], keys[2]]
    const pose = poseAt('swing', (a.at + b.at) / 2)
    JOINTS.forEach((joint) => {
      expect(pose[joint]).toBeGreaterThanOrEqual(Math.min(a.pose[joint], b.pose[joint]))
      expect(pose[joint]).toBeLessThanOrEqual(Math.max(a.pose[joint], b.pose[joint]))
    })
    expect(pose.armNear).not.toBe(a.pose.armNear)
  })
})
