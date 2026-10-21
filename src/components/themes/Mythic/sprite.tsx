'use client'

import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { MYTH } from './palette'
import { MOVES, REST, bodyCss, bodyTransform, jointCss, jointTransform, resolveKeys, type Joint, type Move, type Pose } from './rig'
import s from './sprite.module.css'

// Him as this world's own sprite, a parody of the ash pale Spartan with the chained blades (reference
// sheet src/assets/sprites/kratos_spritesheet.png), in the sheet's three quarter profile facing right:
// the near arm in front of the chest, the far arm and leg behind it in a darker shade. One dark ink line
// round every shape over painted gradient fills, the warm rim of the fire on the lit edge. Heavy
// proportions: a small shaved head, broad shoulders, thick arms, a low stance.
//
// His traits come from HERO_IDENTITY: his skin with the ash dusted over it, his dark hair as the stubble
// shadow on the shaved scalp, his full dark beard and dark oval eyes. The Spartan's marks: the red stripe
// from the crown over the near eye, down the near side of the chest and the near arm; the scar over the
// far eye.
//
// Per profession: the System Engineer in the full kit (kilt with the key band and the ragged hem, the
// harness, the pauldron, bracers with the chains wound round them, the twin blades); the Musician in the
// same kit with the blades crossed on his back and their hilts in his fists over a bronze war drum; the
// Martial Artist bare chested in red Muay Thai shorts, hand wraps, prajioud on the arms and his mongkhon.
//
// Every limb is drawn hanging straight down and rig.ts turns it: SpartanFigure draws one pose as SVG
// attributes (the server render, reduced motion and the pose renders), SpartanSprite plays a move over it
// with the Web Animations API from the same keys.

export type SpriteMotion = 'still' | Move

const INK = MYTH.inkLine

