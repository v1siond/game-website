import { memo, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { CEL } from './palette'
import { HATCH } from './ink'
import s from './sprite.module.css'

// Him as this world's own sprite, a desert commando drawn the way an inked comic shooter draws its heroes:
// plate carrier vest, one armoured shoulder pad, an assault rifle slung on his back and a deployable
// turret as his gadget. Heroic proportions (about six heads, broad shoulders, chunky hands and boots),
// every shape outlined in a thick, uneven black ink line (a heavier ink copy sits a little down and right
// of each shape, so the line swells on the shadow side), hard two tone cel shading (each part has its
// shadow shape on the right, in the darker tone, with diagonal hatching over it) and gritty gear. His
// traits come from HERO_IDENTITY: brown skin, short dark hair, the full dark beard, black oval eyes.
//
// Per profession: the System Engineer in the full commando kit (olive plate carrier with pouches over a
// dark tee, cargo trousers, boots, the rifle slung), with the wrist computer's hologram and the turret
// he deploys; the Musician in the same vest open over a red tee, jeans and boots, two sticks in his
// fists; the Martial Artist bare chested in red Muay Thai shorts with a sun trim, wrapped red gloves and
// his own mongkhon (a thick red and white rope crown tied at the back with two tails). Every outfit keeps
// the commando's shoulder pad.
//
// He faces the viewer. Every part is a group that turns round its own joint (sprite.module.css): the
// shoulders, elbows, hips and knees, the whole of him round his feet. Nothing moves on its own: a theatre
// scene poses him from the scroll (pose.ts), everywhere else he stands at rest.

/** His box: the viewBox's size and the y his soles stand on. */
export const SPRITE_VIEW = { width: 120, height: 200, soles: 196 } as const

const SKIN = HERO_IDENTITY.skin
const SKIN_SHADE = HERO_IDENTITY.skinShade
const INK = CEL.ink

/** One inked shape: the heavy ink copy offset down and right, then the fill with its own line. */
function Ink({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={INK} stroke={INK} strokeWidth={4} strokeLinejoin="round" transform="translate(1.3 1.1)" />
      <path d={d} fill={fill} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
    </>
  )
}

/** The shadow side of a part: the darker tone, then the hatching over it. */
function Shade({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={d} fill={HATCH} opacity={0.5} />
    </>
  )
}

type Side = 'back' | 'front'

interface SideParts {
  arm: string
  fore: string
  leg: string
  shin: string
  /** The boot's sole line. */
  sole: string
  /** The drumstick, tip up and out, and the fist's grip line over it. */
  stickLine: string
  grip: string
  /** The white trim of the Muay Thai glove. */
  gloveTrim: string
  /** The upper arm's shadow edge. */
  sleeveEdge: string
  /** The prajioud band round the upper arm and the sun trim on the shorts' hem. */
  armBand: string
  hem: string
}

// What differs between his back limbs and his front ones: each part's class and the strokes across it.
const SIDE: Record<Side, SideParts> = {
  back: {
    arm: s.sprArmB,
    fore: s.sprForeB,
    leg: s.sprLegB,
    shin: s.sprShinB,
    sole: 'M34 190 L56 190',
    stickLine: 'M30 118 L8 84',
    grip: 'M25 104 L38 104',
    gloveTrim: 'M22 124 Q31 129 40 124',
    sleeveEdge: 'M33 57 L39 57 L38 91 L33 91 Z',
    armBand: 'M23 68 L39 68',
    hem: 'M37 138 L57 136',
  },
  front: {
    arm: s.sprArmF,
    fore: s.sprForeF,
    leg: s.sprLegF,
    shin: s.sprShinF,
    sole: 'M63 190 L88 190',
    stickLine: 'M90 118 L112 84',
    grip: 'M82 104 L95 104',
    gloveTrim: 'M80 124 Q89 129 98 124',
    sleeveEdge: 'M92 57 L98 57 L96 91 L91 91 Z',
    armBand: 'M81 68 L97 68',
    hem: 'M63 136 L83 138',
  },
}

interface Gear {
  torso: ReactNode
  sleeve: string
  sleeveShade: string
  // The forearm: bare skin or the jacket's sleeve.
  forearm: string
  hand: (side: Side) => ReactNode
  legs: string
  legsShade: string
  // Shorts stop at the knee and show the shin; trousers reach the boot.
  shorts: boolean
  feet: (side: Side) => ReactNode
  head: ReactNode
  prop: ReactNode
}

// ---- the body parts every outfit shares ----

const TORSO = 'M30 56 Q60 48 90 56 L95 72 L87 112 L33 112 L25 72 Z'
const TORSO_SHADOW = 'M77 53 Q85 54 90 56 L95 72 L87 112 L74 112 Q83 84 77 53 Z'

const BOOT = {
  back: 'M35 178 L55 178 L57 192 Q50 197 33 196 Q32 186 35 178 Z',
  front: 'M65 178 L84 178 L90 193 Q78 198 63 196 Z',
}
const BARE_FOOT = {
  back: 'M38 180 L54 180 L55 192 Q47 195 36 194 Z',
  front: 'M66 180 L82 180 L87 192 Q77 195 65 194 Z',
}

// Each leg is a thigh and a shin that folds at the knee, (46, 146) and (74, 146). The thigh's lower ink
// edge is the knee line; the shin starts under it at 142 so the knee stays closed when it bends.
const THIGH = {
  back: 'M36 110 L57 110 L55.2 146 L37.2 146 Z',
  front: 'M63 110 L84 110 L83.2 146 L64.8 146 Z',
}
const THIGH_SHADOW = {
  back: 'M50 110 L57 110 L55.2 146 L50.5 146 Q51 128 50 110 Z',
  front: 'M77 110 L84 110 L83.2 146 L78.6 146 Q79 128 77 110 Z',
}
const CALF = {
  back: 'M37 142 L55 142 L53 182 L39 182 Z',
  front: 'M65 142 L83 142 L81 182 L67 182 Z',
}
const CALF_SHADOW = {
  back: 'M50.5 142 L55 142 L53 182 L48 182 Q51 162 50.5 142 Z',
  front: 'M78.6 142 L83 142 L81 182 L76 182 Q79 162 78.6 142 Z',
}
const SHORTS = {
  back: 'M35 108 L58 108 L57 142 L37 144 Z',
  front: 'M62 108 L85 108 L83 144 L63 142 Z',
}
const SHIN = {
  back: 'M38 140 L55 140 L54 182 L40 182 Z',
  front: 'M65 140 L82 140 L81 182 L67 182 Z',
}

const UPPER_ARM = {
  back: 'M22 57 L39 57 L38 91 L24 91 Z',
  front: 'M81 57 L98 57 L96 91 L82 91 Z',
}
const FOREARM = {
  back: 'M24 88 L38 88 L37 116 L26 116 Z',
  front: 'M82 88 L96 88 L94 116 L83 116 Z',
}
const FIST = {
  back: 'M21 113 Q31 106 41 113 L41 126 Q31 132 21 126 Z',
  front: 'M79 113 Q89 106 99 113 L99 126 Q89 132 79 126 Z',
}
const GLOVE = {
  back: 'M19 110 Q31 101 43 110 L43 128 Q31 136 19 128 Z',
  front: 'M77 110 Q89 101 101 110 L101 128 Q89 136 77 128 Z',
}

// ---- the outfits ----

// The boots of one colour, with the sole line across.
function boots(fill: string) {
  return function drawBoot(side: Side) {
    return (
      <>
        <Ink d={BOOT[side]} fill={fill} />
        <path d={SIDE[side].sole} stroke={INK} strokeWidth={2.4} />
      </>
    )
  }
}

// The rifle in his front fist, drawn along the forearm past the hand, so it points wherever the forearm
// does: the stock back along the forearm, the receiver and its magazine at the fist, the barrel beyond it
// and the muzzle flash at its end. It shows while he holds it.
const RIFLE = (
  <g className={s.sprRifle}>
    <Ink d="M85 96 L93 96 L93 112 L85 112 Z" fill={CEL.rock} />
    <Ink d="M83 110 L95 110 L95 156 L83 156 Z" fill={CEL.steelDark} />
    <Ink d="M75 128 L83 126 L83 140 L77 142 Z" fill={INK} />
    <Ink d="M87 156 L91 156 L91 184 L87 184 Z" fill={INK} />
    <g className={s.sprMuzzle}>
      <path d="M89 184 L80 196 L86 194 L82 206 L89 198 L96 206 L92 194 L98 196 Z" fill={CEL.sun} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  </g>
)

const GEAR: Record<Profession, Gear> = {
  engineer: {
    torso: (
      <>
        {/* the assault rifle slung across his back: stock under the back hip, barrel over the far shoulder;
            it leaves his back while he holds it */}
        <g className={s.sprSling}>
          <Ink d="M20 108 L84 30 L90 34 L28 114 Z" fill={CEL.steelDark} />
          <Ink d="M14 106 L26 98 L32 108 L20 116 Z" fill={CEL.rock} />
          <Ink d="M84 26 L96 14 L99 17 L88 30 Z" fill={INK} />
        </g>
        <Ink d={TORSO} fill={CEL.inkSoft} />
        {/* the plate carrier: the front plate, its shadow side, three mag pouches, the belt and buckle */}
        <Ink d="M33 58 Q60 52 87 58 L88 102 L32 102 Z" fill={CEL.scrub} />
        <Shade d="M74 55 Q82 56 87 58 L88 102 L76 102 Q80 80 74 55 Z" fill={CEL.scrubShade} />
        <Ink d="M38 80 L50 80 L50 98 L38 98 Z" fill={CEL.scrubShade} />
        <Ink d="M54 80 L66 80 L66 98 L54 98 Z" fill={CEL.scrubShade} />
        <Ink d="M70 80 L82 80 L82 98 L70 98 Z" fill={CEL.scrubShade} />
        <path d="M40 66 L80 66 M40 72 L80 72" stroke={INK} strokeWidth={1.8} />
        <Ink d="M33 102 L87 102 L87 113 L33 113 Z" fill={INK} />
        <Ink d="M55 101 L65 101 L65 114 L55 114 Z" fill={CEL.sun} />
      </>
    ),
    sleeve: CEL.inkSoft,
    sleeveShade: INK,
    forearm: SKIN,
    hand: (side) => (
      <>
        {side === 'front' && RIFLE}
        <Ink d={FIST[side]} fill={CEL.inkSoft} />
        {side === 'front' && <Ink d="M81 98 L97 98 L96 110 L82 110 Z" fill={CEL.holo} />}
      </>
    ),
    legs: CEL.sand,
    legsShade: CEL.duneShade,
    shorts: false,
    feet: boots(INK),
    head: null,
    prop: (
      <>
        {/* the wrist computer's hologram, beside his front hand; it lights while he works it */}
        <g className={s.sprHolo}>
          <path d="M100 66 L118 60 L118 98 L100 104 Z" fill={CEL.holo} opacity={0.75} stroke={CEL.holoDeep} strokeWidth={1.6} />
          <path d="M103 72 L115 68 M103 79 L113 76 M103 86 L116 82 M103 93 L110 91" stroke={CEL.night} strokeWidth={1.6} />
        </g>
        {/* the deployable turret: tripod, armoured box with its shield, the barrel, the muzzle flash */}
        <g className={s.sprTurret}>
          <path d="M138 150 L124 196 M138 150 L152 196 M138 150 L138 196" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path d="M138 150 L124 196 M138 150 L152 196 M138 150 L138 196" stroke={CEL.steel} strokeWidth={2.4} strokeLinecap="round" />
          <Ink d="M122 128 L154 128 L156 152 L120 152 Z" fill={CEL.orange} />
          <Shade d="M144 128 L154 128 L156 152 L146 152 Z" fill={CEL.mesaShade} />
          <Ink d="M118 120 L130 116 L130 156 L118 158 Z" fill={CEL.steelDark} />
          <Ink d="M154 134 L184 134 L184 142 L154 142 Z" fill={INK} />
          <circle cx={134} cy={140} r={4} fill={CEL.holo} stroke={INK} strokeWidth={1.6} />
          <g className={s.sprFlash}>
            <path d="M184 138 L196 126 L194 134 L206 132 L196 140 L208 148 L194 144 L196 152 Z" fill={CEL.sun} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          </g>
        </g>
      </>
    ),
  },
  drummer: {
    torso: (
      <>
        <Ink d={TORSO} fill={CEL.red} />
        <Shade d={TORSO_SHADOW} fill={CEL.redShade} />
        {/* the open vest over the tee */}
        {/* the commando's plate carrier worn open over the tee */}
        <Ink d="M30 56 Q40 52 48 52 L50 112 L33 112 L25 72 Z" fill={CEL.scrub} />
        <Ink d="M90 56 Q80 52 72 52 L70 112 L87 112 L95 72 Z" fill={CEL.scrub} />
        <Ink d="M34 84 L46 84 L46 100 L34 100 Z" fill={CEL.scrubShade} />
        <Ink d="M74 84 L86 84 L86 100 L74 100 Z" fill={CEL.scrubShade} />
        <Ink d="M33 104 L87 104 L87 113 L33 113 Z" fill={INK} />
        <circle cx={41} cy={70} r={2} fill={CEL.steel} />
        <circle cx={79} cy={70} r={2} fill={CEL.steel} />
      </>
    ),
    sleeve: SKIN,
    sleeveShade: SKIN_SHADE,
    forearm: SKIN,
    hand: (side) => (
      <>
        {/* the stick held in the fist, tip up and out */}
        <g>
          <path d={SIDE[side].stickLine} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d={SIDE[side].stickLine} stroke={CEL.sand} strokeWidth={3} strokeLinecap="round" />
        </g>
        <Ink d={FIST[side]} fill={SKIN} />
        <path d={SIDE[side].grip} stroke={INK} strokeWidth={5} />
      </>
    ),
    legs: CEL.denim,
    legsShade: CEL.denimShade,
    shorts: false,
    feet: boots(INK),
    head: null,
    prop: null,
  },
  fighter: {
    torso: (
      <>
        <Ink d={TORSO} fill={SKIN} />
        <Shade d={TORSO_SHADOW} fill={SKIN_SHADE} />
        {/* the chest and the abs in ink strokes */}
        <path d="M40 70 Q50 76 59 70 M61 70 Q70 76 80 70 M60 76 L60 104 M50 86 L70 86 M51 96 L69 96" fill="none" stroke={INK} strokeWidth={1.8} />
      </>
    ),
    sleeve: SKIN,
    sleeveShade: SKIN_SHADE,
    forearm: SKIN,
    hand: (side) => (
      <>
        <Ink d={GLOVE[side]} fill={CEL.red} />
        <path d={SIDE[side].gloveTrim} fill="none" stroke={CEL.white} strokeWidth={2.4} />
      </>
    ),
    legs: CEL.red,
    legsShade: CEL.redShade,
    shorts: true,
    feet: (side) => <Ink d={BARE_FOOT[side]} fill={SKIN} />,
    head: (
      // His mongkhon: a thick rope crown, red wound with white, the knot and two tails at the back.
      <g>
        <path d="M43 21 Q60 13 77 21" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M43 21 Q60 13 77 21" fill="none" stroke={CEL.red} strokeWidth={4.2} strokeLinecap="round" />
        <path d="M47 19 L50 15 M55 16 L58 13 M63 14 L66 15 M71 16 L74 18" stroke={CEL.white} strokeWidth={1.8} />
        <Ink d="M76 18 Q86 20 90 30 L86 32 Q83 25 76 24 Z" fill={CEL.red} />
      </g>
    ),
    prop: null,
  },
}

// ---- the head, the same in every outfit ----

function Head({ extra }: { extra: ReactNode }) {
  return (
    <g>
      <Ink d="M53 42 L67 42 L67 56 L53 56 Z" fill={SKIN_SHADE} />
      <Ink d="M40 27 Q40 23 44 24 L45 35 Q41 35 40 31 Z" fill={SKIN} />
      <Ink d="M80 27 Q80 23 76 24 L75 35 Q79 35 80 31 Z" fill={SKIN_SHADE} />
      {/* the face: a square jaw */}
      <Ink d="M44 28 Q44 12 60 11 Q76 12 76 28 Q76 42 69 47 L51 47 Q44 42 44 28 Z" fill={SKIN} />
      <Shade d="M68 13 Q76 16 76 28 Q76 40 70 46 Q73 30 68 13 Z" fill={SKIN_SHADE} />
      {/* the short dark hair, a few spikes on the crown */}
      <Ink d="M42 26 Q40 9 56 6 L60 2 L63 6 L68 4 L69 8 Q79 11 78 26 Q75 17 66 16 Q58 19 50 16 Q45 18 42 26 Z" fill={HERO_IDENTITY.hair} />
      {/* the full dark beard and the moustache */}
      <Ink d="M44 29 Q45 50 60 54 Q75 50 76 29 Q73 37 68 36 Q64 40 60 39 Q56 40 52 36 Q47 37 44 29 Z" fill={HERO_IDENTITY.beard} />
      <path d="M52 35 Q60 31 68 35 Q64 37.5 60 36.5 Q56 37.5 52 35 Z" fill={HERO_IDENTITY.beard} stroke={INK} strokeWidth={1.2} />
      {/* the brows, low and set, and the nose */}
      <path d="M49 21 L57 23.5 M63 23.5 L71 21" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M60 27 L58 31.5 L61.5 31.5" fill="none" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      {/* the black oval eyes */}
      <g>
        <ellipse cx={54} cy={27} rx={1.9} ry={2.7} fill={HERO_IDENTITY.eyes} />
        <ellipse cx={66} cy={27} rx={1.9} ry={2.7} fill={HERO_IDENTITY.eyes} />
      </g>
      {extra}
    </g>
  )
}

/** The commando's one armoured shoulder pad, on the front shoulder in every outfit: two plates, rivets. */
function ShoulderPad() {
  return (
    <>
      <Ink d="M77 54 Q89 44 102 54 L101 70 Q89 64 78 70 Z" fill={CEL.orange} />
      <Shade d="M93 50 Q99 51 102 54 L101 70 Q97 67 93 66 Z" fill={CEL.mesaShade} />
      <path d="M79 62 Q89 56 101 62" fill="none" stroke={INK} strokeWidth={2} />
      <circle cx={84} cy={57} r={1.4} fill={INK} />
      <circle cx={95} cy={57} r={1.4} fill={INK} />
    </>
  )
}

// An arm: the upper arm turns at the shoulder, the forearm and hand fold at the elbow, (31, 89) and
// (89, 89).
function Arm({ side, gear }: { side: Side; gear: Gear }) {
  const parts = SIDE[side]
  return (
    <g className={parts.arm}>
      <Ink d={UPPER_ARM[side]} fill={gear.sleeve} />
      <Shade d={parts.sleeveEdge} fill={gear.sleeveShade} />
      {gear.shorts && <path d={parts.armBand} stroke={CEL.red} strokeWidth={4} />}
      <g className={parts.fore}>
        <Ink d={FOREARM[side]} fill={gear.forearm} />
        {gear.hand(side)}
      </g>
      {side === 'front' && <ShoulderPad />}
    </g>
  )
}

// Below the knee: the bare shin under shorts, the trouser calf with its shadow side otherwise.
function Shin({ side, gear }: { side: Side; gear: Gear }) {
  if (gear.shorts) return <Ink d={SHIN[side]} fill={SKIN} />
  return (
    <>
      <Ink d={CALF[side]} fill={gear.legs} />
      <Shade d={CALF_SHADOW[side]} fill={gear.legsShade} />
    </>
  )
}

// Above the knee: the shorts with their sun trim on the hem, the trouser thigh with its shadow side otherwise.
function Thigh({ side, gear }: { side: Side; gear: Gear }) {
  if (gear.shorts) {
    return (
      <>
        <Ink d={SHORTS[side]} fill={gear.legs} />
        <path d={SIDE[side].hem} stroke={CEL.sun} strokeWidth={3} />
      </>
    )
  }
  return (
    <>
      <Ink d={THIGH[side]} fill={gear.legs} />
      <Shade d={THIGH_SHADOW[side]} fill={gear.legsShade} />
    </>
  )
}

// A leg: the thigh turns at the hip, the shin and the foot fold at the knee. The shin is drawn first so
// the shorts' hem or the trouser thigh lies over the top of it.
function Leg({ side, gear }: { side: Side; gear: Gear }) {
  const parts = SIDE[side]
  return (
    <g className={parts.leg}>
      <g className={parts.shin}>
        <Shin side={side} gear={gear} />
        {gear.feet(side)}
      </g>
      <Thigh side={side} gear={gear} />
    </g>
  )
}

interface SpriteProps {
  profession: Profession
  /** His drawn size, when he is drawn into a larger picture. */
  box?: { width: number; height: number }
  className?: string
}

// Memoised on its plain props, so a parent render that leaves his outfit and box as they are does not
// redraw the svg.
export const CommandoSprite = memo(function CommandoSprite({ profession, box, className = '' }: SpriteProps) {
  const gear = GEAR[profession]

  return (
    <svg viewBox={`0 0 ${SPRITE_VIEW.width} ${SPRITE_VIEW.height}`} {...box} className={`overflow-visible ${s.sprite} ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={196} rx={34} ry={4.5} fill={INK} opacity={0.35} />
      <g className={s.sprRoot}>
        <Arm side="back" gear={gear} />
        <Leg side="back" gear={gear} />
        <g>
          {gear.torso}
          <Head extra={gear.head} />
        </g>
        <Leg side="front" gear={gear} />
        <Arm side="front" gear={gear} />
        {gear.prop}
      </g>
    </svg>
  )
})
