import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { WORLD_IDS } from '@/lib/worlds/registry'

// Every world's full themed layout, read only by WorldRenderer; ids and categories are in
// src/lib/worlds/registry.ts, which pages that only list the worlds import instead.
// The default world (Era Postcards, DEFAULT_THEME_ID) is imported statically: the server renders it
// into the home page HTML and it ships in the first load. Every other world is its own chunk, fetched
// only when a visitor enters it (a returning visitor's stored world, or a pick in the worlds modal).
// Each import() is written out with a literal path so the bundler splits each world on its own.
import EraPostcardsTheme from '@/components/themes/EraPostcardsTheme'

const DarkFantasyTheme = dynamic(() => import('@/components/themes/DarkFantasyTheme'))
const SurvivalHorrorTheme = dynamic(() => import('@/components/themes/SurvivalHorrorTheme'))
const NeonPortalsTheme = dynamic(() => import('@/components/themes/NeonPortalsTheme'))
const SoulMapTheme = dynamic(() => import('@/components/themes/SoulMapTheme'))
const AdventurePathsTheme = dynamic(() => import('@/components/themes/AdventurePathsTheme'))
const RubberHoseTheme = dynamic(() => import('@/components/themes/RubberHoseTheme'))
const RetroRPGTheme = dynamic(() => import('@/components/themes/RetroRPGTheme'))
const BoldNoirTheme = dynamic(() => import('@/components/themes/BoldNoirTheme'))
const FighterSelectTheme = dynamic(() => import('@/components/themes/FighterSelectTheme'))
const ArtDecoTheme = dynamic(() => import('@/components/themes/ArtDecoTheme'))
const RetroAtomicTheme = dynamic(() => import('@/components/themes/RetroAtomicTheme'))
const NeonCyberTheme = dynamic(() => import('@/components/themes/NeonCyberTheme'))
const CellShadedTheme = dynamic(() => import('@/components/themes/CellShadedTheme'))
const SilhouetteTheme = dynamic(() => import('@/components/themes/SilhouetteTheme'))
const TropicalPlatformerTheme = dynamic(() => import('@/components/themes/TropicalPlatformerTheme'))
// Medieval Fantasy is the one world under the shared profession stage (ClientProviders), so its chunk
// arrives with the stage's and the stage never shows a beat after the world.
const MedievalFantasyTheme = dynamic(() =>
  Promise.all([import('@/components/themes/MedievalFantasyTheme'), import('@/components/themes/shared/professionStage')]).then(([world]) => world),
)

// id -> full themed layout
const COMPONENT_BY_ID: Record<string, ComponentType> = {
  'era-postcards': EraPostcardsTheme,
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
  'tropical-platformer': TropicalPlatformerTheme,
  'medieval-fantasy': MedievalFantasyTheme,
}

// A theme added without a component fails the build here rather than rendering the default in its place.
const missing = WORLD_IDS.filter((id) => !COMPONENT_BY_ID[id])
if (missing.length > 0) throw new Error(`worlds.ts: no component registered for ${missing.join(', ')}`)

export function getWorldComponent(id: string): ComponentType | undefined {
  return COMPONENT_BY_ID[id]
}
