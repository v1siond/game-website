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
// his full dark beard along the jaw (HERO_IDENTITY via the palette). The far limbs are a shade darker so
// the body reads in depth.
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

const LINE = PORTAL.FUR_DARK
const INK = PORTAL.VOID

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
          <stop offset="1" stopColor="#4d7fd6" />
        </linearGradient>
        <linearGradient id="npb-sneaker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a4e" />
          <stop offset="0.6" stopColor={PORTAL.SNEAKER} />
          <stop offset="1" stopColor={PORTAL.SNEAKER_DARK} />
        </linearGradient>
        <radialGradient id="npb-glove" cx="0.6" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff7468" />
          <stop offset="0.6" stopColor={PORTAL.TNT} />
          <stop offset="1" stopColor={PORTAL.TNT_DARK} />
        </radialGradient>
        <linearGradient id="npb-shorts" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.BLUE_DEEP} />
          <stop offset="1" stopColor="#5aa6ff" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---- legs: thigh (hip to knee, y 72 to 86), shin (knee to ankle, y 86 to 99), foot (from y 99) ----

const jeanThigh = (depth: Depth) => (
  <path
    d={`M${at(depth, 38.6)} 71 L${at(depth, 49.4)} 71 L${at(depth, 48.6)} 87.4 L${at(depth, 39.6)} 87.4 Z`}
    fill={depth === 'near' ? 'url(#npb-jeans)' : PORTAL.JEANS_DARK}
    stroke={INK}
    strokeWidth="0.9"
    strokeLinejoin="round"
  />
)

const jeanShin = (depth: Depth) => (
  <>
    <path
      d={`M${at(depth, 39.6)} 85.6 L${at(depth, 48.6)} 85.6 L${at(depth, 50.4)} 100.4 L${at(depth, 37.8)} 100.4 Z`}
      fill={depth === 'near' ? 'url(#npb-jeans)' : PORTAL.JEANS_DARK}
      stroke={INK}
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    <path d={`M${at(depth, 38.2)} 97.6 H${at(depth, 50)}`} stroke="#7ea6ea" strokeWidth="1.6" opacity={depth === 'near' ? 1 : 0.5} />
  </>
)

const shortsThigh = (depth: Depth) => (
  <>
    <path
      d={`M${at(depth, 38)} 70 L${at(depth, 50)} 70 L${at(depth, 50.6)} 84 L${at(depth, 38.6)} 84 Z`}
      fill={depth === 'near' ? 'url(#npb-shorts)' : PORTAL.BLUE_DEEP}
      stroke={INK}
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    <path d={`M${at(depth, 48)} 82 L${at(depth, 49.6)} 77`} stroke={PORTAL.GOLD} strokeWidth="1.2" />
    <path d={`M${at(depth, 40.4)} 84 L${at(depth, 47.6)} 84 L${at(depth, 47.4)} 87.4 L${at(depth, 40.6)} 87.4 Z`} fill={furOf(depth)} />
  </>
)

const furShin = (depth: Depth) => (
  <>
    <path d={`M${at(depth, 40.6)} 85.6 L${at(depth, 47.4)} 85.6 L${at(depth, 46.6)} 99.6 L${at(depth, 41.4)} 99.6 Z`} fill={furOf(depth)} stroke={LINE} strokeWidth="0.9" />
    <path d={`M${at(depth, 41)} 95.4 L${at(depth, 46.8)} 95.4 L${at(depth, 46.6)} 99.6 L${at(depth, 41.2)} 99.6 Z`} fill={PORTAL.WHITE} stroke={PORTAL.MUTED} strokeWidth="0.5" />
  </>
)

