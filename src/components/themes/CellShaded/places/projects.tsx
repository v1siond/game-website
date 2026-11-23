import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { HOURS } from '../desert'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { loot } from '../pose'

// Projects at dusk: for each project a loot chest comes to him on the run. He kneels at it and throws the
// lid; a column of the rarity's light stands up out of it (the rarity from the project's own facts,
// loot.ts, shown by its colour only), a weapon in the same colour floats up into the light, and he springs
// up with a fist thrown at it.

const CHEST = 170
// The weapon floats up out of the chest to this height.
const FLOAT = -360

function Chest() {
  return (
    <g transform={`translate(${CHEST} 0)`}>
      <rect x={-62} y={-80} width={124} height={80} fill={CEL.steelDark} />
      <rect x={-12} y={-92} width={24} height={26} fill={CEL.sun} />
    </g>
  )
}

function Light({ tone }: { tone: string }) {
  return (
    <g transform={`translate(${CHEST} 0)`}>
      <path d="M-40 -90 L-26 -560 L26 -560 L40 -90 Z" fill={tone} opacity="0.55" data-bare />
      <rect x={-62} y={-84} width={124} height={8} fill={tone} />
    </g>
  )
}

// The weapon in the rarity's colour, drawn round its middle.
function Weapon({ tone }: { tone: string }) {
  return <path d="M-70 -10 L50 -10 L50 -18 L80 -18 L80 -6 L50 -2 L10 -2 L4 20 L-12 20 L-8 -2 L-54 -2 L-70 12 Z" fill={tone} />
}

export const projects = stopsPlace({
  hour: HOURS.dusk,
  back: (i, { tones }) => (
    <>
      <g data-fx={`light-${i}`} opacity="0">
        <Light tone={tones[i] ?? CEL.common} />
      </g>
      <Chest />
      <g data-fx={`lid-${i}`} transform={`translate(${CHEST} -80)`}>
        <path d="M-62 0 Q0 -46 62 0 Z" fill={CEL.steel} />
      </g>
      <g data-fx={`weapon-${i}`} transform={`translate(${CHEST} -60)`} opacity="0">
        <Weapon tone={tones[i] ?? CEL.common} />
      </g>
    </>
  ),
  move: (_profession, t) => still(loot(t)),
  reply: (stage, { count }) => {
    const lights = Array.from({ length: count }, (_, i) => fx(stage, `light-${i}`))
    const lids = Array.from({ length: count }, (_, i) => fx(stage, `lid-${i}`))
    const weapons = Array.from({ length: count }, (_, i) => fx(stage, `weapon-${i}`))
    return (played) =>
      lights.forEach((light, i) => {
        const t = played(i)
        const open = ramp(t, 0.35, 0.5)
        transformTo(lids[i], `translate(${(CHEST - 60 * open).toFixed(1)} ${(-80 - 90 * open).toFixed(1)}) rotate(${(-120 * open).toFixed(1)})`)
        fadeTo(light, ramp(t, 0.4, 0.55))
        const rise = ramp(t, 0.5, 0.85)
        fadeTo(weapons[i], ramp(t, 0.5, 0.6))
        transformTo(weapons[i], `translate(${CHEST} ${(-60 + (FLOAT + 60) * rise).toFixed(1)}) rotate(${(-12 + 12 * rise).toFixed(1)})`)
      })
  },
})
