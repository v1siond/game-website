import { createContext, useContext, type ReactNode } from 'react'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import type { Dir } from './desert'
import { Burst, PLATE } from './ink'
import { CEL } from './palette'
import cel from './cel.module.css'

// The game's own tells drawn into a scene, the things a player knows it by (research notes, What makes it
// unique): the damage number thrown off every hit, the name, level and health bar over every foe, the boss's
// freeze frame card with his name in huge red letters and a joke line over a steel plate, the stat card of a
// gun that pops out of a chest in its rarity's colour, the scope's round frame with its red skull on the
// target, the big comic callouts and the voice's waveform. The words are ours. Each is drawn round its own
// middle and kept upright (Upright) when the stop is laid out the other way round on a phone, so nothing reads
// backwards. Each has its writer over the stop's move t (0 to 1).

/** Which way the stop is laid out, for the words in it to stay upright. */
export const Facing = createContext<Dir>(1)

/** Its children drawn upright whichever way the stop runs: they are drawn round their own middle. */
export function Upright({ children }: { children: ReactNode }) {
  const dir = useContext(Facing)
  return <g transform={dir === 1 ? undefined : 'scale(-1 1)'}>{children}</g>
}

/** Lettering in the display face with its ink line, `size` high, centred on (x, y). */
export function Word({ text, x = 0, y = 0, size, fill, line = 8, anchor = 'middle' }: { text: string; x?: number; y?: number; size: number; fill: string; line?: number; anchor?: 'middle' | 'start' }) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} strokeWidth={line} textAnchor={anchor} dominantBaseline="middle" className={cel.lettering}>
      {text}
    </text>
  )
}

const at = (x: number, y: number): string => `translate(${x.toFixed(1)} ${y.toFixed(1)})`

// ---- the damage numbers ----

/** One number thrown off a hit: where it starts, what it reads, when on the move's t it flies, and whether it
 *  was a critical hit (bigger, red, CRITICAL over it). */
export interface Hit {
  x: number
  y: number
  value: string
  at: number
  crit?: boolean
}

/** How much of the move's t a number takes to rise and fade. */
const RISE = 0.13

/** The numbers of a stop ([data-fx="{name}-{i}"]), hidden until their hit. */
export function Hits({ name, hits }: { name: string; hits: readonly Hit[] }) {
  return (
    <>
      {hits.map((hit, i) => (
        <g key={`${hit.x}-${hit.at}`} data-fx={`${name}-${i}`} opacity="0" transform={at(hit.x, hit.y)}>
          <Upright>
            {hit.crit && <Word text="CRITICAL" y={-50} size={30} fill={CEL.crit} line={7} />}
            <Word text={hit.value} size={hit.crit ? 66 : 52} fill={hit.crit ? CEL.crit : CEL.sun} line={9} />
          </Upright>
        </g>
      ))}
    </>
  )
}

/** Flies each number up off its hit, a pop as it lands, gone by the end of its rise. */
export function hitsWriter(stage: ParentNode, name: string, hits: readonly Hit[]): (t: number) => void {
  const nodes = hits.map((_, i) => fx(stage, `${name}-${i}`))
  return (t) =>
    hits.forEach((hit, i) => {
      const rise = ramp(t, hit.at, hit.at + RISE)
      const pop = 1 + 0.5 * (1 - ramp(t, hit.at, hit.at + 0.02))
      transformTo(nodes[i], `${at(hit.x + 30 * rise, hit.y - 110 * rise)} scale(${pop.toFixed(3)})`)
      fadeTo(nodes[i], ramp(t, hit.at, hit.at + 0.01) * (1 - ramp(t, hit.at + 0.7 * RISE, hit.at + RISE)))
    })
}

// ---- the tag over a foe ----

const TAG_W = 130

/** A foe's tag `y` over its foot: its level and name on an ink plate, its red health bar
 *  ([data-fx="{name}-hp"], drained by its writer). */
export function Tag({ name, label, level, y }: { name: string; label: string; level: number; y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <Upright>
        <rect x={-TAG_W / 2} y={-44} width={TAG_W} height={30} fill={CEL.inkSoft} opacity={0.85} data-bare />
        <Word text={`LV ${level} ${label}`} y={-28} size={22} fill={CEL.paper} line={0} />
        <rect x={-TAG_W / 2} y={-8} width={TAG_W} height={14} fill={CEL.ink} data-bare />
        <g transform={`translate(${-TAG_W / 2 + 2} 0)`}>
          <rect data-fx={`${name}-hp`} x={0} y={-6} width={TAG_W - 4} height={10} fill={CEL.crit} data-bare />
        </g>
      </Upright>
    </g>
  )
}

