import { PROFESSION_ORDER } from '@/lib/cv/professions'
import { MAX_STEP, endMove, motionFor, nextSpecial, startSpecial, startWalk, type MoveState } from './moves'
import { framesFor, type FighterPose } from './poses'

const POSES: FighterPose[] = ['stance', 'walk', 'walkBack', 'hadouken', 'shoryuken', 'tatsumaki', 'win', 'act']
const REST: MoveState = { playing: null, last: null, step: 0 }

describe('fighter moves', () => {
  it('gives every pose four frames and a key frame inside them', () => {
    for (const profession of PROFESSION_ORDER) {
      for (const pose of POSES) {
        expect(framesFor(pose, profession)).toHaveLength(4)
        expect(motionFor(pose, profession).key).toBeLessThan(4)
      }
    }
  })

  it('throws the specials in turn and ignores a throw while one plays', () => {
    const first = startSpecial(REST)
    expect(first.playing).toBe('hadouken')
    expect(startSpecial(first)).toBe(first)
    expect(startSpecial(endMove(first)).playing).toBe('shoryuken')
    expect(nextSpecial('tatsumaki')).toBe('hadouken')
  })

  it('walks a step at a time and stops at the edge of his ground', () => {
    const edge = { ...REST, step: MAX_STEP }
    expect(startWalk(REST, 1)).toEqual({ ...REST, playing: 'walk', step: 1 })
    expect(startWalk(REST, -1).playing).toBe('walkBack')
    expect(startWalk(edge, 1)).toBe(edge)
  })
})
