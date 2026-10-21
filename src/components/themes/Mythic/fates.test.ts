import { nextStrike, rarityOf, waveOf } from './fates'

const facts = { highlight: false, impact: '' }

describe('boon rarity', () => {
  it('takes the first rule a project meets, highest first', () => {
    expect(rarityOf({ highlight: true, impact: 'Thousands of policies' }, 2)).toBe('heroic')
    expect(rarityOf({ ...facts, impact: 'Thousands of policies' }, 1)).toBe('epic')
    expect(rarityOf({ ...facts, impact: 'Thousands of policies' }, 0)).toBe('rare')
  })

  it('is common with no highlight and a blank impact, links or not', () => {
    expect(rarityOf(facts, 3)).toBe('common')
    expect(rarityOf({ ...facts, impact: '   ' }, 1)).toBe('common')
  })
})

describe('boon waves', () => {
  it('puts three boons in each wave', () => {
    expect([0, 1, 2, 3, 5, 6].map(waveOf)).toEqual([0, 0, 0, 1, 1, 2])
  })
})

describe('arena strikes', () => {
  it('runs knee, elbow, kick, roar and back to the knee', () => {
    expect(nextStrike(null)).toBe('knee')
    expect(nextStrike('knee')).toBe('elbow')
    expect(nextStrike('elbow')).toBe('kick')
    expect(nextStrike('kick')).toBe('roar')
    expect(nextStrike('roar')).toBe('knee')
  })
})
