'use client'

import { useId, type CSSProperties, type ReactNode } from 'react'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { FS } from './palette'
import { CELL, framesFor, type ArmPose, type FighterPose, type Frame, type Fx, type LegPose, type Pt } from './poses'
import { motionFor, type BallKind } from './moves'
import sprite from './fighter.module.css'

// Him as player one, a parody of the arcade karate hero drawn as a big fighting game sprite: a strong ink
// outline round every part, hand painted cel shading (one hard shadow tone per part, light from the upper
// left, the far limbs a tone darker), the white gi with its sleeves torn off at the shoulder and its ragged
// trouser hems, the black belt with its knot and tails, the long red headband whose tails wave frame by
// frame, red fingerless gloves, bare feet, and his own face: short dark spiky hair, the full dark beard,
// the oval eye, the skin from HERO_IDENTITY. The Musician keeps the gi and carries sticks; the Martial
// Artist fights his own art, bare chested in blue Muay Thai shorts, red boxing gloves, the prajioud on
// his arms and the mongkhon on his head in place of the headband.
//
// Frames are joint tables (poses.ts) laid side by side in a strip; the strip steps one cell at a time
// (fighter.module.css), the way a sprite sheet plays, so a move is one animated element.

const INK = FS.ink
const LINE = 1.8

interface Tone {
  base: string
  shade: string
}

const SKIN: Tone = { base: HERO_IDENTITY.skin, shade: HERO_IDENTITY.skinShade }
const SKIN_FAR: Tone = { base: HERO_IDENTITY.skinShade, shade: FS.skinDeep }
const GI: Tone = { base: FS.gi, shade: FS.giShade }
const GI_FAR: Tone = { base: FS.giShade, shade: FS.giDeep }
const RED: Tone = { base: FS.p2, shade: FS.p2Dark }
const SHORTS: Tone = { base: FS.p1, shade: '#1a4fb0' }
const GOLD: Tone = { base: FS.gold, shade: FS.orange }

interface Costume {
  top: 'gi' | 'bare'
  legs: 'gi' | 'shorts'
  head: 'band' | 'mongkhon'
  hands: 'wraps' | 'sticks' | 'gloves'
}

const COSTUME: Record<Profession, Costume> = {
  engineer: { top: 'gi', legs: 'gi', head: 'band', hands: 'wraps' },
  drummer: { top: 'gi', legs: 'gi', head: 'band', hands: 'sticks' },
  fighter: { top: 'bare', legs: 'shorts', head: 'mongkhon', hands: 'gloves' },
}

// ---- geometry ----

