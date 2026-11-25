'use client'

import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { MYTH } from './palette'
import { REST, bodyTransform, jointTransform, type Joint, type Pose } from './rig'

// Him as the warrior of the Greek war god games, our own, in three quarter profile facing right: bare
// chested, a crimson cloth kilt to the knee on a bronze belt, one leather strap across the chest, bronze
// bracers with the chains of his blades wound round them, bronze greaves and sandals, and a straight leaf
// blade of bronze with a red hot edge in each fist, each on its chain. One dark ink line round every shape
// over painted fills, the warm rim of fire on the lit edge. Nothing is the game's hero: no ash skin, no red
// mark, no hooked blades, no shoulder guard.
//
// His traits come from HERO_IDENTITY: his skin, his dark hair, his full dark beard and dark oval eyes. The
// Martial Artist wears his mongkhon.
//
// Every limb is drawn hanging straight down and rig.ts turns it: HeroFigure draws one pose as SVG
// attributes, and a scene's writer turns its joints ([data-joint]) and moves its body ([data-body]) as the
// page scrolls (scenes.tsx). What his hands hold, the blades, the horn, the great sword or the hammer, are
// groups a scene shows and hides (data-fx held-blades, held-blade-far, held-horn, held-sword, held-hammer).

const INK = MYTH.inkLine

