'use client'

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'
import { framesOf, JOINTS, jointAttr, jointCss, poseOf, wholeAttr, wholeCss, type BandicootPose, type Gear, type Joint } from './rig'
import sprite from './bandicoot.module.css'

export type { BandicootPose } from './rig'

// Him as this world's hero, a parody of the orange bandicoot of the 1998 time travel platformer (Crash
// of Warped, named in code only), drawn the way the game's renders show him: a 3/4 view facing right,
// hunched with the knees bent, the big head pushed forward on a thin neck, the long muzzle with the black
// nose at its tip and the huge toothy grin, thick brows over eyes set close, the spiky tuft, long thin
// arms with fingerless gloves, wide jeans and oversized red sneakers with white soles. He is still
// himself: his black oval eyes, his short dark hair as the tuft and the brows, his skin on the muzzle and
// his full dark beard boxed along the jaw (HERO_IDENTITY via the palette). The outer line is the night's
// ink and the jeans are a bright denim, so his whole outline reads on the dark eras; the far limbs are a
// shade darker so the body reads in depth.
// - System Engineer: the jeans and sneakers; his action types on a laptop.
// - Musician: a sweatband and a stick in each hand; his action drums on two crates.
// - Martial Artist: Muay Thai shorts with a gold waistband, the mongkhon, arm bands, red gloves, bare
//   feet in ankle wraps; his action is a spinning roundhouse.
//
// The skeleton and every pose are data in rig.ts: arms and legs in two pieces with elbows and knees,
// feet that stay flat, the whole body squashing and stretching from the feet. Each part is a group
// marked data-joint; the pose's frames play on those groups with the Web Animations API (transform and
// opacity only). A still frame (frame prop, reduced motion) is the same transforms as SVG attributes.
// The eyes blink and glance toward the visitor's pointer (--mx, --my) in bandicoot.module.css.

// The outer line is the night's ink, so his edge reads on every era; FUR_DARK draws only the inner folds.
const INK = PORTAL.VOID
const FOLD = PORTAL.FUR_DARK

type Depth = 'near' | 'far'

interface Outfit {
  thigh: (depth: Depth) => ReactNode
  shin: (depth: Depth) => ReactNode
  foot: (depth: Depth) => ReactNode
  hand: (depth: Depth) => ReactNode
  band: boolean
  headwear: ReactNode
  waist: ReactNode
  /** The action's prop: held in the hands (moves with the body) or standing on the floor. */
  prop: ReactNode
  held: boolean
}

// The far side is drawn 8 units back from the near side.
const at = (depth: Depth, x: number) => (depth === 'near' ? x : x - 8)
const furOf = (depth: Depth) => (depth === 'near' ? 'url(#npb-limb)' : PORTAL.FUR_DARK)
const jeansOf = (depth: Depth) => (depth === 'near' ? 'url(#npb-jeans)' : PORTAL.JEANS_DARK)

/** The gradients the figure reads, set once on the world's root. */
export function BandicootDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="npb-fur" cx="0.62" cy="0.3" r="0.85">
          <stop offset="0" stopColor={PORTAL.FUR_LIT} />
          <stop offset="0.55" stopColor={PORTAL.FUR} />
          <stop offset="1" stopColor={PORTAL.FUR_DARK} />
        </radialGradient>
        <linearGradient id="npb-limb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.FUR_DARK} />
          <stop offset="0.45" stopColor={PORTAL.FUR} />
          <stop offset="1" stopColor={PORTAL.FUR_LIT} />
        </linearGradient>
        <radialGradient id="npb-muzzle" cx="0.6" cy="0.3" r="0.8">
          <stop offset="0" stopColor={PORTAL.MUZZLE} />
          <stop offset="1" stopColor={PORTAL.MUZZLE_SHADE} />
        </radialGradient>
        <linearGradient id="npb-jeans" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.JEANS_DARK} />
          <stop offset="0.5" stopColor={PORTAL.JEANS} />
          <stop offset="1" stopColor={PORTAL.JEANS_LIT} />
        </linearGradient>
        <linearGradient id="npb-sneaker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.SNEAKER_LIT} />
          <stop offset="0.6" stopColor={PORTAL.SNEAKER} />
          <stop offset="1" stopColor={PORTAL.SNEAKER_DARK} />
        </linearGradient>
        <radialGradient id="npb-glove" cx="0.6" cy="0.3" r="0.8">
          <stop offset="0" stopColor={PORTAL.SNEAKER_LIT} />
          <stop offset="0.6" stopColor={PORTAL.TNT} />
          <stop offset="1" stopColor={PORTAL.TNT_DARK} />
        </radialGradient>
        <linearGradient id="npb-shorts" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.BLUE_DEEP} />
          <stop offset="1" stopColor={PORTAL.BLUE} />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---- legs: thigh (hip to knee, y 72 to 86), shin (knee to ankle, y 86 to 99), foot (from y 99) ----
