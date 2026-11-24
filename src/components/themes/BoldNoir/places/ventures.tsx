import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, still, stepPlace } from '../case'
import { read } from '../pose'

// Ventures: the newsstand on the corner. A front page spins in toward the camera, the way the films of the
// time cut to a headline, and stops square to it, its photo ringed in red; then it settles back down onto
// the stand as he takes a copy up and reads it. The game's newspapers, each a piece of the story beyond the
// case. No words on it: the headline and the columns are bars.

const STAND = { from: 200, to: 430 }
// The front page spins in round this spot, this many turns.
const PAGE = { x: 330, y: -470, w: 360, h: 460 }
const TURNS = 2.5

function Stand() {
  const { from, to } = STAND
  return (
    <>
      <rect x={from} y={-170} width={to - from} height={170} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="4" />
      <path d={`M${from - 20} -260 H${to + 20} L${to} -210 H${from} Z`} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="4" />
      {Array.from({ length: 6 }, (_, i) => from - 20 + i * ((to - from + 40) / 6)).map((x, i) =>
        i % 2 === 0 ? <path key={x} d={`M${x} -260 h${(to - from + 40) / 6} l-6 50 h${-(to - from + 40) / 6} Z`} fill={NOIR.ink} /> : null,
      )}
      <path d={`M${from + 10} -210 V-170 M${to - 10} -210 V-170`} stroke={NOIR.ink} strokeWidth="6" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${from + 20 + i * 70} ${-186 + i * 2})`}>
          <rect width={56} height={16} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="2" />
          <rect x={6} y={4} width={44} height={4} fill={NOIR.ink} />
        </g>
      ))}
    </>
  )
}

function FrontPage() {
  const { w, h } = PAGE
  return (
    <g data-fx="front-page" opacity="0">
      <g transform={`translate(${-w / 2} ${-h / 2})`}>
        <rect width={w} height={h} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="6" />
        <rect x={24} y={20} width={w - 48} height={44} fill={NOIR.ink} />
        <path d={`M24 76 H${w - 24}`} stroke={NOIR.ink} strokeWidth="3" />
        <rect x={24} y={92} width={w - 48} height={30} fill={NOIR.ink} />
        <rect x={24} y={132} width={w - 120} height={30} fill={NOIR.ink} />
        <rect x={24} y={180} width={160} height={140} fill={NOIR.ash} />
        <path d="M60 320 L60 250 Q104 210 148 250 L148 320 Z M84 240 a20 22 0 1 0 40 0 a20 22 0 1 0 -40 0" fill={NOIR.smoke} />
        <ellipse cx={104} cy={250} rx={96} ry={86} fill="none" stroke={NOIR.red} strokeWidth="6" />
        {Array.from({ length: 8 }, (_, i) => 186 + i * 18).map((y) => (
          <path key={y} d={`M204 ${y} H${w - 24}`} stroke={NOIR.ash} strokeWidth="5" />
        ))}
        {Array.from({ length: 6 }, (_, i) => 344 + i * 18).map((y) => (
          <path key={y} d={`M24 ${y} H${w / 2 - 10} M${w / 2 + 10} ${y} H${w - 24}`} stroke={NOIR.ash} strokeWidth="5" />
        ))}
      </g>
    </g>
  )
}

export const ventures = stepPlace({
  light: NOIR.paper,
  script: [1800, 1700],
  back: () => <Stand />,
  front: () => <FrontPage />,
  bind: (stage, { profession }) => {
    const page = fx(stage, 'front-page')
    const stack = { x: (STAND.from + STAND.to) / 2, y: -186 }
    return (play) => {
      const spun = share(play, 0)
      const settled = share(play, 1)
      // it spins in from a speck, square to the camera at the end, then shrinks back down onto the stack
      const scale = (0.04 + 0.96 * spun) * (1 - 0.9 * ramp(settled, 0, 0.6))
      const turn = 360 * TURNS * (1 - spun)
      const x = PAGE.x + (stack.x - PAGE.x) * ramp(settled, 0, 0.6)
      const y = PAGE.y + (stack.y - PAGE.y) * ramp(settled, 0, 0.6)
      transformTo(page, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${turn.toFixed(1)}) scale(${scale.toFixed(3)})`)
      fadeTo(page, spun > 0 ? 1 - ramp(settled, 0.5, 0.65) : 0)
      return still(read(profession, ramp(settled, 0.3, 1)))
    }
  },
})
