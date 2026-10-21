// Each rebuilt world owns its colours in its palette.ts; its registry entry reads them from there. Dark
// Fantasy and Medieval Fantasy have no palette module yet, so their hex stays here.
import { TRAIL } from '@/components/themes/AdventurePaths/palette'
import { DECO_COLORS } from '@/components/themes/ArtDeco/palette'
import { DARK_FANTASY } from '@/components/themes/DarkFantasy/palette'
import { NOIR } from '@/components/themes/BoldNoir/palette'
import { CEL } from '@/components/themes/CellShaded/palette'
import { FS } from '@/components/themes/FighterSelect/palette'
import { REALM } from '@/components/themes/MedievalFantasy/palette'
import { MYTH } from '@/components/themes/Mythic/palette'
import { NEON } from '@/components/themes/NeonCyber/palette'
import { PORTAL } from '@/components/themes/NeonPortals/palette'
import { ATOMIC_COLORS } from '@/components/themes/RetroAtomic/palette'
import { RPG } from '@/components/themes/RetroRPG/palette'
import { HOSE } from '@/components/themes/RubberHose/palette'
import { SHADE } from '@/components/themes/Silhouette/palette'
import { SOUL } from '@/components/themes/SoulMap/palette'
import { SH } from '@/components/themes/SurvivalHorror/palette'
import { COLORS } from '@/components/themes/TropicalPlatformer/palette'

export interface ThemeColors {
  background: string
  backgroundGradient: string
  accent: string
  text: string
  textMuted: string
  secondary: string
  highlight: string
  border: string
  borderHover: string
  surface: string
  surfaceHover: string
}

export interface ThemeEffects {
  vignette: boolean
  grain: boolean
  scanlines: boolean
  glitch: boolean
  flicker: boolean
  grainOpacity: number
  vignetteIntensity: number
}

export interface Theme {
  id: string
  name: string
  description: string
  colors: ThemeColors
  font: string
  effects: ThemeEffects
}

