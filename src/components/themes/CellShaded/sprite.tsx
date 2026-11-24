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
// shadow on its back edge, in the darker tone, with diagonal hatching over it) and gritty gear. His
// traits come from HERO_IDENTITY: brown skin, short dark hair, the full dark beard, black oval eyes.
//
// Per profession: the System Engineer in the full commando kit (olive plate carrier with pouches over a
// dark tee, cargo trousers, boots, the rifle slung), with the wrist computer's hologram and the turret
// he deploys; the Musician in the same vest open over a red tee, jeans and boots, two sticks in his
// fists; the Martial Artist bare chested in red Muay Thai shorts with a sun trim, wrapped red gloves and
// his own mongkhon (a thick red and white rope crown tied at the back with two tails). Every outfit keeps
// the commando's shoulder pad.
//
// He stands side on, facing right, the way he acts in every scene: his near side (the shoulder pad, the
// rifle hand) toward the viewer, his far arm and leg behind him in shade. Every part is a group that turns
// round its own joint (sprite.module.css): both shoulders on one point (60, 60), the elbows (60, 89), the
// hips side by side (57 and 63, 111), the knees (146), the whole of him round his feet, so a negative turn
// swings a limb forward, to the right, and nothing comes apart at a joint. A theatre scene poses him from
// its playhead (pose.ts); everywhere else he stands at rest.

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

/** The far limbs, behind him, and the near ones, toward the viewer. */
type Side = 'back' | 'front'

const CLASSES: Record<Side, { arm: string; fore: string; leg: string; shin: string }> = {
  back: { arm: s.sprArmB, fore: s.sprForeB, leg: s.sprLegB, shin: s.sprShinB },
  front: { arm: s.sprArmF, fore: s.sprForeF, leg: s.sprLegF, shin: s.sprShinF },
}

// ---- the body parts every outfit shares ----

const TORSO = 'M47 56 Q60 50 74 56 L76 112 L46 112 Z'
const TORSO_SHADOW = 'M47 56 Q51 54 55 54 Q50 82 53 112 L46 112 Z'

// The arm, hanging from the shoulder (60, 60): the upper arm to the elbow (60, 89), the forearm and fist below.
const UPPER_ARM = 'M52 57 L68 57 L67 91 L53 91 Z'
const SLEEVE_EDGE = 'M52 57 L57 57 L57 91 L53 91 Z'
const FOREARM = 'M53 88 L67 88 L66 118 L54 118 Z'
const FIST = 'M52 115 Q60 109 68 115 L68 127 Q60 133 52 127 Z'
const GLOVE = 'M50 112 Q60 103 70 112 L70 130 Q60 138 50 130 Z'

// Each leg under its hip, the far at x 57 and the near at 63: the thigh to the knee at 146, the shin and the
// foot below it, the toes to the right. The shin starts above the knee line so the knee stays closed when it bends.
const HIP: Record<Side, number> = { back: 57, front: 63 }
const thigh = (x: number) => `M${x - 9} 110 L${x + 9} 110 L${x + 8} 146 L${x - 7} 146 Z`
const thighShadow = (x: number) => `M${x - 9} 110 L${x - 3} 110 L${x - 2} 146 L${x - 7} 146 Z`
const calf = (x: number) => `M${x - 7} 142 L${x + 8} 142 L${x + 6} 182 L${x - 5} 182 Z`
const calfShadow = (x: number) => `M${x - 7} 142 L${x - 2} 142 L${x - 1} 182 L${x - 5} 182 Z`
const shorts = (x: number) => `M${x - 10} 108 L${x + 10} 108 L${x + 9} 142 L${x - 8} 144 Z`
const shin = (x: number) => `M${x - 6} 140 L${x + 7} 140 L${x + 6} 182 L${x - 4} 182 Z`
const boot = (x: number) => `M${x - 6} 178 L${x + 7} 178 Q${x + 19} 182 ${x + 20} 194 Q${x + 6} 197 ${x - 7} 196 Z`
const bareFoot = (x: number) => `M${x - 5} 180 L${x + 6} 180 Q${x + 16} 186 ${x + 17} 194 Q${x + 4} 196 ${x - 5} 195 Z`

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
  feet: (x: number) => ReactNode
  head: ReactNode
  prop: ReactNode
}