function Inked({ d, fill, width = 2.2 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={width} strokeLinejoin="round" />
}

type Side = 'far' | 'near'

// ---- the shapes (viewBox 160 by 210, facing right, limbs hanging straight down, feet on y 198) ----

const HEAD = 'M80 38 Q78 20 94 19 Q106 19 107 33 L109 42 Q108 50 102 53 L85 54 Q80 48 80 38 Z'
const HAIR = 'M79 40 Q76 22 92 18 Q106 17 108 30 Q100 26 92 28 Q86 30 84 42 Z'
const BROW = 'M92 32 L108 30 L108 34 L93 35 Z'
const NOSE = 'M107 37 L111 44 L107 45'
const BEARD = 'M84 44 Q86 50 89 52 L107 46 Q111 51 108 58 Q103 69 95 71 Q85 69 83 58 Z'
const NECK = 'M85 50 L101 50 L103 64 L83 64 Z'

// A broad bare chest, the muscle lines in the skin's shade, and the leather strap from the near shoulder to the far hip.
const TORSO = 'M74 62 Q86 52 101 57 Q114 62 115 76 Q116 92 107 106 L103 118 L76 118 Q68 100 70 84 Q70 70 74 62 Z'
const MUSCLE = 'M92 70 Q102 76 110 72 M90 84 Q96 88 104 86 M92 94 Q97 98 103 96 M96 76 L96 108'
const STRAP = 'M100 58 L108 62 L82 116 L74 112 Z'

const UPPER_ARM: Record<Side, string> = {
  far: 'M75 66 Q84 57 93 66 L92 98 Q84 104 76 98 Z',
  near: 'M88 68 Q98 59 109 70 L107 102 Q98 108 89 102 Z',
}
const FOREARM: Record<Side, string> = {
  far: 'M78 96 L90 96 Q91 108 88 122 L80 122 Q77 108 78 96 Z',
  near: 'M91 100 L105 100 Q106 112 103 126 L93 126 Q90 112 91 100 Z',
}
// The bronze bracer and the turns of chain wound over it.
const BRACER: Record<Side, string> = {
  far: 'M77 102 L91 102 L89 120 L79 120 Z',
  near: 'M90 106 L106 106 L104 124 L92 124 Z',
}
const CHAIN_TURNS: Record<Side, string> = {
  far: 'M78 107 L90 105 M78 112 L90 110 M79 117 L89 115',
  near: 'M91 111 L105 109 M91 116 L105 114 M92 121 L104 119',
}
const FIST: Record<Side, string> = {
  far: 'M78 119 Q84 115 90 119 L90 130 Q84 134 78 130 Z',
  near: 'M91 123 Q98 119 105 123 L105 135 Q98 139 91 135 Z',
}
// A straight leaf blade out of the fist, forward and down; its hilt and the chain from the bracer to its pommel.
const BLADE: Record<Side, { hilt: string; blade: string; edge: string; chain: string }> = {
  near: {
    hilt: 'M93 132 L104 130 L105 136 L94 138 Z',
    blade: 'M97 137 L103 136 Q114 160 113 192 L110 198 Q103 168 97 137 Z',
    edge: 'M103 136 Q114 160 113 192',
    chain: 'M92 124 Q86 132 96 134',
  },
  far: {
    hilt: 'M79 128 L90 126 L91 132 L80 134 Z',
    blade: 'M83 133 L89 132 Q100 156 99 188 L96 194 Q89 164 83 133 Z',
    edge: 'M89 132 Q100 156 99 188',
    chain: 'M78 120 Q72 128 82 130',
  },
}
// The great sword along the near forearm's line, far past the fist; the war hammer's long haft and its head.
const SWORD = 'M95 134 L103 133 L112 330 L104 344 L96 330 Z'
const SWORD_GUARD = 'M86 132 L112 128 L113 136 L87 140 Z'
const HAMMER_HAFT = 'M95 100 L102 99 L108 250 L101 251 Z'
const HAMMER_HEAD = 'M82 236 L126 230 L130 268 L86 274 Z'
// The great horn: its mouthpiece in the fist, the bell curling forward.
const HORN = 'M96 126 Q92 110 104 98 Q120 86 140 92 L142 108 Q124 104 114 112 Q104 120 102 132 Z'

const THIGH: Record<Side, string> = {
  far: 'M72 120 L88 120 L87 158 L74 158 Z',
  near: 'M84 120 L101 120 L99 158 L86 158 Z',
}
const SHIN: Record<Side, string> = {
  far: 'M74 156 L87 156 L85 190 L76 190 Z',
  near: 'M86 156 L99 156 L97 190 L88 190 Z',
}
// The bronze greave over the shin, and the sandal's sole and straps.
const GREAVE: Record<Side, string> = {
  far: 'M73 158 L88 158 L86 186 L75 186 Z',
  near: 'M85 158 L100 158 L98 186 L87 186 Z',
}
const SANDAL: Record<Side, string> = {
  far: 'M74 186 L87 186 Q92 190 97 192 L97 198 L71 198 Z',
  near: 'M86 186 L99 186 Q104 190 109 192 L109 198 L83 198 Z',
}

// The crimson kilt in folds to the knee, and the bronze belt over it.
const KILT = 'M71 110 L105 110 L112 150 Q100 156 88 150 Q78 156 66 150 Z'
const KILT_FOLDS = 'M80 114 L76 150 M90 114 L89 150 M99 114 L102 150'
const KILT_SHADE = 'M71 110 L79 110 L76 151 Q70 153 66 150 Z'
const BELT = 'M71 104 L105 104 L106 116 L70 116 Z'

// ---- the parts ----

interface GradientIds {
  skin: string
  skinFar: string
  bronze: string
  kilt: string
  blade: string
}

interface PartProps {
  profession: Profession
  ids: GradientIds
  pose: Pose
}

/** A joint's group: rotated by the pose as an attribute, and found by a scene's writer through data-joint. */
function JointGroup({ joint, pose, children }: { joint: Joint; pose: Pose; children: ReactNode }) {
  return (
    <g data-joint={joint} transform={jointTransform(joint, pose[joint])}>
      {children}
    </g>
  )
}

function Head({ profession, ids, pose }: PartProps) {
  return (
    <JointGroup joint="head" pose={pose}>
      <Inked d={HEAD} fill={`url(#${ids.skin})`} />
      <ellipse cx={85} cy={40} rx={3} ry={5} fill={HERO_IDENTITY.skinShade} stroke={INK} strokeWidth={1.6} />
      <Inked d={HAIR} fill={HERO_IDENTITY.hair} />
      <path d={BROW} fill={HERO_IDENTITY.skinShade} />
      <ellipse cx={96} cy={37} rx={2.4} ry={1.7} fill={HERO_IDENTITY.eyes} />
      <ellipse cx={104} cy={37} rx={1.6} ry={1.5} fill={HERO_IDENTITY.eyes} />
      <path d={NOSE} fill={HERO_IDENTITY.skinShade} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <Inked d={BEARD} fill={HERO_IDENTITY.beard} />
      <path d="M89 58 Q95 64 104 58" stroke={MYTH.inkSoft} strokeWidth={1.2} fill="none" />
      {profession === 'fighter' && <Mongkhon />}
    </JointGroup>
  )
}

// His own mongkhon: a red rope crown wound with white, tied at the back of the head with two tails.
function Mongkhon() {
  return (
    <g>
      <path d="M80 33 L73 50 M82 32 L79 52" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M80 33 L73 50 M82 32 L79 52" stroke={MYTH.crest} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M81 32 Q94 22 108 30" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M81 32 Q94 22 108 30" fill="none" stroke={MYTH.crest} strokeWidth={4.6} strokeLinecap="round" />
      <path d="M81 32 Q94 22 108 30" fill="none" stroke={MYTH.bone} strokeWidth={4.6} strokeDasharray="2 4" />
      <circle cx={80} cy={33} r={3} fill={MYTH.crest} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

function Torso({ ids }: Pick<PartProps, 'ids'>) {
  return (
    <g>
      <Inked d={NECK} fill={`url(#${ids.skin})`} />
      <Inked d={TORSO} fill={`url(#${ids.skin})`} />
      <path d={MUSCLE} fill="none" stroke={HERO_IDENTITY.skinShade} strokeWidth={1.6} strokeLinecap="round" />
      <Inked d={STRAP} fill={MYTH.leather} width={1.6} />
      <circle cx={96} cy={78} r={3.4} fill={MYTH.bronze} stroke={INK} strokeWidth={1.2} />
    </g>
  )
}

function Waist({ ids }: Pick<PartProps, 'ids'>) {
  return (
    <g>
      <Inked d={KILT} fill={`url(#${ids.kilt})`} />
      <path d={KILT_SHADE} fill={MYTH.kiltShade} opacity={0.7} />
      <path d={KILT_FOLDS} fill="none" stroke={MYTH.kiltShade} strokeWidth={1.6} />
      <Inked d={BELT} fill={`url(#${ids.bronze})`} />
      <path d="M74 110 H102" stroke={MYTH.bronzeShade} strokeWidth={1.4} strokeDasharray="3 3" />
    </g>
  )
}

const skinOf = (ids: GradientIds, side: Side) => `url(#${side === 'far' ? ids.skinFar : ids.skin})`

function Leg({ side, ids, pose }: Omit<PartProps, 'profession'> & { side: Side }) {
  return (
    <JointGroup joint={side === 'far' ? 'thighFar' : 'thighNear'} pose={pose}>
      <Inked d={THIGH[side]} fill={skinOf(ids, side)} />
      <JointGroup joint={side === 'far' ? 'shinFar' : 'shinNear'} pose={pose}>
        <Inked d={SHIN[side]} fill={skinOf(ids, side)} />
        <Inked d={GREAVE[side]} fill={side === 'far' ? MYTH.bronzeShade : `url(#${ids.bronze})`} />
        <Inked d={SANDAL[side]} fill={MYTH.leather} />
        <path d={side === 'far' ? 'M76 190 L95 194' : 'M88 190 L107 194'} stroke={MYTH.leatherShade} strokeWidth={1.4} />
      </JointGroup>
    </JointGroup>
  )
}

/** A blade in a fist on its chain; the near one is also the one a scene hides when that hand holds another thing. */
function Blade({ side, ids }: { side: Side; ids: GradientIds }) {
  const { hilt, blade, edge, chain } = BLADE[side]
  return (
    <g data-fx={side === 'near' ? 'held-blades' : 'held-blade-far'}>
      <path d={chain} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      <path d={chain} fill="none" stroke={MYTH.chain} strokeWidth={1.8} strokeDasharray="2.4 1.6" strokeLinecap="round" />
      <Inked d={blade} fill={`url(#${ids.blade})`} width={1.8} />
      <path d={edge} fill="none" stroke={MYTH.fireCore} strokeWidth={1.6} />
      <Inked d={hilt} fill={MYTH.bronzeShade} width={1.4} />
    </g>
  )
}

/** What else the near hand can hold, each hidden until a scene shows it: the horn, the great sword, the hammer. */
function HandHeld({ ids }: { ids: GradientIds }) {
  return (
    <>
      <g data-fx="held-horn" opacity={0}>
        <Inked d={HORN} fill={MYTH.bone} />
        <path d="M108 104 Q116 98 126 98 M112 112 Q118 106 128 104" fill="none" stroke={MYTH.boneShade} strokeWidth={1.6} />
        <path d="M138 92 L142 108" stroke={MYTH.bronze} strokeWidth={3} />
      </g>
      <g data-fx="held-sword" opacity={0}>
        <Inked d={SWORD} fill={`url(#${ids.blade})`} width={2.6} />
        <path d="M99 140 L106 334" stroke={MYTH.fireCore} strokeWidth={2} />
        <Inked d={SWORD_GUARD} fill={`url(#${ids.bronze})`} />
      </g>
      <g data-fx="held-hammer" opacity={0}>
        <Inked d={HAMMER_HAFT} fill={MYTH.leather} />
        <Inked d={HAMMER_HEAD} fill={MYTH.mail} width={2.6} />
        <path d="M88 248 L126 242 M90 260 L128 254" stroke={MYTH.rotShade} strokeWidth={2} />
      </g>
    </>
  )
}

function Arm({ side, ids, pose }: Omit<PartProps, 'profession'> & { side: Side }) {
  return (
    <JointGroup joint={side === 'far' ? 'armFar' : 'armNear'} pose={pose}>
      <Inked d={UPPER_ARM[side]} fill={skinOf(ids, side)} />
      <JointGroup joint={side === 'far' ? 'foreFar' : 'foreNear'} pose={pose}>
        <Inked d={FOREARM[side]} fill={skinOf(ids, side)} />
        <Blade side={side} ids={ids} />
        {side === 'near' && <HandHeld ids={ids} />}
        <Inked d={BRACER[side]} fill={side === 'far' ? MYTH.bronzeShade : `url(#${ids.bronze})`} />
        <path d={CHAIN_TURNS[side]} stroke={MYTH.chain} strokeWidth={1.6} />
        <Inked d={FIST[side]} fill={skinOf(ids, side)} />
      </JointGroup>
    </JointGroup>
  )
}

function Gradients({ ids }: { ids: GradientIds }) {
  return (
    <defs>
      {/* the light falls from the upper left; the lit right edge carries the warm rim of the fire */}
      <linearGradient id={ids.skin} x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor={HERO_IDENTITY.skinShade} />
        <stop offset="0.45" stopColor={HERO_IDENTITY.skin} />
        <stop offset="0.9" stopColor={HERO_IDENTITY.skin} />
        <stop offset="1" stopColor={MYTH.rim} />
      </linearGradient>
      {/* the far limbs sit in the body's shadow */}
      <linearGradient id={ids.skinFar} x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor={MYTH.inkSoft} />
        <stop offset="0.7" stopColor={HERO_IDENTITY.skinShade} />
      </linearGradient>
      <linearGradient id={ids.bronze} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.bronzeLight} />
        <stop offset="0.5" stopColor={MYTH.bronze} />
        <stop offset="1" stopColor={MYTH.bronzeShade} />
      </linearGradient>
      <linearGradient id={ids.kilt} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.blood} />
        <stop offset="0.55" stopColor={MYTH.kilt} />
        <stop offset="1" stopColor={MYTH.kiltShade} />
      </linearGradient>
      {/* bronze at the spine, red hot towards the edge */}
      <linearGradient id={ids.blade} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={MYTH.bronzeLight} />
        <stop offset="0.55" stopColor={MYTH.fire} />
        <stop offset="1" stopColor={MYTH.fireRed} />
      </linearGradient>
    </defs>
  )
}

function useGradientIds(): GradientIds {
  const base = useId().replace(/:/g, '')
  return { skin: `${base}skin`, skinFar: `${base}skinfar`, bronze: `${base}bronze`, kilt: `${base}kilt`, blade: `${base}blade` }
}

/** His drawing's own box: a scene scales it to the height it stands him at. */
export const FIGURE_BOX = { width: 160, height: 210, feetX: 90, feetY: 198 } as const

/** Him in one pose, his drawing's 160 by 210 box at the origin; a scene places and poses him. */
export function HeroFigure({ profession, pose = REST }: { profession: Profession; pose?: Pose }) {
  const ids = useGradientIds()
  const parts = { ids, pose }
  return (
    <g>
      <Gradients ids={ids} />
      <ellipse data-fx="hero-shadow" cx={90} cy={199} rx={40} ry={5} fill={MYTH.inkLine} opacity={0.45} />
      <g data-body="" transform={bodyTransform(pose)}>
        <JointGroup joint="chest" pose={pose}>
          <Arm side="far" {...parts} />
        </JointGroup>
        <Leg side="far" {...parts} />
        <Leg side="near" {...parts} />
        <Waist ids={ids} />
        <JointGroup joint="chest" pose={pose}>
          <Torso ids={ids} />
          <Head profession={profession} {...parts} />
          <Arm side="near" {...parts} />
        </JointGroup>
      </g>
    </g>
  )
}
