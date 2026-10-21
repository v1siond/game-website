import { advancePose, hasArrived, playMove, poseOf, settleMove, START, stepEntrance, type PoseState } from '@/hooks/poseSequence'

type Pose = 'revive' | 'walk' | 'idle' | 'zap' | 'swing'

const ENTRANCE: readonly Pose[] = ['revive', 'walk']
const begin: PoseState<Pose> = START

describe('poseSequence', () => {
  it('plays the entrance in order, then holds the rest', () => {
    const once = advancePose(begin, ENTRANCE.length)
    const twice = advancePose(once, ENTRANCE.length)
    expect(poseOf(begin, ENTRANCE, 'idle')).toBe('revive')
    expect(poseOf(once, ENTRANCE, 'idle')).toBe('walk')
    expect(poseOf(twice, ENTRANCE, 'idle')).toBe('idle')
    expect(hasArrived(twice, ENTRANCE.length)).toBe(true)
    expect(advancePose(twice, ENTRANCE.length)).toBe(twice)
  })

  it('refuses a move during the entrance unless the policy is always', () => {
    expect(playMove(begin, 'zap', 'arrived', ENTRANCE.length)).toBe(begin)
    expect(playMove(begin, 'zap', 'rest', ENTRANCE.length)).toBe(begin)
    expect(poseOf(playMove(begin, 'zap', 'always', ENTRANCE.length), ENTRANCE, 'idle')).toBe('zap')
  })

  it('plays a move over the rest and goes back to it when the move ends', () => {
    const atRest: PoseState<Pose> = { step: 2, move: null, take: 0 }
    const zapping = playMove(atRest, 'zap', 'arrived', ENTRANCE.length)
    expect(poseOf(zapping, ENTRANCE, 'idle')).toBe('zap')
    expect(poseOf(advancePose(zapping, ENTRANCE.length), ENTRANCE, 'idle')).toBe('idle')
    expect(poseOf(settleMove(zapping), ENTRANCE, 'idle')).toBe('idle')
  })

  it('lets arrived replace a move but rest wait for it to end', () => {
    const zapping: PoseState<Pose> = { step: 2, move: 'zap', take: 1 }
    expect(playMove(zapping, 'swing', 'arrived', ENTRANCE.length).move).toBe('swing')
    expect(playMove(zapping, 'swing', 'rest', ENTRANCE.length)).toBe(zapping)
  })

  it('counts every taken move so a repeated move can replay', () => {
    const atRest: PoseState<Pose> = { step: 2, move: null, take: 0 }
    const first = playMove(atRest, 'zap', 'always', ENTRANCE.length)
    expect(playMove(first, 'zap', 'always', ENTRANCE.length).take).toBe(2)
  })

  it('settling never steps the entrance', () => {
    expect(settleMove(begin)).toBe(begin)
  })

  it('steps the entrance under a move without ending the move', () => {
    const zapping = playMove(begin, 'zap', 'always', ENTRANCE.length)
    const stepped = stepEntrance(zapping, ENTRANCE.length)
    expect(stepped.step).toBe(1)
    expect(poseOf(stepped, ENTRANCE, 'idle')).toBe('zap')
    expect(poseOf(settleMove(stepped), ENTRANCE, 'idle')).toBe('walk')
  })

  it('stops stepping the entrance at rest', () => {
    const atRest: PoseState<Pose> = { step: 2, move: null, take: 0 }
    expect(stepEntrance(atRest, ENTRANCE.length)).toBe(atRest)
  })
})
