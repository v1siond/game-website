'use client'

import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { MYTH } from './palette'
import { REST, bodyTransform, jointTransform, type Joint, type Pose } from './rig'

// Him as a hero of the old myths, in three quarter profile facing right: the near arm with the short sword
// in front of the chest, the far arm with the round shield and the far leg behind it in a darker shade, the
// red cloak hanging from his shoulders behind him. One dark ink line round every shape over painted
// gradient fills, the warm rim of the fire on the lit edge. A bronze cuirass, a leather kilt of strips with
// the key band, bronze greaves, and the crested helm pushed back off his brow so his face shows.
//
// His traits come from HERO_IDENTITY: his skin, his dark hair under the helm, his full dark beard and dark
// oval eyes. The Martial Artist wears his mongkhon in place of the helm.
//
// Every limb is drawn hanging straight down and rig.ts turns it: HeroFigure draws one pose as SVG
// attributes, and a scene's writer turns its joints ([data-joint]) and moves its body ([data-body]) as the
// page scrolls (scenes.tsx).

const INK = MYTH.inkLine

function Inked({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
}

type Side = 'far' | 'near'

// ---- the shapes (viewBox 160 by 210, facing right, limbs hanging straight down, feet on y 198) ----

const HEAD = 'M80 38 Q78 20 94 19 Q106 19 107 33 L109 42 Q108 50 102 53 L85 54 Q80 48 80 38 Z'
const HAIR = 'M79 40 Q76 22 92 18 Q106 17 108 30 Q100 26 92 28 Q86 30 84 42 Z'
const HELM = 'M77 30 Q78 12 95 10 Q110 11 111 24 L104 26 Q96 18 86 22 Q80 26 79 33 Z'
const CREST = 'M80 14 Q88 -4 104 2 Q114 6 112 16 Q102 8 92 12 Q86 14 82 20 Z'
const BROW = 'M92 32 L108 30 L108 34 L93 35 Z'
const NOSE = 'M107 37 L111 44 L107 45'
const BEARD = 'M84 44 Q86 50 89 52 L107 46 Q111 51 108 58 Q103 69 95 71 Q85 69 83 58 Z'
const NECK = 'M85 50 L101 50 L103 64 L83 64 Z'

const CLOAK = 'M74 62 Q66 64 62 80 L52 168 Q70 176 82 168 L86 110 Q88 80 92 62 Z'
const TORSO = 'M76 62 Q86 54 100 58 Q111 62 113 74 Q115 90 107 104 L103 118 L76 118 Q69 100 71 84 Q71 70 76 62 Z'
const CUIRASS = 'M75 66 Q86 58 100 61 Q110 65 112 76 Q113 90 106 104 L103 116 L77 116 Q71 100 72 84 Q72 72 75 66 Z'
const CUIRASS_LINES = 'M95 80 Q104 90 111 82 M99 94 L101 112 M92 99 Q98 101 105 99'

const UPPER_ARM: Record<Side, string> = {
  far: 'M76 66 Q84 58 92 66 L91 98 Q84 103 77 98 Z',
  near: 'M89 68 Q98 60 108 70 L106 102 Q98 107 90 102 Z',
}
const SHOULDER_GUARD = 'M87 64 Q98 53 111 64 L109 80 Q98 85 88 78 Z'
const FOREARM: Record<Side, string> = {
  far: 'M78 96 L90 96 Q91 108 88 122 L80 122 Q77 108 78 96 Z',
  near: 'M91 100 L105 100 Q106 112 103 126 L93 126 Q90 112 91 100 Z',
}
const BRACER: Record<Side, string> = {
  far: 'M77 104 L91 104 L89 120 L79 120 Z',
  near: 'M90 108 L106 108 L104 124 L92 124 Z',
}
const FIST: Record<Side, string> = {
  far: 'M78 119 Q84 115 90 119 L90 130 Q84 134 78 130 Z',
  near: 'M91 123 Q98 119 105 123 L105 135 Q98 139 91 135 Z',
}
// The short sword leaves the near fist forward and down, its guard across the fist.
const SWORD_BLADE = 'M101 134 L106 132 L128 176 L126 182 L121 179 Z'
const SWORD_EDGE = 'M104 134 L125 177'
const SWORD_GUARD = 'M94 132 L110 126 L111 130 L96 136 Z'
// The round shield rides on the far forearm, its face to the front.
const SHIELD_AT = { x: 86, y: 116, r: 30 }

const THIGH: Record<Side, string> = {
  far: 'M72 120 L88 120 L87 158 L74 158 Z',
  near: 'M84 120 L101 120 L99 158 L86 158 Z',
}
const SHIN: Record<Side, string> = {
  far: 'M74 156 L87 156 L85 190 L76 190 Z',
  near: 'M86 156 L99 156 L97 190 L88 190 Z',
}
const GREAVE: Record<Side, string> = {
  far: 'M73 158 L88 158 L86 184 L75 184 Z',
  near: 'M85 158 L100 158 L98 184 L87 184 Z',
}
const SANDAL: Record<Side, string> = {
  far: 'M74 183 L87 183 L94 191 L97 198 L71 198 Z',
  near: 'M86 183 L99 183 L106 191 L109 198 L83 198 Z',
}

const KILT = 'M72 112 L104 112 L113 146 L105 150 L99 142 L93 152 L87 142 L81 152 L75 142 L66 148 Z'
const KILT_SHADE = 'M72 112 L80 112 L77 128 L81 152 L75 142 L66 148 Z'
const BELT = 'M72 105 L104 105 L105 116 L71 116 Z'

// The key pattern band along the kilt's top: one square hook per step.
const keyBand = (x0: number, x1: number, y: number) => {
  const hooks: string[] = []
  for (let x = x0; x + 8 <= x1; x += 8) hooks.push(`M${x} ${y + 6} L${x} ${y} L${x + 6} ${y} L${x + 6} ${y + 4} L${x + 3} ${y + 4} L${x + 3} ${y + 2}`)
  return hooks.join(' ')
}
const KILT_KEY = keyBand(73, 105, 117)

// ---- the parts ----

interface GradientIds {
  skin: string
  skinFar: string
  leather: string
  bronze: string
  blade: string
  cloak: string
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
      {profession === 'fighter' ? (
        <Mongkhon />
      ) : (
        <>
          <Inked d={CREST} fill={MYTH.crest} />
          <Inked d={HELM} fill={`url(#${ids.bronze})`} />
        </>
      )}
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
      <Inked d={CUIRASS} fill={`url(#${ids.bronze})`} />
      <path d={CUIRASS_LINES} fill="none" stroke={MYTH.leatherShade} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  )
}

