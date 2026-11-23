import { rarityOf } from './loot'

const facts = { highlight: false, current: false, featured: false, impact: '' }

describe('loot rarity', () => {
  it('takes the first rule a project meets, highest first', () => {
    expect(rarityOf({ ...facts, highlight: true, current: true, featured: true })).toBe('legendary')
    expect(rarityOf({ ...facts, current: true, featured: true })).toBe('epic')
    expect(rarityOf({ ...facts, featured: true, impact: 'Thousands of policies' })).toBe('rare')
    expect(rarityOf({ ...facts, impact: 'Thousands of policies' })).toBe('uncommon')
  })

  it('is common when the project meets no rule, a blank impact included', () => {
    expect(rarityOf(facts)).toBe('common')
    expect(rarityOf({ ...facts, impact: '   ' })).toBe('common')
  })
})
