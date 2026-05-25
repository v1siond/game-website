'use client'

import { useTheme } from '../themes/ThemeContext'

// Import all themed layouts
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

export default function Home() {
  const { theme } = useTheme()

  switch (theme.id) {
    case 'dark-fantasy':
      return <DarkFantasyTheme />
    case 'survival-horror':
      return <SurvivalHorrorTheme />
    case 'neon-portals':
      return <NeonPortalsTheme />
    case 'soul-map':
      return <SoulMapTheme />
    case 'adventure-paths':
      return <AdventurePathsTheme />
    case 'rubber-hose':
      return <RubberHoseTheme />
    case 'retro-rpg':
      return <RetroRPGTheme />
    case 'bold-noir':
      return <BoldNoirTheme />
    case 'fighter-select':
      return <FighterSelectTheme />
    case 'art-deco':
      return <ArtDecoTheme />
    case 'retro-atomic':
      return <RetroAtomicTheme />
    case 'neon-cyber':
      return <NeonCyberTheme />
    case 'cell-shaded':
      return <CellShadedTheme />
    case 'silhouette':
      return <SilhouetteTheme />
    case 'mythic':
      return <MythicTheme />
    case 'tropical-platformer':
      return <TropicalPlatformerTheme />
    case 'medieval-fantasy':
      return <MedievalFantasyTheme />
    default:
      return <DarkFantasyTheme />
  }
}
