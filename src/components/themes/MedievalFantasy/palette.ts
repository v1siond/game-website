// Medieval Fantasy's palette: the Reign of Chaos zone (fel greens, fire, olive battlefield), the Frozen
// Throne zone (ice and frost), and the shared metal frame, gold trim and parchment text.

export const WC3 = {
  // === REIGN OF CHAOS (demonic, war, plague) ===
  roc: {
    skyTop: '#050805',
    skyMid: '#081008',
    skyBot: '#0c150c',
    // Olive-green fel tones - muddy, worn, rain-soaked battlefield
    felBright: '#5a6a3a',
    felMid: '#3a4a28',
    felDark: '#2a3518',
    felGlow: '#4a5a3080',
    fireBright: '#ffaa44',
    fireMid: '#dd6622',
    fireCore: '#ffff88',
    // Terrain - WC3 RoC style: olive-green grass, earthy ground
    grassOlive: '#5a5a30',       // olive-green grass (main)
    grassYellow: '#6a6535',      // yellowish green
    grassDark: '#4a4a28',        // darker grass shadow
    grassLight: '#7a7040',       // lighter grass highlights
    groundGreen: '#1a2518',      // greenish ground (from flagpole)
    groundMid: '#253020',        // mid-tone ground
    groundDark: '#2a2518',       // darker areas
    waterDark: '#1a2a30',        // puddle water
    rockDistant: '#4a4a48',      // distant gray cliffs
    rockSilhouette: '#2a2a28',   // very distant rock shapes
  },

  // === FROZEN THRONE (ice, frost, Northrend) ===
  ft: {
    skyTop: '#080a10',
    skyMid: '#0a1420',
    skyBot: '#102030',
    iceBright: '#c8e8ff',
    iceMid: '#6eb5ff',
    iceDark: '#3a7fba',
    iceGlow: '#6eb5ff60',
    frostWhite: '#e8f4ff',
    frostMid: '#a0c8e8',
  },

  // === SHARED ===
  bgVoid: '#060608',
  bgDeep: '#0a0c0e',

  metalDark: '#2a2428',
  metalMid: '#3a3438',
  metalLight: '#5a5458',
  metalHighlight: '#6a6468',

  goldBright: '#d4a017',
  goldMid: '#b8860b',
  goldDark: '#8b6914',
  goldDeep: '#5f4c0c',

  bloodRed: '#8b0000',
  hordeRed: '#5a1a1a',
  allianceBlue: '#1e3a5f',
  elfPurple: '#4a2a6a',

  textBright: '#e8dcc8',  // ~14:1 contrast on dark bg ✓
  textMid: '#b09878',     // bumped from #a08868 for ~7:1 contrast ✓
  textDim: '#8a7860',     // bumped from #685840 for ~4.5:1 contrast ✓ WCAG AA
}
