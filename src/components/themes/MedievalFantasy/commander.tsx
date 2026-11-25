import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { REALM } from './palette'

// Him as the river kingdom's knight commander, the hero unit of every scene: steel plate under the kingdom's
// blue tabard with its gold tower, round pauldrons rimmed in gold, a blue cape, a heater shield and a long
// sword, and his own face (skin, hair, beard and eyes from HERO_IDENTITY), bare headed. The Musician wears the
// same plate with a drumstick in each hand; the Martial Artist fights in his gold shorts with the maroon band,
// the red prajioud on his arms, wrapped hands and his own mongkhon. Drawn in a 200 by 320 box facing right,
// his feet at HERO_FEET.
//
// The scenes move his parts by data-fx name, each turning about its own joint: his sword arm ("hero-sword",
// about SWORD_AT), his shield arm ("hero-shield", about SHIELD_AT) and each leg ("hero-leg-front",
// "hero-leg-back", about HIP_AT); his shield board ("hero-board") fades when his shield hand shows the horn
// ("hero-horn"). `figure` marks him as the world's figure, on the hero's stage only, the one the preview
// capture reads.

export const HERO_FEET = { x: 100, y: 312 }
export const SWORD_AT = { x: 112, y: 112 }
export const SHIELD_AT = { x: 90, y: 112 }
export const HIP_AT = { x: 100, y: 204 }

const LINE = REALM.stone4b

function Head({ profession }: { profession: Profession }) {
  return (
    <g>
      <rect x={94} y={84} width={16} height={18} fill={HERO_IDENTITY.skinShade} />
      <path d="M80 62 Q80 38 102 38 Q124 38 124 62 L124 72 Q120 88 104 92 L96 92 Q82 86 80 72 Z" fill={HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
      <path d="M78 64 Q74 32 102 33 Q128 33 127 58 Q118 46 104 46 Q90 46 84 66 Z" fill={HERO_IDENTITY.hair} />
      <path d="M81 68 Q83 94 98 102 Q112 106 122 96 Q128 86 126 70 Q120 80 110 80 Q100 82 90 76 Q85 73 81 68 Z" fill={HERO_IDENTITY.beard} />
      <path d="M104 86 Q112 88 118 85" stroke={LINE} strokeWidth="2" fill="none" />
      <path d="M104 55 L116 52 M119 54 L125 56" stroke={HERO_IDENTITY.hair} strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx={111} cy={63} rx={3} ry={4} fill={HERO_IDENTITY.eyes} />
      <ellipse cx={122} cy={63.5} rx={2} ry={3.6} fill={HERO_IDENTITY.eyes} />
      {profession === 'fighter' && (
        <>
          <path d="M78 50 Q102 40 127 48" fill="none" stroke={REALM.blood33} strokeWidth="7" strokeLinecap="round" />
          <path d="M80 50 Q66 36 70 18 Q74 34 86 46" fill={REALM.blood33} />
        </>
      )}
    </g>
  )
}

/** The blue cape behind him, from the pauldrons to his heels. */
function Cape() {
  return <path d="M70 104 Q40 180 36 306 L150 306 Q148 190 128 104 Z" fill={REALM.kingdomBlueDeep} stroke={LINE} strokeWidth="2" />
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <path d="M76 104 Q100 96 124 104 L122 196 Q100 202 78 196 Z" fill={HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
        <path d="M86 130 Q94 136 100 130 Q106 136 114 130 M100 140 V186" stroke={HERO_IDENTITY.skinShade} strokeWidth="2" fill="none" />
        <path d="M76 190 L124 190 L128 228 L102 228 L100 214 L98 228 L72 228 Z" fill={REALM.princeGold} stroke={LINE} strokeWidth="2" />
        <rect x={76} y={188} width={48} height={9} fill={REALM.blood33} />
      </g>
    )
  }
  return (
    <g>
      <path d="M72 104 Q100 94 128 104 L132 204 Q100 214 68 204 Z" fill={REALM.steel} stroke={LINE} strokeWidth="2.5" />
      <path d="M80 112 Q100 106 120 112 L118 150 Q100 156 82 150 Z" fill={REALM.steelLight} opacity="0.5" />
      <path d="M80 122 L120 122 L124 236 L100 246 L76 236 Z" fill={REALM.kingdomBlue} stroke={REALM.goldMid} strokeWidth="3" />
      <path d="M92 140 V170 H108 V140 L104 134 L100 140 L96 134 Z M90 170 H110 V176 H90 Z" fill={REALM.goldMid} />
      <rect x={70} y={190} width={60} height={11} fill={REALM.ember16} />
      <rect x={95} y={188} width={12} height={15} fill={REALM.goldBright} />
    </g>
  )
}

function Pauldron({ cx }: { cx: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={110} rx={20} ry={14} fill={REALM.steel} stroke={REALM.goldMid} strokeWidth="3" />
      <path d={`M${cx - 14} 112 Q${cx} 100 ${cx + 14} 112`} stroke={REALM.steelLight} strokeWidth="3" fill="none" />
    </g>
  )
}

