// Neon Portals' colours for SVG fills and strokes, which Tailwind classes cannot reach. The page itself
// uses the same values as Tailwind arbitrary colours.
//
// Two portal colours carry every scene: orange is where he comes in, blue is where he leaves. Rift
// violet is the tear between dimensions (a torn pocket turns from violet to blue once it is crossed).
// Text on the void: white 17:1, muted 8.6:1, orange 9.4:1, blue 7.3:1, violet 6.6:1.
export const PORTAL = {
  VOID: '#07060f',
  CHAMBER: '#12111c',
  PANEL: '#1c1b29',
  SEAM: '#2c2a3d',
  WHITE: '#edebe4',
  MUTED: '#a9a6b8',
  ORANGE: '#ff9a00',
  BLUE: '#00a2ff',
  VIOLET: '#b57bff',
  GRID: '#0d3a5c',
} as const
