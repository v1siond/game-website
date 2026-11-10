import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { themes } from './themes'

// The default world (Adventure Paths, DEFAULT_THEME_ID) is imported statically: the server renders it
// into the home page HTML and it ships in the first load. Every other world is its own chunk, fetched
// only when a visitor enters it (a returning visitor's stored world, or a pick in the worlds modal).
// Each import() is written out with a literal path so the bundler splits each world on its own.
import AdventurePathsTheme from '@/components/themes/AdventurePathsTheme'

const DarkFantasyTheme = dynamic(() => import('@/components/themes/DarkFantasyTheme'))
const SurvivalHorrorTheme = dynamic(() => import('@/components/themes/SurvivalHorrorTheme'))
const NeonPortalsTheme = dynamic(() => import('@/components/themes/NeonPortalsTheme'))
const SoulMapTheme = dynamic(() => import('@/components/themes/SoulMapTheme'))
const RubberHoseTheme = dynamic(() => import('@/components/themes/RubberHoseTheme'))
const RetroRPGTheme = dynamic(() => import('@/components/themes/RetroRPGTheme'))
const BoldNoirTheme = dynamic(() => import('@/components/themes/BoldNoirTheme'))
const FighterSelectTheme = dynamic(() => import('@/components/themes/FighterSelectTheme'))
const ArtDecoTheme = dynamic(() => import('@/components/themes/ArtDecoTheme'))
const RetroAtomicTheme = dynamic(() => import('@/components/themes/RetroAtomicTheme'))
const NeonCyberTheme = dynamic(() => import('@/components/themes/NeonCyberTheme'))
const CellShadedTheme = dynamic(() => import('@/components/themes/CellShadedTheme'))
const SilhouetteTheme = dynamic(() => import('@/components/themes/SilhouetteTheme'))
const MythicTheme = dynamic(() => import('@/components/themes/MythicTheme'))
const TropicalPlatformerTheme = dynamic(() => import('@/components/themes/TropicalPlatformerTheme'))
const MedievalFantasyTheme = dynamic(() => import('@/components/themes/MedievalFantasyTheme'))

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
  /** The full themed layout rendered when you enter the world. */
  component: ComponentType
  category: WorldCategory
}

// id -> full themed layout
const COMPONENT_BY_ID: Record<string, ComponentType> = {
  'dark-fantasy': DarkFantasyTheme,
  'survival-horror': SurvivalHorrorTheme,
  'neon-portals': NeonPortalsTheme,
  'soul-map': SoulMapTheme,
  'adventure-paths': AdventurePathsTheme,
  'rubber-hose': RubberHoseTheme,
  'retro-rpg': RetroRPGTheme,
  'bold-noir': BoldNoirTheme,
  'fighter-select': FighterSelectTheme,
  'art-deco': ArtDecoTheme,
  'retro-atomic': RetroAtomicTheme,
  'neon-cyber': NeonCyberTheme,
  'cell-shaded': CellShadedTheme,
  'silhouette': SilhouetteTheme,
  'mythic': MythicTheme,
  'tropical-platformer': TropicalPlatformerTheme,
  'medieval-fantasy': MedievalFantasyTheme,
}

// id -> category bucket (mirrors the groupings the ThemeSwitcher used)
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

// Built from `themes` so the registry order and membership always track themes.ts.
// If a theme is added without a component/category here, the build fails loudly below.
export const WORLDS: World[] = themes.map((theme) => {
  const component = COMPONENT_BY_ID[theme.id]
  const category = CATEGORY_BY_ID[theme.id]
  if (!component) {
    throw new Error(`worlds.ts: no component registered for theme "${theme.id}"`)
  }
  if (!category) {
    throw new Error(`worlds.ts: no category registered for theme "${theme.id}"`)
  }
  return { id: theme.id, component, category }
})

export function getWorldComponent(id: string): ComponentType | undefined {
  return COMPONENT_BY_ID[id]
}