/** Drains a tag's bar from `from` to `to` on the move's t. */
export function drainWriter(stage: ParentNode, name: string, from: number, to: number): (t: number) => void {
  const hp = fx(stage, `${name}-hp`)
  return (t) => transformTo(hp, `scale(${(1 - ramp(t, from, to)).toFixed(3)} 1)`)
}

// ---- the boss card ----

const CARD = { w: 600, h: 250 }

// Sized so a long name and a long joke still fit the card.
const titleSize = (title: string): number => Math.min(118, 560 / (0.5 * title.length))
const jokeSize = (joke: string): number => Math.min(32, 540 / (0.47 * joke.length))

/** A boss's freeze frame card round (0, 0): a steel plate in red going hot orange, his name in huge red letters
 *  with an ink and a white line round them, and his joke on an ink strip under it, set on a slant. */
export function TitleCard({ name, x, y, title, joke }: { name: string; x: number; y: number; title: string; joke: string }) {
  return (
    <g data-fx={name} opacity="0" transform={at(x, y)}>
      <Upright>
        <g transform="rotate(-6)">
          <polygon points={`${-CARD.w / 2},${-CARD.h / 2} ${CARD.w / 2},${-CARD.h / 2 - 20} ${CARD.w / 2 + 10},${CARD.h / 2} ${-CARD.w / 2 - 10},${CARD.h / 2 + 10}`} fill={CEL.bossRed} className={cel.heavy} />
          <polygon points={`${-CARD.w / 6},${-CARD.h / 2 - 7} ${CARD.w / 2},${-CARD.h / 2 - 20} ${CARD.w / 2 + 10},${CARD.h / 2} ${CARD.w / 8},${CARD.h / 2 + 4}`} fill={CEL.bossHot} data-bare />
          <rect x={-CARD.w / 2} y={-CARD.h / 2 - 20} width={CARD.w + 10} height={CARD.h + 30} fill={PLATE} data-bare />
          <text x={0} y={-12} fontSize={titleSize(title)} fill={CEL.white} strokeWidth={26} textAnchor="middle" dominantBaseline="middle" className={`${cel.lettering} ${cel.halo}`}>
            {title}
          </text>
          <Word text={title} y={-12} size={titleSize(title)} fill={CEL.bossRed} line={10} />
          <rect x={-CARD.w / 2 + 20} y={64} width={CARD.w - 40} height={48} fill={CEL.ink} data-bare />
          <Word text={joke} y={89} size={jokeSize(joke)} fill={CEL.paper} line={0} />
        </g>
      </Upright>
    </g>
  )
}

/** Slams the card in at `from` (from big to its size) and throws it off at `to`. */
export function cardWriter(stage: ParentNode, name: string, x: number, y: number, from: number, to: number): (t: number) => void {
  const card = fx(stage, name)
  return (t) => {
    const slam = ramp(t, from, from + 0.025)
    const off = ramp(t, to, to + 0.025)
    transformTo(card, `${at(x + 500 * off * off, y)} scale(${(1.7 - 0.7 * slam).toFixed(3)})`)
    fadeTo(card, slam * (1 - off))
  }
}

// ---- the loot card ----

/** A gun's stat card round (0, 0): its rarity's frame, its name in that colour, the gun, three stats. */
export function LootStats({ name, x, y, color, title, stats }: { name: string; x: number; y: number; color: string; title: string; stats: readonly string[] }) {
  return (
    <g data-fx={name} opacity="0" transform={at(x, y)}>
      <Upright>
        <rect x={-130} y={-100} width={260} height={200} fill={color} className={cel.heavy} />
        <rect x={-118} y={-88} width={236} height={176} fill={CEL.inkSoft} data-bare />
        <Word text={title} y={-66} size={26} fill={color} line={0} />
        <path d="M-70 -30 L40 -30 L66 -36 L66 -22 L40 -18 L-14 -18 L-24 6 L-42 6 L-36 -18 L-70 -18 Z" fill={color} />
        {stats.map((stat, i) => (
          <Word key={stat} text={stat} x={-100} y={28 + 24 * i} size={22} fill={CEL.paper} line={0} anchor="start" />
        ))}
      </Upright>
    </g>
  )
}

