'use client'

import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { MYTH } from './palette'
import { REST, bodyTransform, jointTransform, type Joint, type Pose } from './rig'

// Him as the father of the northern journey, in three quarter profile facing right: a plain woodsman's axe in
// the near hand, a fur mantle over the shoulders hanging behind him, a wool tunic belted in leather, wool
// trousers with the shins wound in leather wraps, soft boots, his head bare. One dark ink line round every
// shape over painted gradient fills, the warm rim of the fire on the lit edge. Nothing is the game's hero: no
// runes, no shield, no armour.
//
// His traits come from HERO_IDENTITY: his skin, his dark hair, his full dark beard and dark oval eyes. The
// Martial Artist wears his mongkhon.
//
// Every limb is drawn hanging straight down and rig.ts turns it: HeroFigure draws one pose as SVG
// attributes, and a scene's writer turns its joints ([data-joint]) and moves its body ([data-body]) as the
// page scrolls (scenes.tsx). What he holds in the near hand, the axe, the torch, the ash pouch or the mallets
// of the drum, are groups a scene shows and hides (data-fx axe-held, held-torch, held-pouch, held-mallets).

const INK = MYTH.inkLine

function Inked({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
}

type Side = 'far' | 'near'

// ---- the shapes (viewBox 160 by 210, facing right, limbs hanging straight down, feet on y 198) ----

const HEAD = 'M80 38 Q78 20 94 19 Q106 19 107 33 L109 42 Q108 50 102 53 L85 54 Q80 48 80 38 Z'
const HAIR = 'M79 40 Q76 22 92 18 Q106 17 108 30 Q100 26 92 28 Q86 30 84 42 Z'
const BROW = 'M92 32 L108 30 L108 34 L93 35 Z'
const NOSE = 'M107 37 L111 44 L107 45'
const BEARD = 'M84 44 Q86 50 89 52 L107 46 Q111 51 108 58 Q103 69 95 71 Q85 69 83 58 Z'
const NECK = 'M85 50 L101 50 L103 64 L83 64 Z'

const MANTLE = 'M74 62 Q66 64 62 80 L58 132 Q70 140 82 132 L86 104 Q88 80 92 62 Z'
const MANTLE_FUR = 'M70 56 Q86 46 104 54 Q112 60 110 68 Q98 62 86 64 Q76 66 70 74 Q64 66 70 56 Z'
const TORSO = 'M76 62 Q86 54 100 58 Q111 62 113 74 Q115 90 107 104 L103 118 L76 118 Q69 100 71 84 Q71 70 76 62 Z'
const TUNIC_SEAMS = 'M92 64 L96 84 L103 64 M84 100 Q94 104 106 100'

const UPPER_ARM: Record<Side, string> = {
  far: 'M76 66 Q84 58 92 66 L91 98 Q84 103 77 98 Z',
  near: 'M89 68 Q98 60 108 70 L106 102 Q98 107 90 102 Z',
}
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
// The woodsman's axe hangs from the near fist forward and down: the haft through the fist, a plain narrow
// head at its foot.
const AXE_HAFT = 'M96 120 L101 119 L112 182 L107 183 Z'
const AXE_HEAD = 'M106 166 L120 162 Q128 168 128 178 L114 182 L110 176 Z'
const AXE_EDGE = 'M120 162 Q128 168 128 178'
// A pine torch, its flame over the fist; a small leather pouch hanging from its cord; the drum's two mallets.
const TORCH = 'M96 122 L101 121 L104 160 L99 161 Z'
const POUCH = 'M92 132 Q90 146 98 150 Q106 146 104 132 Z'

const THIGH: Record<Side, string> = {
  far: 'M72 120 L88 120 L87 158 L74 158 Z',
  near: 'M84 120 L101 120 L99 158 L86 158 Z',
}
const SHIN: Record<Side, string> = {
  far: 'M74 156 L87 156 L85 190 L76 190 Z',
  near: 'M86 156 L99 156 L97 190 L88 190 Z',
}
// The leather wraps wound round the shins over the wool, and the soft boots.
const WRAPS: Record<Side, string> = {
  far: 'M73 160 L88 160 L86 184 L75 184 Z',
  near: 'M85 160 L100 160 L98 184 L87 184 Z',
}
const WRAP_TURNS: Record<Side, string> = {
  far: 'M74 166 L87 162 M74 172 L87 168 M75 178 L86 174',
  near: 'M86 166 L99 162 M86 172 L99 168 M87 178 L98 174',
}
const BOOT: Record<Side, string> = {
  far: 'M74 182 L87 182 Q92 188 97 190 L97 198 L71 198 Z',
  near: 'M86 182 L99 182 Q104 188 109 190 L109 198 L83 198 Z',
}

// The tunic's skirt to the thigh, and the leather belt over it.
const SKIRT = 'M72 112 L104 112 L110 142 Q90 148 68 142 Z'
const SKIRT_SHADE = 'M72 112 L80 112 L77 144 Q72 144 68 142 Z'
const BELT = 'M72 105 L104 105 L105 116 L71 116 Z'

// ---- the parts ----

interface GradientIds {
  skin: string
  skinFar: string
  leather: string
  wool: string
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
      <Inked d={TORSO} fill={`url(#${ids.wool})`} />
      <path d={TUNIC_SEAMS} fill="none" stroke={MYTH.woolShade} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  )
}

