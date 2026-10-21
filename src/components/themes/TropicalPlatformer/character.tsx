'use client'

import { useId, type CSSProperties, type ReactNode } from 'react'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { COLORS } from './palette'
import sprite from './character.module.css'

// Him as a parody of the source's hero, the big tie wearing gorilla, in the look of its pre rendered 3D
// sprites: a gorilla build (a huge chest and shoulders, long thick arms with heavy knuckles, short legs
// and big feet), a heavy brow, a tuft of his own dark hair on top, his face with the full dark beard and
// black oval eyes, and a red tie with nothing written on it. No ink outline: every volume is shaded by a
// radial gradient lit from the upper left and edged by a warm rim light on the right (the level's sun
// behind him). The bare skin (face, ears, chest, hands, feet) is his own, from HERO_IDENTITY.
//
// Poses, transform keyframes in character.module.css keyed off data-pose:
// - idle: a big breath, a blink, and every few seconds the chest pound;
// - run: the knuckle run, the body bouncing while the arms plant and swing;
// - roll: tucked into a spinning ball, the roll attack;
// - throw: a barrel hoisted overhead and thrown, once, then back to rest;
// - act: his profession, done the way this hero would: typing on a field laptop with his knuckles
//   (engineer), slapping a pair of bongos (drummer), a guard and jabs in gloves, shorts and his mongkhon
//   (fighter, who wears no tie).
//
// `silhouette` draws him the way the sunset level draws its characters: fur and skin one dark shape, the
// rim light kept, only what he wears in colour.

export type HeroPose = 'idle' | 'run' | 'roll' | 'throw' | 'act'

// A hex colour moved toward another by t (0 to 1), for the light and the shade of a volume.
const mix = (from: string, to: string, t: number): string => {
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
  const value = [0, 1, 2].map((i) => Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * t))
  return `#${value.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

const WHITE = '#ffffff'
const BLACK = '#000000'
const FUR = '#6a3a1c'
const TIE = '#d42a1e'

interface Look {
  fur: string
  skin: string
  hair: string
  beard: string
  eyes: string
  rim: string
}

const OWN_LOOK: Look = {
  fur: FUR,
  skin: HERO_IDENTITY.skin,
  hair: HERO_IDENTITY.hair,
  beard: HERO_IDENTITY.beard,
  eyes: HERO_IDENTITY.eyes,
  rim: COLORS.sunCore,
}

const SHADOW_LOOK: Look = {
  fur: COLORS.shadow,
  skin: COLORS.shadowSoft,
  hair: COLORS.shadow,
  beard: COLORS.shadow,
  eyes: COLORS.shadow,
  rim: COLORS.sunsetOrange,
}

// The gradient ids of one drawing; useId keeps two heroes on a page from sharing them.
interface Paints {
  fur: string
  skin: string
  tie: string
  glove: string
  shorts: string
}

function Volume({ id, color }: { id: string; color: string }) {
  return (
    <radialGradient id={id} cx="0.34" cy="0.3" r="0.8">
      <stop offset="0" stopColor={mix(color, WHITE, 0.3)} />
      <stop offset="0.45" stopColor={color} />
      <stop offset="1" stopColor={mix(color, BLACK, 0.5)} />
    </radialGradient>
  )
}

// A shape with its rim light: the same shape in the rim colour, nudged right and up, under the shaded one.
function Lit({ d, fill, rim }: { d: string; fill: string; rim: string }) {
  return (
    <>
      <path d={d} fill={rim} opacity="0.85" transform="translate(1.6 -0.8)" />
      <path d={d} fill={fill} />
    </>
  )
}

// The left half of the drawing; the right half is the same shapes mirrored on x = 50.
const UPPER_ARM = 'M15 48 C11 58 11 70 12 80 H28 C30 70 32 60 33 51 Z'
const FOREARM = 'M10 76 C7 86 7 96 8 103 H25 C27 95 28 86 28 78 Z'
const LEG = 'M31 88 C29 97 30 105 31 110 H45 C46 104 46 96 45 88 Z'
const TORSO = 'M20 46 C30 37 70 37 80 46 C87 60 83 84 70 95 H30 C17 84 13 60 20 46 Z'
const HEAD_FUR = 'M50 9 C63 9 70 18 70 30 C70 42 62 50 50 50 C38 50 30 42 30 30 C30 18 37 9 50 9 Z'
const TIE_SHAPE = 'M46.5 50 H53.5 L57 76 L50 83 L43 76 Z'
const SHORTS = 'M27 84 H73 C73 92 71 98 67 101 H54 L50 95 L46 101 H33 C29 98 27 92 27 84 Z'

const MIRROR = 'translate(100 0) scale(-1 1)'

interface PartProps {
  look: Look
  paints: Paints
  profession: Profession
}

function Hand({ look, paints, profession }: PartProps) {
  if (profession === 'fighter') {
    return (
      <>
        <circle cx="17.5" cy="105" r="10.5" fill={look.rim} opacity="0.85" />
        <circle cx="16.5" cy="106" r="10.5" fill={`url(#${paints.glove})`} />
        <path d="M9 111 H24" stroke={COLORS.burst} strokeWidth="2.2" strokeLinecap="round" />
      </>
    )
  }
  return (
    <>
      <ellipse cx="17.5" cy="105.2" rx="10" ry="7.5" fill={look.rim} opacity="0.85" />
      <ellipse cx="16.5" cy="106" rx="10" ry="7.5" fill={`url(#${paints.skin})`} />
      <path d="M11 104 v4 M16 103.5 v4.5 M21 104 v4" stroke={mix(look.skin, BLACK, 0.4)} strokeWidth="1.2" strokeLinecap="round" />
    </>
  )
}

