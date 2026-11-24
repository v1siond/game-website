import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { HOURS } from '../desert'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { loot } from '../pose'

// Projects at dusk: a loot chest before him. First he kneels at it and throws the lid off, and a column of
// the rarity's light stands up out of it (the rarity of his first project, from its own facts, loot.ts,
// shown by its colour only); then a weapon in the same colour floats up into the light and he springs up
// with a fist thrown at it.

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
  script: [1800, 2000],
  ends: [0.5, 1],
  back: ({ tones }) => (
    <>
      <g data-fx="light" opacity="0">
        <Light tone={tones[0] ?? CEL.common} />
      </g>
      <Chest />
      <g data-fx="lid" transform={`translate(${CHEST} -80)`}>
        <path d="M-62 0 Q0 -46 62 0 Z" fill={CEL.steel} />
      </g>
      <g data-fx="weapon" transform={`translate(${CHEST} -60)`} opacity="0">
        <Weapon tone={tones[0] ?? CEL.common} />
      </g>
    </>
  ),
  move: (_profession, t) => still(loot(t)),
  reply: (stage) => {
    const light = fx(stage, 'light')
    const lid = fx(stage, 'lid')
    const weapon = fx(stage, 'weapon')
    return (t) => {
      const open = ramp(t, 0.35, 0.5)
      transformTo(lid, `translate(${(CHEST - 60 * open).toFixed(1)} ${(-80 - 90 * open).toFixed(1)}) rotate(${(-120 * open).toFixed(1)})`)
      fadeTo(lid, 1 - ramp(t, 0.45, 0.55))
      fadeTo(light, ramp(t, 0.4, 0.55))
      const rise = ramp(t, 0.5, 0.85)
      fadeTo(weapon, ramp(t, 0.5, 0.6))
      transformTo(weapon, `translate(${CHEST} ${(-60 + (FLOAT + 60) * rise).toFixed(1)}) rotate(${(-12 + 12 * rise).toFixed(1)})`)
    }
  },
})
