import { JOINTS, MOVES, RANGE, REST, plantedDrop, resolveKeys, type Move } from './rig'
import type { Profession } from '@/lib/cv/professions'

const PROFESSIONS: Profession[] = ['engineer', 'drummer', 'fighter']
const MOVE_NAMES = Object.keys(MOVES) as Move[]

describe('his rig', () => {
  it.each(PROFESSIONS)('keeps every joint of the %s at rest inside its human range', (profession) => {
    JOINTS.forEach((joint) => {
      const [low, high] = RANGE[joint]
      expect(REST[profession][joint]).toBeGreaterThanOrEqual(low)
      expect(REST[profession][joint]).toBeLessThanOrEqual(high)
    })
  })

  it.each(MOVE_NAMES)('bends the elbows only forward and the knees only back in every key of %s, in every kit', (move) => {
    PROFESSIONS.forEach((profession) => {
      resolveKeys(move, profession).forEach(({ at, pose }) => {
        JOINTS.forEach((joint) => {
          const [low, high] = RANGE[joint]
          const where = `${move} ${profession} at ${at} ${joint} ${pose[joint]}`
          expect([where, pose[joint] >= low && pose[joint] <= high]).toEqual([where, true])
        })
      })
    })
  })

  it.each(MOVE_NAMES)('runs the keys of %s in order from 0 to 1', (move) => {
    const times = resolveKeys(move, 'engineer').map(({ at }) => at)
    expect(times[0]).toBe(0)
    expect(times[times.length - 1]).toBe(1)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })

  it('ends every loop where it starts, so the cycle has no jump', () => {
    MOVE_NAMES.filter((move) => MOVES[move].loop).forEach((move) => {
      const keys = resolveKeys(move, 'engineer')
      expect(keys[keys.length - 1].pose).toEqual(keys[0].pose)
    })
  })

  it('stands on the floor at rest, and drops the hips when the knees bend', () => {
    expect(Math.abs(plantedDrop({ ...REST.engineer, thighNear: 0, shinNear: 0, thighFar: 0, shinFar: 0 }))).toBeLessThan(0.001)
    expect(plantedDrop({ ...REST.engineer, thighNear: -60, shinNear: 85, thighFar: -10, shinFar: 75 })).toBeGreaterThan(8)
  })
})
