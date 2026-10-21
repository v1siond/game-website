import { compareStat, rarityOf, statsOf } from './loot'

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

describe('loot stats', () => {
  it('counts technologies, details and links in card order', () => {
    expect(statsOf({ techStack: ['Elixir', 'Vue'], details: ['a', 'b', 'c'] }, 1)).toEqual([
      { key: 'tech', value: 2 },
      { key: 'details', value: 3 },
      { key: 'links', value: 1 },
    ])
  })

  it('compares a stat against the equipped one, the diff always positive', () => {
    expect(compareStat(5, 3)).toEqual({ trend: 'up', diff: 2 })
    expect(compareStat(1, 4)).toEqual({ trend: 'down', diff: 3 })
    expect(compareStat(2, 2)).toEqual({ trend: 'same', diff: 0 })
  })
})