function Waist({ ids }: Pick<PartProps, 'ids'>) {
  return (
    <g>
      <Inked d={SKIRT} fill={`url(#${ids.wool})`} />
      <path d={SKIRT_SHADE} fill={MYTH.woolShade} opacity={0.7} />
      <Inked d={BELT} fill={`url(#${ids.leather})`} />
      <rect x={89} y={107} width={7} height={7} fill={MYTH.iron} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

const skinOf = (ids: GradientIds, side: Side) => `url(#${side === 'far' ? ids.skinFar : ids.skin})`

function Leg({ side, ids, pose }: Omit<PartProps, 'profession'> & { side: Side }) {
  return (
    <JointGroup joint={side === 'far' ? 'thighFar' : 'thighNear'} pose={pose}>
      <Inked d={THIGH[side]} fill={side === 'far' ? MYTH.woolShade : `url(#${ids.wool})`} />
      <JointGroup joint={side === 'far' ? 'shinFar' : 'shinNear'} pose={pose}>
        <Inked d={SHIN[side]} fill={side === 'far' ? MYTH.woolShade : `url(#${ids.wool})`} />
        <Inked d={WRAPS[side]} fill={`url(#${ids.leather})`} />
        <path d={WRAP_TURNS[side]} stroke={MYTH.leatherShade} strokeWidth={1.4} />
        <Inked d={BOOT[side]} fill={`url(#${ids.leather})`} />
      </JointGroup>
    </JointGroup>
  )
}

function Axe({ ids }: { ids: GradientIds }) {
  return (
    <g data-fx="axe-held">
      <Inked d={AXE_HAFT} fill={`url(#${ids.leather})`} />
      <Inked d={AXE_HEAD} fill={`url(#${ids.blade})`} />
      <path d={AXE_EDGE} fill="none" stroke={MYTH.bone} strokeWidth={1.8} />
    </g>
  )
}

/** What else the near hand can hold, each hidden until a scene shows it: the torch, the pouch, the mallets. */
function HandHeld() {
  return (
    <>
      <g data-fx="held-torch" opacity={0}>
        <Inked d={TORCH} fill={MYTH.wood} />
        <path d="M100 160 Q90 172 98 186 Q102 176 106 186 Q112 172 100 160 Z" fill={MYTH.fire} stroke={INK} strokeWidth={1.6} />
        <path d="M100 166 Q96 174 99 182 Q104 174 100 166 Z" fill={MYTH.fireCore} />
      </g>
      <g data-fx="held-pouch" opacity={0}>
        <path d="M98 128 L98 134" stroke={MYTH.leatherShade} strokeWidth={1.6} />
        <Inked d={POUCH} fill={MYTH.leather} />
        <path d="M93 136 Q98 139 103 136" fill="none" stroke={MYTH.leatherShade} strokeWidth={1.4} />
      </g>
      <g data-fx="held-mallets" opacity={0}>
        <path d="M98 124 L112 158" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
        <path d="M98 124 L112 158" stroke={MYTH.wood} strokeWidth={2.6} strokeLinecap="round" />
        <circle cx={113} cy={161} r={6} fill={MYTH.wrap} stroke={INK} strokeWidth={1.6} />
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
        <Inked d={BRACER[side]} fill={`url(#${ids.leather})`} />
        {side === 'near' && (
          <>
            <Axe ids={ids} />
            <HandHeld />
          </>
        )}
        {side === 'far' && (
          <g data-fx="held-mallets-far" opacity={0}>
            <path d="M84 120 L98 154" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
            <path d="M84 120 L98 154" stroke={MYTH.wood} strokeWidth={2.6} strokeLinecap="round" />
            <circle cx={99} cy={157} r={6} fill={MYTH.wrap} stroke={INK} strokeWidth={1.6} />
          </g>
        )}
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
      <linearGradient id={ids.leather} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.leather} />
        <stop offset="1" stopColor={MYTH.leatherShade} />
      </linearGradient>
      <linearGradient id={ids.wool} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.furLight} />
        <stop offset="0.45" stopColor={MYTH.wool} />
        <stop offset="1" stopColor={MYTH.woolShade} />
      </linearGradient>
      <linearGradient id={ids.blade} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.bone} />
        <stop offset="0.6" stopColor={MYTH.steel} />
        <stop offset="1" stopColor={MYTH.steelShade} />
      </linearGradient>
      {/* the fur of the mantle, lit at its top */}
      <linearGradient id={ids.cloak} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={MYTH.furLight} />
        <stop offset="1" stopColor={MYTH.fur} />
      </linearGradient>
    </defs>
  )
}

function useGradientIds(): GradientIds {
  const base = useId().replace(/:/g, '')
  return { skin: `${base}skin`, skinFar: `${base}skinfar`, leather: `${base}leather`, wool: `${base}wool`, blade: `${base}blade`, cloak: `${base}cloak` }
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
          <Inked d={MANTLE} fill={`url(#${ids.cloak})`} />
          <Arm side="far" {...parts} />
        </JointGroup>
        <Leg side="far" {...parts} />
        <Leg side="near" {...parts} />
        <Waist ids={ids} />
        <JointGroup joint="chest" pose={pose}>
          <Torso ids={ids} />
          <Inked d={MANTLE_FUR} fill={`url(#${ids.cloak})`} />
          <Head profession={profession} {...parts} />
          <Arm side="near" {...parts} />
        </JointGroup>
      </g>
    </g>
  )
}
