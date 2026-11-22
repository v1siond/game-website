import { PROFESSION_ORDER } from '@/lib/cv/professions'
import { ACT_MS, entranceEndMs } from './entrance'
import { ARRIVAL, BRANCHES } from './hubMap'
import { WALK_FRAME_MS, walkBeats } from './walk'

describe('the hub entrance', () => {
  it.each(PROFESSION_ORDER)('ends by 5000 ms when he walks to the %s landmark', (profession) => {
    expect(entranceEndMs(ARRIVAL.length + BRANCHES[profession].length)).toBeLessThanOrEqual(5000)
  })

  it('keeps his act long enough to read', () => {
    expect(ACT_MS).toBeGreaterThanOrEqual(1500)
  })
})

describe('his step frames on a walk', () => {
  it('cover the whole walk, however long', () => {
    expect(walkBeats(2000) * WALK_FRAME_MS).toBeGreaterThanOrEqual(2000)
    expect(walkBeats(9100) * WALK_FRAME_MS).toBeGreaterThanOrEqual(9100)
  })
})
