import type { ReactNode } from 'react'
import { DARK_FANTASY as P } from './palette'
import s from './wanderer.module.css'

// Him side on, facing right, as the scenes draw him: the small masked wanderer of the bug kingdom's caverns, in
// the game's hand drawn ink. A pale mask of our own shape (an egg, two horns curving up) with both void eyes
// turned the way he faces, his own dark beard under it, a slate cloak with a torn hem over a small body, thin
// dark legs, and the nail, a plain blade, in his near hand. Every shape has the ink outline.
//
// The parts are groups that turn round their own joints (the origins in wanderer.module.css), posed by a scene's
// writer on the shared rig (pose.ts); his shadow under his soles fades as he leaves the floor. The nail's slash in front of him, under him and over him, the soul
// gathering round him and the shadow of his dash rest hidden until a pose shows them. Transform and opacity only.

// ---- shapes (viewBox 100 by 120, facing right, soles on y 114; the horns rise above the box) ----

const VIEW = { width: 100, height: 120 }

/** His viewBox, the point a scene stands him on (between his soles) and the middle of his body. */
export const WANDERER = { ...VIEW, soleX: 54, soleY: 114, bodyY: 72 }

const LINE = P.black

const MASK = 'M54 15 C66 15 73 25 73 37 C73 49 65 56 54 56 C43 56 35 49 35 37 C35 25 42 15 54 15 Z'
const HORN_BACK = 'M42 22 C37 14 35 6 38 -4 C42 0 45 9 48 18 Z'
const HORN_FRONT = 'M60 17 C62 8 66 1 72 -4 C73 6 69 15 65 21 Z'
const BEARD = 'M41 49 Q43 60 51 65 Q59 68 65 61 Q69 55 68 49 Q62 54 55 54 Q47 54 41 49 Z'
const CLOAK = 'M38 54 Q54 46 68 54 L73 97 L67 94 L61 100 L54 95 L46 100 L40 95 L32 99 Z'
const CLOAK_FOLDS = 'M50 58 L48 96 M60 58 L62 94'

const UPPER_ARM = { back: 'M43.5 58 L48.5 58 L48.5 73 L43.5 73 Z', front: 'M59.5 58 L65 58 L65.5 73 L60.5 73 Z' }
const FOREARM = { back: 'M44 71 L48.5 71 L48.5 81 L44.5 81 Z', front: 'M60.8 71 L65.4 71 L65 82 L61.2 82 Z' }
const HAND = { back: { x: 46.5, y: 82 }, front: { x: 63, y: 83 } }
const THIGH = { back: 'M48 93 L52 93 L51.6 106 L48.4 106 Z', front: 'M56 93 L60 93 L59.6 106 L56.4 106 Z' }
const SHIN = { back: 'M48.4 104 L51.6 104 L51.4 111 L55.5 114 L47.6 114 Z', front: 'M56.4 104 L59.6 104 L59.4 111 L63.5 114 L55.6 114 Z' }

// The nail, held in the near fist, pointing down the forearm: the pommel, the grip, the guard and the blade.
const NAIL_GRIP = 'M61.8 79 L64.2 79 L64.2 86 L61.8 86 Z'
const NAIL_GUARD = 'M59.5 86 L66.5 86 L66.5 88.4 L59.5 88.4 Z'
const NAIL_BLADE = 'M61.5 88.4 L64.5 88.4 L64.3 112 L63 117 L61.7 112 Z'

// The slashes, white crescents: ahead at his chest, under his soles, over his horns.
const SLASH = {
  arc: 'M68 18 Q118 40 88 104 Q104 54 68 30 Z',
  downArc: 'M22 104 Q56 156 90 104 Q56 132 22 104 Z',
  upArc: 'M24 6 Q56 -50 88 6 Q56 -22 24 6 Z',
}

// The dash's shadow, a smoke streak trailing behind him at body height.
const SHADE = 'M-84 70 Q-30 44 44 54 L44 92 Q-30 98 -84 80 Z'