function Leg({ side, profession }: { side: 'front' | 'back'; profession: Profession }) {
  const x = side === 'front' ? 104 : 84
  const bare = profession === 'fighter'
  const plate = bare ? HERO_IDENTITY.skin : side === 'front' ? REALM.steel : REALM.steelShade
  return (
    <g data-fx={`hero-leg-${side}`}>
      <rect x={x} y={200} width={17} height={60} rx={5} fill={plate} stroke={LINE} strokeWidth="2" />
      <rect x={x} y={256} width={17} height={50} rx={5} fill={plate} stroke={LINE} strokeWidth="2" />
      {!bare && <circle cx={x + 8.5} cy={258} r={8} fill={REALM.steelLight} stroke={LINE} strokeWidth="2" />}
      <path d={`M${x - 2} 292 H${x + 18} Q${x + 32} 298 ${x + 32} 312 H${x - 2} Z`} fill={bare ? HERO_IDENTITY.skinShade : REALM.steelShade} stroke={LINE} strokeWidth="2" />
    </g>
  )
}

function Fist({ x, y, profession }: { x: number; y: number; profession: Profession }) {
  return <circle cx={x} cy={y} r={profession === 'fighter' ? 10 : 9} fill={profession === 'fighter' ? REALM.riverCream : REALM.steelShade} stroke={LINE} strokeWidth="2" />
}

function Arm({ x, profession }: { x: number; profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <>
        <rect x={x} y={104} width={17} height={82} rx={7} fill={HERO_IDENTITY.skin} stroke={LINE} strokeWidth="2" />
        <rect x={x} y={124} width={17} height={6} fill={REALM.blood33} />
      </>
    )
  }
  return <rect x={x} y={104} width={17} height={82} rx={7} fill={REALM.steel} stroke={LINE} strokeWidth="2" />
}

/** His shield arm (the far one): the heater shield with the gold tower, a drumstick for the Musician, the horn
 *  his hand can show. */
function ShieldArm({ profession }: { profession: Profession }) {
  return (
    <g data-fx="hero-shield">
      <Arm x={82} profession={profession} />
      {profession === 'drummer' && <path d="M92 188 L132 156" stroke={REALM.goldBright} strokeWidth="5" strokeLinecap="round" />}
      <Fist x={92} y={188} profession={profession} />
      {profession === 'engineer' && (
        <g data-fx="hero-board">
          <path d="M98 118 H158 V160 Q158 196 128 214 Q98 196 98 160 Z" fill={REALM.kingdomBlue} stroke={REALM.goldMid} strokeWidth="5" />
          <path d="M120 140 V172 H136 V140 L132 134 L128 140 L124 134 Z M117 172 H139 V180 H117 Z" fill={REALM.goldMid} />
        </g>
      )}
      <g data-fx="hero-horn" opacity="0">
        <path d="M92 190 Q82 160 102 146 L110 152 Q96 166 102 192 Z" fill={REALM.horn} stroke={LINE} strokeWidth="2" />
        <path d="M98 146 L112 140 L114 156 Z" fill={REALM.goldMid} />
      </g>
    </g>
  )
}

/** His sword arm (the near one): the long sword, or a drumstick for the Musician, or the bare wrapped fist. */
function SwordArm({ profession }: { profession: Profession }) {
  return (
    <g data-fx="hero-sword">
      {profession === 'engineer' && (
        <g>
          <path d="M122 190 L196 262 L190 268 L116 196 Z" fill={REALM.steelLight} stroke={LINE} strokeWidth="2" />
          <path d="M124 192 L192 260" stroke={REALM.ash100} strokeWidth="1.5" opacity="0.7" />
          <path d="M108 200 L136 172" stroke={REALM.goldMid} strokeWidth="7" strokeLinecap="round" />
          <circle cx={112} cy={180} r={6} fill={REALM.goldBright} />
        </g>
      )}
      <Arm x={104} profession={profession} />
      {profession === 'drummer' && <path d="M114 188 L154 160" stroke={REALM.goldBright} strokeWidth="5" strokeLinecap="round" />}
      <Fist x={114} y={188} profession={profession} />
    </g>
  )
}

/** Him as the knight commander in a profession's kit. */
export function Commander({ profession, figure = false }: { profession: Profession; figure?: boolean }) {
  const armoured = profession !== 'fighter'
  return (
    <g data-worlds-figure={figure ? '' : undefined}>
      {armoured && <Cape />}
      <Leg side="back" profession={profession} />
      <Leg side="front" profession={profession} />
      <Torso profession={profession} />
      {armoured && <Pauldron cx={80} />}
      <Head profession={profession} />
      <ShieldArm profession={profession} />
      {armoured && <Pauldron cx={118} />}
      <SwordArm profession={profession} />
    </g>
  )
}