// Loose jeans: the thigh a little narrower than the shin, which flares to a rolled cuff over the sneaker.

const jeanThigh = (depth: Depth) => (
  <path
    d={`M${at(depth, 37.8)} 70.6 L${at(depth, 50.2)} 70.6 L${at(depth, 49.4)} 87.6 L${at(depth, 38.8)} 87.6 Z`}
    fill={jeansOf(depth)}
    stroke={INK}
    strokeWidth="1.1"
    strokeLinejoin="round"
  />
)

const jeanShin = (depth: Depth) => (
  <>
    <path
      d={`M${at(depth, 38.8)} 85.4 L${at(depth, 49.4)} 85.4 L${at(depth, 51.6)} 100.4 L${at(depth, 36.8)} 100.4 Z`}
      fill={jeansOf(depth)}
      stroke={INK}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path d={`M${at(depth, 37.2)} 97.4 H${at(depth, 51.2)}`} stroke={PORTAL.JEANS_LIT} strokeWidth="1.8" opacity={depth === 'near' ? 1 : 0.6} />
  </>
)

const shortsThigh = (depth: Depth) => (
  <>
    <path
      d={`M${at(depth, 37.4)} 70 L${at(depth, 50.6)} 70 L${at(depth, 51.2)} 84 L${at(depth, 38)} 84 Z`}
      fill={depth === 'near' ? 'url(#npb-shorts)' : PORTAL.BLUE_DEEP}
      stroke={INK}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path d={`M${at(depth, 48.4)} 82 L${at(depth, 50)} 77`} stroke={PORTAL.GOLD} strokeWidth="1.2" />
    <path d={`M${at(depth, 40.4)} 84 L${at(depth, 47.6)} 84 L${at(depth, 47.4)} 87.4 L${at(depth, 40.6)} 87.4 Z`} fill={furOf(depth)} />
  </>
)

const furShin = (depth: Depth) => (
  <>
    <path d={`M${at(depth, 40.4)} 85.6 L${at(depth, 47.6)} 85.6 L${at(depth, 46.8)} 99.6 L${at(depth, 41.2)} 99.6 Z`} fill={furOf(depth)} stroke={INK} strokeWidth="1" />
    <path d={`M${at(depth, 40.8)} 95.4 L${at(depth, 47)} 95.4 L${at(depth, 46.8)} 99.6 L${at(depth, 41)} 99.6 Z`} fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.6" />
  </>
)

// the big sneaker points forward (right): heel at the ankle, the round toe well out in front, a thick sole
const sneaker = (depth: Depth) => (
  <>
    <path
      d={`M${at(depth, 37.2)} 99.4 C${at(depth, 37.2)} 96 ${at(depth, 46)} 95.2 ${at(depth, 49.6)} 96.8 C${at(depth, 55.4)} 97.8 ${at(depth, 61)} 100 ${at(depth, 62.2)} 103.6 L${at(depth, 62.2)} 105.4 L${at(depth, 36)} 105.4 L${at(depth, 36)} 101.6 Z`}
      fill={depth === 'near' ? 'url(#npb-sneaker)' : PORTAL.SNEAKER_DARK}
      stroke={INK}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path
      d={`M${at(depth, 35.2)} 104.6 H${at(depth, 62.8)} Q${at(depth, 64.6)} 110 ${at(depth, 59.6)} 110 H${at(depth, 37.2)} Q${at(depth, 34.2)} 110 ${at(depth, 35.2)} 104.6 Z`}
      fill={PORTAL.SOLE}
      stroke={INK}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d={`M${at(depth, 44.4)} 97.8 L${at(depth, 49)} 101.4 M${at(depth, 47.6)} 97.4 L${at(depth, 45.4)} 101.6`} stroke={PORTAL.WHITE} strokeWidth="1.1" strokeLinecap="round" />
  </>
)

