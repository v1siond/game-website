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
  // 1. Dark Fantasy (DEFAULT) - Hollow Knight/Iconoclast
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy',
    description: 'Hollow Knight - ethereal interconnected map',
    colors: {
      background: '#0f0a1a',
      backgroundGradient: 'linear-gradient(to bottom, #0f0a1a, #1a1025)',
      accent: '#41c8e8',
      text: '#c8d4e8',
      textMuted: '#6b7a94',
      secondary: '#9966cc',
      highlight: '#e8c841',
      border: '#2a2540',
      borderHover: '#41c8e8',
      surface: '#150f25',
      surfaceHover: '#1f1835',
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

  // 2. Survival Horror - Dark mansion, inventory grid
  {
    id: 'survival-horror',
    name: 'Survival Horror',
    description: 'Resident Evil - dark mansion, typewriter saves',
    colors: {
      background: '#0a0805',
      backgroundGradient: 'linear-gradient(to bottom, #1a1510, #0a0805)',
      accent: '#8b0000',
      text: '#998866',
      textMuted: '#665544',
      secondary: '#aa8855',
      highlight: '#cc4444',
      border: '#3a3020',
      borderHover: '#8b0000',
      surface: '#1a1510',
      surfaceHover: '#2a2015',
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

  // 3. Neon Portals - Crash Bandicoot warp room
  {
    id: 'neon-portals',
    name: 'Neon Portals',
    description: 'Crash Bandicoot - glowing circular portals',
    colors: {
      background: '#0a0520',
      backgroundGradient: 'linear-gradient(to bottom, #150a30, #0a0520)',
      accent: '#ff6b00',
      text: '#f0e8ff',
      textMuted: '#9988cc',
      secondary: '#00ccff',
      highlight: '#ffcc00',
      border: '#3322aa',
      borderHover: '#ff6b00',
      surface: '#1a1040',
      surfaceHover: '#251560',
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

  // 4. Soul Map - Metroidvania interconnected zones
  {
    id: 'soul-map',
    name: 'Soul Map',
    description: 'Metroidvania - interconnected zones reveal',
    colors: {
      background: '#0d0d12',
      backgroundGradient: 'linear-gradient(to bottom, #14141f, #0d0d12)',
      accent: '#5588ff',
      text: '#d0d8e8',
      textMuted: '#707890',
      secondary: '#88cc55',
      highlight: '#ffaa33',
      border: '#252535',
      borderHover: '#5588ff',
      surface: '#16161f',
      surfaceHover: '#202030',
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

  // 5. Adventure Paths - Mario world map
  {
    id: 'adventure-paths',
    name: 'Adventure Paths',
    description: 'Mario World - cheerful path nodes',
    colors: {
      background: '#1a4422',
      backgroundGradient: 'linear-gradient(to bottom, #2a6633, #1a4422)',
      accent: '#ffcc00',
      text: '#ffffff',
      textMuted: '#aaccaa',
      secondary: '#ff4444',
      highlight: '#44ddff',
      border: '#336633',
      borderHover: '#ffcc00',
      surface: '#225533',
      surfaceHover: '#2a6644',
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

  // 6. Rubber Hose - 1930s Cuphead cartoon
  {
    id: 'rubber-hose',
    name: 'Rubber Hose',
    description: 'Cuphead - 1930s cartoon, film grain',
    colors: {
      background: '#f5e6c8',
      backgroundGradient: 'linear-gradient(to bottom, #f5e6c8, #e8d4b0)',
      accent: '#8b0000',
      text: '#2a2015',
      textMuted: '#5a4a35',
      secondary: '#1a3050',
      highlight: '#cc4400',
      border: '#8a7a60',
      borderHover: '#8b0000',
      surface: '#efe0c0',
      surfaceHover: '#e8d4b0',
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

  // 7. Retro RPG - Undertale black/white/yellow
  {
    id: 'retro-rpg',
    name: 'Retro RPG',
    description: 'Undertale - battle menu, determination',
    colors: {
      background: '#000000',
      backgroundGradient: 'linear-gradient(to bottom, #0a0a0a, #000000)',
      accent: '#ffff00',
      text: '#ffffff',
      textMuted: '#888888',
      secondary: '#ff6600',
      highlight: '#ff0000',
      border: '#ffffff',
      borderHover: '#ffff00',
      surface: '#1a1a1a',
      surfaceHover: '#2a2a2a',
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

  // 8. Bold Noir - Persona 5 red/black
  {
    id: 'bold-noir',
    name: 'Bold Noir',
    description: 'Persona 5 - red/black, skewed angles',
    colors: {
      background: '#0a0a0a',
      backgroundGradient: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
      accent: '#ff0033',
      text: '#ffffff',
      textMuted: '#999999',
      secondary: '#ff0033',
      highlight: '#ffcc00',
      border: '#ff0033',
      borderHover: '#ff3366',
      surface: '#1a0a0a',
      surfaceHover: '#2a1515',
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

  // 9. Fighter Select - Street Fighter character grid
  {
    id: 'fighter-select',
    name: 'Fighter Select',
    description: 'Street Fighter - character select grid',
    colors: {
      background: '#0a1530',
      backgroundGradient: 'linear-gradient(to bottom, #152550, #0a1530)',
      accent: '#ffd700',
      text: '#ffffff',
      textMuted: '#88aacc',
      secondary: '#ff4444',
      highlight: '#00ff88',
      border: '#4466aa',
      borderHover: '#ffd700',
      surface: '#152040',
      surfaceHover: '#1a2850',
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

  // 10. Art Deco - 1920s Bioshock
  {
    id: 'art-deco',
    name: 'Art Deco',
    description: 'Bioshock - 1920s gold filigree',
    colors: {
      background: '#0a1520',
      backgroundGradient: 'linear-gradient(to bottom, #152535, #0a1520)',
      accent: '#d4af37',
      text: '#e8e0d0',
      textMuted: '#a09080',
      secondary: '#2a6080',
      highlight: '#f0c850',
      border: '#4a3a20',
      borderHover: '#d4af37',
      surface: '#152030',
      surfaceHover: '#1a2840',
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

  // 11. Retro Atomic - Fallout
  {
    id: 'retro-atomic',
    name: 'Retro Atomic',
    description: 'Fallout - Vault-Tec, Pip-Boy, wasteland',
    colors: {
      background: '#000000',
      backgroundGradient: 'linear-gradient(to bottom, #000000, #000000)',
      accent: '#ffff00',
      text: '#ffb897',
      textMuted: '#888888',
      secondary: '#2121ff',
      highlight: '#ffff00',
      border: '#2121ff',
      borderHover: '#ffff00',
      surface: '#0a0a0a',
      surfaceHover: '#151515',
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

  // 12. Neon Cyber - Cyberpunk magenta/cyan glitch
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Cyberpunk - magenta/cyan glitch',
    colors: {
      background: '#0a0512',
      backgroundGradient: 'linear-gradient(to bottom, #150a20, #0a0512)',
      accent: '#ff00ff',
      text: '#e0f0ff',
      textMuted: '#8080a0',
      secondary: '#00ffff',
      highlight: '#ffff00',
      border: '#4020a0',
      borderHover: '#ff00ff',
      surface: '#150a1a',
      surfaceHover: '#201025',
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

  // 13. Cell Shaded - Borderlands comic book
  {
    id: 'cell-shaded',
    name: 'Cell Shaded',
    description: 'Borderlands - comic book ink lines',
    colors: {
      background: '#f5f0e0',
      backgroundGradient: 'linear-gradient(to bottom, #f5f0e0, #e8e0d0)',
      accent: '#ff6600',
      text: '#1a1a1a',
      textMuted: '#555555',
      secondary: '#3366cc',
      highlight: '#ffcc00',
      border: '#1a1a1a',
      borderHover: '#ff6600',
      surface: '#ebe5d5',
      surfaceHover: '#e0d8c8',
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

  // 15. Silhouette - Limbo pure black shapes
  {
    id: 'silhouette',
    name: 'Silhouette',
    description: 'Limbo - pure black and white shapes',
    colors: {
      background: '#e8e8e8',
      backgroundGradient: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)',
      accent: '#000000',
      text: '#000000',
      textMuted: '#555555',
      secondary: '#333333',
      highlight: '#666666',
      border: '#000000',
      borderHover: '#333333',
      surface: '#e0e0e0',
      surfaceHover: '#d8d8d8',
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

  // 16. Mythic - Hades Greek mythology
  {
    id: 'mythic',
    name: 'Mythic',
    description: 'Hades - Greek mythology, blood red',
    colors: {
      background: '#1a0a10',
      backgroundGradient: 'linear-gradient(to bottom, #2a1520, #1a0a10)',
      accent: '#ff3344',
      text: '#f0e8e0',
      textMuted: '#a08888',
      secondary: '#d4af37',
      highlight: '#ff6655',
      border: '#4a2020',
      borderHover: '#ff3344',
      surface: '#251518',
      surfaceHover: '#301a20',
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

  // 17. Tropical Platformer - jungle, crates, vibrant colors
  {
    id: 'tropical-platformer',
    name: 'Tropical Platformer',
    description: 'Jungle platformer - vibrant colors, wooden crates',
    colors: {
      background: '#0a1505',
      backgroundGradient: 'linear-gradient(to bottom, #1a2810, #0a1505)',
      accent: '#ff6b00',
      text: '#ffffff',
      textMuted: '#a0a0a0',
      secondary: '#00d4ff',
      highlight: '#ff8800',
      border: '#8b5a2b',
      borderHover: '#ff6b00',
      surface: '#1a1510',
      surfaceHover: '#2a2010',
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

  // 18. Medieval Fantasy - RTS-inspired gold and stone
  {
    id: 'medieval-fantasy',
    name: 'Medieval Fantasy',
    description: 'RTS fantasy - gold accents, stone frames, parchment',
    colors: {
      background: '#0a0805',
      backgroundGradient: 'linear-gradient(to bottom, #151210, #0a0805)',
      accent: '#ffd100',
      text: '#e8dcc4',
      textMuted: '#a09080',
      secondary: '#0066cc',
      highlight: '#ffdd44',
      border: '#6b5a4a',
      borderHover: '#ffd100',
      surface: '#1a1510',
      surfaceHover: '#252015',
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

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0]
}
