import type { Project } from '@/lib/cv/content'

// The world's rules, kept apart from the drawing so they are plain and tested: the rarity of a project's
// boon, the wave of three it arrives in, and the order of his strikes in the arena.

export type Rarity = 'common' | 'rare' | 'epic' | 'heroic'

type RarityFacts = Pick<Project, 'highlight' | 'impact'>

// The first rule a project meets wins: a highlight is heroic, a stated impact with a public link to see
// it is epic, a stated impact alone rare, the rest common.
const RARITY_RULES: ReadonlyArray<readonly [Rarity, (project: RarityFacts, links: number) => boolean]> = [
  ['heroic', (project) => project.highlight],
  ['epic', (project, links) => hasImpact(project) && links > 0],
  ['rare', (project) => hasImpact(project)],
]

const hasImpact = (project: RarityFacts) => project.impact.trim() !== ''

/** A project's boon rarity; `links` is the number of public links its card shows. */
export function rarityOf(project: RarityFacts, links: number): Rarity {
  const rule = RARITY_RULES.find(([, meets]) => meets(project, links))
  return rule ? rule[0] : 'common'
}

/** Boons arrive three at a time, the way a god offers three: the wave a card at this index belongs to. */
export const BOONS_PER_WAVE = 3

export const waveOf = (index: number): number => Math.floor(index / BOONS_PER_WAVE)

export type Strike = 'knee' | 'elbow' | 'kick' | 'roar'

export const STRIKES: readonly Strike[] = ['knee', 'elbow', 'kick', 'roar']

/** The strike after the one just thrown, back to the knee after the roar; null is the first press. */
export function nextStrike(last: Strike | null): Strike {
  if (last === null) return STRIKES[0]
  return STRIKES[(STRIKES.indexOf(last) + 1) % STRIKES.length]
}