// ---- the outfits ----

// The boots of one colour, with the sole line across.
function boots(fill: string) {
  return function drawBoot(x: number) {
    return (
      <>
        <Ink d={boot(x)} fill={fill} />
        <path d={`M${x - 6} 192 L${x + 19} 192`} stroke={INK} strokeWidth={2.4} />
      </>
    )
  }
}

// The rifle in his near fist, drawn along the forearm past the hand, so it points wherever the forearm
// does: the stock back along the forearm, the receiver at the fist with the magazine under it, the barrel
// beyond and the muzzle flash at its end. It shows while he holds it.
const RIFLE = (
  <g className={s.sprRifle}>
    <Ink d="M56 96 L64 96 L64 112 L56 112 Z" fill={CEL.rock} />
    <Ink d="M54 110 L66 110 L66 156 L54 156 Z" fill={CEL.steelDark} />
    <Ink d="M46 128 L54 126 L54 140 L48 142 Z" fill={INK} />
    <Ink d="M58 156 L62 156 L62 184 L58 184 Z" fill={INK} />
    <g className={s.sprMuzzle}>
      <path d="M60 184 L51 196 L57 194 L53 206 L60 198 L67 206 L63 194 L69 196 Z" fill={CEL.sun} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  </g>
)

// A drumstick in the fist along the forearm's line, its tip past the fist, and the grip over it.
const STICK = (
  <>
    <path d="M60 112 L60 148" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <path d="M60 112 L60 148" stroke={CEL.sand} strokeWidth={3} strokeLinecap="round" />
  </>
)