// One long arm, hinged at the shoulder (24, 50) and the elbow (19, 78).
function Arm({ side, ...part }: PartProps & { side: 'back' | 'front' }) {
  const back = side === 'back'
  return (
    <g transform={back ? undefined : MIRROR}>
      <g className={back ? sprite.armBack : sprite.armFront}>
        <Lit d={UPPER_ARM} fill={`url(#${part.paints.fur})`} rim={part.look.rim} />
        <g className={back ? sprite.foreBack : sprite.foreFront}>
          <Lit d={FOREARM} fill={`url(#${part.paints.fur})`} rim={part.look.rim} />
          <Hand {...part} />
        </g>
      </g>
    </g>
  )
}

function Leg({ side, look, paints }: { side: 'back' | 'front'; look: Look; paints: Paints }) {
  const back = side === 'back'
  return (
    <g transform={back ? undefined : MIRROR}>
      <g className={back ? sprite.legBack : sprite.legFront}>
        <Lit d={LEG} fill={`url(#${paints.fur})`} rim={look.rim} />
        <Lit d="M27 112 C27 106 46 106 48 111 C49 117 26 118 27 112 Z" fill={`url(#${paints.skin})`} rim={look.rim} />
      </g>
    </g>
  )
}

// His mongkhon in the jungle's look: a thick twisted cord ring round the head, blue wound with white, and
// the raised point at the front.
function JungleMongkhon() {
  return (
    <g>
      <path d="M31 21 C38 15 62 15 69 21" fill="none" stroke={COLORS.seaDeep} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M31 21 C38 15 62 15 69 21" fill="none" stroke={COLORS.burst} strokeWidth="2.2" strokeDasharray="3 3" strokeLinecap="round" />
      <path d="M46 17 Q50 3 54 17 Z" fill={COLORS.seaDeep} />
      <path d="M48.5 15 Q50 7 51.5 15" fill="none" stroke={COLORS.burst} strokeWidth="1.2" />
    </g>
  )
}