export const themes: Theme[] = [
  // 1. Dark Fantasy - an ethereal ruined kingdom
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy',
    description: 'Ethereal ruined kingdom - an interconnected map',
    colors: {
      background: DARK_FANTASY.void,
      backgroundGradient: `linear-gradient(to bottom, ${DARK_FANTASY.void}, ${DARK_FANTASY.voidDeep})`,
      accent: DARK_FANTASY.ethereal,
      text: DARK_FANTASY.text,
      textMuted: DARK_FANTASY.textMuted,
      secondary: DARK_FANTASY.violet,
      highlight: DARK_FANTASY.spiritGold,
      border: DARK_FANTASY.rim,
      borderHover: DARK_FANTASY.ethereal,
      surface: DARK_FANTASY.voidPurple,
      surfaceHover: DARK_FANTASY.surfaceHover,
    },
    font: 'serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: true,
      grainOpacity: 0.02,
      vignetteIntensity: 0.6,
    },
  },

  // 2. Survival Horror - an old house at night, one lamp at a time
  {
    id: 'survival-horror',
    name: 'Survival Horror',
    description: 'An old house at night - one lamp at a time, fog and the save room',
    colors: {
      background: SH.void,
      backgroundGradient: `linear-gradient(to bottom, ${SH.shadow}, ${SH.void})`,
      accent: SH.brass,
      text: SH.cream,
      textMuted: SH.fog,
      secondary: SH.rust,
      highlight: SH.flame,
      border: SH.sepia,
      borderHover: SH.brass,
      surface: SH.panel,
      surfaceHover: SH.paper,
    },
    font: 'monospace',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: true,
      grainOpacity: 0.03,
      vignetteIntensity: 0.7,
    },
  },

  // 3. Neon Portals - orange portal in, blue portal out
  {
    id: 'neon-portals',
    name: 'Neon Portals',
    description: 'Glowing portals - orange in, blue out, violet rifts between',
    colors: {
      background: PORTAL.VOID,
      backgroundGradient: `linear-gradient(to bottom, ${PORTAL.CHAMBER}, ${PORTAL.VOID})`,
      accent: PORTAL.ORANGE,
      text: PORTAL.WHITE,
      textMuted: PORTAL.MUTED,
      secondary: PORTAL.BLUE,
      highlight: PORTAL.VIOLET,
      border: PORTAL.SEAM,
      borderHover: PORTAL.ORANGE,
      surface: PORTAL.CHAMBER,
      surfaceHover: PORTAL.PANEL,
    },
    font: 'sans-serif',
    effects: {
      vignette: true,
      grain: false,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0,
      vignetteIntensity: 0.5,
    },
  },

  // 4. Soul Map - deep blue caverns of a map exploration game
  {
    id: 'soul-map',
    name: 'Soul Map',
    description: 'Deep blue caverns - rooms that reveal as you explore, glowing paths',
    colors: {
      background: SOUL.abyss,
      backgroundGradient: `linear-gradient(to bottom, ${SOUL.deep}, ${SOUL.abyss})`,
      accent: SOUL.glow,
      text: SOUL.text,
      textMuted: SOUL.textSoft,
      secondary: SOUL.moss,
      highlight: SOUL.lantern,
      border: SOUL.rock,
      borderHover: SOUL.glow,
      surface: SOUL.deep,
      surfaceHover: SOUL.cavern,
    },
    font: 'sans-serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.015,
      vignetteIntensity: 0.5,
    },
  },

  // 5. Adventure Paths - an explorer's map at dusk
  {
    id: 'adventure-paths',
    name: 'Adventure Paths',
    description: "An explorer's map at dusk - trails, ruins and a red route",
    colors: {
      background: TRAIL.NIGHT,
      backgroundGradient: `linear-gradient(to bottom, ${TRAIL.CANOPY}, ${TRAIL.NIGHT})`,
      accent: TRAIL.GOLD,
      text: TRAIL.PARCHMENT,
      textMuted: TRAIL.EDGE,
      secondary: TRAIL.ROUTE,
      highlight: TRAIL.RUNE,
      border: TRAIL.FOREST,
      borderHover: TRAIL.GOLD,
      surface: TRAIL.CANOPY,
      surfaceHover: TRAIL.FOREST,
    },
    font: 'sans-serif',
    effects: {
      vignette: false,
      grain: false,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0,
      vignetteIntensity: 0,
    },
  },

  // 6. Rubber Hose - a 1930s rubber hose cartoon in sepia
  {
    id: 'rubber-hose',
    name: 'Rubber Hose',
    description: '1930s rubber hose cartoon: sepia sets, the pink parry slap, the knockout',
    colors: {
      background: HOSE.paper,
      backgroundGradient: `linear-gradient(to bottom, ${HOSE.paper}, ${HOSE.paperSepia})`,
      accent: HOSE.redDark,
      text: HOSE.ink,
      textMuted: HOSE.inkSoft,
      secondary: HOSE.blue,
      highlight: HOSE.orange,
      border: HOSE.shadow,
      borderHover: HOSE.redDark,
      surface: HOSE.paperSepia,
      surfaceHover: HOSE.paperDark,
    },
    font: 'serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: true,
      grainOpacity: 0.08,
      vignetteIntensity: 0.4,
    },
  },

  // 7. Retro RPG - a 16 bit role playing game at night
  {
    id: 'retro-rpg',
    name: 'Retro RPG',
    description: '16 bit role playing game at night - dialogue windows and the overworld road',
    colors: {
      background: RPG.void,
      backgroundGradient: `linear-gradient(to bottom, ${RPG.night}, ${RPG.void})`,
      accent: RPG.gold,
      text: RPG.text,
      textMuted: RPG.muted,
      secondary: RPG.sky,
      highlight: RPG.green,
      border: RPG.border,
      borderHover: RPG.gold,
      surface: RPG.windowLow,
      surfaceHover: RPG.windowTop,
    },
    font: 'monospace',
    effects: {
      vignette: false,
      grain: false,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0,
      vignetteIntensity: 0,
    },
  },

  // 8. Bold Noir - a graphic novel night with one red accent
  {
    id: 'bold-noir',
    name: 'Bold Noir',
    description: 'Graphic novel night - black, white and one red accent, rain',
    colors: {
      background: NOIR.ink,
      backgroundGradient: `linear-gradient(135deg, ${NOIR.coal}, ${NOIR.ink})`,
      accent: NOIR.red,
      text: NOIR.paper,
      textMuted: NOIR.fog,
      secondary: NOIR.redDeep,
      highlight: NOIR.paper,
      border: NOIR.smoke,
      borderHover: NOIR.red,
      surface: NOIR.coal,
      surfaceHover: NOIR.smoke,
    },
    font: 'sans-serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.02,
      vignetteIntensity: 0.4,
    },
  },

  // 9. Fighter Select - an arcade fighting game's select screen and stages
  {
    id: 'fighter-select',
    name: 'Fighter Select',
    description: 'Arcade fighting game: the versus splash, a select grid with the player one cursor, jobs as rounds, projects taking combo hits, a challenger stepping in',
    colors: {
      background: FS.night,
      backgroundGradient: `linear-gradient(to bottom, ${FS.panel}, ${FS.night})`,
      accent: FS.gold,
      text: FS.chrome,
      textMuted: FS.p1Light,
      secondary: FS.p2,
      highlight: FS.health,
      border: FS.p1,
      borderHover: FS.gold,
      surface: FS.panel,
      surfaceHover: FS.panelLight,
    },
    font: 'sans-serif',
    effects: {
      vignette: false,
      grain: false,
      scanlines: true,
      glitch: false,
      flicker: false,
      grainOpacity: 0,
      vignetteIntensity: 0,
    },
  },

  // 10. Art Deco - a 1920s city under the sea
  {
    id: 'art-deco',
    name: 'Art Deco',
    description: '1920s city under the sea - brass, gold filigree and neon signs',
    colors: {
      background: DECO_COLORS.abyss,
      backgroundGradient: `linear-gradient(to bottom, ${DECO_COLORS.deepSeaDark}, ${DECO_COLORS.abyss})`,
      accent: DECO_COLORS.gold,
      text: DECO_COLORS.cream,
      textMuted: DECO_COLORS.bronze,
      secondary: DECO_COLORS.tealLight,
      highlight: DECO_COLORS.goldBright,
      border: DECO_COLORS.brassDark,
      borderHover: DECO_COLORS.gold,
      surface: DECO_COLORS.deepSeaDark,
      surfaceHover: DECO_COLORS.deepSea,
    },
    font: 'serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.02,
      vignetteIntensity: 0.5,
    },
  },

  // 11. Retro Atomic - an atomic age shelter
  {
    id: 'retro-atomic',
    name: 'Retro Atomic',
    description: 'Atomic age shelter - phosphor terminals and steel bunker rooms',
    colors: {
      background: ATOMIC_COLORS.ink,
      backgroundGradient: `linear-gradient(to bottom, ${ATOMIC_COLORS.bunker}, ${ATOMIC_COLORS.ink})`,
      accent: ATOMIC_COLORS.yellow,
      text: ATOMIC_COLORS.phosphor,
      textMuted: ATOMIC_COLORS.ash,
      secondary: ATOMIC_COLORS.blue,
      highlight: ATOMIC_COLORS['red-light'],
      border: ATOMIC_COLORS['steel-edge'],
      borderHover: ATOMIC_COLORS.yellow,
      surface: ATOMIC_COLORS.panel,
      surfaceHover: ATOMIC_COLORS.bunker,
    },
    font: 'monospace',
    effects: {
      vignette: false,
      grain: false,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0,
      vignetteIntensity: 0,
    },
  },

  // 12. Neon Cyber - a neon city at night
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Neon city at night - magenta and cyan glitch',
    colors: {
      background: NEON.void,
      backgroundGradient: `linear-gradient(to bottom, ${NEON.dusk}, ${NEON.void})`,
      accent: NEON.magenta,
      text: NEON.ice,
      textMuted: NEON.muted,
      secondary: NEON.cyan,
      highlight: NEON.yellow,
      border: NEON.rim,
      borderHover: NEON.magenta,
      surface: NEON.surface,
      surfaceHover: NEON.surfaceHover,
    },
    font: 'monospace',
    effects: {
      vignette: true,
      grain: true,
      scanlines: true,
      glitch: true,
      flicker: false,
      grainOpacity: 0.03,
      vignetteIntensity: 0.5,
    },
  },

  // 13. Cell Shaded - a toon shaded comic
  {
    id: 'cell-shaded',
    name: 'Cell Shaded',
    description: 'Toon shaded comic - flat colour bands, bold ink lines, impact bursts',
    colors: {
      background: CEL.paper,
      backgroundGradient: `linear-gradient(to bottom, ${CEL.paper}, ${CEL.paperShade})`,
      accent: CEL.skyDeep,
      text: CEL.ink,
      textMuted: CEL.inkSoft,
      secondary: CEL.orange,
      highlight: CEL.sun,
      border: CEL.ink,
      borderHover: CEL.skyDeep,
      surface: CEL.paper,
      surfaceHover: CEL.paperShade,
    },
    font: 'sans-serif',
    effects: {
      vignette: false,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.02,
      vignetteIntensity: 0,
    },
  },

  // 14. Silhouette - black shapes on a lit sky
  {
    id: 'silhouette',
    name: 'Silhouette',
    description: 'Black shapes on a lit sky - fog, dawn, ember and crimson light',
    colors: {
      background: SHADE.void,
      backgroundGradient: `linear-gradient(to bottom, ${SHADE.panel}, ${SHADE.void})`,
      accent: SHADE.rim,
      text: SHADE.text,
      textMuted: SHADE.muted,
      secondary: SHADE.ember,
      highlight: SHADE.sun,
      border: SHADE.edge,
      borderHover: SHADE.rim,
      surface: SHADE.panel,
      surfaceHover: SHADE.raised,
    },
    font: 'sans-serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.04,
      vignetteIntensity: 0.7,
    },
  },

  // 15. Mythic - a sunlit Aegean noon over marble temples
  {
    id: 'mythic',
    name: 'Mythic',
    description: 'Sunlit Aegean noon - marble temples, terracotta pottery and laurel gold',
    colors: {
      background: MYTH.sky,
      backgroundGradient: `linear-gradient(to bottom, ${MYTH.sky}, ${MYTH.marble})`,
      accent: MYTH.aegean,
      text: MYTH.ink,
      textMuted: MYTH.inkSoft,
      secondary: MYTH.terracotta,
      highlight: MYTH.gold,
      border: MYTH.terracottaDeep,
      borderHover: MYTH.aegean,
      surface: MYTH.marble,
      surfaceHover: MYTH.marbleShade,
    },
    font: 'serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.02,
      vignetteIntensity: 0.5,
    },
  },

  // 16. Tropical Platformer - an island at midday
  {
    id: 'tropical-platformer',
    name: 'Tropical Platformer',
    description: 'Island platformer - jungle greens, lagoon blues, ripe fruit and crates',
    colors: {
      background: COLORS.canopy,
      backgroundGradient: `linear-gradient(to bottom, ${COLORS.leafDark}, ${COLORS.canopy})`,
      accent: COLORS.fruitGold,
      text: COLORS.parchment,
      textMuted: COLORS.sandLight,
      secondary: COLORS.lagoon,
      highlight: COLORS.sun,
      border: COLORS.wood,
      borderHover: COLORS.fruitGold,
      surface: COLORS.woodDark,
      surfaceHover: COLORS.wood,
    },
    font: 'sans-serif',
    effects: {
      vignette: true,
      grain: false,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0,
      vignetteIntensity: 0.4,
    },
  },

  // 17. Medieval Fantasy - RTS-inspired gold and stone
  {
    id: 'medieval-fantasy',
    name: 'Medieval Fantasy',
    description: 'RTS fantasy - gold accents, stone frames, parchment',
    colors: {
      background: REALM.bgDeep,
      backgroundGradient: `linear-gradient(to bottom, ${REALM.bgDeep}, ${REALM.bgVoid})`,
      accent: REALM.goldBright,
      text: REALM.textBright,
      textMuted: REALM.textMid,
      secondary: REALM.allianceBlue,
      highlight: REALM.goldBright,
      border: REALM.metalLight,
      borderHover: REALM.goldBright,
      surface: REALM.metalDark,
      surfaceHover: REALM.metalMid,
    },
    font: 'serif',
    effects: {
      vignette: true,
      grain: true,
      scanlines: false,
      glitch: false,
      flicker: false,
      grainOpacity: 0.02,
      vignetteIntensity: 0.5,
    },
  },
]

export const DEFAULT_THEME_ID = 'neon-cyber'

/** Where the chosen world is remembered. Exported because the failure screen has to read the world
 *  WITHOUT the ThemeProvider: a root-layout crash unmounts the providers, and the Pages Router tree
 *  never had one, so `useTheme()` would throw exactly where nothing is allowed to. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0]
}
