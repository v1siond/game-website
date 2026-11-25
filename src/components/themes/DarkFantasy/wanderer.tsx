import type { ReactNode } from 'react'
import { DARK_FANTASY as P } from './palette'
import s from './wanderer.module.css'

// Him side on, facing right, as the scenes draw him: a small wanderer of the fallen kingdom, in the game's hand
// drawn ink, big headed and small bodied the way the game draws its travellers, with no mask: his own face,
// brown skin, short dark hair, the full dark beard and black eyes turned the way he faces (src/lib/cv/heroIdentity
// through the palette), a short slate cloak with a torn hem over a small body, thin dark legs, and a plain
// blade in his near hand. Every shape has the ink outline.
//
// The same figure in `shade` is the dark copy his death leaves where he fell, and the empty shells of the
// abyss: every part black, the eyes two white points.
//
// The parts are groups that turn round their own joints (the origins in wanderer.module.css), posed by a scene's
// writer on the shared rig (pose.ts); his shadow under his soles fades as he leaves the floor. The slash in
// front of him, under him and over him, the light gathering round him and the shadow of his dash rest hidden
// until a pose shows them. Transform and opacity only.

// ---- shapes (viewBox 100 by 120, facing right, soles on y 114) ----

const VIEW = { width: 100, height: 120 }

/** His viewBox, the point a scene stands him on (between his soles) and the middle of his body. */
export const WANDERER = { ...VIEW, soleX: 54, soleY: 114, bodyY: 72 }

const LINE = P.black

const FACE = 'M54 19 C65 19 72 27 72 38 C72 49 64 55 54 55 C44 55 36 49 36 38 C36 27 43 19 54 19 Z'
// Short dark hair over the crown and the back of the head, the fringe cut short over the brow.
const HAIR = 'M35 40 C33 25 42 14 55 14 C66 14 73 21 73 29 C70 27 66 26 62 27 C58 25 52 25 48 28 C44 31 42 35 42 41 C40 42 37 42 35 40 Z'
// The full beard round the jaw, from the ear to the chin, the mouth a gap in it.
const BEARD = 'M42 41 Q41 55 51 61 Q61 64 68 56 Q73 50 72 41 Q69 46 64 47 Q60 49 56 47 Q49 48 42 41 Z'
const CLOAK = 'M38 54 Q54 46 68 54 L73 97 L67 94 L61 100 L54 95 L46 100 L40 95 L32 99 Z'
const CLOAK_FOLDS = 'M50 58 L48 96 M60 58 L62 94'

const UPPER_ARM = { back: 'M43.5 58 L48.5 58 L48.5 73 L43.5 73 Z', front: 'M59.5 58 L65 58 L65.5 73 L60.5 73 Z' }
const FOREARM = { back: 'M44 71 L48.5 71 L48.5 81 L44.5 81 Z', front: 'M60.8 71 L65.4 71 L65 82 L61.2 82 Z' }
const HAND = { back: { x: 46.5, y: 82 }, front: { x: 63, y: 83 } }
const THIGH = { back: 'M48 93 L52 93 L51.6 106 L48.4 106 Z', front: 'M56 93 L60 93 L59.6 106 L56.4 106 Z' }
const SHIN = { back: 'M48.4 104 L51.6 104 L51.4 111 L55.5 114 L47.6 114 Z', front: 'M56.4 104 L59.6 104 L59.4 111 L63.5 114 L55.6 114 Z' }

// The blade, held in the near fist, pointing down the forearm: the pommel, the grip, the guard and the blade.
const GRIP = 'M61.8 79 L64.2 79 L64.2 86 L61.8 86 Z'
const GUARD = 'M59.5 86 L66.5 86 L66.5 88.4 L59.5 88.4 Z'
const BLADE = 'M61.5 88.4 L64.5 88.4 L64.3 112 L63 117 L61.7 112 Z'

// The slashes, white crescents: ahead at his chest, under his soles, over his head.
const SLASH = {
  arc: 'M68 18 Q118 40 88 104 Q104 54 68 30 Z',
  downArc: 'M22 104 Q56 156 90 104 Q56 132 22 104 Z',
  upArc: 'M24 6 Q56 -50 88 6 Q56 -22 24 6 Z',
}

// The dash's shadow, a smoke streak trailing behind him at body height.
const SMOKE = 'M-84 70 Q-30 44 44 54 L44 92 Q-30 98 -84 80 Z'

/** What a pose shows beside his limbs, each a group `data-part="{name}"`. */
export const PARTS = ['arc', 'downArc', 'upArc', 'focus', 'shade'] as const
export type Part = (typeof PARTS)[number]

/** His colours: himself, or the dark copy every part of which is the void. */
interface Look {
  skin: string
  skinShade: string
  hair: string
  beard: string
  eyes: string
  cloak: string
  cloakDark: string
  limb: string
  blade: string
  shine: string
}

const HIM: Look = {
  skin: P.skin,
  skinShade: P.skinShade,
  hair: P.hair,
  beard: P.beard,
  eyes: P.eyes,
  cloak: P.cloak,
  cloakDark: P.cloakDark,
  limb: P.black,
  blade: P.blade,
  shine: P.white,
}

