// Every world owns its colours in its palette.ts; its registry entry reads them from there.
import { TRAIL } from '@/components/themes/AdventurePaths/palette'
import { DECO_COLORS } from '@/components/themes/ArtDeco/palette'
import { DARK_FANTASY } from '@/components/themes/DarkFantasy/palette'
import { LOOK as ERA_LOOK, PAGE as ERA_PAGE } from '@/components/themes/EraPostcards/palette'
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

export interface Theme {
  id: string
  name: string
  description: string
  colors: ThemeColors
  font: string
}

export const themes: Theme[] = [
  // Era Postcards - the default world: a scroll through the Chronoport, one era picture per part of the CV that rises from dark and sinks again
  {
    id: 'era-postcards',
    name: 'Era Postcards',
    description: 'A scroll through the time portal, one era for each part of the CV',
    colors: {
      background: ERA_PAGE.ink,
      backgroundGradient: `linear-gradient(to bottom, ${ERA_PAGE.night}, ${ERA_PAGE.ink})`,
      accent: ERA_PAGE.portal,
      text: ERA_PAGE.chalk,
      textMuted: ERA_PAGE.mist,
      secondary: ERA_PAGE.padDrummer,
      highlight: ERA_PAGE.padFighter,
      border: ERA_LOOK.hero.rim,
      borderHover: ERA_PAGE.portal,
      surface: ERA_PAGE.night,
      surfaceHover: ERA_LOOK.hero.card,
    },
    font: 'sans-serif',
  },

  // 1. Dark Fantasy - an ethereal ruined kingdom of spirits and lanterns, him as its masked knight
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy',
    description: 'A ruined kingdom of spirits and lanterns',
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
  },

  // 2. Survival Horror - an old house at night with fixed camera rooms, the item box and the last corridor
  {
    id: 'survival-horror',
    name: 'Survival Horror',
    description: 'Search an old house at night and reach the safe room',
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
  },

  // 3. Neon Portals - one neon tunnel through time, a room of its own era per CV section, him as its bandicoot styled runner
  {
    id: 'neon-portals',
    name: 'Neon Portals',
    description: 'A neon tunnel through time with a room of its own era for each part of the CV',
    colors: {
      background: PORTAL.VOID,
      backgroundGradient: `linear-gradient(to bottom, ${PORTAL.PANEL}, ${PORTAL.VOID})`,
      accent: PORTAL.CYAN,
      text: PORTAL.INK,
      textMuted: PORTAL.MUTED,
      secondary: PORTAL.VIOLET,
      highlight: PORTAL.GOLD,
      border: PORTAL.SEAM,
      borderHover: PORTAL.CYAN,
      surface: PORTAL.PANEL,
      surfaceHover: PORTAL.RAISED,
    },
    font: 'sans-serif',
  },

  // 4. Soul Map - an ash and bonfire world of a hard knight game: the shrine, the class pick, the fog wall
  {
    id: 'soul-map',
    name: 'Soul Map',
    description: 'A ruined shrine at dusk and a lift down through the jobs',
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
  },

  // 5. Adventure Paths - an explorer's overworld map whose regions hold each profession, ending at the goal gate
  {
    id: 'adventure-paths',
    name: 'Adventure Paths',
    description: 'An overworld map with a region for each part of the CV',
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
  },

  // 6. Rubber Hose - a 1930s rubber hose cartoon in sepia with the iris, him as the cup headed toon
  {
    id: 'rubber-hose',
    name: 'Rubber Hose',
    description: 'A 1930s rubber hose cartoon in sepia',
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
  },

  // 7. Retro RPG - a 16 bit role playing game's encounter screen, its command windows and the save point
  {
    id: 'retro-rpg',
    name: 'Retro RPG',
    description: 'A pixel RPG encounter in white boxes on black',
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
  },

  // 8. Bold Noir - a stylish heist night in black, paper and one red: calling cards, the menu cut-in, the finisher
  {
    id: 'bold-noir',
    name: 'Bold Noir',
    description: "A gentleman thief's night in black, white and red",
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
  },

  // 9. Fighter Select - an arcade fighting game's select screen and its matches, a challenger at the end
  {
    id: 'fighter-select',
    name: 'Fighter Select',
    description: 'An arcade fighting game with one round per job',
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
  },

  // 10. Art Deco - a 1920s city at the bottom of the sea in brass and gold, reached by bathysphere
  {
    id: 'art-deco',
    name: 'Art Deco',
    description: 'A 1920s city under the sea in brass and neon',
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
  },

  // 11. Retro Atomic - an atomic age bomb shelter seen through his wrist terminal, out to the wasteland
  {
    id: 'retro-atomic',
    name: 'Retro Atomic',
    description: 'An atomic age shelter read on a green wrist terminal',
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
  },

  // 12. Neon Cyber - a netrunner's night city through the optics HUD, with quickhacks and scan mode
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'A neon city at night in magenta and cyan',
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
  },

  // 13. Cell Shaded - an inked wasteland looter shooter, one desert day from the intro card to the respawn station
  {
    id: 'cell-shaded',
    name: 'Cell Shaded',
    description: 'One day in an inked comic desert, from noon to night',
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
  },

  // 14. Silhouette - a black forest in the fog, a monochrome puzzle platformer with levers, ropes and death cuts
  {
    id: 'silhouette',
    name: 'Silhouette',
    description: 'A black forest in the fog',
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
  },

  // 15. Mythic - an underworld escape painted in ink over colour, from the great hall up to the dawn
  {
    id: 'mythic',
    name: 'Mythic',
    description: 'An escape from the underworld, drawn in ink over colour',
    colors: {
      background: MYTH.sky,
      backgroundGradient: `linear-gradient(to bottom, ${MYTH.sky}, ${MYTH.hallLow})`,
      accent: MYTH.gold,
      text: MYTH.bone,
      textMuted: MYTH.boneShade,
      secondary: MYTH.terracotta,
      highlight: MYTH.goldPale,
      border: MYTH.goldDeep,
      borderHover: MYTH.gold,
      surface: MYTH.panel,
      surfaceHover: MYTH.panelEdge,
    },
    font: 'serif',
  },

  // 16. Tropical Platformer - a jungle barrel platformer from sunset to night, shot out of his tree house
  {
    id: 'tropical-platformer',
    name: 'Tropical Platformer',
    description: 'A jungle run from sunset to night, barrel to barrel',
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
  },

  // 17. Medieval Fantasy - a real time strategy kingdom in gold and stone
  {
    id: 'medieval-fantasy',
    name: 'Medieval Fantasy',
    description: 'A strategy game realm of stone and parchment',
    colors: {
      background: REALM.bgDeep,
      backgroundGradient: `linear-gradient(to bottom, ${REALM.bgDeep}, ${REALM.bgVoid})`,
      accent: REALM.goldBright,
      text: REALM.textBright,
      textMuted: REALM.textMid,
      secondary: REALM.kingdomBlue,
      highlight: REALM.goldBright,
      border: REALM.metalLight,
      borderHover: REALM.goldBright,
      surface: REALM.metalDark,
      surfaceHover: REALM.metalMid,
    },
    font: 'serif',
  },
]

export const DEFAULT_THEME_ID = 'era-postcards'

/** Where the chosen world is remembered. Exported because the failure screen has to read the world
 *  WITHOUT the ThemeProvider: a root-layout crash unmounts the providers, and the Pages Router tree
 *  never had one, so `useTheme()` would throw exactly where nothing is allowed to. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

// An unknown or stale stored id opens the default world, the same one a fresh visitor gets.
const DEFAULT_THEME = themes.find(t => t.id === DEFAULT_THEME_ID)!

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) ?? DEFAULT_THEME
}