function Head({ look, paints, profession }: PartProps) {
  return (
    <g className={sprite.head}>
      <Lit d={HEAD_FUR} fill={`url(#${paints.fur})`} rim={look.rim} />
      <path d="M43 12 Q45 1 49 9 Q51 -1 54 9 Q58 2 58 13 Z" fill={look.hair} />
      <ellipse cx="32" cy="31" rx="4" ry="5" fill={`url(#${paints.skin})`} />
      <ellipse cx="68" cy="31" rx="4" ry="5" fill={`url(#${paints.skin})`} />
      <path d="M50 17 C60 17 63 24 63 32 C63 41 58 47 50 47 C42 47 37 41 37 32 C37 24 40 17 50 17 Z" fill={`url(#${paints.skin})`} />
      <path d="M36 25 Q50 15 64 25 Q60 21.5 50 21.5 Q40 21.5 36 25 Z" fill={`url(#${paints.fur})`} />
      <path d="M37 31 C37 44 42 52 50 52 C58 52 63 44 63 31 C61 36 58 37.5 55 37.5 C53 39.5 51.5 40 50 40 C48.5 40 47 39.5 45 37.5 C42 37.5 39 36 37 31 Z" fill={look.beard} />
      <path d="M45.5 43.5 Q50 46 54.5 43.5" fill="none" stroke={mix(look.beard, WHITE, 0.18)} strokeWidth="1.4" strokeLinecap="round" />
      <g className={sprite.eyes}>
        <ellipse cx="44.5" cy="29.5" rx="2.6" ry="3.8" fill={look.eyes} />
        <ellipse cx="55.5" cy="29.5" rx="2.6" ry="3.8" fill={look.eyes} />
        <circle cx="45.3" cy="28.1" r="0.9" fill={WHITE} opacity="0.85" />
        <circle cx="56.3" cy="28.1" r="0.9" fill={WHITE} opacity="0.85" />
      </g>
      {profession === 'fighter' && <JungleMongkhon />}
    </g>
  )
}

// What he works with in the act pose, on the ground in front of him.
const ACT_PROPS: Record<Profession, ReactNode> = {
  engineer: (
    <g>
      <path d="M28 104 L34 90 H66 L72 104 Z" fill={COLORS.hoop} />
      <path d="M31 102 L36 92 H64 L69 102 Z" fill={COLORS.lagoon} opacity="0.85" />
      <path d="M39 96 H52 M40 99 H59" stroke={COLORS.burst} strokeWidth="1.2" />
      <rect x="25" y="104" width="50" height="4.5" rx="2.2" fill={COLORS.hoopLight} />
    </g>
  ),
  drummer: (
    <g>
      {[38, 62].map((cx, i) => (
        <g key={cx}>
          <path d={`M${cx - 11} ${98 + i * 2} V112 Q${cx} 118 ${cx + 11} 112 V${98 + i * 2}`} fill="url(#tp-wood)" />
          <ellipse cx={cx} cy={98 + i * 2} rx="11" ry="4" fill={COLORS.parchment} />
          <path d={`M${cx - 11} ${104 + i * 2} Q${cx} ${109 + i * 2} ${cx + 11} ${104 + i * 2}`} fill="none" stroke={COLORS.hoopLight} strokeWidth="1.6" />
        </g>
      ))}
    </g>
  ),
  fighter: null,
}

// The barrel he hoists in the throw pose, over his head in both hands.
function HeldBarrel() {
  return (
    <g className={sprite.held}>
      <ellipse cx="50" cy="-8" rx="24" ry="15" fill="url(#tp-wood)" />
      <path d="M28 -15 Q50 -10 72 -15 M28 0 Q50 5 72 0" fill="none" stroke="url(#tp-hoop)" strokeWidth="3" />
    </g>
  )
}