const bareFoot = (depth: Depth) => (
  <path
    d={`M${at(depth, 41)} 99 L${at(depth, 47)} 99 Q${at(depth, 54.6)} 103 ${at(depth, 57.4)} 106.4 Q${at(depth, 58.4)} 110 ${at(depth, 54)} 110 L${at(depth, 40.8)} 110 Q${at(depth, 39)} 110 ${at(depth, 39.6)} 106 Z`}
    fill={furOf(depth)}
    stroke={INK}
    strokeWidth="1"
    strokeLinejoin="round"
  />
)

// ---- arms: the upper arm (shoulder to elbow, 12 units) thick with a round shoulder, the forearm (elbow to
// wrist, 11 units) thinner, the hand at the wrist. Round caps fill the joints at any angle. ----

const ARM_X: Record<Depth, number> = { near: 47, far: 35 }
const SHOULDER_Y: Record<Depth, number> = { near: 53, far: 52 }
const UPPER = 12
const FORE = 11

const limb = (depth: Depth, d: string, width: number) => (
  <>
    <path d={d} fill="none" stroke={INK} strokeWidth={width + 1.8} strokeLinecap="round" />
    <path d={d} fill="none" stroke={depth === 'near' ? PORTAL.FUR : PORTAL.FUR_DARK} strokeWidth={width} strokeLinecap="round" />
  </>
)

const upperArm = (depth: Depth, band: boolean) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth]
  return (
    <>
      {limb(depth, `M${x} ${y} L${x} ${y + UPPER}`, 5.2)}
      {depth === 'near' && <path d={`M${x + 1} ${y - 0.6} V${y + 6}`} stroke={PORTAL.FUR_LIT} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />}
      {band && <path d={`M${x - 3} ${y + 6} H${x + 3}`} stroke={PORTAL.TNT} strokeWidth="2.6" />}
    </>
  )
}

const foreArm = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + UPPER
  return limb(depth, `M${x} ${y} L${x} ${y + FORE}`, 3.8)
}

// the fingerless glove, knuckles forward, fur fingers curling out of it
const glove = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + UPPER + FORE + 1
  return (
    <g transform={`translate(${x} ${y}) scale(1.2)`}>
      <path d="M-3.2 -1.4 Q-3.4 3.6 -1.4 5.4 Q2.6 6.6 4.4 3.6 Q5 0.6 3.4 -1.6 Z" fill={depth === 'near' ? PORTAL.GLOVE : PORTAL.GLOVE_DARK} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M1.6 4.8 Q4.4 6.6 5.6 4.4 M-0.6 5.6 Q1 8 3 7" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M1.6 4.8 Q4.4 6.6 5.6 4.4 M-0.6 5.6 Q1 8 3 7" fill="none" stroke={PORTAL.FUR} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-3 -0.6 H3.6" stroke={PORTAL.GLOVE_SEAM} strokeWidth="0.8" />
    </g>
  )
}

const stickHand = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + UPPER + FORE + 2
  return (
    <>
      <path d={`M${x} ${y} L${x + 13} ${y + 6}`} stroke={PORTAL.PLANK_LIT} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={x + 13} cy={y + 6} r={1.3} fill={PORTAL.SOLE} />
      {glove(depth)}
    </>
  )
}