// the sneaker points forward (right): heel at the ankle, the big rounded toe out in front
const sneaker = (depth: Depth) => (
  <>
    <path
      d={`M${at(depth, 38.4)} 99 C${at(depth, 38.4)} 96.6 ${at(depth, 46)} 96 ${at(depth, 49)} 97.6 C${at(depth, 54)} 98.6 ${at(depth, 58.4)} 100.4 ${at(depth, 59.4)} 103.4 L${at(depth, 59.4)} 105.6 L${at(depth, 37.4)} 105.6 L${at(depth, 37.4)} 101.6 Z`}
      fill={depth === 'near' ? 'url(#npb-sneaker)' : PORTAL.SNEAKER_DARK}
      stroke={INK}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path
      d={`M${at(depth, 36.6)} 104.8 H${at(depth, 60)} Q${at(depth, 61.6)} 110 ${at(depth, 57)} 110 H${at(depth, 38.4)} Q${at(depth, 35.6)} 110 ${at(depth, 36.6)} 104.8 Z`}
      fill={PORTAL.SOLE}
      stroke={INK}
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    <path d={`M${at(depth, 44)} 98.2 L${at(depth, 48.4)} 101.6 M${at(depth, 47)} 97.8 L${at(depth, 45)} 101.8`} stroke={PORTAL.WHITE} strokeWidth="1" strokeLinecap="round" />
  </>
)

const bareFoot = (depth: Depth) => (
  <path
    d={`M${at(depth, 41.2)} 99 L${at(depth, 46.8)} 99 Q${at(depth, 54)} 103 ${at(depth, 56.6)} 106.4 Q${at(depth, 57.6)} 110 ${at(depth, 53.4)} 110 L${at(depth, 41)} 110 Q${at(depth, 39.4)} 110 ${at(depth, 39.8)} 106 Z`}
    fill={furOf(depth)}
    stroke={LINE}
    strokeWidth="0.9"
    strokeLinejoin="round"
  />
)

// ---- arms: upper arm (shoulder to elbow), forearm (elbow to wrist) with the hand ----

const ARM_X: Record<Depth, number> = { near: 45, far: 37 }
const SHOULDER_Y: Record<Depth, number> = { near: 52, far: 51 }

const limbStroke = (depth: Depth, d: string) => (
  <>
    <path d={d} fill="none" stroke={LINE} strokeWidth="5.6" strokeLinecap="round" />
    <path d={d} fill="none" stroke={depth === 'near' ? PORTAL.FUR : PORTAL.FUR_DARK} strokeWidth="4" strokeLinecap="round" />
  </>
)

const upperArm = (depth: Depth, band: boolean) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth]
  return (
    <>
      {limbStroke(depth, `M${x} ${y} L${x} ${y + 11}`)}
      {band && <path d={`M${x - 2.6} ${y + 5} H${x + 2.6}`} stroke={PORTAL.TNT} strokeWidth="2.4" />}
    </>
  )
}

const foreArm = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + 11
  return limbStroke(depth, `M${x} ${y} L${x} ${y + 10}`)
}

// the fingerless glove, knuckles forward, fur fingers curling out of it
const glove = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + 22
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-3.2 -1.4 Q-3.4 3.6 -1.4 5.4 Q2.6 6.6 4.4 3.6 Q5 0.6 3.4 -1.6 Z" fill={depth === 'near' ? PORTAL.GLOVE : '#3d1c17'} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M1.6 4.8 Q4.4 6.6 5.6 4.4 M-0.6 5.6 Q1 8 3 7" fill="none" stroke={LINE} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M1.6 4.8 Q4.4 6.6 5.6 4.4 M-0.6 5.6 Q1 8 3 7" fill="none" stroke={PORTAL.FUR} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-3 -0.6 H3.6" stroke="#6b4a36" strokeWidth="0.8" />
    </g>
  )
}

const stickHand = (depth: Depth) => {
  const x = ARM_X[depth]
  const y = SHOULDER_Y[depth] + 24
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
  const y = SHOULDER_Y[depth] + 24
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3.6" y="-5.6" width="7.2" height="3" rx="1" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.7" />
      <ellipse cx="0.6" cy="0.4" rx="5.4" ry="5" fill={depth === 'near' ? 'url(#npb-glove)' : PORTAL.TNT_DARK} stroke={INK} strokeWidth="0.9" />
      <ellipse cx="2" cy="-1.4" rx="1.8" ry="1.1" fill={PORTAL.WHITE} opacity="0.45" />
    </g>
  )
}

