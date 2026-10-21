import type { Project } from '@/lib/cv/content'

// The loot rules of the projects, kept apart from the drawing so they are plain and tested.
// A project's rarity comes from facts the content already holds, the first rule it meets wins: a big
// highlight is legendary, a project still running is epic, a featured one rare, one with a stated
// impact uncommon, the rest common. Its stats are counts of real facts (technologies, details, public
// links), compared on the item card against the equipped project the way a looter's card shows a
// stat going up or down against what the player holds.

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export const RARITY_ORDER: readonly Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary']

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

export type StatKey = 'tech' | 'details' | 'links'

export interface Stat {
  key: StatKey
  value: number
}

/** The card's stats in reading order; `links` is the number of public links the card shows. */
export const statsOf = (project: Pick<Project, 'techStack' | 'details'>, links: number): Stat[] => [
  { key: 'tech', value: project.techStack.length },
  { key: 'details', value: project.details.length },
  { key: 'links', value: links },
]

export type Trend = 'up' | 'down' | 'same'

export interface Comparison {
  trend: Trend
  // How far the value sits from the equipped one, always 0 or more.
  diff: number
}

export function compareStat(value: number, equipped: number): Comparison {
  const diff = value - equipped
  if (diff > 0) return { trend: 'up', diff }
  if (diff < 0) return { trend: 'down', diff: -diff }
  return { trend: 'same', diff: 0 }
}
