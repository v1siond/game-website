import type { Profession } from '@/lib/cv/professions'
import { EYES, OUTFITS, PART_TOP, SPRITE, headRows, legRows, spriteRuns, torsoRows, type LegFrame, type TorsoFrame } from './sprite'
import map from './map.module.css'

// Him as the map walker (the pixel data in sprite.ts). Every frame is drawn once and the CSS picks the one
// showing from the attributes of the element he stands in: data-walking (the trail walker writes it) swaps
// the two step frames, data-acting plays his profession's action, data-cheer raises both arms. The swap
// is a one frame opacity step, the way sprite frames change; an idle breath and a blink run underneath.

const TORSO_FRAMES: TorsoFrame[] = ['idle', 'walkA', 'walkB', 'actA', 'actB', 'cheer']
const LEG_FRAMES: LegFrame[] = ['stand', 'walkA', 'walkB']

function Pixels({ rows, top, colours }: { rows: readonly string[]; top: number; colours: Record<string, string> }) {
  return (
    <>
      {spriteRuns(rows, top).map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={colours[run.key]} />
      ))}
    </>
  )
}

export function TrailWalker({ profession, className = '' }: { profession: Profession; className?: string }) {
  const { headgear, colours } = OUTFITS[profession]

  return (
    <svg
      viewBox={`0 0 ${SPRITE.width} ${SPRITE.height}`}
      className={`overflow-visible ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx={SPRITE.width / 2} cy={SPRITE.height - 0.4} rx={6} ry={1.4} fill={colours.K} opacity={0.3} shapeRendering="auto" />
      <g className={map.hop}>
        <g className={map.breath}>
          {LEG_FRAMES.map((frame) => (
            <g key={frame} className={map.frame} data-f={`legs-${frame}`}>
              <Pixels rows={legRows(frame)} top={PART_TOP.legs} colours={colours} />
            </g>
          ))}
          {TORSO_FRAMES.map((frame) => (
            <g key={frame} className={map.frame} data-f={`torso-${frame}`}>
              <Pixels rows={torsoRows(profession, frame)} top={PART_TOP.torso} colours={colours} />
            </g>
          ))}
          <Pixels rows={headRows(headgear)} top={PART_TOP.head} colours={colours} />
          <g className={map.blink}>
            {EYES.map(([x, y]) => (
              <rect key={x} x={x} y={y} width={1} height={1} fill={colours.S} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  )
}