// ---- headwear, waist and props ----

const SWEATBAND = <path d="M24 13.4 Q38 6 53.4 11.6" fill="none" stroke={PORTAL.TNT} strokeWidth="3.2" strokeLinecap="round" />

const MONGKHON = (
  <>
    <path d="M24.6 14 Q16 8 18 -2 Q19 -5 21 -4" fill="none" stroke={PORTAL.WHITE} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M24 13.6 Q38 5.6 53.6 11.4" fill="none" stroke={PORTAL.WHITE} strokeWidth="3.4" strokeLinecap="round" />
    {[29, 36, 43, 50].map((x) => (
      <path key={x} d={`M${x} ${x < 40 ? 9.4 : 7.8} v3`} stroke={PORTAL.BLUE} strokeWidth="1.5" />
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

const JEANS_WAIST = <path d="M32 67.6 L50 67.6 L51 74 L31.4 74 Z" fill="url(#npb-jeans)" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />

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
    waist: <rect x="31.4" y="66.6" width="19.4" height="4.4" rx="1" fill={PORTAL.GOLD} stroke={PORTAL.BRASS_DARK} strokeWidth="0.9" />,
    prop: null,
    held: false,
  },
}

// ---- gear a pose shows ----

const TORNADO = (
  <g className={sprite.tornado}>
    <path d="M14 22 Q40 8 66 22 M10 50 Q40 36 70 50 M14 78 Q40 64 66 78 M20 102 Q40 92 60 102" fill="none" stroke={PORTAL.WHITE} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    <path d="M12 36 Q40 24 68 36 M12 64 Q40 52 68 64 M16 90 Q40 80 64 90" fill="none" stroke="#ff9ad5" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
  </g>
)

// the tank on his back and the mask strap; the mask glass itself sits on the head
const SCUBA_TANK = (
  <g>
    <rect x="26" y="50" width="8" height="20" rx="4" fill={PORTAL.GOLD} stroke={INK} strokeWidth="1" />
    <rect x="27.4" y="48" width="5" height="3" rx="1" fill={PORTAL.METAL} stroke={INK} strokeWidth="0.7" />
    <path d="M30 48 Q32 42 40 40" fill="none" stroke={PORTAL.VOID} strokeWidth="1.4" />
  </g>
)

const SCUBA_MASK = (
  <g>
    <path d="M24 18 Q38 12 54 14" fill="none" stroke={PORTAL.VOID} strokeWidth="1.6" />
    <rect x="40" y="13" width="17" height="11" rx="4" fill="#9ff3ff" fillOpacity="0.45" stroke={PORTAL.GREEN} strokeWidth="2" />
  </g>
)

const HALO = <ellipse cx="38" cy="-6" rx="10" ry="2.8" fill="none" stroke={PORTAL.TITLE} strokeWidth="2" />

const WINGS = (
  <g fill={PORTAL.WHITE} stroke={PORTAL.MUTED} strokeWidth="0.8" strokeLinejoin="round">
    <path d="M34 54 Q18 40 8 46 Q14 50 12 54 Q18 56 16 60 Q24 62 34 58 Z" />
    <path d="M36 52 Q30 36 20 34 Q24 40 22 44 Q28 46 26 50 Z" opacity="0.85" />
  </g>
)

// ---- the head, in 3/4: the round skull, the muzzle pushed out to the right with the nose at its tip ----

function Head({ profession, gear, transform }: { profession: Profession; gear?: Gear; transform: string }) {
  return (
    <g data-joint="head" transform={transform}>
      <path d="M30 12 L20 -4 L34 6 Z" fill={PORTAL.FUR_DARK} stroke={LINE} strokeWidth="1" strokeLinejoin="round" />
      <path d="M25 21 L6 14 L22 30 Z" fill="url(#npb-fur)" stroke={LINE} strokeWidth="1" strokeLinejoin="round" />
      <path d="M22.6 21 L11.6 17.4 L21.4 26.4 Z" fill={PORTAL.FUR_DARK} opacity="0.6" />

      <ellipse cx="38" cy="25" rx="16.6" ry="18" fill="url(#npb-fur)" stroke={LINE} strokeWidth="1.1" />
      <ellipse cx="44" cy="12" rx="6" ry="2.4" fill={PORTAL.FUR_LIT} opacity="0.5" transform="rotate(12 44 12)" />

      <path d="M22.4 18 C24 7.4 33 3.2 42 4.2 C49 5 53.6 9 54.6 13 C47 9.6 36 9.6 22.4 18 Z" fill={PORTAL.HAIR} />
      <path d="M28 8 L24.6 -5.6 L33 3.2 L34.6 -8.6 L39.6 2.6 L45 -5 L44.6 5.2 Z" fill={PORTAL.HAIR} stroke={PORTAL.HAIR} strokeWidth="0.8" strokeLinejoin="round" />

      <path
        d="M44 20.6 C52 18.4 61 20.6 65 26.4 C67.6 30.4 66 35.6 60.6 38.6 C55 41.6 47.6 42 42 40.6 Z"
        fill="url(#npb-muzzle)"
        stroke={LINE}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />

      <path
        d="M23.4 30 C22.6 40.4 29 48.6 40 50 C50 51.2 58.4 47.6 62.4 41.4 C57.6 43.6 51.4 44.6 46 44 C37.6 43 30 38.4 23.4 30 Z"
        fill={PORTAL.BEARD}
      />

      <g className={sprite.look}>
        <g className={sprite.eyes}>
          <ellipse cx="41" cy="19" rx="3.6" ry="5.4" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.8" />
          <ellipse cx="50.4" cy="19.6" rx="4.6" ry="6.2" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.9" />
          <g>
            <ellipse cx="42.4" cy="20" rx="1.8" ry="3" fill={PORTAL.EYE} />
            <ellipse cx="52.2" cy="20.6" rx="2.3" ry="3.6" fill={PORTAL.EYE} />
            <circle cx="53" cy="19" r="0.9" fill={PORTAL.WHITE} />
          </g>
        </g>
      </g>
      <path d="M37.4 12.8 Q41 10.4 44.6 12.4 L44 14.6 Q41 12.8 38 14.8 Z" fill={PORTAL.HAIR} />
      <path d="M46 12 Q51.6 9 57 12.6 L56.2 15 Q51.4 12 46.4 14.4 Z" fill={PORTAL.HAIR} />

      <ellipse cx="64.2" cy="27.6" rx="3.8" ry="3" fill={INK} />
      <ellipse cx="63.4" cy="26.6" rx="1.3" ry="0.7" fill={PORTAL.WHITE} opacity="0.7" />
      <path d="M50 30.6 Q55 31.4 59.4 30" fill="none" stroke={PORTAL.BEARD} strokeWidth="1.8" strokeLinecap="round" />

      <g>
        <path d="M43.4 33.6 Q54 37.6 63.4 33 Q62 41.6 54 43.2 Q46 43.4 43.4 33.6 Z" fill={PORTAL.MOUTH} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
        <path d="M44.4 34.4 Q54 38 62.4 33.8 L61.4 37.2 Q54 40.6 45.6 37.8 Z" fill={PORTAL.TOOTH} />
        <path d="M48.4 35.8 V38.8 M52.6 36.6 V39.6 M56.8 36.4 V39.4 M60.4 35 V37.6" stroke={PORTAL.MUTED} strokeWidth="0.55" />
        <ellipse cx="53.6" cy="41.4" rx="3.2" ry="1" fill={PORTAL.FRUIT_RED} />
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
          <path d="M36.6 47 C30.4 53 29.8 64 32.6 72 L49.6 72 C51.6 64 50.6 53.4 46 47 Z" fill="url(#npb-fur)" stroke={LINE} strokeWidth="1.1" />
          <ellipse cx="45" cy="60" rx="4.2" ry="7.6" fill={PORTAL.FUR_LIT} opacity="0.45" />
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
