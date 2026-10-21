// The arcade palette and the CSS textures every Fighter Select panel shares.

export const COLORS = {
  // Player 1 Blue
  p1Blue: '#0066FF',
  p1BlueDark: '#0044CC',
  p1BlueDarker: '#003399',
  // Player 2 Red
  p2Red: '#FF0033',
  p2RedDark: '#CC0022',
  p2RedDarker: '#990011',
  // Electric Yellow
  electricYellow: '#FFFF00',
  gold: '#FFD700',
  orange: '#FFA500',
  // Neon Pink
  neonPink: '#FF00FF',
  neonPinkLight: '#FF66FF',
  // Arcade Black
  arcadeBlack: '#0A0A0A',
  arcadeGray: '#1A1A1A',
  // Chrome/Metal
  chrome: '#C0C0C0',
  chromeDark: '#A0A0A0',
  chromeDarker: '#808080',
  // Health Green
  healthGreen: '#00FF00',
  healthGreenDark: '#00CC00',
  // Special Move Blue
  specialBlue: '#00FFFF',
  specialBlueDark: '#00CCCC',
}

// =============================================================================
// CSS TEXTURES & EFFECTS
// =============================================================================

// Metallic arcade cabinet texture with brushed metal effect
export const metallicTexture = `
  linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 25%, #3a3a4a 50%, #1a1a2a 75%, #2a2a3a 100%),
  repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 5px),
  repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)
`

// CRT scanline overlay - authentic arcade monitor effect
export const crtScanlines = `
  repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px),
  repeating-linear-gradient(90deg, rgba(255,0,0,0.015) 0px, rgba(255,0,0,0.015) 1px, transparent 1px, transparent 3px)
`

// Screen vignette - darkened edges like CRT monitors
export const screenVignette = `radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)`

// RGB screen glow bleeding at edges
export const screenGlow = `
  radial-gradient(ellipse at 20% 30%, rgba(255,0,100,0.08) 0%, transparent 40%),
  radial-gradient(ellipse at 80% 70%, rgba(0,100,255,0.08) 0%, transparent 40%),
  radial-gradient(ellipse at 50% 50%, rgba(0,255,255,0.03) 0%, transparent 60%)
`

// Lightning bolt background pattern
export const lightningPattern = `
  radial-gradient(ellipse at 50% 0%, ${COLORS.electricYellow}10 0%, transparent 50%),
  radial-gradient(ellipse at 50% 100%, ${COLORS.orange}10 0%, transparent 50%)
`
