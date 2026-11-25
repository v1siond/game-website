import type { ReactElement, ReactNode } from 'react'
import { clamp01, fadeTo, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { ramp } from '@/lib/scroll/stage'
import { REALM } from './palette'

// The burning giant the demons drop from the sky, the infernal golem the world drew before: a hulk of dark rock
// held together by blight fire at every joint, boulder shoulders, claws of green fire and a skull of stone with
// fire deep in its sockets. It falls as a meteor, bursts in its crater, and its rocks fly up out of the crater and
// lock into place until it stands whole, all as one action of its scene (riseWriter), never a card's share at a
// time. Drawn in its own 160 by 200 box, its feet at GOLEM_FEET; every part a scene moves is named after the
// golem (`${name}-meteor` and the rest), so two golems on one stage stay apart.

export const GOLEM_FEET = { x: 80, y: 190 }

/** A flame of blight fire, three layered ellipses, standing on (cx, cy). */
function BlightFlame({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  const w = size * 14
  const h = size * 20
  return (
    <g transform={`translate(${r1(cx - w / 2)} ${r1(cy - h)})`}>
      <ellipse cx={w / 2} cy={h * 0.6} rx={w * 0.5} ry={h * 0.5} fill={REALM.blightFireDark} opacity="0.55" />
      <ellipse cx={w / 2} cy={h * 0.55} rx={w * 0.35} ry={h * 0.4} fill={REALM.blightFire} opacity="0.8" />
      <ellipse cx={w / 2} cy={h * 0.5} rx={w * 0.2} ry={h * 0.3} fill={REALM.blightFireCore} opacity="0.9" />
    </g>
  )
}

const CRACK = { stroke: REALM.blightFire, strokeWidth: 2, fill: 'none' }

/** The golem whole, its fires lit; `id` keeps its rock gradient apart from another golem's on the page. */
export function InfernalGolem({ id }: { id: string }) {
  const rock = `url(#${id}-rock)`
  const edge = { stroke: REALM.stone9b, strokeWidth: 2 }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-rock`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={REALM.stone28} />
          <stop offset="30%" stopColor={REALM.stone22} />
          <stop offset="60%" stopColor={REALM.stone15b} />
          <stop offset="100%" stopColor={REALM.stone9b} />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="96" rx="96" ry="110" fill={REALM.blightFire} opacity="0.12" />
      <polygon points="50,120 42,140 52,145 58,125" fill={rock} {...edge} />
      <BlightFlame cx={48} cy={147} size={1.6} />
      <polygon points="30,148 26,162 32,178 50,185 58,172 55,155 45,148" fill={rock} {...edge} />
      <path d="M38,155 L42,168 L38,178" {...CRACK} />
      <polygon points="32,178 18,200 38,192" fill={REALM.blightFireCore} />
      <polygon points="48,182 48,205 60,195" fill={REALM.blightFireCore} />
      <polygon points="110,120 102,125 108,145 118,140" fill={rock} {...edge} />
      <BlightFlame cx={112} cy={147} size={1.6} />
      <polygon points="102,148 105,155 102,172 110,185 128,178 134,162 130,148 115,148" fill={rock} {...edge} />
      <path d="M122,155 L118,168 L122,178" {...CRACK} />
      <polygon points="128,178 142,200 122,192" fill={REALM.blightFireCore} />
      <polygon points="112,182 112,205 100,195" fill={REALM.blightFireCore} />
      <BlightFlame cx={55} cy={115} size={2.7} />
      <BlightFlame cx={105} cy={115} size={2.7} />
      <polygon points="45,60 38,90 50,115 80,122 110,115 122,90 115,60 95,50 65,50" fill={rock} {...edge} />
      <path d="M65,55 L60,75 L70,95 L80,115 M95,55 L100,75 L90,95 L80,115 M55,70 L80,80 L105,70" {...CRACK} />
      <BlightFlame cx={80} cy={85} size={2.6} />
      <BlightFlame cx={35} cy={55} size={2.2} />
      <polygon points="5,35 0,55 10,75 35,80 55,65 50,40 30,25 10,30" fill={rock} {...edge} />
      <path d="M15,40 L25,55 L20,70 M40,35 L35,55 L45,70" {...CRACK} />
      <BlightFlame cx={125} cy={55} size={2.2} />
      <polygon points="155,35 160,55 150,75 125,80 105,65 110,40 130,25 150,30" fill={rock} {...edge} />
      <path d="M145,40 L135,55 L140,70 M120,35 L125,55 L115,70" {...CRACK} />
      <polygon points="20,78 12,95 22,105 32,90" fill={rock} {...edge} />
      <BlightFlame cx={18} cy={108} size={1.6} />
      <polygon points="0,108 -5,125 2,145 22,150 32,138 30,118 18,108" fill={rock} {...edge} />
      <path d="M8,115 L12,130 L8,142 M22,115 L18,130 L24,142" {...CRACK} />
      <polygon points="4,145 -14,175 12,162" fill={REALM.blightFireCore} />
      <polygon points="20,148 18,180 32,165" fill={REALM.blightFireCore} />
      <polygon points="140,78 148,90 138,105 128,95" fill={rock} {...edge} />
      <BlightFlame cx={142} cy={108} size={1.6} />
      <polygon points="128,108 130,118 128,138 138,150 158,145 165,125 160,108 142,108" fill={rock} {...edge} />
      <path d="M152,115 L148,130 L152,142 M138,115 L142,130 L136,142" {...CRACK} />
      <polygon points="156,145 174,175 148,162" fill={REALM.blightFireCore} />
      <polygon points="140,148 142,180 128,165" fill={REALM.blightFireCore} />
      <BlightFlame cx={80} cy={48} size={2.4} />
      <polygon points="58,48 52,35 55,18 65,8 80,5 95,8 105,18 108,35 102,48 92,50 68,50" fill={rock} {...edge} />
      <polygon points="60,20 65,10 80,7 95,10 100,20 95,22 65,22" fill={REALM.stone15b} />
      <polygon points="55,28 62,22 80,20 98,22 105,28 100,32 60,32" fill={REALM.stone9b} />
      <polygon points="62,32 68,28 76,32 76,40 68,43 62,38" fill={REALM.stone4a} />
      <polygon points="84,32 92,28 98,32 98,38 92,43 84,40" fill={REALM.stone4a} />
      <ellipse cx="69" cy="35" rx="3" ry="2.4" fill={REALM.blightFireCore} />
      <ellipse cx="91" cy="35" rx="3" ry="2.4" fill={REALM.blightFireCore} />
      <polygon points="76,38 80,34 84,38 80,46" fill={REALM.stone4a} />
      <polygon points="65,46 70,42 80,41 90,42 95,46 92,52 68,52" fill={rock} />
      <path d="M72,46 V50 M77,45 V50 M83,45 V50 M88,46 V50" stroke={REALM.blightFireDark} strokeWidth="2" />
    </g>
  )
}

// The rocks it stands up from, each flying from the crater to its place: where it starts (offset, turn, size),
// and the white heat it lands in, which cools to its stone colour.
interface RockPart {
  from: { x: number; y: number; turn: number; size: number }
  outline: (fill: string) => ReactElement
  detail?: ReactNode
}

const ROCK_PARTS: RockPart[] = [
  { from: { x: -60, y: 150, turn: -30, size: 0.6 }, outline: (fill) => <ellipse cx="80" cy="25" rx="22" ry="18" fill={fill} />, detail: <ellipse cx="80" cy="24" rx="18" ry="14" fill={REALM.stone28} /> },
  { from: { x: -40, y: 130, turn: 20, size: 0.5 }, outline: (fill) => <polygon points="20,50 15,65 30,72 45,68 42,52 30,45" fill={fill} /> },
  { from: { x: 40, y: 130, turn: -25, size: 0.5 }, outline: (fill) => <polygon points="140,50 145,65 130,72 115,68 118,52 130,45" fill={fill} /> },
  {
    from: { x: 0, y: 100, turn: 0, size: 0.4 },
    outline: (fill) => <polygon points="55,55 50,90 55,115 105,115 110,90 105,55" fill={fill} />,
    detail: <path d="M80,65 L75,85 L82,105" stroke={REALM.blightFire} strokeWidth="2" fill="none" />,
  },
  { from: { x: -50, y: 60, turn: 45, size: 0.4 }, outline: (fill) => <polygon points="15,72 8,100 18,115 30,108 28,78" fill={fill} /> },
  { from: { x: 50, y: 60, turn: -45, size: 0.4 }, outline: (fill) => <polygon points="145,72 152,100 142,115 130,108 132,78" fill={fill} /> },
  { from: { x: -30, y: 70, turn: 15, size: 0.5 }, outline: (fill) => <polygon points="50,120 42,160 55,185 68,175 62,125" fill={fill} /> },
  { from: { x: 30, y: 70, turn: -15, size: 0.5 }, outline: (fill) => <polygon points="110,120 118,160 105,185 92,175 98,125" fill={fill} /> },
]

// The meteor falls from up and left of the crater; the burst grows from a third of its size to one and a half.
const METEOR_FROM = { x: -420, y: -900 }

/** A falling burning giant: the meteor with its trail of fire. */
export function Meteor({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <path d="M0,0 L-180,-390" stroke={REALM.chaosFireBright} strokeWidth="26" strokeLinecap="round" opacity="0.25" />
      <path d="M0,0 L-110,-240" stroke={REALM.blightFire} strokeWidth="14" strokeLinecap="round" opacity="0.5" />
      <circle r="44" fill={REALM.blightFire} opacity="0.4" />
      <circle r="28" fill={REALM.chaosFireBright} />
      <circle r="18" fill={REALM.stone22} />
      <circle r="9" fill={REALM.blightFireCore} />
    </g>
  )
}

/** Its crater: scorched ground and green fire round its rim. */
export function Crater({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <ellipse rx="120" ry="30" fill={REALM.stone4a} />
      <ellipse rx="96" ry="22" fill={REALM.blightFireDark} opacity="0.8" />
      {[-90, -50, 40, 84].map((x) => (
        <path key={x} d={`M${x - 10},${-4 + (x % 3)} Q${x},-44 ${x + 10},${-4 + (x % 3)} Z`} fill={REALM.blightFire} opacity="0.8" />
      ))}
    </g>
  )
}

/** The golem's figure in its 160 by 200 box: the meteor, the burst, the rocks in flight and the golem whole. */
export function GolemRise({ name }: { name: string }) {
  return (
    <>
      <g transform={`translate(${GOLEM_FEET.x} ${GOLEM_FEET.y})`}>
        <Crater name={`${name}-crater`} />
      </g>
      <Meteor name={`${name}-meteor`} />
      <g data-fx={`${name}-burst`} opacity="0">
        <circle r="90" fill={REALM.blightFire} opacity="0.5" />
        <circle r="56" fill={REALM.chaosFireBright} opacity="0.8" />
        <circle r="26" fill={REALM.ash100} opacity="0.8" />
      </g>
      <g data-fx={`${name}-rocks`} opacity="0">
        {ROCK_PARTS.map((part, i) => (
          <g key={i} data-fx={`${name}-rock-${i}`}>
            {part.outline(REALM.stone22)}
            {part.detail}
            <g data-fx={`${name}-heat-${i}`}>{part.outline(REALM.blightFireCore)}</g>
          </g>
        ))}
      </g>
      <g data-fx={`${name}-whole`} opacity="0">
        <InfernalGolem id={name} />
      </g>
    </>
  )
}

/** Where a golem's rise is, each 0 to 1: the meteor's fall, its burst, its rocks flown home, and how far the
 *  locked rocks have turned into the golem whole. */
export interface Rise {
  fall: number
  burst: number
  built: number
  whole: number
}

export const STOOD: Rise = { fall: 1, burst: 1, built: 1, whole: 1 }

// The rocks leave the crater one after another over the first half of `built` and each takes the rest to land.
const LEAVE_SPAN = 0.5

/** The writer of the GolemRise named `name` inside `stage`. */
export function riseWriter(stage: ParentNode, name: string): (rise: Rise) => void {
  const meteor = fx(stage, `${name}-meteor`)
  const crater = fx(stage, `${name}-crater`)
  const burst = fx(stage, `${name}-burst`)
  const rocks = fx(stage, `${name}-rocks`)
  const whole = fx(stage, `${name}-whole`)
  const parts = ROCK_PARTS.map((part, i) => ({ part, node: fx(stage, `${name}-rock-${i}`), heat: fx(stage, `${name}-heat-${i}`) }))
  return ({ fall, burst: blast, built, whole: stood }) => {
    transformTo(meteor, `translate(${r1(lerp(METEOR_FROM.x, GOLEM_FEET.x, fall))} ${r1(lerp(METEOR_FROM.y, GOLEM_FEET.y, fall))}) scale(${(0.5 + 0.5 * fall).toFixed(3)})`)
    fadeTo(meteor, fall > 0 && blast === 0 ? ramp(fall, 0, 0.1) : 0)
    fadeTo(crater, ramp(blast, 0, 0.2))
    transformTo(burst, `translate(${GOLEM_FEET.x} ${GOLEM_FEET.y - 20}) scale(${lerp(0.3, 1.6, blast).toFixed(3)})`)
    fadeTo(burst, blast > 0 && blast < 1 ? 1 - blast : 0)
    fadeTo(rocks, ramp(built, 0, 0.05) * (1 - stood))
    parts.forEach(({ part: { from }, node, heat }, i) => {
      const leaves = (LEAVE_SPAN * i) / ROCK_PARTS.length
      const home = clamp01((built - leaves) / (1 - LEAVE_SPAN))
      const arc = -60 * Math.sin(Math.PI * home)
      transformTo(node, `translate(${r1(lerp(from.x, 0, home))} ${r1(lerp(from.y, 0, home) + arc)}) rotate(${r1(lerp(from.turn, 0, home))} 80 100) scale(${lerp(from.size, 1, home).toFixed(3)})`)
      fadeTo(node, home > 0 ? 1 : 0)
      fadeTo(heat, 0.8 * (1 - home))
    })
    fadeTo(whole, stood)
  }
}