/** One painted shape with the ink line round it. */
function Inked({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
}

type Side = 'far' | 'near'

// ---- the shapes (viewBox 160 by 210, facing right, limbs hanging straight down, feet on y 198) ----

const HEAD = 'M80 38 Q78 20 94 19 Q106 19 107 33 L109 42 Q108 50 102 53 L85 54 Q80 48 80 38 Z'
const STUBBLE = 'M79 36 Q78 20 94 19 Q106 19 107 31 Q94 25 79 36 Z'
const HEAD_STRIPE = 'M89 19 Q93 18 97 20 L98 34 L98 46 L94 46 L93 34 Z'
const BROW = 'M92 32 L108 30 L108 34 L93 35 Z'
const NOSE = 'M107 37 L111 44 L107 45'
const BEARD = 'M84 44 Q86 50 89 52 L107 46 Q111 51 108 58 Q103 69 95 71 Q85 69 83 58 Z'
const NECK = 'M85 50 L101 50 L103 64 L83 64 Z'

const TORSO = 'M76 62 Q86 54 100 58 Q111 62 113 74 Q115 90 107 104 L103 118 L76 118 Q69 100 71 84 Q71 70 76 62 Z'
const TORSO_SHADE = 'M76 62 Q71 72 71 84 Q69 100 76 118 L83 118 Q78 96 83 64 Z'
const CHEST_LINES = 'M95 80 Q104 90 112 82 M99 94 L101 112 M92 99 Q98 101 105 99 M92 107 Q98 109 103 107'
const TORSO_STRIPE = 'M95 58 Q105 60 109 70 Q113 82 107 96 L103 94 Q107 82 104 72 Q100 64 93 62 Z'
const ASH = 'M78 76 L84 72 M88 102 L94 100 M104 70 L108 72'
const HARNESS = 'M77 64 L86 61 L108 104 L99 111 Z'

const UPPER_ARM: Record<Side, string> = {
  far: 'M76 66 Q84 58 92 66 L91 98 Q84 103 77 98 Z',
  near: 'M89 68 Q98 60 108 70 L106 102 Q98 107 90 102 Z',
}
const ARM_STRIPE = 'M99 66 L105 68 L104 98 L99 98 Z'
const PRAJIOUD: Record<Side, string> = {
  far: 'M77 80 L91 80 L91 86 L77 86 Z',
  near: 'M90 82 L107 82 L106 88 L90 88 Z',
}
const PAULDRON = 'M87 64 Q98 53 111 64 L109 80 Q98 85 88 78 Z'
const FOREARM: Record<Side, string> = {
  far: 'M78 96 L90 96 Q91 108 88 122 L80 122 Q77 108 78 96 Z',
  near: 'M91 100 L105 100 Q106 112 103 126 L93 126 Q90 112 91 100 Z',
}
const BRACER: Record<Side, string> = {
  far: 'M77 104 L91 104 L89 120 L79 120 Z',
  near: 'M90 108 L106 108 L104 124 L92 124 Z',
}
const CHAIN_WRAP: Record<Side, string> = {
  far: 'M78 108 L90 111 M78 113 L90 116 M79 118 L89 119',
  near: 'M91 112 L105 115 M91 117 L105 120 M92 122 L104 123',
}
const FIST: Record<Side, string> = {
  far: 'M78 119 Q84 115 90 119 L90 130 Q84 134 78 130 Z',
  near: 'M91 123 Q98 119 105 123 L105 135 Q98 139 91 135 Z',
}
const WRAP_LINES: Record<Side, string> = {
  far: 'M78 123 L90 125 M78 127 L90 129',
  near: 'M91 127 L105 129 M91 131 L105 133',
}
// The blades leave the fist edge first and curve forward, the chain looping from the pommel to the bracer.
const BLADE: Record<Side, string> = {
  far: 'M81 130 L87 130 L89 142 Q94 160 108 170 Q96 169 89 159 Q83 149 81 138 Z',
  near: 'M95 134 L101 134 L103 146 Q108 164 123 175 Q110 173 103 163 Q97 153 95 142 Z',
}
const BLADE_EDGE: Record<Side, string> = {
  far: 'M89 142 Q94 160 108 170',
  near: 'M103 146 Q108 164 123 175',
}
const CHAIN: Record<Side, string> = {
  far: 'M80 120 Q70 136 83 146',
  near: 'M93 124 Q82 140 96 150',
}
// A hilt held as a beater leaves the fist forward and down, so the forearm swinging forward brings its tip down on the skin.
const HILT: Record<Side, string> = {
  far: 'M83 129 L89 126 L102 148 L96 151 Z',
  near: 'M97 133 L103 130 L116 152 L110 155 Z',
}

const THIGH: Record<Side, string> = {
  far: 'M72 120 L88 120 L87 158 L74 158 Z',
  near: 'M84 120 L101 120 L99 158 L86 158 Z',
}
const SHIN: Record<Side, string> = {
  far: 'M74 156 L87 156 L85 190 L76 190 Z',
  near: 'M86 156 L99 156 L97 190 L88 190 Z',
}
const BOOT: Record<Side, string> = {
  far: 'M74 183 L87 183 L94 191 L97 198 L71 198 Z',
  near: 'M86 183 L99 183 L106 191 L109 198 L83 198 Z',
}
const BARE_FOOT: Record<Side, string> = {
  far: 'M75 187 L86 187 L94 193 L96 198 L72 198 Z',
  near: 'M87 187 L98 187 L106 193 L108 198 L84 198 Z',
}
const FOOT_WRAPS: Record<Side, string> = {
  far: 'M74 186 L87 187 M73 191 L89 192',
  near: 'M86 186 L99 187 M85 191 L101 192',
}

const KILT = 'M72 112 L104 112 L113 146 L105 150 L99 142 L93 152 L87 142 L81 152 L75 142 L66 148 Z'
const KILT_SHADE = 'M72 112 L80 112 L77 128 L81 152 L75 142 L66 148 Z'
const BELT = 'M72 105 L104 105 L105 116 L71 116 Z'
const SHORTS = 'M72 110 L104 110 L109 140 L91 142 L88 131 L85 142 L67 140 Z'
const SHORTS_TRIM = 'M68 135 L86 137 M91 137 L108 135'

// The key pattern band along the kilt's top: one square hook per step.
const keyBand = (x0: number, x1: number, y: number) => {
  const hooks: string[] = []
  for (let x = x0; x + 8 <= x1; x += 8) hooks.push(`M${x} ${y + 6} L${x} ${y} L${x + 6} ${y} L${x + 6} ${y + 4} L${x + 3} ${y + 4} L${x + 3} ${y + 2}`)
  return hooks.join(' ')
}
const KILT_KEY = keyBand(73, 105, 117)

// ---- the parts ----

interface PartProps {
  profession: Profession
  ids: GradientIds
  pose: Pose
}

/** A joint's group: rotated by the pose as an attribute, and found by the animation through data-joint. */
function JointGroup({ joint, pose, children }: { joint: Joint; pose: Pose; children: ReactNode }) {
  return (
    <g data-joint={joint} transform={jointTransform(joint, pose[joint])}>
      {children}
    </g>
  )
}

/** The rage light laid over a mark: hidden, lit by the roar. */
function Rage({ d }: { d: string }) {
  return <path d={d} fill={MYTH.rage} opacity={0} data-fx="rage" />
}

function Head({ profession, ids, pose }: PartProps) {
  return (
    <JointGroup joint="head" pose={pose}>
      <Inked d={HEAD} fill={`url(#${ids.skin})`} />
      <ellipse cx={85} cy={40} rx={3} ry={5} fill={HERO_IDENTITY.skinShade} stroke={INK} strokeWidth={1.6} />
      <path d={STUBBLE} fill={HERO_IDENTITY.hair} opacity={0.35} />
      <path d={HEAD_STRIPE} fill={MYTH.tattoo} />
      <Rage d={HEAD_STRIPE} />
      <path d={BROW} fill={HERO_IDENTITY.skinShade} />
      {/* his eyes: the near one under the stripe, the far one smaller towards the nose, the scar over it */}
      <ellipse cx={96} cy={37} rx={2.4} ry={1.7} fill={HERO_IDENTITY.eyes} />
      <ellipse cx={104} cy={37} rx={1.6} ry={1.5} fill={HERO_IDENTITY.eyes} />
      <g opacity={0} data-fx="rage">
        <ellipse cx={96} cy={37} rx={2.4} ry={1.7} fill={MYTH.rageCore} />
        <ellipse cx={104} cy={37} rx={1.6} ry={1.5} fill={MYTH.rageCore} />
      </g>
      <path d="M102 30 L106 41" stroke={MYTH.ash} strokeWidth={1.2} />
      <path d={NOSE} fill={HERO_IDENTITY.skinShade} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <Inked d={BEARD} fill={HERO_IDENTITY.beard} />
      <path d="M89 58 Q95 64 104 58" stroke={MYTH.inkSoft} strokeWidth={1.2} fill="none" />
      <ellipse cx={101} cy={54} rx={4} ry={3.4} fill={MYTH.bloodDeep} stroke={INK} strokeWidth={1.2} opacity={0} data-fx="mouth" />
      {profession === 'fighter' && <Mongkhon />}
    </JointGroup>
  )
}

// His own mongkhon: a red rope crown wound with white, tied at the back of the head with two tails.
function Mongkhon() {
  return (
    <g>
      <path d="M80 33 L73 50 M82 32 L79 52" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M80 33 L73 50 M82 32 L79 52" stroke={MYTH.tattoo} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M81 32 Q94 22 108 30" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M81 32 Q94 22 108 30" fill="none" stroke={MYTH.tattoo} strokeWidth={4.6} strokeLinecap="round" />
      <path d="M81 32 Q94 22 108 30" fill="none" stroke={MYTH.bone} strokeWidth={4.6} strokeDasharray="2 4" />
      <circle cx={80} cy={33} r={3} fill={MYTH.tattoo} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

function Torso({ profession, ids }: Omit<PartProps, 'pose'>) {
  return (
    <g>
      <Inked d={NECK} fill={`url(#${ids.skin})`} />
      <Inked d={TORSO} fill={`url(#${ids.skin})`} />
      <path d={TORSO_SHADE} fill={HERO_IDENTITY.skinShade} opacity={0.6} />
      <path d={CHEST_LINES} fill="none" stroke={HERO_IDENTITY.skinShade} strokeWidth={1.6} strokeLinecap="round" />
      <path d={ASH} stroke={MYTH.ash} strokeWidth={2.4} strokeLinecap="round" opacity={0.45} />
      <path d={TORSO_STRIPE} fill={MYTH.tattoo} />
      <Rage d={TORSO_STRIPE} />
      {profession !== 'fighter' && (
        <>
          <Inked d={HARNESS} fill={`url(#${ids.leather})`} />
          <circle cx={93} cy={86} r={4.6} fill={MYTH.bronze} stroke={INK} strokeWidth={1.6} />
        </>
      )}
    </g>
  )
}

function Waist({ profession, ids }: Omit<PartProps, 'pose'>) {
  if (profession === 'fighter') {
    return (
      <g>
        <Inked d={SHORTS} fill={`url(#${ids.kilt})`} />
        <path d={SHORTS_TRIM} stroke={MYTH.gold} strokeWidth={2.4} />
        <path d="M72 112 L104 112" stroke={MYTH.gold} strokeWidth={3} />
      </g>
    )
  }
  return (
    <g>
      <Inked d={KILT} fill={`url(#${ids.kilt})`} />
      <path d={KILT_SHADE} fill={MYTH.kiltShade} opacity={0.7} />
      <path d={KILT_KEY} fill="none" stroke={MYTH.gold} strokeWidth={1.4} />
      <Inked d="M90 116 L96 116 L96 146 L93 149 L90 146 Z" fill={`url(#${ids.leather})`} />
      <Inked d={BELT} fill={`url(#${ids.leather})`} />
      <circle cx={92} cy={110} r={3.4} fill={MYTH.bronze} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

const skinOf = (ids: GradientIds, side: Side) => `url(#${side === 'far' ? ids.skinFar : ids.skin})`

function Leg({ side, profession, ids, pose }: PartProps & { side: Side }) {
  const skin = skinOf(ids, side)
  return (
    <JointGroup joint={side === 'far' ? 'thighFar' : 'thighNear'} pose={pose}>
      <Inked d={THIGH[side]} fill={skin} />
      <JointGroup joint={side === 'far' ? 'shinFar' : 'shinNear'} pose={pose}>
        <Inked d={SHIN[side]} fill={skin} />
        {profession === 'fighter' ? (
          <>
            <Inked d={BARE_FOOT[side]} fill={skin} />
            <path d={FOOT_WRAPS[side]} stroke={MYTH.wrap} strokeWidth={2.4} />
          </>
        ) : (
          <>
            <Inked d={BOOT[side]} fill={`url(#${ids.leather})`} />
            <path d={FOOT_WRAPS[side]} stroke={MYTH.leatherShade} strokeWidth={1.6} />
          </>
        )}
      </JointGroup>
    </JointGroup>
  )
}

// What a fist holds: a blade on its chain, a blade's hilt as a drum beater, or the Muay Thai wraps.
function Grip({ side, profession, ids }: Omit<PartProps, 'pose'> & { side: Side }) {
  if (profession === 'fighter') {
    return (
      <>
        <Inked d={FIST[side]} fill={MYTH.wrap} />
        <path d={WRAP_LINES[side]} stroke={MYTH.boneShade} strokeWidth={1.2} />
      </>
    )
  }
  if (profession === 'drummer') {
    return (
      <>
        <Inked d={HILT[side]} fill={MYTH.bronze} />
        <Inked d={FIST[side]} fill={skinOf(ids, side)} />
      </>
    )
  }
  return (
    <>
      <path d={CHAIN[side]} fill="none" stroke={INK} strokeWidth={4} />
      <path d={CHAIN[side]} fill="none" stroke={MYTH.steel} strokeWidth={2.4} strokeDasharray="3 2" />
      <Inked d={BLADE[side]} fill={`url(#${ids.blade})`} />
      <path d={BLADE_EDGE[side]} fill="none" stroke={MYTH.bladeFire} strokeWidth={1.8} />
      <Inked d={FIST[side]} fill={skinOf(ids, side)} />
    </>
  )
}

function Arm({ side, profession, ids, pose }: PartProps & { side: Side }) {
  const fighter = profession === 'fighter'
  return (
    <JointGroup joint={side === 'far' ? 'armFar' : 'armNear'} pose={pose}>
      <Inked d={UPPER_ARM[side]} fill={skinOf(ids, side)} />
      {side === 'near' && (
        <>
          <path d={ARM_STRIPE} fill={MYTH.tattoo} />
          <Rage d={ARM_STRIPE} />
        </>
      )}
      {fighter && <Inked d={PRAJIOUD[side]} fill={MYTH.tattoo} />}
      {side === 'near' && !fighter && <Inked d={PAULDRON} fill={`url(#${ids.leather})`} />}
      <JointGroup joint={side === 'far' ? 'foreFar' : 'foreNear'} pose={pose}>
        <Inked d={FOREARM[side]} fill={skinOf(ids, side)} />
        {!fighter && (
          <>
            <Inked d={BRACER[side]} fill={`url(#${ids.leather})`} />
            <path d={CHAIN_WRAP[side]} stroke={MYTH.steel} strokeWidth={1.8} />
          </>
        )}
        <g data-fx={side === 'near' ? 'grip' : undefined}>
          <Grip side={side} profession={profession} ids={ids} />
        </g>
      </JointGroup>
    </JointGroup>
  )
}

// The slam's mark: his code burnt into the floor as a glowing bracket rune.
function Rune() {
  return (
    <g opacity={0} data-fx="rune">
      <ellipse cx={132} cy={198} rx={26} ry={5} fill={MYTH.bladeFire} opacity={0.5} />
      <path d="M122 189 L114 195 L122 201 M142 189 L150 195 L142 201 M135 187 L129 203" fill="none" stroke={MYTH.rageCore} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

// The bronze war drum in front of him, its skin where the hilts land.
function WarDrum({ ids }: { ids: GradientIds }) {
  return (
    <g>
      <path d="M123 190 L118 202 M151 190 L156 202" stroke={INK} strokeWidth={3} />
      <Inked d="M117 132 L157 132 L153 190 L121 190 Z" fill={`url(#${ids.leather})`} />
      <path d="M119 138 L137 184 L155 138 M121 184 L137 138 L153 184" fill="none" stroke={MYTH.bone} strokeWidth={1.4} opacity={0.8} />
      <Inked d="M115 126 L159 126 L159 134 L115 134 Z" fill={MYTH.bronze} />
      <ellipse cx={137} cy={127} rx={22} ry={6} fill={MYTH.bone} stroke={INK} strokeWidth={2.2} />
      <path d="M142 122 Q136 108 144 96 Q146 108 152 102 Q154 114 148 122 Z" fill={MYTH.bladeFire} stroke={INK} strokeWidth={1.4} opacity={0} data-fx="flame" />
    </g>
  )
}

// The blades crossed on his back while his fists hold their hilts at the drum.
function BladesOnBack({ ids }: { ids: GradientIds }) {
  return (
    <g>
      <Inked d="M70 62 L77 58 L96 22 L92 20 Z" fill={`url(#${ids.blade})`} />
      <Inked d="M104 62 L97 58 L80 20 L84 18 Z" fill={`url(#${ids.blade})`} />
    </g>
  )
}

interface GradientIds {
  skin: string
  skinFar: string
  leather: string
  kilt: string
  blade: string
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
      <linearGradient id={ids.kilt} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor={MYTH.kilt} />
        <stop offset="1" stopColor={MYTH.kiltShade} />
      </linearGradient>
      <linearGradient id={ids.blade} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={MYTH.bone} />
        <stop offset="0.6" stopColor={MYTH.steel} />
        <stop offset="1" stopColor={MYTH.steelShade} />
      </linearGradient>
    </defs>
  )
}

function useGradientIds(): GradientIds {
  const base = useId().replace(/:/g, '')
  return { skin: `${base}skin`, skinFar: `${base}skinfar`, leather: `${base}leather`, kilt: `${base}kilt`, blade: `${base}blade` }
}

interface FigureProps {
  profession: Profession
  pose?: Pose
  className?: string
  svgRef?: Ref<SVGSVGElement>
  /** Where he stands inside a scene's own SVG, in that scene's units (a nested viewport). */
  place?: Place
}

export interface Place {
  x: number
  y: number
  height: number
}

/** A placed figure's viewport: his 160 by 210 box scaled to the height. */
const placeAttributes = (place?: Place) => (place ? { x: place.x, y: place.y, height: place.height, width: (place.height * 160) / 210 } : {})

/** A viewport over a placed figure's own box, so a scene draws the props he handles in his units (the hand positions of rig.ts). */
export function FigureSpace({ place, children }: { place: Place; children: ReactNode }) {
  return (
    <svg {...placeAttributes(place)} viewBox="0 0 160 210" className="overflow-visible">
      {children}
    </svg>
  )
}

/** Him in one pose, drawn with SVG attributes only. */
export function SpartanFigure({ profession, pose = REST[profession], className = '', svgRef, place }: FigureProps) {
  const ids = useGradientIds()
  const parts = { profession, ids, pose }

  return (
    <svg ref={svgRef} {...placeAttributes(place)} viewBox="0 0 160 210" className={`overflow-visible ${className}`} aria-hidden="true">
      <Gradients ids={ids} />
      <g className={s.sprite}>
        <ellipse cx={90} cy={199} rx={40} ry={5} fill={MYTH.inkLine} opacity={0.45} />
        <ellipse cx={92} cy={140} rx={70} ry={66} fill="none" stroke={MYTH.rage} strokeWidth={3} opacity={0} data-fx="ring" className={s.ring} />
        {profession === 'engineer' && <Rune />}
        {profession === 'drummer' && <WarDrum ids={ids} />}
        <g data-body="" transform={bodyTransform(pose)}>
          {/* the far arm turns with the chest but sits behind the legs and the kilt, so it has its own chest group */}
          <JointGroup joint="chest" pose={pose}>
            <Arm side="far" {...parts} />
          </JointGroup>
          <Leg side="far" {...parts} />
          <Leg side="near" {...parts} />
          <Waist profession={profession} ids={ids} />
          <JointGroup joint="chest" pose={pose}>
            {profession === 'drummer' && <BladesOnBack ids={ids} />}
            <Torso profession={profession} ids={ids} />
            <Head {...parts} />
            <Arm side="near" {...parts} />
          </JointGroup>
        </g>
      </g>
    </svg>
  )
}

// The lights each move turns on, as opacity keys over the move's own length (offsets 0 to 1).
type Fx = 'rage' | 'mouth' | 'ring' | 'rune' | 'flame' | 'grip'
const FX: Partial<Record<Move, Partial<Record<Fx, Keyframe[]>>>> = {
  roar: {
    rage: [{ offset: 0, opacity: 0 }, { offset: 0.3, opacity: 0 }, { offset: 0.4, opacity: 0.95 }, { offset: 0.8, opacity: 0.95 }, { offset: 1, opacity: 0 }],
    mouth: [{ offset: 0, opacity: 0 }, { offset: 0.34, opacity: 1 }, { offset: 0.82, opacity: 1 }, { offset: 0.9, opacity: 0 }],
    ring: [
      { offset: 0, opacity: 0, transform: 'scale(0.4)' },
      { offset: 0.36, opacity: 0.9, transform: 'scale(0.6)' },
      { offset: 0.8, opacity: 0, transform: 'scale(1.4)' },
      { offset: 1, opacity: 0, transform: 'scale(1.4)' },
    ],
  },
  combo: {
    rune: [{ offset: 0, opacity: 0 }, { offset: 0.71, opacity: 0 }, { offset: 0.74, opacity: 1 }, { offset: 0.92, opacity: 1 }, { offset: 1, opacity: 0 }],
  },
  finish: {
    rage: [{ offset: 0, opacity: 0 }, { offset: 0.55, opacity: 0 }, { offset: 0.6, opacity: 0.8 }, { offset: 1, opacity: 0 }],
  },
  // the near blade leaves the hand on the throw and is back in it on the catch (the scene flies it)
  hurl: {
    grip: [{ offset: 0, opacity: 1 }, { offset: 0.23, opacity: 1 }, { offset: 0.24, opacity: 0 }, { offset: 0.75, opacity: 0 }, { offset: 0.76, opacity: 1 }, { offset: 1, opacity: 1 }],
  },
  drum: {
    flame: [{ offset: 0, opacity: 0 }, { offset: 0.3, opacity: 1 }, { offset: 0.45, opacity: 0.2 }, { offset: 0.7, opacity: 1 }, { offset: 1, opacity: 0 }],
  },
}

interface SpriteProps {
  profession: Profession
  motion: SpriteMotion
  className?: string
  place?: Place
  /** A one shot move has played out (never called for a loop, or under reduced motion). */
  onDone?: () => void
}

/** Plays a move's keys on the figure's joints, its body and its lights, and cancels them when the move changes. */
function useRigMotion(svg: SVGSVGElement | null, profession: Profession, motion: SpriteMotion, onDone?: () => void) {
  const reduced = useReducedMotion()
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    if (!svg || reduced || motion === 'still' || typeof svg.animate !== 'function') return
    const { ms, loop } = MOVES[motion]
    const keys = resolveKeys(motion, profession)
    const timing: KeyframeAnimationOptions = { duration: ms, iterations: loop ? Infinity : 1 }
    const frames = (style: (pose: Pose) => Keyframe) => keys.map(({ at, pose }) => ({ offset: at, easing: 'ease-in-out', ...style(pose) }))

    const joints = [...svg.querySelectorAll<SVGGElement>('[data-joint]')].map((element) => {
      const joint = element.dataset.joint as Joint
      return element.animate(frames((pose) => jointCss(joint, pose[joint])), timing)
    })
    const body = [...svg.querySelectorAll<SVGGElement>('[data-body]')].map((element) => element.animate(frames(bodyCss), timing))
    const lights = Object.entries(FX[motion] ?? {}).flatMap(([fx, track]) =>
      [...svg.querySelectorAll<SVGElement>(`[data-fx="${fx}"]`)].map((element) => element.animate(track, timing)),
    )
    const all = [...joints, ...body, ...lights]
    if (!loop) all[0]?.finished.then(() => done.current?.(), () => undefined)
    return () => all.forEach((animation) => animation.cancel())
  }, [svg, reduced, motion, profession])
}

/** Him as the chained blade Spartan, in a profession's kit, playing one motion. */
export function SpartanSprite({ profession, motion, className = '', place, onDone }: SpriteProps) {
  const [svg, setSvg] = useState<SVGSVGElement | null>(null)
  useRigMotion(svg, profession, motion, onDone)
  return <SpartanFigure profession={profession} className={className} place={place} svgRef={setSvg} />
}