function Waist({ ids }: Pick<PartProps, 'ids'>) {
  return (
    <g>
      <Inked d={KILT} fill={`url(#${ids.leather})`} />
      <path d={KILT_SHADE} fill={MYTH.leatherShade} opacity={0.7} />
      <path d={KILT_KEY} fill="none" stroke={MYTH.gold} strokeWidth={1.4} />
      <Inked d={BELT} fill={`url(#${ids.leather})`} />
      <circle cx={92} cy={110} r={3.4} fill={MYTH.bronze} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

const skinOf = (ids: GradientIds, side: Side) => `url(#${side === 'far' ? ids.skinFar : ids.skin})`

function Leg({ side, ids, pose }: Omit<PartProps, 'profession'> & { side: Side }) {
  const skin = skinOf(ids, side)
  return (
    <JointGroup joint={side === 'far' ? 'thighFar' : 'thighNear'} pose={pose}>
      <Inked d={THIGH[side]} fill={skin} />
      <JointGroup joint={side === 'far' ? 'shinFar' : 'shinNear'} pose={pose}>
        <Inked d={SHIN[side]} fill={skin} />
        <Inked d={GREAVE[side]} fill={`url(#${ids.bronze})`} />
        <Inked d={SANDAL[side]} fill={`url(#${ids.leather})`} />
      </JointGroup>
    </JointGroup>
  )
}

function Sword({ ids }: { ids: GradientIds }) {
  return (
    <g>
      <Inked d={SWORD_BLADE} fill={`url(#${ids.blade})`} />
      <path d={SWORD_EDGE} fill="none" stroke={MYTH.bone} strokeWidth={1.2} />
      {/* the god's light the sword keeps once it is given (scenes.tsx lights it) */}
      <path d={SWORD_EDGE} fill="none" stroke={MYTH.bladeFire} strokeWidth={5} strokeLinecap="round" opacity={0} data-fx="sword-light" />
      <Inked d={SWORD_GUARD} fill={MYTH.bronze} />
    </g>
  )
}

function Shield({ ids }: { ids: GradientIds }) {
  const { x, y, r } = SHIELD_AT
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={`url(#${ids.bronze})`} stroke={INK} strokeWidth={2.6} />
      <circle cx={x} cy={y} r={r - 6} fill="none" stroke={MYTH.leatherShade} strokeWidth={1.6} />
      <path d={`M${x - 10} ${y - 8} Q${x} ${y - 16} ${x + 10} ${y - 8} M${x - 12} ${y + 6} Q${x} ${y + 14} ${x + 12} ${y + 6}`} fill="none" stroke={MYTH.crest} strokeWidth={3} />
      <circle cx={x} cy={y} r={4} fill={MYTH.gold} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

function Arm({ side, ids, pose }: Omit<PartProps, 'profession'> & { side: Side }) {
  return (
    <JointGroup joint={side === 'far' ? 'armFar' : 'armNear'} pose={pose}>
      <Inked d={UPPER_ARM[side]} fill={skinOf(ids, side)} />
      {side === 'near' && <Inked d={SHOULDER_GUARD} fill={`url(#${ids.bronze})`} />}
      <JointGroup joint={side === 'far' ? 'foreFar' : 'foreNear'} pose={pose}>
        <Inked d={FOREARM[side]} fill={skinOf(ids, side)} />
        <Inked d={BRACER[side]} fill={`url(#${ids.leather})`} />
        {side === 'near' && <Sword ids={ids} />}
        <Inked d={FIST[side]} fill={skinOf(ids, side)} />
        {side === 'far' && <Shield ids={ids} />}
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
      <linearGradient id={ids.leather} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.leather} />
        <stop offset="1" stopColor={MYTH.leatherShade} />
      </linearGradient>
      <linearGradient id={ids.bronze} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.goldPale} />
        <stop offset="0.45" stopColor={MYTH.bronze} />
        <stop offset="1" stopColor={MYTH.leatherShade} />
      </linearGradient>
      <linearGradient id={ids.blade} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.bone} />
        <stop offset="0.6" stopColor={MYTH.steel} />
        <stop offset="1" stopColor={MYTH.steelShade} />
      </linearGradient>
      <linearGradient id={ids.cloak} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={MYTH.crest} />
        <stop offset="1" stopColor={MYTH.bloodDeep} />
      </linearGradient>
    </defs>
  )
}

function useGradientIds(): GradientIds {
  const base = useId().replace(/:/g, '')
  return { skin: `${base}skin`, skinFar: `${base}skinfar`, leather: `${base}leather`, bronze: `${base}bronze`, blade: `${base}blade`, cloak: `${base}cloak` }
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
      <ellipse cx={90} cy={199} rx={40} ry={5} fill={MYTH.inkLine} opacity={0.45} />
      <g data-body="" transform={bodyTransform(pose)}>
        <JointGroup joint="chest" pose={pose}>
          <Inked d={CLOAK} fill={`url(#${ids.cloak})`} />
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
