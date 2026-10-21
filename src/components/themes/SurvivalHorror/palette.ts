// The Survival Horror world's palette and its CSS paper textures.

// Resident Evil actual game palette - from gameplay screenshots
// RE1 Remake mansion, RE4 village, RE7 Baker house
export const RE = {
  // Blacks and deep shadows
  void: '#0f0a08',
  shadow: '#1a1410',

  // Sepia browns (dominant)
  darkSepia: '#2a2018',
  sepia: '#3d3020',
  midBrown: '#5c4a38',

  // Olive/muddy greens
  olive: '#4a4a30',
  deadGreen: '#3a4030',

  // Rust/burgundy accents - HORROR colors
  rust: '#6b4030',
  burgundy: '#4a2020',
  blood: '#6b1010',
  bloodDark: '#3a0808',

  // Warm highlights (candlelight/fireplace)
  warmGlow: '#c49050',
  candlelight: '#e8a860',
  cream: '#d8c8a8',
  ivory: '#f0e8d8',

  // Fog/mist
  fog: '#a8a090',
  mistDark: '#706860',
}

// CSS texture patterns for horror feel
export const TEXTURES = {
  // Scratched/clawed surface
  scratches: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 20 L25 35 M15 40 L30 60 M5 70 L20 85 M60 10 L75 25 M70 50 L85 70 M55 80 L70 95' stroke='%23000' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
  // Decayed/worn paper
  wornPaper: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
  // Blood stain texture
  bloodStain: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='15' fill='%236b1010' opacity='0.05'/%3E%3Ccircle cx='45' cy='20' r='8' fill='%233a0808' opacity='0.03'/%3E%3C/svg%3E")`,
}