const boxingGlove = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + UPPER + FORE + 2.6
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3.6" y="-5.6" width="7.2" height="3" rx="1" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.7" />
      <ellipse cx="0.6" cy="0.4" rx="5.4" ry="5" fill={depth === 'near' ? 'url(#npb-glove)' : PORTAL.TNT_DARK} stroke={INK} strokeWidth="0.9" />
      <ellipse cx="2" cy="-1.4" rx="1.8" ry="1.1" fill={PORTAL.WHITE} opacity="0.45" />
    </g>
  )
}

// ---- headwear, waist and props ----

const SWEATBAND = <path d="M20.6 16.4 Q37 4.6 57.6 8.8" fill="none" stroke={PORTAL.TNT} strokeWidth="3.4" strokeLinecap="round" />

const MONGKHON = (
  <>
    <path d="M21 17 Q12 11 14 1 Q15 -2 17 -1" fill="none" stroke={PORTAL.WHITE} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M20.6 16.6 Q37 4.2 57.8 8.6" fill="none" stroke={PORTAL.WHITE} strokeWidth="3.6" strokeLinecap="round" />
    {[27, 35, 43, 51].map((x) => (
      <path key={x} d={`M${x} ${x < 40 ? 8.6 : 6.6} v3`} stroke={PORTAL.BLUE} strokeWidth="1.5" />
    ))}
  </>
)

const LAPTOP = (
  <g>
    <path d="M56 54 L74 50 L76 64 L58 68 Z" fill={PORTAL.METAL_DARK} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    <path d="M58.4 56 L72.6 52.8 L74.2 62.4 L60 65.6 Z" fill={PORTAL.VOID} />
    <path d="M60.6 58.4 L67 57 M61 61 L70 59 M62 63.4 L68 62" stroke={PORTAL.TEAL} strokeWidth="1" strokeLinecap="round" />
    <path d="M50 70 L76 64 L78 66.4 L52 72.6 Z" fill={PORTAL.METAL} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
  </g>
)

const DRUM_CRATES = (
  <g>
    {[52, 64].map((x, index) => (
      <g key={x} transform={`translate(${x} ${index === 0 ? 84 : 88})`}>
        <path d="M0 0 H16 V18 H0 Z" fill={PORTAL.PLANK} stroke={INK} strokeWidth="1" />
        <path d="M2 2 H14 V16 H2 Z M2 2 L14 16 M14 2 L2 16" fill="none" stroke={PORTAL.BAND} strokeWidth="1.3" />
        <ellipse cx="8" cy="0" rx="8" ry="1.8" fill={PORTAL.SOLE} stroke={INK} strokeWidth="0.8" />
      </g>
    ))}
  </g>
)

const JEANS_WAIST = (
  <>
    <path d="M30.8 67.4 L51 67.4 L51.6 74 L30.4 74 Z" fill="url(#npb-jeans)" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M31 69.4 H51.2" stroke={PORTAL.JEANS_DARK} strokeWidth="1.2" />
  </>
)

const OUTFIT: Record<Profession, Outfit> = {
  engineer: { thigh: jeanThigh, shin: jeanShin, foot: sneaker, hand: glove, band: false, headwear: null, waist: JEANS_WAIST, prop: LAPTOP, held: true },
  drummer: { thigh: jeanThigh, shin: jeanShin, foot: sneaker, hand: stickHand, band: false, headwear: SWEATBAND, waist: JEANS_WAIST, prop: DRUM_CRATES, held: false },
  fighter: {
    thigh: shortsThigh,
    shin: furShin,
    foot: bareFoot,
    hand: boxingGlove,
    band: true,
    headwear: MONGKHON,
    waist: <rect x="30.8" y="66.4" width="20.6" height="4.6" rx="1" fill={PORTAL.GOLD} stroke={INK} strokeWidth="1" />,
    prop: null,
    held: false,
  },
}

// ---- gear a pose shows ----