/** What a pose shows beside his limbs, each a group `data-part="{name}"`. */
export const PARTS = ['arc', 'downArc', 'upArc', 'focus', 'shade'] as const
export type Part = (typeof PARTS)[number]

function Ink({ d, fill, width = 1.4 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={width} strokeLinejoin="round" />
}

function Head() {
  return (
    <g data-part="head">
      <Ink d={HORN_BACK} fill={P.maskShade} />
      <Ink d={BEARD} fill={P.beard} width={1} />
      <Ink d={MASK} fill={P.white} width={1.6} />
      <Ink d={HORN_FRONT} fill={P.white} />
      <ellipse cx={57} cy={37} rx={4.4} ry={7.4} fill={P.black} />
      <ellipse cx={67.5} cy={36} rx={3.3} ry={6.6} fill={P.black} />
      <path d="M51 63 Q55 66 60 63" fill="none" stroke={P.beardDark} strokeWidth={0.8} />
    </g>
  )
}

function Leg({ side }: { side: 'back' | 'front' }) {
  const fill = side === 'back' ? P.black : P.cloakDark
  return (
    <g className={side === 'back' ? s.thighBack : s.thighFront}>
      <Ink d={THIGH[side]} fill={fill} width={1} />
      <g className={side === 'back' ? s.shinBack : s.shinFront}>
        <Ink d={SHIN[side]} fill={fill} width={1} />
      </g>
    </g>
  )
}

function Arm({ side }: { side: 'back' | 'front' }) {
  const { x, y } = HAND[side]
  return (
    <g className={side === 'back' ? s.armBack : s.armFront}>
      <Ink d={UPPER_ARM[side]} fill={side === 'back' ? P.cloakDark : P.cloak} width={1} />
      <g className={side === 'back' ? s.foreBack : s.foreFront}>
        <Ink d={FOREARM[side]} fill={P.cloakDark} width={1} />
        {side === 'front' && (
          <>
            <Ink d={NAIL_BLADE} fill={P.blade} width={1} />
            <path d="M63 90 L63 111" stroke={P.white} strokeWidth={0.6} opacity={0.7} />
            <Ink d={NAIL_GUARD} fill={P.cloakDark} width={0.8} />
            <Ink d={NAIL_GRIP} fill={P.beardDark} width={0.8} />
          </>
        )}
        <circle cx={x} cy={y} r={2.6} fill={P.cloakDark} stroke={LINE} strokeWidth={1} />
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

/** Him side on in the caverns, at rest; a scene poses his groups (pose.ts). */
export function WandererSprite({ box }: { box: { width: number; height: number } }) {
  return (
    <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} {...box} overflow="visible" aria-hidden="true" focusable="false">
      <g className={s.sprite}>
        <ellipse data-part="shadow" cx={WANDERER.soleX} cy={WANDERER.soleY} rx={22} ry={3.4} fill={P.black} opacity={0.45} />
        <Shown name="shade">
          <path d={SHADE} fill={P.black} opacity={0.75} />
          <path d="M-60 66 Q-10 52 40 60 M-70 84 Q-10 90 40 86" fill="none" stroke={P.voidDeep} strokeWidth={4} />
        </Shown>
        <Shown name="focus">
          <circle cx={54} cy={66} r={52} fill={P.soulBlue} opacity={0.18} />
          <circle cx={54} cy={66} r={46} fill="none" stroke={P.white} strokeWidth={2.4} strokeDasharray="22 14" opacity={0.85} />
        </Shown>
        <g className={s.body}>
          <Arm side="back" />
          <Leg side="back" />
          <Leg side="front" />
          <Ink d={CLOAK} fill={P.cloak} width={1.6} />
          <path d={CLOAK_FOLDS} fill="none" stroke={P.cloakDark} strokeWidth={1.4} />
          <Head />
          <Arm side="front" />
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
      </g>
    </svg>
  )
}