/** Pops a card or a callout up at `from`, with a little overshoot, and holds it; gone again at `to` if given. */
export function popWriter(stage: ParentNode, name: string, x: number, y: number, from: number, to = 2): (t: number) => void {
  const node = fx(stage, name)
  return (t) => {
    const pop = ramp(t, from, from + 0.04)
    const scale = pop < 1 ? 0.4 + 0.75 * pop : 1
    transformTo(node, `${at(x, y)} scale(${scale.toFixed(3)})`)
    fadeTo(node, Math.min(1, 3 * pop) * (1 - ramp(t, to, to + 0.03)))
  }
}

// ---- the scope ----

/** The scope's round frame laid over a target round (0, 0): the steel ring, the tinted glass, the red cross
 *  hairs and the red skull over the target; its flash ([data-fx="{name}-flash"]) on the shot. */
export function Scope({ name, x, y }: { name: string; x: number; y: number }) {
  return (
    <g data-fx={name} opacity="0" transform={at(x, y)}>
      <circle r={120} fill={CEL.holo} opacity={0.14} data-bare />
      <circle r={132} fill="none" stroke={CEL.ink} strokeWidth={34} data-bare />
      <circle r={132} fill="none" stroke={CEL.steelDark} strokeWidth={22} data-bare />
      <path d="M-120 0 H-26 M26 0 H120 M0 -120 V-26 M0 26 V120" stroke={CEL.crit} strokeWidth={4} data-bare />
      <path d="M-14 -64 Q-14 -84 0 -84 Q14 -84 14 -64 L10 -56 L-10 -56 Z" fill={CEL.crit} stroke={CEL.ink} strokeWidth={2} />
      <circle cx={-5} cy={-68} r={3.5} fill={CEL.ink} data-bare />
      <circle cx={5} cy={-68} r={3.5} fill={CEL.ink} data-bare />
      <g data-fx={`${name}-flash`} opacity="0">
        <Burst x={0} y={0} r={44} fill={CEL.sun} />
      </g>
    </g>
  )
}

/** Brings the scope onto its target at `from`, flashes on the shot at `shot`, and lifts it off at `to`. */
export function scopeWriter(stage: ParentNode, name: string, x: number, y: number, [from, shot, to]: readonly [number, number, number]): (t: number) => void {
  const scope = fx(stage, name)
  const flash = fx(stage, `${name}-flash`)
  return (t) => {
    const on = ramp(t, from, from + 0.05)
    transformTo(scope, `${at(x, y)} scale(${(1.4 - 0.4 * on).toFixed(3)})`)
    fadeTo(scope, on * (1 - ramp(t, to, to + 0.03)))
    fadeTo(flash, Math.sin(Math.PI * ramp(t, shot, shot + 0.03)))
  }
}

// ---- callouts and the voice ----

/** A big comic callout round (0, 0) ([data-fx="{name}"]), hidden until its writer (popWriter) shows it. */
export function Callout({ name, x, y, text, fill, size = 60 }: { name: string; x: number; y: number; text: string; fill: string; size?: number }) {
  return (
    <g data-fx={name} opacity="0" transform={at(x, y)}>
      <Upright>
        <g transform="rotate(-5)">
          <Word text={text} size={size} fill={fill} line={11} />
        </g>
      </Upright>
    </g>
  )
}

/** The voice in his ear, a waveform of five bars 90 wide round its middle, each bar ([data-fx="{name}-{i}"])
 *  scaled by the voice. */
export function Waveform({ name }: { name: string }) {
  return (
    <g>
      <rect x={-56} y={-40} width={112} height={80} rx={12} fill={CEL.inkSoft} opacity={0.7} data-bare />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} data-fx={`${name}-${i}`} x={-45 + i * 20} y={-30} width={10} height={60} rx={5} fill={CEL.holo} transform="scale(1 0.2)" />
      ))}
    </g>
  )
}

/** Pulses the voice's bars while `on` (0 to 1) shows it, `t` the move's t. */
export function voiceWriter(stage: ParentNode, name: string): (t: number, on: number) => void {
  const voice = fx(stage, name)
  const bars = [0, 1, 2, 3, 4].map((i) => fx(stage, `${name}-${i}`))
  return (t, on) => {
    fadeTo(voice, on)
    bars.forEach((bar, i) => transformTo(bar, `scale(1 ${(0.2 + 0.8 * Math.abs(Math.sin(t * 60 + i * 1.3))).toFixed(3)})`))
  }
}