const SHADE: Look = {
  skin: P.black,
  skinShade: P.black,
  hair: P.black,
  beard: P.black,
  eyes: P.white,
  cloak: P.black,
  cloakDark: P.voidDeep,
  limb: P.black,
  blade: P.voidDeep,
  shine: P.voidDeep,
}

function Ink({ d, fill, width = 1.4 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={width} strokeLinejoin="round" />
}

function Head({ look }: { look: Look }) {
  return (
    <g data-part="head">
      <Ink d={FACE} fill={look.skin} width={1.6} />
      <ellipse cx={44} cy={39} rx={3} ry={4.2} fill={look.skinShade} stroke={LINE} strokeWidth={0.8} />
      <Ink d={BEARD} fill={look.beard} width={1} />
      <Ink d={HAIR} fill={look.hair} width={1.2} />
      <ellipse cx={58} cy={35} rx={2.9} ry={4.4} fill={look.eyes} />
      <ellipse cx={66.5} cy={34.5} rx={2.4} ry={4} fill={look.eyes} />
      <path d="M57 51 Q61 53 65 51" fill="none" stroke={look.skinShade} strokeWidth={1} />
    </g>
  )
}

function Leg({ side, look }: { side: 'back' | 'front'; look: Look }) {
  const fill = side === 'back' ? look.limb : look.cloakDark
  return (
    <g className={side === 'back' ? s.thighBack : s.thighFront}>
      <Ink d={THIGH[side]} fill={fill} width={1} />
      <g className={side === 'back' ? s.shinBack : s.shinFront}>
        <Ink d={SHIN[side]} fill={fill} width={1} />
      </g>
    </g>
  )
}

function Arm({ side, look }: { side: 'back' | 'front'; look: Look }) {
  const { x, y } = HAND[side]
  return (
    <g className={side === 'back' ? s.armBack : s.armFront}>
      <Ink d={UPPER_ARM[side]} fill={side === 'back' ? look.cloakDark : look.cloak} width={1} />
      <g className={side === 'back' ? s.foreBack : s.foreFront}>
        <Ink d={FOREARM[side]} fill={look.cloakDark} width={1} />
        {side === 'front' && (
          <>
            <Ink d={BLADE} fill={look.blade} width={1} />
            <path d="M63 90 L63 111" stroke={look.shine} strokeWidth={0.6} opacity={0.7} />
            <Ink d={GUARD} fill={look.cloakDark} width={0.8} />
            <Ink d={GRIP} fill={look.hair} width={0.8} />
          </>
        )}
        <circle cx={x} cy={y} r={2.6} fill={look.skin} stroke={LINE} strokeWidth={1} />
      </g>
    </g>
  )
}

function Shown({ name, children }: { name: Part; children: ReactNode }) {
  return (
    <g data-part={name} opacity="0">
      {children}
    </g>
  )
}

/** Him side on, at rest; a scene poses his groups (pose.ts). `figure` marks his body, without the slashes, the
 *  light and the dash's shadow round him, as the world's figure (data-worlds-figure) the launcher's portrait is
 *  cut from. `shade` draws him as the dark copy. */
export function WandererSprite({ box, figure = false, shade = false }: { box: { width: number; height: number }; figure?: boolean; shade?: boolean }) {
  const look = shade ? SHADE : HIM
  return (
    <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} {...box} overflow="visible" aria-hidden="true" focusable="false">
      <g className={s.sprite}>
        <ellipse data-part="shadow" cx={WANDERER.soleX} cy={WANDERER.soleY} rx={22} ry={3.4} fill={P.black} opacity={0.45} />
        <Shown name="shade">
          <path d={SMOKE} fill={P.black} opacity={0.75} />
          <path d="M-60 66 Q-10 52 40 60 M-70 84 Q-10 90 40 86" fill="none" stroke={P.voidDeep} strokeWidth={4} />
        </Shown>
        <Shown name="focus">
          <circle cx={54} cy={66} r={52} fill={P.soulBlue} opacity={0.18} />
          <circle cx={54} cy={66} r={46} fill="none" stroke={P.white} strokeWidth={2.4} strokeDasharray="22 14" opacity={0.85} />
        </Shown>
        <g className={s.body} data-worlds-figure={figure ? '' : undefined}>
          <Arm side="back" look={look} />
          <Leg side="back" look={look} />
          <Leg side="front" look={look} />
          <Ink d={CLOAK} fill={look.cloak} width={1.6} />
          <path d={CLOAK_FOLDS} fill="none" stroke={look.cloakDark} strokeWidth={1.4} />
          <Head look={look} />
          <Arm side="front" look={look} />
        </g>
        <Shown name="arc">
          <path d={SLASH.arc} fill={P.white} stroke={P.soulBlue} strokeWidth={1} />
        </Shown>
        <Shown name="downArc">
          <path d={SLASH.downArc} fill={P.white} stroke={P.soulBlue} strokeWidth={1} />
        </Shown>
        <Shown name="upArc">
          <path d={SLASH.upArc} fill={P.white} stroke={P.soulBlue} strokeWidth={1} />
        </Shown>
      </g>
    </svg>
  )
}