const r1 = (v: number) => Math.round(v * 10) / 10
const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`
const plus = (p: Pt, v: Pt, k: number): Pt => [p[0] + v[0] * k, p[1] + v[1] * k]
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function axis(from: Pt, to: Pt): { u: Pt; n: Pt } {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const length = Math.hypot(dx, dy) || 1
  const u: Pt = [dx / length, dy / length]
  return { u, n: [-u[1], u[0]] }
}

// A limb as a capsule: straight sides, round ends of each width.
function capsule(from: Pt, to: Pt, w1: number, w2: number): string {
  const { n } = axis(from, to)
  const a = w1 / 2
  const b = w2 / 2
  return `M${pt(plus(from, n, a))} L${pt(plus(to, n, b))} A${b} ${b} 0 0 0 ${pt(plus(to, n, -b))} L${pt(plus(from, n, -a))} A${a} ${a} 0 0 0 ${pt(plus(from, n, a))}Z`
}

// The side of a part turned from the light (upper left), as the sign of its normal.
function shadeSide(n: Pt): number {
  return n[0] + n[1] >= 0 ? 1 : -1
}

// The hard cel shadow along the dark side of a capsule.
function shadeStrip(from: Pt, to: Pt, w1: number, w2: number): string {
  const { n } = axis(from, to)
  const side = shadeSide(n)
  const s: Pt = [n[0] * side, n[1] * side]
  return `M${pt(plus(from, s, w1 * 0.08))} L${pt(plus(to, s, w2 * 0.08))} L${pt(plus(to, s, w2 / 2))} L${pt(plus(from, s, w1 / 2))}Z`
}

// A gi trouser leg: round at the knee, torn into a zigzag at the ankle.
function trouser(from: Pt, to: Pt, w1: number, w2: number): string {
  const { u, n } = axis(from, to)
  const a = w1 / 2
  const b = w2 / 2
  const teeth = [-1, -0.5, 0, 0.5, 1].map((t, i) => plus(plus(to, n, b * t * -1), u, i % 2 ? 4 : 1.2))
  return `M${pt(plus(from, n, a))} L${pt(plus(to, n, b))} ${teeth.map((p) => `L${pt(p)}`).join(' ')} L${pt(plus(from, n, -a))} A${a} ${a} 0 0 0 ${pt(plus(from, n, a))}Z`
}

// ---- parts ----

function Shaded({ d, shade, tone }: { d: string; shade: string; tone: Tone }) {
  return (
    <>
      <path d={d} fill={tone.base} />
      <path d={shade} fill={tone.shade} />
      <path d={d} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
    </>
  )
}

function Limb({ from, to, w1, w2, tone }: { from: Pt; to: Pt; w1: number; w2: number; tone: Tone }) {
  return <Shaded d={capsule(from, to, w1, w2)} shade={shadeStrip(from, to, w1, w2)} tone={tone} />
}

function Round({ at, r, tone }: { at: Pt; r: number; tone: Tone }) {
  return (
    <>
      <circle cx={r1(at[0])} cy={r1(at[1])} r={r} fill={tone.base} stroke={INK} strokeWidth={LINE} />
      <path d={`M${pt([at[0] + r * 0.2, at[1] + r * 0.95])} A${r} ${r} 0 0 0 ${pt([at[0] + r * 0.95, at[1] - r * 0.2])} A${r * 1.1} ${r * 1.1} 0 0 1 ${pt([at[0] + r * 0.2, at[1] + r * 0.95])}Z`} fill={tone.shade} />
    </>
  )
}

function Stick({ from, to }: { from: Pt; to: Pt }) {
  return (
    <>
      <path d={`M${pt(from)} L${pt(to)}`} stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      <path d={`M${pt(from)} L${pt(to)}`} stroke={FS.gold} strokeWidth={2.2} strokeLinecap="round" />
    </>
  )
}

function Hand({ arm, costume, skin }: { arm: ArmPose; costume: Costume; skin: Tone }) {
  const { u } = axis(arm.e, arm.h)
  if (costume.hands === 'gloves') {
    return (
      <>
        <Limb from={plus(arm.h, u, -5)} to={plus(arm.h, u, -1)} w1={9.4} w2={9.4} tone={GOLD} />
        <Round at={plus(arm.h, u, 2.4)} r={7.2} tone={RED} />
        <circle cx={r1(arm.h[0] + u[0] * 2.4 - 2.4)} cy={r1(arm.h[1] + u[1] * 2.4 - 2.6)} r={1.8} fill={FS.flash} opacity={0.75} />
      </>
    )
  }
  const wrap = <Limb from={plus(arm.h, u, -4.5)} to={plus(arm.h, u, -0.5)} w1={8.6} w2={8.6} tone={RED} />
  if (arm.hand === 'palm') {
    const centre = plus(arm.h, u, 3)
    const angle = (Math.atan2(u[1], u[0]) * 180) / Math.PI
    return (
      <>
        {wrap}
        <ellipse cx={r1(centre[0])} cy={r1(centre[1])} rx={3.6} ry={5.8} transform={`rotate(${r1(angle)} ${pt(centre)})`} fill={skin.base} stroke={INK} strokeWidth={LINE} />
      </>
    )
  }
  const stick = costume.hands === 'sticks' && <Stick from={plus(arm.h, u, -3)} to={arm.tip ?? plus(arm.h, u, 22)} />
  return (
    <>
      {wrap}
      {stick}
      <Round at={plus(arm.h, u, 1.6)} r={4.8} tone={skin} />
    </>
  )
}

// Where his gi sleeve was torn off: a ragged white cap over the shoulder.
function TornSleeve({ arm, tone }: { arm: ArmPose; tone: Tone }) {
  const { u, n } = axis(arm.s, arm.e)
  const edge = [-6.8, -3.4, 0, 3.4, 6.8].map((t, i) => plus(plus(arm.s, n, t), u, i % 2 ? 3 : 6.5))
  const d = `M${pt(plus(plus(arm.s, n, -6.8), u, -4))} L${pt(plus(plus(arm.s, n, 6.8), u, -4))} ${edge
    .reverse()
    .map((p) => `L${pt(p)}`)
    .join(' ')}Z`
  return <path d={d} fill={tone.base} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
}

function Arm({ arm, costume, far }: { arm: ArmPose; costume: Costume; far: boolean }) {
  const skin = far ? SKIN_FAR : SKIN
  return (
    <g>
      <Limb from={arm.s} to={arm.e} w1={10.4} w2={8.6} tone={skin} />
      <Limb from={arm.e} to={arm.h} w1={8.8} w2={7.4} tone={skin} />
      {costume.top === 'gi' && <TornSleeve arm={arm} tone={far ? GI_FAR : GI} />}
      {costume.top === 'bare' && <Limb from={lerp(arm.s, arm.e, 0.3)} to={lerp(arm.s, arm.e, 0.42)} w1={11.4} w2={11} tone={RED} />}
      <Hand arm={arm} costume={costume} skin={skin} />
    </g>
  )
}

function Leg({ leg, hip, costume, far }: { leg: LegPose; hip: Pt; costume: Costume; far: boolean }) {
  const skin = far ? SKIN_FAR : SKIN
  const foot = <Limb from={leg.a} to={leg.toe} w1={7.4} w2={5.6} tone={skin} />
  if (costume.legs === 'shorts') {
    return (
      <g>
        <Limb from={hip} to={leg.k} w1={13} w2={10.6} tone={skin} />
        <Limb from={leg.k} to={leg.a} w1={10.4} w2={7.6} tone={skin} />
        {foot}
        <Limb from={hip} to={lerp(hip, leg.k, 0.55)} w1={19} w2={17} tone={far ? { base: SHORTS.shade, shade: FS.panel } : SHORTS} />
      </g>
    )
  }
  const gi = far ? GI_FAR : GI
  return (
    <g>
      {foot}
      <Shaded d={trouser(leg.k, leg.a, 13.4, 14.4)} shade={shadeStrip(leg.k, leg.a, 13.4, 14.4)} tone={gi} />
      <Limb from={hip} to={leg.k} w1={17} w2={13.6} tone={gi} />
    </g>
  )
}

function Torso({ frame, costume }: { frame: Frame; costume: Costume }) {
  const { neck: n, hip: h, back, front } = frame
  const neckBase = <Limb from={n} to={[frame.head[0] - 1, frame.head[1] + 7]} w1={9} w2={8} tone={SKIN} />
  if (costume.top === 'bare') {
    const d = `M${pt([back.s[0] - 4, back.s[1]])} L${pt([n[0] - 3, n[1]])} L${pt([n[0] + 4, n[1]])} L${pt([front.s[0] + 4, front.s[1] + 1])} Q${pt([h[0] + 14, (n[1] + h[1]) / 2])} ${pt([h[0] + 10, h[1] - 4])} L${pt([h[0] - 10, h[1] - 4])} Q${pt([h[0] - 13, (n[1] + h[1]) / 2])} ${pt([back.s[0] - 4, back.s[1]])}Z`
    const shade = `M${pt([back.s[0] - 4, back.s[1]])} L${pt(lerp(n, h, 0.5))} L${pt([h[0] - 2, h[1] - 4])} L${pt([h[0] - 10, h[1] - 4])}Z`
    const chest = lerp(n, h, 0.28)
    return (
      <g>
        {neckBase}
        <Shaded d={d} shade={shade} tone={SKIN} />
        <path d={`M${pt([chest[0] - 7, chest[1]])} Q${pt([chest[0] - 1, chest[1] + 5])} ${pt([chest[0] + 7, chest[1] + 1])} M${pt(lerp(n, h, 0.5))} L${pt(lerp(n, h, 0.82))} M${pt([h[0] - 5, h[1] - 18])} H${r1(h[0] + 5)}`} fill="none" stroke={HERO_IDENTITY.skinShade} strokeWidth={1.4} strokeLinecap="round" />
        <Limb from={[h[0] - 12, h[1] - 4]} to={[h[0] + 12, h[1] - 4]} w1={5.6} w2={5.6} tone={GOLD} />
        <Limb from={[h[0] - 11, h[1] + 1]} to={[h[0] + 11, h[1] + 1]} w1={8} w2={8} tone={SHORTS} />
      </g>
    )
  }
  const hemBack: Pt = [h[0] - 12, h[1] + 12]
  const hemFront: Pt = [h[0] + 12, h[1] + 12]
  const sternum = plus(lerp(n, h, 0.42), [1, 0], 2)
  const top = `M${pt([back.s[0] - 3, back.s[1] - 1])} L${pt([n[0] - 2, n[1] - 1])} L${pt([n[0] + 5, n[1] - 1])} L${pt([front.s[0] + 4, front.s[1]])} Q${pt([h[0] + 15, (n[1] + h[1]) / 2])} ${pt(hemFront)} L${pt(hemBack)} Q${pt([h[0] - 14, (n[1] + h[1]) / 2])} ${pt([back.s[0] - 3, back.s[1] - 1])}Z`
  const shade = `M${pt([back.s[0] - 3, back.s[1] - 1])} L${pt(plus(lerp(n, h, 0.5), [1, 0], -4))} L${pt([h[0] - 2, h[1] + 12])} L${pt(hemBack)}Z`
  const swing = frame.wind % 2 ? 1 : -1
  const knot: Pt = [h[0] + 6, h[1] - 4.5]
  return (
    <g>
      {neckBase}
      <Shaded d={top} shade={shade} tone={GI} />
      <path d={`M${pt([n[0] - 1, n[1]])} L${pt([n[0] + 5, n[1]])} L${pt(sternum)}Z`} fill={SKIN.base} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d={`M${pt([n[0] + 5, n[1]])} L${pt(sternum)} L${pt([h[0] - 4, h[1] - 5])} M${pt([front.s[0], front.s[1] + 7])} L${pt([h[0] + 8, h[1] - 8])}`} fill="none" stroke={FS.giShade} strokeWidth={1.4} strokeLinecap="round" />
      <Limb from={[h[0] - 12.5, h[1] - 4.5]} to={[h[0] + 12.5, h[1] - 4.5]} w1={5.2} w2={5.2} tone={{ base: FS.belt, shade: INK }} />
      <path d={`M${pt(knot)} L${pt([knot[0] + swing * 2, knot[1] + 17])} M${pt(knot)} L${pt([knot[0] + 4 + swing * 3, knot[1] + 14])}`} stroke={INK} strokeWidth={4.6} strokeLinecap="round" />
      <path d={`M${pt(knot)} L${pt([knot[0] + swing * 2, knot[1] + 17])} M${pt(knot)} L${pt([knot[0] + 4 + swing * 3, knot[1] + 14])}`} stroke={FS.belt} strokeWidth={2.6} strokeLinecap="round" />
      <rect x={r1(knot[0] - 2.6)} y={r1(knot[1] - 2.6)} width={5.2} height={5.2} rx={1} fill={FS.belt} stroke={INK} strokeWidth={1.2} />
    </g>
  )
}

// The headband tails' bend per wave phase: the first and second control point drops.
const TAIL_WAVE: readonly (readonly [number, number])[] = [
  [-4, 5],
  [1, -1],
  [4, 4],
  [-1, 7],
]

function Ribbon({ d, color, width }: { d: string; color: string; width: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 1.8} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
    </>
  )
}

function Tails({ wind, stream }: { wind: number; stream: boolean }) {
  return (
    <>
      {[22, 17].map((length, i) => {
        const [a, b] = TAIL_WAVE[(wind + i) % TAIL_WAVE.length]
        const end: Pt = stream ? [-16 - length, -4 + b * 0.6] : [-10 - length * 0.6, -3 + length * 0.75 + a * 0.5]
        return <Ribbon key={length} d={`M-10 -3 C-16 ${-3 + a} ${r1(-10 - length * 0.55)} ${-3 + b + (stream ? -2 : 6)} ${pt(end)}`} color={FS.p2} width={2.8} />
      })}
    </>
  )
}

function Headgear({ costume }: { costume: Costume }) {
  if (costume.head === 'mongkhon') {
    return (
      <g>
        <Ribbon d="M-9.5 -5.5 C-14 -6 -18 -4 -21 -1" color={FS.gi} width={3} />
        <Ribbon d="M-9.6 -5 C-4 -10.4 4 -10.8 9.4 -6.8" color={FS.gi} width={3.2} />
        <path d="M-9.6 -5 C-4 -10.4 4 -10.8 9.4 -6.8" fill="none" stroke={FS.giDeep} strokeWidth={1.2} strokeDasharray="1.4 1.6" />
        <rect x={-11.4} y={-7.6} width={3.6} height={4.6} rx={0.8} fill={FS.p2} stroke={INK} strokeWidth={1} />
      </g>
    )
  }
  return (
    <g>
      <path d="M9.6 -6.5 C3 -8.6 -4 -8 -9.8 -4.6 L-9.4 -0.8 C-4 -4.4 3 -5 9.6 -3 Z" fill={FS.p2} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M9.6 -4.4 C3 -6.4 -4 -5.8 -9.6 -2.4" fill="none" stroke={FS.p2Dark} strokeWidth={1.2} />
      <circle cx={-10} cy={-3} r={2.2} fill={FS.p2} stroke={INK} strokeWidth={1.1} />
    </g>
  )
}

// His head in three quarter view facing right: the spiky short hair, the ear, the heavy brow over the oval
// eye, the nose, and the full beard over the jaw and round the mouth.
function Head({ frame, costume }: { frame: Frame; costume: Costume }) {
  const stream = frame.stream ?? false
  return (
    <g transform={`translate(${pt(frame.head)}) rotate(${frame.tilt ?? 0})`}>
      {costume.head === 'band' && <Tails wind={frame.wind} stream={stream} />}
      <path d="M-8 -2 C-8 -9 -3 -11 1 -11 C6 -11 9 -7 9 -2 L9.6 2 L8 5 C7 9 4 11 0 11 C-5 11 -8 7 -8 -2 Z" fill={SKIN.base} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
      <path d="M-8 -2 C-8 7 -5 11 0 11 C-4 8 -5 3 -5 -2 Z" fill={SKIN.shade} />
      <path d="M9 -1.5 L11.2 2.8 L8.8 3.4" fill={SKIN.base} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M-0.8 -2 L0.8 -2 C1.5 1.5 4 3 6.6 3.2 C7.6 3 8.6 3.3 9.6 4 L9.4 5.2 C9 9 5 12 0.5 11.8 C-3 11.5 -5.2 8 -4.6 3 Z" fill={HERO_IDENTITY.beard} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M6 6.4 L8.8 6.2" stroke={HERO_IDENTITY.skinShade} strokeWidth={1.1} strokeLinecap="round" />
      <ellipse cx={-2.6} cy={0.8} rx={2} ry={2.8} fill={SKIN.base} stroke={INK} strokeWidth={1.1} />
      <path d="M-9 2 C-10 -6 -6 -12 1 -12.5 L3 -15.4 L4.2 -12.2 L7.2 -13.8 L7.6 -10.6 L10.2 -10 C9.6 -7 8.6 -6 7 -5.4 C3 -7 -2 -6 -4 -3 L-5 2 Z" fill={HERO_IDENTITY.hair} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <Headgear costume={costume} />
      <path d="M3 -3.4 L7.8 -2.2" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <ellipse cx={5.6} cy={-0.4} rx={1.1} ry={1.7} fill={HERO_IDENTITY.eyes} />
    </g>
  )
}

// ---- effects ----

function DrumKit({ swing }: { swing: number }) {
  return (
    <g>
      <path d="M96 118 L92 166 M112 118 L116 166 M104 118 V166 M126 166 L124 72" stroke={FS.steel} strokeWidth={1.8} />
      <path d="M90 108 V118 Q104 122 118 118 V108 Z" fill={FS.p2} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
      <path d="M90 113 Q104 117 118 113" fill="none" stroke={FS.chrome} strokeWidth={1.4} />
      <ellipse cx={104} cy={108} rx={14} ry={4} fill={FS.gi} stroke={INK} strokeWidth={LINE} />
      <ellipse cx={122} cy={70} rx={16} ry={3.4} transform={`rotate(${swing ? -14 : -4} 122 70)`} fill={FS.gold} stroke={INK} strokeWidth={LINE} />
    </g>
  )
}

const SPARK_RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

function Spark({ at: [x, y], r }: { at: Pt; r: number }) {
  const ray = (deg: number, length: number) => {
    const rad = (deg * Math.PI) / 180
    return `${r1(x + Math.cos(rad) * length)} ${r1(y + Math.sin(rad) * length)}`
  }
  const d = `M${SPARK_RAYS.map((deg) => `${ray(deg, r)} L${ray(deg + 22.5, r * 0.4)}`).join(' L')}Z`
  return (
    <g>
      <path d={d} fill={FS.gold} stroke={FS.flash} strokeWidth={1} strokeLinejoin="round" />
      <circle cx={x} cy={y} r={r * 0.3} fill={FS.flash} />
    </g>
  )
}

const FX_DRAW: Record<Fx['kind'], (fx: Fx) => ReactNode> = {
  charge: (fx) =>
    fx.kind === 'charge' && (
      <g>
        <circle cx={fx.at[0]} cy={fx.at[1]} r={fx.r + 3} fill={FS.p1} opacity={0.45} />
        <circle cx={fx.at[0]} cy={fx.at[1]} r={fx.r} fill={FS.cyan} />
        <circle cx={fx.at[0]} cy={fx.at[1]} r={fx.r * 0.45} fill={FS.flash} />
      </g>
    ),
  flame: (fx) => {
    if (fx.kind !== 'flame') return null
    const mid = lerp(fx.from, fx.to, 0.5)
    return (
      <g>
        <path d={`M${pt(fx.from)} Q${pt([mid[0] + 20, mid[1]])} ${pt(fx.to)} Q${pt([mid[0] + 6, mid[1]])} ${pt(fx.from)}Z`} fill={FS.orange} opacity={0.85} />
        <path d={`M${pt(fx.from)} Q${pt([mid[0] + 12, mid[1]])} ${pt(fx.to)} Q${pt([mid[0] + 7, mid[1]])} ${pt(fx.from)}Z`} fill={FS.flash} opacity={0.9} />
      </g>
    )
  },
  spark: (fx) => fx.kind === 'spark' && <Spark at={fx.at} r={fx.r} />,
  spin: (fx) =>
    fx.kind === 'spin' && (
      <ellipse cx={58} cy={88} rx={40} ry={9} fill="none" stroke={FS.flash} strokeWidth={3} strokeDasharray="46 160" strokeDashoffset={fx.phase * -52} opacity={0.75} />
    ),
  kit: (fx) => fx.kind === 'kit' && <DrumKit swing={fx.swing} />,
}

const BEHIND: ReadonlySet<Fx['kind']> = new Set(['flame'])

function Effects({ fx = [], behind }: { fx?: Fx[]; behind: boolean }) {
  return (
    <>
      {fx
        .filter((item) => BEHIND.has(item.kind) === behind)
        .map((item, i) => (
          <g key={`${item.kind}-${i}`}>{FX_DRAW[item.kind](item)}</g>
        ))}
    </>
  )
}

// One cell of the strip.
function FrameArt({ frame, costume, index }: { frame: Frame; costume: Costume; index: number }) {
  const backHip: Pt = [frame.hip[0] - 4, frame.hip[1] + 2]
  const frontHip: Pt = [frame.hip[0] + 4, frame.hip[1] + 2]
  const backLeg = <Leg leg={frame.backLeg} hip={backHip} costume={costume} far />
  return (
    <g transform={`translate(${index * CELL.width} 0)`}>
      <Effects fx={frame.fx} behind />
      <Arm arm={frame.back} costume={costume} far />
      {!frame.kickFront && backLeg}
      <Leg leg={frame.frontLeg} hip={frontHip} costume={costume} far={false} />
      <Torso frame={frame} costume={costume} />
      {frame.kickFront && backLeg}
      <Head frame={frame} costume={costume} />
      <Arm arm={frame.front} costume={costume} far={false} />
      <Effects fx={frame.fx} behind={false} />
    </g>
  )
}

// The thrown ball of light; the System Engineer's carries a terminal prompt.
function KiBall({ kind }: { kind: BallKind }) {
  return (
    <g className={sprite.ball} transform="translate(118 72)">
      <path d="M-4 -9 Q-26 -5 -36 0 Q-26 5 -4 9 Z" fill={FS.cyan} opacity={0.55} />
      <circle r={13} fill={FS.p1} opacity={0.4} />
      <circle r={9.5} fill={FS.cyan} />
      <circle r={kind === 'code' ? 7 : 5.5} fill={FS.flash} />
      {kind === 'code' && <path d="M-4 -3 L-0.6 0 L-4 3 M0.6 3.6 H4.6" fill="none" stroke={FS.night} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  )
}

interface FighterProps {
  profession: Profession
  pose: FighterPose
  className?: string
  // A held frame: the slot of a fighter not under the cursor.
  still?: boolean
  onMoveEnd?: () => void
}

export function Fighter({ profession, pose, className = '', still = false, onMoveEnd }: FighterProps) {
  const clip = `fs-${useId().replace(/:/g, '')}`
  const motion = motionFor(pose, profession)
  const costume = COSTUME[profession]
  const vars = { '--cycle': `${motion.cycleMs}ms`, '--key': motion.key, '--runs': String(motion.runs) } as CSSProperties

  return (
    <svg
      viewBox={`0 0 ${CELL.width} ${CELL.height}`}
      className={`${sprite.sprite} ${className}`}
      data-mode={motion.mode}
      data-still={still || undefined}
      style={vars}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={-30} width={CELL.width} height={CELL.height + 30} />
        </clipPath>
      </defs>
      <ellipse cx={62} cy={CELL.ground} rx={34} ry={3.8} fill={INK} opacity={0.4} />
      <g clipPath={`url(#${clip})`}>
        <g key={`${pose}-${profession}`} className={sprite.strip} onAnimationEnd={onMoveEnd}>
          {framesFor(pose, profession).map((frame, index) => (
            <FrameArt key={index} frame={frame} costume={costume} index={index} />
          ))}
        </g>
      </g>
      {motion.ball && <KiBall key={pose} kind={motion.ball} />}
    </svg>
  )
}