const GEAR: Record<Profession, Gear> = {
  engineer: {
    torso: (
      <>
        {/* the assault rifle slung across his back: stock low behind him, barrel up over the shoulder; it
            leaves his back while he holds it */}
        <g className={s.sprSling}>
          <Ink d="M40 110 L66 30 L72 33 L47 114 Z" fill={CEL.steelDark} />
          <Ink d="M33 106 L43 99 L49 110 L39 117 Z" fill={CEL.rock} />
          <Ink d="M66 26 L72 13 L76 15 L71 30 Z" fill={INK} />
        </g>
        <Ink d={TORSO} fill={CEL.inkSoft} />
        {/* the plate carrier: the plates front and back, its shadow side, two mag pouches on the front, the belt and buckle */}
        <Ink d="M49 60 Q62 55 75 60 L76 104 L48 104 Z" fill={CEL.scrub} />
        <Shade d="M49 60 Q52 58 56 58 Q52 80 54 104 L48 104 Z" fill={CEL.scrubShade} />
        <Ink d="M57 80 L66 80 L66 98 L57 98 Z" fill={CEL.scrubShade} />
        <Ink d="M67 80 L76 80 L76 98 L67 98 Z" fill={CEL.scrubShade} />
        <path d="M50 66 L75 66 M50 72 L75 72" stroke={INK} strokeWidth={1.8} />
        <Ink d="M46 102 L76 102 L76 113 L46 113 Z" fill={INK} />
        <Ink d="M70 101 L77 101 L77 114 L70 114 Z" fill={CEL.sun} />
      </>
    ),
    sleeve: CEL.inkSoft,
    sleeveShade: INK,
    forearm: SKIN,
    hand: (side) => (
      <>
        {side === 'front' && RIFLE}
        <Ink d={FIST} fill={CEL.inkSoft} />
        {side === 'front' && <Ink d="M53 100 L67 100 L66 112 L54 112 Z" fill={CEL.holo} />}
      </>
    ),
    legs: CEL.sand,
    legsShade: CEL.duneShade,
    shorts: false,
    feet: boots(INK),
    head: null,
    prop: (
      <>
        {/* the wrist computer's hologram, over the raised wrist before his face; it lights while he works it */}
        <g className={s.sprHolo}>
          <path d="M98 30 L116 24 L116 62 L98 68 Z" fill={CEL.holo} opacity={0.75} stroke={CEL.holoDeep} strokeWidth={1.6} />
          <path d="M101 36 L113 32 M101 43 L111 40 M101 50 L114 46 M101 57 L108 55" stroke={CEL.night} strokeWidth={1.6} />
        </g>
        {/* the deployable turret before him, facing the way he does: tripod, armoured box, the shield and
            barrel to the right, the muzzle flash */}
        <g className={s.sprTurret}>
          <path d="M132 150 L118 196 M132 150 L146 196 M132 150 L132 196" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path d="M132 150 L118 196 M132 150 L146 196 M132 150 L132 196" stroke={CEL.steel} strokeWidth={2.4} strokeLinecap="round" />
          <Ink d="M116 128 L148 128 L150 152 L114 152 Z" fill={CEL.orange} />
          <Shade d="M116 128 L124 128 L122 152 L114 152 Z" fill={CEL.mesaShade} />
          <Ink d="M146 116 L156 120 L156 158 L146 156 Z" fill={CEL.steelDark} />
          <Ink d="M156 134 L182 134 L182 142 L156 142 Z" fill={INK} />
          <circle cx={128} cy={140} r={4} fill={CEL.holo} stroke={INK} strokeWidth={1.6} />
          <g className={s.sprFlash}>
            <path d="M182 138 L194 126 L192 134 L204 132 L194 140 L206 148 L192 144 L194 152 Z" fill={CEL.sun} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
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
        {/* the commando's plate carrier worn open over the tee: its back panel, its front panel */}
        <Ink d="M47 56 Q52 53 56 53 L55 112 L46 112 Z" fill={CEL.scrub} />
        <Ink d="M69 54 Q72 55 74 56 L76 112 L69 112 Z" fill={CEL.scrub} />
        <Ink d="M48 84 L54 84 L54 100 L48 100 Z" fill={CEL.scrubShade} />
        <Ink d="M46 104 L76 104 L76 113 L46 113 Z" fill={INK} />
        <circle cx={72} cy={70} r={2} fill={CEL.steel} />
      </>
    ),
    sleeve: SKIN,
    sleeveShade: SKIN_SHADE,
    forearm: SKIN,
    hand: () => (
      <>
        {STICK}
        <Ink d={FIST} fill={SKIN} />
        <path d="M53 120 L67 120" stroke={INK} strokeWidth={5} />
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
        {/* the chest and the abs in profile, in ink strokes */}
        <path d="M64 64 Q71 72 75 68 M68 80 L75 80 M68 92 L76 92 M67 102 L76 102" fill="none" stroke={INK} strokeWidth={1.8} />
      </>
    ),
    sleeve: SKIN,
    sleeveShade: SKIN_SHADE,
    forearm: SKIN,
    hand: () => (
      <>
        <Ink d={GLOVE} fill={CEL.red} />
        <path d="M51 126 Q60 131 69 126" fill="none" stroke={CEL.white} strokeWidth={2.4} />
      </>
    ),
    legs: CEL.red,
    legsShade: CEL.redShade,
    shorts: true,
    feet: (x) => <Ink d={bareFoot(x)} fill={SKIN} />,
    head: (
      // His mongkhon: a thick rope crown seen from the side, red wound with white, the knot and two tails at the back.
      <g>
        <path d="M45 21 Q60 13 76 20" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M45 21 Q60 13 76 20" fill="none" stroke={CEL.red} strokeWidth={4.2} strokeLinecap="round" />
        <path d="M50 18 L52 14 M57 15 L60 12 M65 14 L68 15 M71 16 L74 18" stroke={CEL.white} strokeWidth={1.8} />
        <Ink d="M46 19 Q36 22 33 32 L37 33 Q40 26 46 24 Z" fill={CEL.red} />
      </g>
    ),
    prop: null,
  },
}

// ---- the head in profile, the same in every outfit ----