// Tucked into the roll: a ball of fur with his hair, his beard and the end of the tie flying round it.
function RollBall({ look, paints, profession }: PartProps) {
  return (
    <g className={sprite.ball}>
      <circle cx="51.5" cy="80" r="31" fill={look.rim} opacity="0.85" />
      <circle cx="50" cy="81" r="31" fill={`url(#${paints.fur})`} />
      <path d="M50 50 C56 46 62 47 66 52 C60 52 55 53 50 56 Z" fill={look.hair} />
      <path d="M79 72 A31 31 0 0 1 78 94 C72 88 70 80 72 72 Z" fill={look.beard} />
      <ellipse cx="34" cy="84" rx="9" ry="7" fill={`url(#${paints.skin})`} />
      <ellipse cx="60" cy="104" rx="9" ry="5" fill={`url(#${paints.skin})`} />
      {profession === 'fighter' ? (
        <path d="M22 70 Q50 58 78 70" fill="none" stroke={COLORS.seaDeep} strokeWidth="4" />
      ) : (
        <path d="M70 58 L84 50 L86 58 Z" fill={`url(#${paints.tie})`} />
      )}
      <path d="M26 70 Q50 58 74 74" fill="none" stroke={mix(look.fur, WHITE, 0.3)} strokeWidth="1.6" opacity="0.5" />
    </g>
  )
}

interface HeroCharacterProps {
  profession: Profession
  pose?: HeroPose
  className?: string
  silhouette?: boolean
  /** When a one shot pose (throw) starts, as a CSS time. */
  delay?: string
}

export function HeroCharacter({ profession, pose = 'idle', className = '', silhouette = false, delay = '0s' }: HeroCharacterProps) {
  const uid = useId().replace(/:/g, '')
  const look = silhouette ? SHADOW_LOOK : OWN_LOOK
  const paints: Paints = {
    fur: `${uid}-fur`,
    skin: `${uid}-skin`,
    tie: `${uid}-tie`,
    glove: `${uid}-glove`,
    shorts: `${uid}-shorts`,
  }
  const part = { look, paints, profession }
  const fighter = profession === 'fighter'

  return (
    <svg
      viewBox="0 -24 100 144"
      className={`${sprite.figure} ${className}`}
      data-pose={pose}
      data-profession={profession}
      style={{ '--pose-delay': delay } as CSSProperties}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <Volume id={paints.fur} color={look.fur} />
        <Volume id={paints.skin} color={look.skin} />
        <Volume id={paints.tie} color={TIE} />
        <Volume id={paints.glove} color={COLORS.target} />
        <Volume id={paints.shorts} color={COLORS.sunGold} />
      </defs>
      <ellipse cx="50" cy="116" rx="34" ry="4.5" fill={BLACK} opacity="0.3" />
      {pose === 'roll' ? (
        <RollBall {...part} />
      ) : (
        <g className={sprite.body}>
          <Leg side="back" look={look} paints={paints} />
          <Leg side="front" look={look} paints={paints} />
          <Lit d={TORSO} fill={`url(#${paints.fur})`} rim={look.rim} />
          <ellipse cx="50" cy="69" rx="18" ry="21" fill={`url(#${paints.skin})`} />
          <path d="M40 62 Q45 66 49 62 M51 62 Q55 66 60 62" fill="none" stroke={mix(look.skin, BLACK, 0.35)} strokeWidth="1.4" strokeLinecap="round" />
          {fighter && <Lit d={SHORTS} fill={`url(#${paints.shorts})`} rim={look.rim} />}
          {fighter && <path d="M27 86 H73" stroke={COLORS.seaDeep} strokeWidth="3" />}
          {!fighter && (
            <g className={sprite.tie}>
              <path d={TIE_SHAPE} fill={`url(#${paints.tie})`} />
              <path d="M48 56 L54 62 M47 64 L55 70" stroke={mix(TIE, BLACK, 0.35)} strokeWidth="1.6" />
              <path d="M45.5 46 H54.5 L53.5 52 H46.5 Z" fill={mix(TIE, BLACK, 0.2)} />
            </g>
          )}
          {pose === 'act' && ACT_PROPS[profession]}
          <Arm side="back" {...part} />
          <Arm side="front" {...part} />
          <Head {...part} />
          {pose === 'throw' && <HeldBarrel />}
        </g>
      )}
    </svg>
  )
}
