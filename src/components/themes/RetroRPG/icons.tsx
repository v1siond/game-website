// The small pixel icons that sit in a command's slot, the way each of the game's command buttons carries
// its own glyph until the heart takes the slot. Each icon is a 7 by 7 grid written as rows ('#' a lit
// pixel), turned into one rect per lit run so the SVG stays a handful of nodes. The icon draws in
// currentColor, so it turns yellow with its command.

export type IconId = 'engineer' | 'drummer' | 'fighter' | 'email' | 'linkedin' | 'cv' | 'game'

const ROWS: Record<IconId, readonly string[]> = {
  // a terminal: the frame and the prompt
  engineer: ['#######', '#.....#', '#.#...#', '#..#..#', '#.#.###', '#.....#', '#######'],
  // two crossed drumsticks
  drummer: ['##...##', '.##.##.', '..###..', '...#...', '..###..', '.##.##.', '##...##'],
  // a boxing glove, cuff below
  fighter: ['.####..', '######.', '#######', '#######', '.#####.', '..###..', '.#####.'],
  // an envelope
  email: ['.......', '#######', '##...##', '#.#.#.#', '#..#..#', '#######', '.......'],
  // two linked rings
  linkedin: ['.......', '###....', '#.#####', '###.#.#', '..#####', '.......', '.......'],
  // a page with lines
  cv: ['#####..', '#...##.', '#.##..#', '#.....#', '#.###.#', '#.....#', '#######'],
  // a star
  game: ['...#...', '...#...', '#######', '.#####.', '..###..', '.##.##.', '##...##'],
}

type Run = { x: number; y: number; w: number }

const runsOf = (row: string, y: number): Run[] =>
  [...row.matchAll(/#+/g)].map((match) => ({ x: match.index ?? 0, y, w: match[0].length }))

const RUNS: Record<IconId, Run[]> = Object.fromEntries(
  Object.entries(ROWS).map(([id, rows]) => [id, rows.flatMap(runsOf)]),
) as Record<IconId, Run[]>

export function PixelIcon({ id, className = '' }: { id: IconId; className?: string }) {
  return (
    <svg viewBox="0 0 7 7" className={className} aria-hidden="true" focusable="false" shapeRendering="crispEdges" fill="currentColor">
      {RUNS[id].map(({ x, y, w }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </svg>
  )
}
