import type { ComponentType } from 'react'
import { themes } from './themes'

// Import every world's full themed layout. These are statically imported (same as the
// old page.tsx switch) so bundle size is unchanged; the World Select grid limits runtime
// cost by lazy-MOUNTING previews, not by lazy-loading the modules.
import DarkFantasyTheme from '@/components/themes/DarkFantasyTheme'
import SurvivalHorrorTheme from '@/components/themes/SurvivalHorrorTheme'
import NeonPortalsTheme from '@/components/themes/NeonPortalsTheme'
import SoulMapTheme from '@/components/themes/SoulMapTheme'
import AdventurePathsTheme from '@/components/themes/AdventurePathsTheme'
import RubberHoseTheme from '@/components/themes/RubberHoseTheme'
import RetroRPGTheme from '@/components/themes/RetroRPGTheme'
import BoldNoirTheme from '@/components/themes/BoldNoirTheme'
import FighterSelectTheme from '@/components/themes/FighterSelectTheme'
import ArtDecoTheme from '@/components/themes/ArtDecoTheme'
import RetroAtomicTheme from '@/components/themes/RetroAtomicTheme'
import NeonCyberTheme from '@/components/themes/NeonCyberTheme'
import CellShadedTheme from '@/components/themes/CellShadedTheme'
import SilhouetteTheme from '@/components/themes/SilhouetteTheme'
import MythicTheme from '@/components/themes/MythicTheme'
import TropicalPlatformerTheme from '@/components/themes/TropicalPlatformerTheme'
import MedievalFantasyTheme from '@/components/themes/MedievalFantasyTheme'

export type WorldCategory = 'Fantasy' | 'Retro' | 'Neon' | 'Action' | 'Artistic'

export interface WorldCategoryMeta {
  name: WorldCategory
  icon: string
}

// Display order of the filter chips on the World Select screen.
export const WORLD_CATEGORIES: WorldCategoryMeta[] = [
  { name: 'Fantasy', icon: '⚔️' },
  { name: 'Retro', icon: '🕹️' },
  { name: 'Neon', icon: '💫' },
  { name: 'Action', icon: '🎮' },
  { name: 'Artistic', icon: '🎨' },
]

export interface World {
  /** Matches the Theme id in themes.ts — drives `?t=<id>` and ThemeContext. */
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
  'retro-rpg': 'Retro',
  'retro-atomic': 'Retro',
  'rubber-hose': 'Retro',
  'adventure-paths': 'Retro',
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

export function getWorldsByCategory(category: WorldCategory): World[] {
  return WORLDS.filter((w) => w.category === category)
}