const TORNADO = (
  <g className={sprite.tornado}>
    <path d="M14 22 Q40 8 66 22 M10 50 Q40 36 70 50 M14 78 Q40 64 66 78 M20 102 Q40 92 60 102" fill="none" stroke={PORTAL.WHITE} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    <path d="M12 36 Q40 24 68 36 M12 64 Q40 52 68 64 M16 90 Q40 80 64 90" fill="none" stroke={PORTAL.SWIRL} strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
  </g>
)

// the tank on his back and the mask strap; the mask glass itself sits on the head
const SCUBA_TANK = (
  <g>
    <rect x="25" y="50" width="8" height="20" rx="4" fill={PORTAL.GOLD} stroke={INK} strokeWidth="1" />
    <rect x="26.4" y="48" width="5" height="3" rx="1" fill={PORTAL.METAL} stroke={INK} strokeWidth="0.7" />
    <path d="M29 48 Q31 42 39 40" fill="none" stroke={PORTAL.VOID} strokeWidth="1.4" />
  </g>
)

const SCUBA_MASK = (
  <g>
    <path d="M21 19 Q36 11 50 12" fill="none" stroke={PORTAL.VOID} strokeWidth="1.8" />
    <rect x="40" y="8" width="22" height="16" rx="5" fill={PORTAL.GEM} fillOpacity="0.45" stroke={PORTAL.GREEN} strokeWidth="2" />
  </g>
)

const HALO = <ellipse cx="38" cy="-16" rx="11" ry="3" fill="none" stroke={PORTAL.TITLE} strokeWidth="2" />

const WINGS = (
  <g fill={PORTAL.WHITE} stroke={PORTAL.MUTED} strokeWidth="0.8" strokeLinejoin="round">
    <path d="M33 54 Q17 40 7 46 Q13 50 11 54 Q17 56 15 60 Q23 62 33 58 Z" />
    <path d="M35 52 Q29 36 19 34 Q23 40 21 44 Q27 46 25 50 Z" opacity="0.85" />
  </g>
)

// ---- the head, in 3/4: a big round skull, the long wide muzzle in his skin pushed out to the right with the
// black nose at its tip, the big close set eyes under thick brows, the spiky tuft of his dark hair, two pointed
// ears up and back, and his full beard boxed along the jaw inside an orange rim so the head's edge stays fur ----

