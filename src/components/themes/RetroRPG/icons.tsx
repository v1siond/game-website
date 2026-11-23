import { pixelRuns, type Run } from '@/lib/pixelRuns'
import { PixelRuns } from '../shared/PixelRuns'

// The small pixel icons that sit in a command's slot, the way each of the game's command buttons carries
// its own glyph until the cursor arrow takes the slot. Each icon is a 7 by 7 grid written as rows ('#' a lit
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

const RUNS = Object.fromEntries(Object.entries(ROWS).map(([id, rows]) => [id, pixelRuns(rows, 0)])) as Record<IconId, Run[]>

const LIT = { '#': 'currentColor' }

export function PixelIcon({ id, className = '' }: { id: IconId; className?: string }) {
  return (
    <svg viewBox="0 0 7 7" className={className} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <PixelRuns runs={RUNS[id]} colours={LIT} />
    </svg>
  )
}
