import type { Project } from '@/lib/cv/content'

// The loot rule of the projects, kept apart from the drawing so it is plain and tested. A project's
// rarity, the colour of its chest's light and of its card's band, comes from facts the content already
// holds, the first rule it meets wins: a big highlight is legendary, a project still running is epic, a
// featured one rare, one with a stated impact uncommon, the rest common.

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

type RarityFacts = Pick<Project, 'highlight' | 'current' | 'featured' | 'impact'>

const RARITY_RULES: ReadonlyArray<readonly [Rarity, (project: RarityFacts) => boolean]> = [
  ['legendary', (project) => project.highlight],
  ['epic', (project) => project.current],
  ['rare', (project) => project.featured],
  ['uncommon', (project) => project.impact.trim() !== ''],
]

export function rarityOf(project: RarityFacts): Rarity {
  const rule = RARITY_RULES.find(([, meets]) => meets(project))
  return rule ? rule[0] : 'common'
}