function Head({ profession, gear, transform }: { profession: Profession; gear?: Gear; transform: string }) {
  return (
    <g data-joint="head" transform={transform}>
      <path d="M27.6 12 Q17.4 5 15.6 -7.6 Q26 -3.4 34 5 Z" fill={PORTAL.FUR_DARK} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M26.8 8.4 Q20.6 3.4 19.4 -3 Q25.4 0 30 5 Z" fill={PORTAL.MUZZLE_SHADE} />
      <path d="M33 7 Q30.6 -4.6 35.4 -11.6 Q41.6 -3.6 42.4 5.4 Z" fill="url(#npb-fur)" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M35 4.6 Q34.2 -2.6 36 -7 Q39.4 -1.6 40 4.4 Z" fill={PORTAL.MUZZLE} />

      <ellipse cx="38" cy="24" rx="18.4" ry="19.6" fill="url(#npb-fur)" stroke={INK} strokeWidth="1.2" />
      <ellipse cx="32" cy="12" rx="7" ry="3" fill={PORTAL.FUR_LIT} opacity="0.55" transform="rotate(-18 32 12)" />

      <path
        d="M44.4 19.4 C53 17.6 65 19 70.8 23.4 C75.4 27 74.4 33.4 69.2 36.8 C65 44.4 55 47.4 46.6 46 C40.6 45 37.4 40 38.4 33.4 C39.2 27 41 21.6 44.4 19.4 Z"
        fill="url(#npb-muzzle)"
        stroke={INK}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />

      <path
        d="M23.4 21 C21.6 30 24.6 38.6 32 41.6 C36.6 43.4 41 44.2 46.8 44.6 C54.6 45.6 62 43.4 66.6 37.6 L68.6 33.4 C62 37 54 38.6 47 37.8 C40 37 33 33.6 28.6 27.6 C27 25.6 25.6 23.4 25 21 Z"
        fill={PORTAL.BEARD}
      />
      <path d="M52 31 Q60.6 33 68.4 29.2" fill="none" stroke={PORTAL.BEARD} strokeWidth="2.4" strokeLinecap="round" />

      <g className={sprite.look}>
        <g className={sprite.eyes}>
          <ellipse cx="45.4" cy="16" rx="4.4" ry="6.4" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.9" />
          <ellipse cx="55.4" cy="16.8" rx="5.6" ry="7.4" fill={PORTAL.WHITE} stroke={INK} strokeWidth="1" />
          <g>
            <ellipse cx="47" cy="17" rx="2" ry="3.4" fill={PORTAL.EYE} />
            <ellipse cx="57.6" cy="17.8" rx="2.6" ry="4" fill={PORTAL.EYE} />
            <circle cx="58.4" cy="16" r="1" fill={PORTAL.WHITE} />
            <circle cx="47.6" cy="15.4" r="0.7" fill={PORTAL.WHITE} />
          </g>
        </g>
      </g>
      <path d="M40.4 9.4 Q45 5.6 49.6 8.4 L48.8 11 Q45 8.8 41.2 11.6 Z" fill={PORTAL.HAIR} />
      <path d="M50.4 8.2 Q56 4.4 62 8.4 L60.8 11 Q55.6 8.2 50.8 10.8 Z" fill={PORTAL.HAIR} />
      <path d="M31 7.6 L27.8 -3.4 L34.6 2.6 L36 -9 L40.6 0.8 L45.6 -6.6 L45.8 3.2 L51.6 -0.4 L48.4 6.6 Q40 3.6 31 7.6 Z" fill={PORTAL.HAIR} stroke={PORTAL.HAIR} strokeWidth="0.8" strokeLinejoin="round" />

      <ellipse cx="71.2" cy="25.4" rx="4.4" ry="3.4" fill={INK} />
      <ellipse cx="70.2" cy="24.2" rx="1.5" ry="0.8" fill={PORTAL.WHITE} opacity="0.7" />

      <g>
        <path d="M46.6 32.6 Q58 36.6 70 30.8 Q68.4 40.6 58.6 42.6 Q49.4 43.4 46.6 32.6 Z" fill={PORTAL.MOUTH} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
        <path d="M47.6 33.4 Q58 37.2 69 31.6 L67.8 35.4 Q58.4 39.6 48.8 36.8 Z" fill={PORTAL.TOOTH} />
        <path d="M51.8 35.2 V38.2 M56.4 36 V39.2 M61 35.6 V38.8 M65 34 V36.8" stroke={PORTAL.MUTED} strokeWidth="0.55" />
        <ellipse cx="58" cy="40.8" rx="3.4" ry="1" fill={PORTAL.FRUIT_RED} />
      </g>

      {OUTFIT[profession].headwear}
      {gear === 'scuba' && SCUBA_MASK}
      {gear === 'halo' && HALO}
    </g>
  )
}

// ---- the figure ----

interface BandicootProps {
  profession: Profession
  pose?: BandicootPose
  /** Draws one frame of the pose still, with no animation. */
  frame?: number
  className?: string
}

/** Plays a pose's frames on the sprite's joint groups; cancels them when the pose changes. */
function usePosePlayer(svg: RefObject<SVGSVGElement | null>, pose: BandicootPose, profession: Profession, still: boolean) {
  useEffect(() => {
    const root = svg.current
    if (!root || still || typeof root.animate !== 'function') return
    const spec = poseOf(pose, profession)
    const frames = framesOf(spec)
    if (frames.length < 2) return
    const timing: KeyframeAnimationOptions = { duration: spec.ms, iterations: spec.loop ? Infinity : 1, fill: 'forwards' }
    const whole = root.querySelector<SVGGElement>('[data-joint="whole"]')
    const animations: Animation[] = []
    if (whole) animations.push(whole.animate(frames.map((f) => ({ transform: wholeCss(f), opacity: f.fade, easing: spec.easing })), timing))
    JOINTS.forEach((joint) => {
      const part = root.querySelector<SVGGElement>(`[data-joint="${joint}"]`)
      if (part) animations.push(part.animate(frames.map((f) => ({ transform: jointCss(joint, f[joint]), easing: spec.easing })), timing))
    })
    return () => animations.forEach((animation) => animation.cancel())
  }, [svg, pose, profession, still])
}

