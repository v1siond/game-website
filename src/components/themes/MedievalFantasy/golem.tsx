import type { ReactElement, ReactNode } from 'react'
import { clamp01, fadeTo, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { ramp } from '@/lib/scroll/stage'
import { REALM } from './palette'
import { InfernalGolemSVG } from './character'

// The infernal golem rising in a chaos scene, moved by the scroll alone (scenes.tsx): a meteor falls on the
// field and bursts, his rocks fly from the crater to their places, a card's share of them at a time, and once
// the last card is read he stands whole. Drawn in his own 160 by 200 box, his feet at the crater (80, 190).

// Where each rock starts its flight, as the offset, turn and size it flies in from, and the brightness it lands
// at: it lands lit and cools to its stone colour. The light is a white copy of its outline that fades out.
interface RockPart {
  from: { x: number; y: number; turn: number; size: number }
  /** Its opacity before it flies: the head shows faintly in the crater, the rest are hidden. */
  shown: number
  brightness: number
  outlineFill: string
  outline: (fill: string) => ReactElement
  detail?: ReactNode
}

const ROCK_PARTS: RockPart[] = [
  {
    from: { x: -60, y: 150, turn: -30, size: 0.6 }, shown: 0.3, brightness: 1.5, outlineFill: REALM.stone22,
    outline: (fill) => <ellipse cx="80" cy="25" rx="22" ry="18" fill={fill} />,
    detail: (
      <>
        <ellipse cx="80" cy="24" rx="18" ry="14" fill={REALM.stone28} />
        <ellipse cx="70" cy="24" rx="4" ry="3" fill={REALM.chaosBlightMid} />
        <ellipse cx="90" cy="24" rx="4" ry="3" fill={REALM.chaosBlightMid} />
      </>
    ),
  },
  {
    from: { x: -40, y: 130, turn: 20, size: 0.5 }, shown: 0, brightness: 1.4, outlineFill: REALM.stone22,
    outline: (fill) => <polygon points="20,50 15,65 30,72 45,68 42,52 30,45" fill={fill} />,
    detail: <polygon points="25,52 22,62 32,66 40,63 38,55 30,50" fill={REALM.stone28} />,
  },
  {
    from: { x: 40, y: 130, turn: -25, size: 0.5 }, shown: 0, brightness: 1.4, outlineFill: REALM.stone22,
    outline: (fill) => <polygon points="140,50 145,65 130,72 115,68 118,52 130,45" fill={fill} />,
    detail: <polygon points="135,52 138,62 128,66 120,63 122,55 130,50" fill={REALM.stone28} />,
  },
  {
    from: { x: 0, y: 100, turn: 0, size: 0.4 }, shown: 0, brightness: 1.6, outlineFill: REALM.stone15b,
    outline: (fill) => <polygon points="55,55 50,90 55,115 105,115 110,90 105,55" fill={fill} />,
    detail: (
      <>
        <polygon points="60,58 58,88 62,110 98,110 102,88 100,58" fill={REALM.stone22} />
        <path d="M80,65 L75,85 L82,105" stroke={REALM.chaosBlightMid} strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    from: { x: -50, y: 60, turn: 45, size: 0.4 }, shown: 0, brightness: 1.3, outlineFill: REALM.stone22,
    outline: (fill) => <polygon points="15,72 8,100 18,115 30,108 28,78" fill={fill} />,
  },
  {
    from: { x: 50, y: 60, turn: -45, size: 0.4 }, shown: 0, brightness: 1.3, outlineFill: REALM.stone22,
    outline: (fill) => <polygon points="145,72 152,100 142,115 130,108 132,78" fill={fill} />,
  },
  {
    from: { x: -30, y: 70, turn: 15, size: 0.5 }, shown: 0, brightness: 1.2, outlineFill: REALM.stone22,
    outline: (fill) => <polygon points="50,120 42,160 55,185 68,175 62,125" fill={fill} />,
  },
  {
    from: { x: 30, y: 70, turn: -15, size: 0.5 }, shown: 0, brightness: 1.2, outlineFill: REALM.stone22,
    outline: (fill) => <polygon points="110,120 118,160 105,185 92,175 98,125" fill={fill} />,
  },
]

export const ROCK_COUNT = ROCK_PARTS.length

// The stones sit near 22% luminance (c). A white layer at alpha a lifts c to c + a(1 - c), which equals the
// c * brightness a part lands at when a = c(brightness - 1) / (1 - c).
const STONE_LUMINANCE = 0.22
const litAlpha = (brightness: number): number => (STONE_LUMINANCE * (brightness - 1)) / (1 - STONE_LUMINANCE)

// The meteor falls from up and left of the crater; the burst grows from a third of its size to one and a half.
const METEOR_FROM = { x: -50, y: -200 }
const CRATER = { x: 80, y: 190 }

/** The golem's figure: the meteor, the burst, the rocks in flight and the golem whole, all in his 160 by 200 box. */
export function GolemRise({ id }: { id: string }) {
  return (
    <>
      <g data-fx="meteor" opacity="0">
        <path d="M0,0 L-70,-150" stroke={REALM.chaosFireBright} strokeWidth="10" strokeLinecap="round" opacity="0.35" />
        <circle r="34" fill={REALM.chaosBlightBright} opacity="0.35" />
        <circle r="20" fill={REALM.chaosFireBright} />
        <circle r="10" fill={REALM.ash100} opacity="0.8" />
      </g>
      <g data-fx="burst" opacity="0">
        <circle r="70" fill={REALM.chaosBlightBright} opacity="0.5" />
        <circle r="40" fill={REALM.chaosFireBright} opacity="0.7" />
      </g>
      <g data-fx="rocks">
        <ellipse cx={CRATER.x} cy={CRATER.y + 4} rx="60" ry="12" fill={REALM.chaosBlightDark} opacity="0.6" />
        {ROCK_PARTS.map((part, i) => (
          <g key={i} data-fx={`rock-${i}`} opacity={part.shown}>
            {part.outline(part.outlineFill)}
            {part.detail}
            <g data-fx={`lit-${i}`} opacity="0">
              {part.outline(REALM.ash100)}
            </g>
          </g>
        ))}
      </g>
      <g data-fx="golem" opacity="0">
        <InfernalGolemSVG id={id} />
      </g>
    </>
  )
}

/** Where the golem's rise is: the meteor's fall and its burst (0 to 1 each), the rocks home (0 to ROCK_COUNT) and
 *  how far he has turned from the assembled rocks into the golem whole (0 to 1). */
export interface Rise {
  fall: number
  burst: number
  built: number
  whole: number
}

export const RISEN: Rise = { fall: 1, burst: 1, built: ROCK_COUNT, whole: 1 }

/** The writer of a GolemRise inside `stage`. */
export function riseWriter(stage: ParentNode): (rise: Rise) => void {
  const meteor = fx(stage, 'meteor')
  const burst = fx(stage, 'burst')
  const rocks = fx(stage, 'rocks')
  const golem = fx(stage, 'golem')
  const parts = ROCK_PARTS.map((part, i) => ({ part, node: fx(stage, `rock-${i}`), lit: fx(stage, `lit-${i}`) }))
  return ({ fall, burst: blast, built, whole }) => {
    const x = lerp(METEOR_FROM.x, CRATER.x, fall)
    const y = lerp(METEOR_FROM.y, CRATER.y, fall)
    transformTo(meteor, `translate(${r1(x)} ${r1(y)}) scale(${(0.4 + 0.6 * fall).toFixed(3)})`)
    fadeTo(meteor, fall > 0 && blast < 0.2 ? ramp(fall, 0, 0.1) : 0)
    transformTo(burst, `translate(${CRATER.x} ${CRATER.y}) scale(${lerp(0.3, 1.5, blast).toFixed(3)})`)
    fadeTo(burst, blast > 0 && blast < 1 ? 1 - blast : 0)
    fadeTo(rocks, ramp(blast, 0.3, 0.6) * (1 - whole))
    for (const [i, { part, node, lit }] of parts.entries()) {
      const home = clamp01(built - i)
      const { from } = part
      transformTo(
        node,
        `translate(${r1(lerp(from.x, 0, home))} ${r1(lerp(from.y, 0, home))}) rotate(${r1(lerp(from.turn, 0, home))} 80 100) scale(${lerp(from.size, 1, home).toFixed(3)})`,
      )
      fadeTo(node, home > 0 ? lerp(part.shown, 1, ramp(home, 0, 0.2)) : part.shown)
      fadeTo(lit, home > 0 ? litAlpha(part.brightness) * (1 - home) : 0)
    }
    fadeTo(golem, whole)
  }
}