function Head({ extra }: { extra: ReactNode }) {
  return (
    <g>
      <Ink d="M55 42 L66 42 L66 58 L55 58 Z" fill={SKIN_SHADE} />
      {/* the head: the back of the skull on the left, the brow, nose and square jaw to the right */}
      <Ink d="M46 28 Q45 10 60 9 Q73 9 75 22 L79 30 L75 32 Q75 44 68 49 Q58 52 52 46 Q46 40 46 28 Z" fill={SKIN} />
      <Shade d="M46 28 Q46 40 52 46 Q49 36 50 24 Z" fill={SKIN_SHADE} />
      <Ink d="M52 29 Q52 24 56 25 Q59 26 58 31 Q57 35 53 34 Z" fill={SKIN_SHADE} />
      {/* the short dark hair, a few spikes on the crown */}
      <Ink d="M45 28 Q42 8 58 5 L61 1 L64 5 L69 3 L70 7 Q77 11 76 20 Q70 15 62 16 Q55 18 52 28 Z" fill={HERO_IDENTITY.hair} />
      {/* the full dark beard along the jaw and the moustache */}
      <Ink d="M53 34 Q54 51 63 54 Q74 51 76 34 L72 36 Q68 38 65 36 Q59 38 53 34 Z" fill={HERO_IDENTITY.beard} />
      <path d="M66 35 Q71 32.5 76 34.5" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      {/* the brow, low and set, and the black oval eye */}
      <path d="M64 21 L73 23" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <ellipse cx={69} cy={26.5} rx={1.9} ry={2.7} fill={HERO_IDENTITY.eyes} />
      {extra}
    </g>
  )
}

/** The commando's one armoured shoulder pad, on his near shoulder in every outfit: two plates, rivets. */
function ShoulderPad() {
  return (
    <>
      <Ink d="M51 57 Q60 46 70 56 L69 71 Q60 65 52 71 Z" fill={CEL.orange} />
      <Shade d="M51 57 Q53 53 56 51 L56 67 Q54 68 52 71 Z" fill={CEL.mesaShade} />
      <path d="M52 64 Q60 58 69 63" fill="none" stroke={INK} strokeWidth={2} />
      <circle cx={57} cy={58} r={1.4} fill={INK} />
      <circle cx={65} cy={58} r={1.4} fill={INK} />
    </>
  )
}

// An arm: the upper arm turns at the shoulder, the forearm and hand fold at the elbow.
function Arm({ side, gear }: { side: Side; gear: Gear }) {
  const parts = CLASSES[side]
  return (
    <g className={parts.arm}>
      <Ink d={UPPER_ARM} fill={gear.sleeve} />
      <Shade d={SLEEVE_EDGE} fill={gear.sleeveShade} />
      {gear.shorts && <path d="M52 70 L68 70" stroke={CEL.red} strokeWidth={4} />}
      <g className={parts.fore}>
        <Ink d={FOREARM} fill={gear.forearm} />
        {gear.hand(side)}
      </g>
      {side === 'front' && <ShoulderPad />}
    </g>
  )
}

// Below the knee: the bare shin under shorts, the trouser calf with its shadow side otherwise.
function Shin({ x, gear }: { x: number; gear: Gear }) {
  if (gear.shorts) return <Ink d={shin(x)} fill={SKIN} />
  return (
    <>
      <Ink d={calf(x)} fill={gear.legs} />
      <Shade d={calfShadow(x)} fill={gear.legsShade} />
    </>
  )
}

// Above the knee: the shorts with their sun trim on the hem, the trouser thigh with its shadow side otherwise.
function Thigh({ x, gear }: { x: number; gear: Gear }) {
  if (gear.shorts) {
    return (
      <>
        <Ink d={shorts(x)} fill={gear.legs} />
        <path d={`M${x - 8} 140 L${x + 9} 139`} stroke={CEL.sun} strokeWidth={3} />
      </>
    )
  }
  return (
    <>
      <Ink d={thigh(x)} fill={gear.legs} />
      <Shade d={thighShadow(x)} fill={gear.legsShade} />
    </>
  )
}

// A leg: the thigh turns at the hip, the shin and the foot fold at the knee. The shin is drawn first so
// the shorts' hem or the trouser thigh lies over the top of it.
function Leg({ side, gear }: { side: Side; gear: Gear }) {
  const parts = CLASSES[side]
  const x = HIP[side]
  return (
    <g className={parts.leg}>
      <g className={parts.shin}>
        <Shin x={x} gear={gear} />
        {gear.feet(x)}
      </g>
      <Thigh x={x} gear={gear} />
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
      <ellipse cx={62} cy={196} rx={30} ry={4.5} fill={INK} opacity={0.35} />
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
