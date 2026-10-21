// Retro Atomic's palette and the CSS textures its panels paint with.

// PIP-BOY GREEN - The iconic terminal green
export const PIPBOY_GREEN = '#14FF00'
export const PIPBOY_GREEN_DIM = '#10CC00'
export const PIPBOY_GREEN_DARK = '#0D9900'
export const PIPBOY_GREEN_GLOW = 'rgba(20, 255, 0, 0.4)'
export const PIPBOY_SCREEN_BG = '#001a00'

// VAULT-TEC CORPORATE
export const VAULT_BLUE = '#0066CC'
export const VAULT_BLUE_DARK = '#004499'
export const VAULT_YELLOW = '#FFD700'
export const VAULT_YELLOW_DIM = '#FFCC00'

// NUKA-COLA
export const NUKA_RED = '#CC0000'
export const NUKA_RED_DARK = '#990000'
export const NUKA_GLOW = 'rgba(204, 0, 0, 0.5)'
export const NUKA_GLOW_TEXT = '#FF4D4D'

// WASTELAND
export const WASTELAND_BROWN = '#8B7355'
export const WASTELAND_BROWN_MED = '#6B5344'
export const WASTELAND_BROWN_DARK = '#4A3728'
export const RUST_ORANGE = '#B7410E'
export const RUST_DARK = '#8B3A0E'

// RADIATION / HAZARD
export const IRRADIATED_GREEN = '#00FF00'
export const IRRADIATED_GLOW = '#33FF33'
export const TERMINAL_AMBER = '#FF9900'

// BACKGROUNDS
export const TERMINAL_BG = '#0a0a08'
export const PANEL_BG = '#0d0d0a'
export const VAULT_BG = '#1a1a16'

// BUNKER: the steel, lamps and fittings the scroll scenes are built from
export const STEEL = '#23261f'
export const STEEL_LIGHT = '#3d4136'
export const STEEL_EDGE = '#5a5e50'
export const CHROME = '#c9cbb8'
export const CASING = '#8f8a6a'
export const LAMP_GLOW = '#ffe9a8'
export const VELVET = '#5a1020'
export const VELVET_FOLD = '#3d0a15'

// TEXT
export const TERMINAL_TEXT = PIPBOY_GREEN
export const FADED_TEXT = '#A3A38C'

// ============================================================================
// CRT SCANLINE EFFECT
// ============================================================================

export const crtScanlinesBg = `
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.15) 1px,
    rgba(0, 0, 0, 0.15) 2px
  )
`

// ============================================================================
// WASTELAND TEXTURES (Pure CSS)
// ============================================================================

export const rustTexture = `
  linear-gradient(135deg, ${RUST_DARK}40 0%, transparent 50%),
  linear-gradient(225deg, ${WASTELAND_BROWN_DARK}30 0%, transparent 50%),
  repeating-linear-gradient(90deg, ${RUST_ORANGE}08 0px 2px, transparent 2px 4px),
  repeating-linear-gradient(0deg, ${RUST_DARK}10 0px 1px, transparent 1px 3px)
`

export const pipboyScreenBg = `
  repeating-linear-gradient(0deg, ${PIPBOY_GREEN}03 0px 1px, transparent 1px 2px),
  repeating-linear-gradient(90deg, ${PIPBOY_GREEN}02 0px 1px, transparent 1px 3px),
  radial-gradient(ellipse at 50% 0%, ${PIPBOY_GREEN}12 0%, transparent 50%),
  radial-gradient(ellipse at 50% 100%, ${PIPBOY_SCREEN_BG} 0%, transparent 30%),
  linear-gradient(180deg, ${PIPBOY_SCREEN_BG}80 0%, ${TERMINAL_BG} 10%, ${TERMINAL_BG} 90%, ${PIPBOY_SCREEN_BG}80 100%)
`

export const wornPaperBg = `
  repeating-linear-gradient(45deg, ${WASTELAND_BROWN}08 0px 1px, transparent 1px 6px),
  repeating-linear-gradient(-45deg, ${WASTELAND_BROWN_DARK}10 0px 1px, transparent 1px 8px),
  linear-gradient(180deg, ${WASTELAND_BROWN}12 0%, ${WASTELAND_BROWN_DARK}08 100%)
`

export const hazardStripes = `
  repeating-linear-gradient(
    45deg,
    ${VAULT_YELLOW}20 0px 10px,
    ${TERMINAL_BG} 10px 20px
  )
`
