import type { ReactNode } from 'react'
import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell } from '../../shared/stageNodes'
import { Burst } from '../props'
import type { Frame } from '../moves'
import type { PartnerFrame } from '../partner'

// What the places share: the cover a place lays over the whole view (the storm's dark, the cave's dark, the
// flash), a puff of dust, and the partner's frames that follow his.

/** A rect over the whole view round his spot, on a wide screen and on a phone, at any shift. */
export const COVER = { x: -1400, y: -1300, width: 2600, height: 2400 } as const

/** A puff of dust on the ground at `x`, `data-fx` named, its place fading it in and out. */
export function Dust({ name, x, size = 70 }: { name: string; x: number; size?: number }): ReactNode {
  return (
    <g data-fx={name} opacity="0" transform={`translate(${x} -10)`}>
      <ellipse rx={size} ry={size / 5} fill="#e8d9b8" opacity={0.75} />
      <ellipse cx={-size / 2} cy={-size / 5} rx={size / 3} ry={size / 4} fill="#e8d9b8" opacity={0.6} />
      <ellipse cx={size / 2} cy={-size / 6} rx={size / 3} ry={size / 4} fill="#e8d9b8" opacity={0.6} />
    </g>
  )
}

/** A flash of light round 0 0 where a thing bursts or lands. */
export function Flash({ name, x, y, size }: { name: string; x: number; y: number; size: number }): ReactNode {
  return (
    <g data-fx={name} opacity="0" transform={`translate(${x} ${y})`}>
      <Burst size={size} />
    </g>
  )
}

/** The partner a step behind him, on the ground or in the air with him, his stride kept with his. */
export const behind = (frame: Frame, gap: number, phase = 0): PartnerFrame => ({
  ahead: frame.ahead - gap,
  lift: frame.lift ?? 0,
  phase,
  air: (frame.lift ?? 0) > 4 ? 1 : 0,
  opacity: frame.opacity ?? 1,
})

/** The partner on his own feet at `ahead`, still. */
export const waiting = (ahead: number, arms = 0): PartnerFrame => ({ ahead, arms })

/** A hop of the partner from `from` to `to` while t runs a..b, his legs tucked in the air. */
export const hopOf = (t: number, a: number, b: number, from: number, to: number, height: number, fromLift = 0, toLift = 0): PartnerFrame => {
  const u = ramp(t, a, b)
  return { ahead: from + (to - from) * u, lift: fromLift + (toLift - fromLift) * u + hop(u, height), air: bell(t, a, b) }
}
