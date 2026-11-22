import { themes } from '@/themes/themes'

// The worlds as data: every world's id and the category the picker files it under, in themes.ts order.
// It imports no world component, so the launcher, the hint and the picker can read it on /cv and /blog
// without pulling a world into those pages. The components live in src/themes/worlds.ts, read only by
// WorldRenderer.

export type WorldCategory = 'Fantasy' | 'Retro' | 'Neon' | 'Action' | 'Artistic'

// Each chip's icon is drawn in src/components/worlds/categoryIcons.tsx.
export interface WorldCategoryMeta {
  name: WorldCategory
}

// Display order of the filter chips on the World Select screen.
export const WORLD_CATEGORIES: WorldCategoryMeta[] = [
  { name: 'Fantasy' },
  { name: 'Retro' },
  { name: 'Neon' },
  { name: 'Action' },
  { name: 'Artistic' },
]

export interface World {
  /** Matches the Theme id in themes.ts, drives `?t=<id>` and ThemeContext. */
  id: string
  category: WorldCategory
}

const CATEGORY_BY_ID: Record<string, WorldCategory> = {
  'dark-fantasy': 'Fantasy',
  'medieval-fantasy': 'Fantasy',
  'mythic': 'Fantasy',
  'soul-map': 'Fantasy',
  'adventure-paths': 'Fantasy',
  'retro-rpg': 'Retro',
  'retro-atomic': 'Retro',
  'rubber-hose': 'Retro',
  'neon-cyber': 'Neon',
  'neon-portals': 'Neon',
  'bold-noir': 'Neon',
  'fighter-select': 'Action',
  'survival-horror': 'Action',
  'cell-shaded': 'Action',
  'silhouette': 'Artistic',
  'art-deco': 'Artistic',
  'tropical-platformer': 'Artistic',
}

const categoryOf = (id: string): WorldCategory => {
  const category = CATEGORY_BY_ID[id]
  if (!category) throw new Error(`registry.ts: no category registered for theme "${id}"`)
  return category
}

// Built from `themes` so the order and membership always track themes.ts; a theme added without a
// category fails the build here.
export const WORLDS: World[] = themes.map((theme) => ({ id: theme.id, category: categoryOf(theme.id) }))

/** The one world that draws the shared profession stage (shared/professionStage.tsx); every other world
 *  draws its own, so ClientProviders loads the stage's chunk only in this one. */
export const SHARED_STAGE_WORLD_ID = 'medieval-fantasy'

/** Every world id, in themes.ts order. */
export const WORLD_IDS: string[] = WORLDS.map((world) => world.id)