// Poses that only make sense in their place (seated on a ride, flat in the water) hold their first frame
// under reduced motion instead of dropping to the standing still.
const HELD: ReadonlySet<BandicootPose> = new Set(['ride', 'swim'])

export function Bandicoot({ profession, pose = 'idle', frame, className = '' }: BandicootProps) {
  const reduced = useReducedMotion()
  const svg = useRef<SVGSVGElement>(null)
  const still = reduced || frame !== undefined || pose === 'still'
  const spec = poseOf(reduced && !HELD.has(pose) ? 'still' : pose, profession)
  const frames = framesOf(spec)
  const shown = frames[Math.min(frame ?? 0, frames.length - 1)]
  const outfit = OUTFIT[profession]
  const gear = spec.gear
  usePosePlayer(svg, pose, profession, still)

  const t = (name: Joint) => jointAttr(name, shown[name])

  return (
    <svg ref={svg} viewBox="0 -12 80 124" className={`${sprite.sprite} ${still ? sprite.still : ''} ${className}`} aria-hidden="true" focusable="false">
      {!HELD.has(pose) && <ellipse cx="42" cy="110" rx="20" ry="2.8" fill={INK} opacity="0.35" />}
      <g data-joint="whole" transform={wholeAttr(shown)} opacity={shown.fade}>
        {gear === 'halo' && WINGS}
        {gear === 'scuba' && SCUBA_TANK}
        <g data-joint="legFar" transform={t('legFar')}>
          {outfit.thigh('far')}
          <g data-joint="shinFar" transform={t('shinFar')}>
            {outfit.shin('far')}
            <g data-joint="footFar" transform={t('footFar')}>
              {outfit.foot('far')}
            </g>
          </g>
        </g>
        <g data-joint="legNear" transform={t('legNear')}>
          {outfit.thigh('near')}
          <g data-joint="shinNear" transform={t('shinNear')}>
            {outfit.shin('near')}
            <g data-joint="footNear" transform={t('footNear')}>
              {outfit.foot('near')}
            </g>
          </g>
        </g>
        {gear === 'prop' && !outfit.held && outfit.prop}
        <g data-joint="torso" transform={t('torso')}>
          <g data-joint="armFar" transform={t('armFar')}>
            {upperArm('far', outfit.band)}
            <g data-joint="foreFar" transform={t('foreFar')}>
              {foreArm('far')}
              {outfit.hand('far')}
            </g>
          </g>
          <path d="M37.4 42 L45.6 42 L46.6 51 L37 51 Z" fill={PORTAL.FUR} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M36 47.4 C29.6 50.6 28.4 61 30.8 72 L51 72 C53.4 63 52.6 53 46.8 47.4 C43.4 45.6 39.4 45.6 36 47.4 Z" fill="url(#npb-fur)" stroke={INK} strokeWidth="1.2" />
          <path d="M41.6 51.6 C47 51.8 50 57.6 49 64 C48 69 43.4 70.4 41 66.4 C39.4 61.4 39.4 55.4 41.6 51.6 Z" fill={PORTAL.FUR_LIT} opacity="0.55" />
          <path d="M33.4 56 Q35 63 34 70" fill="none" stroke={FOLD} strokeWidth="1" opacity="0.6" />
          {outfit.waist}
          <Head profession={profession} gear={gear} transform={t('head')} />
          {gear === 'prop' && outfit.held && outfit.prop}
          <g data-joint="armNear" transform={t('armNear')}>
            {upperArm('near', outfit.band)}
            <g data-joint="foreNear" transform={t('foreNear')}>
              {foreArm('near')}
              {outfit.hand('near')}
            </g>
          </g>
        </g>
      </g>
      {gear === 'tornado' && TORNADO}
    </svg>
  )
}
