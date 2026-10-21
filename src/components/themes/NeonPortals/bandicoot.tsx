import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'
import sprite from './bandicoot.module.css'

// Him as this world's hero, a parody of the orange bandicoot of the 1998 time travel platformer (Crash
// of Warped, named in code only), seen from the front the way the game's camera meets him running at
// it: the big wide head with the ears flung out to the sides and the spiky tuft, thick brows over two
// big eyes set close, the long muzzle with the black nose and the huge toothy grin, a slim orange body
// on long thin arms, fingerless gloves, blue jeans flaring over oversized red sneakers with white soles.
// He is still himself: his black oval eyes in place of the green ones, his short dark hair as the tuft
// and the brows, his skin on the muzzle, and his full dark beard framing the grin (HERO_IDENTITY via
// the palette). Fur is shaded with gradients, lit from the top left, the way the game's smooth shaded
// models read.
// - System Engineer: the classic jeans and sneakers; his action pulls out a laptop and types in a blur.
// - Musician: a sweatband and a stick in each hand; his action drums on two crates.
// - Martial Artist: Muay Thai shorts with a gold waistband, the mongkhon round his head with its tail
//   standing up, arm bands, red gloves, bare feet in ankle wraps; his action is a spinning roundhouse.
//
// The parts are separate groups (each arm, each leg, the body, the head, the eyes, the profession's
// prop), each turning round its own joint, so bandicoot.module.css runs every pose with transforms
// only: the idle shimmy, the run, the tornado spin, the body slam, the double jump, the dance, the
// profession action, and the warp. His head and eyes follow the pointer (--mx, --my on the root).
// viewBox units: 80 by 112, feet on y 110.

export type BandicootPose = 'idle' | 'run' | 'spin' | 'slam' | 'jump' | 'dance' | 'act' | 'warp' | 'still'

const LINE = PORTAL.FUR_DARK
const INK = PORTAL.VOID

interface Outfit {
  legs: (side: Side) => ReactNode
  feet: (side: Side) => ReactNode
  hand: (side: Side) => ReactNode
  arm: (side: Side) => ReactNode
  headwear: ReactNode
  prop: ReactNode
}

type Side = 'left' | 'right'

// Mirrors an x of the left side onto the right (the figure is symmetric about x 40).
const mx = (side: Side, x: number) => (side === 'left' ? x : 80 - x)

/** The gradients the figure reads, set once on the world's root. */
export function BandicootDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="npb-fur" cx="0.36" cy="0.28" r="0.85">
          <stop offset="0" stopColor={PORTAL.FUR_LIT} />
          <stop offset="0.55" stopColor={PORTAL.FUR} />
          <stop offset="1" stopColor={PORTAL.FUR_DARK} />
        </radialGradient>
        <linearGradient id="npb-limb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.FUR_LIT} />
          <stop offset="0.6" stopColor={PORTAL.FUR} />
          <stop offset="1" stopColor={PORTAL.FUR_DARK} />
        </linearGradient>
        <radialGradient id="npb-muzzle" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor={PORTAL.MUZZLE} />
          <stop offset="1" stopColor={PORTAL.MUZZLE_SHADE} />
        </radialGradient>
        <linearGradient id="npb-jeans" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4d7fd6" />
          <stop offset="0.5" stopColor={PORTAL.JEANS} />
          <stop offset="1" stopColor={PORTAL.JEANS_DARK} />
        </linearGradient>
        <linearGradient id="npb-sneaker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a4e" />
          <stop offset="0.6" stopColor={PORTAL.SNEAKER} />
          <stop offset="1" stopColor={PORTAL.SNEAKER_DARK} />
        </linearGradient>
        <radialGradient id="npb-glove" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff7468" />
          <stop offset="0.6" stopColor={PORTAL.TNT} />
          <stop offset="1" stopColor={PORTAL.TNT_DARK} />
        </radialGradient>
        <linearGradient id="npb-shorts" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5aa6ff" />
          <stop offset="1" stopColor={PORTAL.BLUE_DEEP} />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---- legs and feet ----

const jeans = (side: Side) => (
  <>
    <path
      d={`M${mx(side, 29)} 71 L${mx(side, 38.6)} 71 L${mx(side, 38.4)} 99 L${mx(side, 25)} 99 Z`}
      fill="url(#npb-jeans)"
      stroke={PORTAL.JEANS_DARK}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d={`M${mx(side, 26)} 95.5 H${mx(side, 38.4)}`} stroke="#7ea6ea" strokeWidth="2" />
    <path d={`M${mx(side, 31)} 82 Q${mx(side, 33)} 84 ${mx(side, 36)} 82`} fill="none" stroke={PORTAL.JEANS_DARK} strokeWidth="0.9" />
    <path d={`M${mx(side, 36.5)} 72 L${mx(side, 36.4)} 95`} stroke="#7ea6ea" strokeWidth="0.6" strokeDasharray="1.4 1.2" />
  </>
)

const shorts = (side: Side) => (
  <>
    <path
      d={`M${mx(side, 28.6)} 70 L${mx(side, 39)} 70 L${mx(side, 39)} 84 L${mx(side, 25.5)} 84 Z`}
      fill="url(#npb-shorts)"
      stroke={PORTAL.BLUE_DEEP}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d={`M${mx(side, 26)} 81 L${mx(side, 28)} 77`} stroke={PORTAL.GOLD} strokeWidth="1.2" />
    <path
      d={`M${mx(side, 27.5)} 84 L${mx(side, 37.5)} 84 L${mx(side, 37)} 100 L${mx(side, 28.4)} 100 Z`}
      fill="url(#npb-limb)"
      stroke={LINE}
      strokeWidth="0.9"
    />
  </>
)

const sneaker = (side: Side) => (
  <>
    <path
      d={`M${mx(side, 24)} 98 C${mx(side, 24)} 95 ${mx(side, 28)} 94 ${mx(side, 32)} 94.6 C${mx(side, 36)} 95 ${mx(side, 39.4)} 97 ${mx(side, 39.4)} 100 L${mx(side, 39.4)} 105 L${mx(side, 19)} 105 C${mx(side, 15.6)} 105 ${mx(side, 15)} 101.6 ${mx(side, 17.6)} 100.2 C${mx(side, 19.6)} 99.2 ${mx(side, 22)} 99 ${mx(side, 24)} 98 Z`}
      fill="url(#npb-sneaker)"
      stroke={INK}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path
      d={`M${mx(side, 15.8)} 104 L${mx(side, 40)} 104 L${mx(side, 40)} 107.6 Q${mx(side, 40)} 110 ${mx(side, 37.4)} 110 L${mx(side, 18.6)} 110 Q${mx(side, 15.4)} 110 ${mx(side, 15.8)} 107 Z`}
      fill={PORTAL.SOLE}
      stroke={INK}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d={`M${mx(side, 28)} 96.6 L${mx(side, 34)} 99.6 M${mx(side, 28)} 99.6 L${mx(side, 34)} 96.6`} stroke={PORTAL.WHITE} strokeWidth="1.1" strokeLinecap="round" />
    <path d={`M${mx(side, 20)} 101.6 Q${mx(side, 22)} 100.4 ${mx(side, 24)} 101`} fill="none" stroke="#ff8a80" strokeWidth="1" />
  </>
)

const bareFoot = (side: Side) => (
  <>
    <path
      d={`M${mx(side, 27.6)} 99 L${mx(side, 37.6)} 99 L${mx(side, 38.6)} 105 Q${mx(side, 38.6)} 109.6 ${mx(side, 34)} 109.6 L${mx(side, 20.4)} 109.6 Q${mx(side, 17.4)} 109.6 ${mx(side, 18)} 107 Q${mx(side, 19)} 104 ${mx(side, 27.6)} 103 Z`}
      fill="url(#npb-limb)"
      stroke={LINE}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d={`M${mx(side, 28)} 98.6 L${mx(side, 37.6)} 98.6 L${mx(side, 37.8)} 102.6 L${mx(side, 27.8)} 102.6 Z`} fill={PORTAL.WHITE} stroke={PORTAL.MUTED} strokeWidth="0.6" />
    <path d={`M${mx(side, 21)} 109.4 V107.6 M${mx(side, 24)} 109.4 V107.4`} stroke={LINE} strokeWidth="0.7" />
  </>
)

// ---- arms and hands ----

const ARM_PATH = (side: Side) => `M${mx(side, 31.5)} 50.5 Q${mx(side, 25.5)} 58 ${mx(side, 24)} 70`

const furArm = (side: Side) => (
  <>
    <path d={ARM_PATH(side)} fill="none" stroke={LINE} strokeWidth="7.4" strokeLinecap="round" />
    <path d={ARM_PATH(side)} fill="none" stroke="url(#npb-limb)" strokeWidth="5.6" strokeLinecap="round" />
  </>
)

const fighterArm = (side: Side) => (
  <>
    {furArm(side)}
    <path d={`M${mx(side, 27.2)} 55.4 L${mx(side, 31.4)} 57.6`} stroke={PORTAL.TNT} strokeWidth="2.6" strokeLinecap="round" />
    <path d={`M${mx(side, 30.6)} 57.4 L${mx(side, 33)} 61`} stroke={PORTAL.TNT} strokeWidth="1.2" strokeLinecap="round" />
  </>
)

const glove = (side: Side) => (
  <g transform={`translate(${mx(side, 24)} 73)`}>
    <path d="M-3.4 -1.6 Q-5 2.4 -4 4.8 M-1.2 -0.8 Q-1.6 4 -0.4 6.2 M1.4 -0.8 Q1.8 4 3 5.6" fill="none" stroke={LINE} strokeWidth="3.2" strokeLinecap="round" />
    <path d="M-3.4 -1.6 Q-5 2.4 -4 4.8 M-1.2 -0.8 Q-1.6 4 -0.4 6.2 M1.4 -0.8 Q1.8 4 3 5.6" fill="none" stroke={PORTAL.FUR} strokeWidth="2" strokeLinecap="round" />
    <path d="M-5 -5.4 Q0 -7.6 5 -5.4 L5.4 1.6 Q0 3.4 -5.4 1.6 Z" fill={PORTAL.GLOVE} stroke={INK} strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M-4.6 -5 Q0 -6.6 4.6 -5" fill="none" stroke="#6b4a36" strokeWidth="0.9" />
    <path d={side === 'left' ? 'M4.6 -2.2 Q8 -1.4 7.4 1.6' : 'M-4.6 -2.2 Q-8 -1.4 -7.4 1.6'} fill="none" stroke={PORTAL.FUR} strokeWidth="2.4" strokeLinecap="round" />
  </g>
)

const sticks = (side: Side) => (
  <>
    <path
      d={`M${mx(side, 24)} 73 L${mx(side, 12)} 58`}
      stroke={PORTAL.PLANK_LIT}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx={mx(side, 12)} cy={58} r={1.4} fill={PORTAL.SOLE} />
    {glove(side)}
  </>
)

const boxingGlove = (side: Side) => (
  <g transform={`translate(${mx(side, 24)} 73)`}>
    <rect x="-4.4" y="-7.4" width="8.8" height="3.6" rx="1" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.8" />
    <ellipse cx="0" cy="0" rx="6.4" ry="6" fill="url(#npb-glove)" stroke={INK} strokeWidth="1" />
    <ellipse cx="-2" cy="-2.2" rx="2.2" ry="1.4" fill={PORTAL.WHITE} opacity="0.5" />
  </g>
)

// ---- headwear and props ----

const SWEATBAND = <path d="M19.4 16.6 Q40 8.6 60.6 16.6" fill="none" stroke={PORTAL.TNT} strokeWidth="3.4" strokeLinecap="round" />

const MONGKHON = (
  <>
    <path d="M55 13 Q63 4 61 -7 Q60 -10 58 -9" fill="none" stroke={PORTAL.WHITE} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M19.2 16.8 Q40 8.2 60.8 16.8" fill="none" stroke={PORTAL.WHITE} strokeWidth="3.6" strokeLinecap="round" />
    {[25, 33, 40, 47, 55].map((x) => (
      <path key={x} d={`M${x} ${x === 40 ? 10.4 : x < 30 || x > 50 ? 13.8 : 11.4} v3`} stroke={PORTAL.BLUE} strokeWidth="1.6" />
    ))}
  </>
)

const LAPTOP = (
  <g>
    <path d="M10 60 L32 60 L33 74 L9 74 Z" fill={PORTAL.METAL_DARK} stroke={INK} strokeWidth="1" />
    <rect x="12" y="62" width="18.6" height="10" fill={PORTAL.VOID} />
    <path d="M14 64.4 H22 M14 67 H26 M16 69.6 H24" stroke={PORTAL.TEAL} strokeWidth="1.1" strokeLinecap="round" />
    <path d="M7 74 H35 L33 77 H9 Z" fill={PORTAL.METAL} stroke={INK} strokeWidth="0.9" />
  </g>
)

const DRUM_CRATES = (
  <g>
    {[
      [6, 'M6 86 H30 V104 H6 Z'],
      [50, 'M50 86 H74 V104 H50 Z'],
    ].map(([x, d]) => (
      <g key={x}>
        <path d={d as string} fill={PORTAL.PLANK} stroke={INK} strokeWidth="1.1" />
        <path d={`M${(x as number) + 2} 88 H${(x as number) + 22} V102 H${(x as number) + 2} Z`} fill="none" stroke={PORTAL.BAND} strokeWidth="1.6" />
        <ellipse cx={(x as number) + 12} cy={86} rx={12} ry={2.4} fill={PORTAL.SOLE} stroke={INK} strokeWidth="0.9" />
      </g>
    ))}
  </g>
)

const OUTFIT: Record<Profession, Outfit> = {
  engineer: { legs: jeans, feet: sneaker, hand: glove, arm: furArm, headwear: null, prop: LAPTOP },
  drummer: { legs: jeans, feet: sneaker, hand: sticks, arm: furArm, headwear: SWEATBAND, prop: DRUM_CRATES },
  fighter: { legs: shorts, feet: bareFoot, hand: boxingGlove, arm: fighterArm, headwear: MONGKHON, prop: null },
}

const WAIST: Record<Profession, ReactNode> = {
  engineer: <path d="M28.6 66.8 H51.4 L52 72.6 L40 71.6 L28 72.6 Z" fill="url(#npb-jeans)" stroke={PORTAL.JEANS_DARK} strokeWidth="1" />,
  drummer: <path d="M28.6 66.8 H51.4 L52 72.6 L40 71.6 L28 72.6 Z" fill="url(#npb-jeans)" stroke={PORTAL.JEANS_DARK} strokeWidth="1" />,
  fighter: <rect x="28" y="66.4" width="24" height="4.4" rx="1" fill={PORTAL.GOLD} stroke={PORTAL.BRASS_DARK} strokeWidth="0.9" />,
}

// ---- the head ----

function Head({ profession }: { profession: Profession }) {
  return (
    <g className={sprite.head}>
      <path d="M22.4 19 C14 14.6 6.4 10 2.6 5.6 C5 14.4 10 22.4 20.4 27.6 Z" fill="url(#npb-fur)" stroke={LINE} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M20.6 20.6 C14.6 17.4 9.6 13.6 7 10.6 C9.6 16 13.4 20.6 19.4 24 Z" fill={PORTAL.FUR_DARK} opacity="0.65" />
      <path d="M57.6 19 C66 14.6 73.6 10 77.4 5.6 C75 14.4 70 22.4 59.6 27.6 Z" fill="url(#npb-fur)" stroke={LINE} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M59.4 20.6 C65.4 17.4 70.4 13.6 73 10.6 C70.4 16 66.6 20.6 60.6 24 Z" fill={PORTAL.FUR_DARK} opacity="0.65" />

      <path
        d="M40 6 C54 6 62 14 62 24 C62 30 60.4 34 58.4 37 C56 44.4 50 50.6 40 50.6 C30 50.6 24 44.4 21.6 37 C19.6 34 18 30 18 24 C18 14 26 6 40 6 Z"
        fill="url(#npb-fur)"
        stroke={LINE}
        strokeWidth="1.2"
      />
      <ellipse cx="31" cy="11.6" rx="7" ry="2.6" fill={PORTAL.FUR_LIT} opacity="0.55" transform="rotate(-14 31 11.6)" />

      <path
        d="M23.6 15.4 C27 8.6 33 5.4 40 5.4 C47 5.4 53 8.6 56.4 15.4 C51 12 46 11 40 11 C34 11 29 12 23.6 15.4 Z"
        fill={PORTAL.HAIR}
      />
      <path d="M32.6 9.4 L33.6 0.6 L38 7 L41 -1.6 L43.6 7 L49.4 1.4 L47.6 10.2 Z" fill={PORTAL.HAIR} stroke={PORTAL.HAIR} strokeWidth="0.8" strokeLinejoin="round" />

      <path d="M26.6 16 Q32 12 37.4 15.2 L37.2 17.8 Q32 15 26.8 18.4 Z" fill={PORTAL.HAIR} />
      <path d="M53.4 16 Q48 12 42.6 15.2 L42.8 17.8 Q48 15 53.2 18.4 Z" fill={PORTAL.HAIR} />

      <g className={sprite.look}>
        <g className={sprite.eyes}>
          <ellipse cx="33" cy="23" rx="4.8" ry="6.2" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.9" />
          <ellipse cx="47" cy="23" rx="4.8" ry="6.2" fill={PORTAL.WHITE} stroke={INK} strokeWidth="0.9" />
          <g className={sprite.pupils}>
            <ellipse cx="34" cy="24" rx="2.3" ry="3.6" fill={PORTAL.EYE} />
            <ellipse cx="46" cy="24" rx="2.3" ry="3.6" fill={PORTAL.EYE} />
            <circle cx="34.8" cy="22.4" r="0.9" fill={PORTAL.WHITE} />
            <circle cx="46.8" cy="22.4" r="0.9" fill={PORTAL.WHITE} />
          </g>
        </g>
      </g>

      <path
        d="M25.6 31 C25.6 26.6 32 25.6 40 26.6 C48 25.6 54.4 26.6 54.4 31 C56 37 54 44 48 47.6 C44 49.6 36 49.6 32 47.6 C26 44 24 37 25.6 31 Z"
        fill="url(#npb-muzzle)"
      />
      <path
        d="M21.4 33 C21.6 42 27.6 52.4 40 54.4 C52.4 52.4 58.4 42 58.6 33 C56.6 38.6 53.4 42.4 50 43.4 C47 47.4 44 48.4 40 48.4 C36 48.4 33 47.4 30 43.4 C26.6 42.4 23.4 38.6 21.4 33 Z"
        fill={PORTAL.BEARD}
      />
      <path d="M26 46 L27.4 49.6 M31 50.4 L32 53.2 M37 52.6 L37.6 55 M43 52.6 L42.4 55 M49 50.4 L48 53.2 M54 46 L52.6 49.6" stroke={PORTAL.BEARD} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30.6 35.4 Q35.6 33 40 35 Q44.4 33 49.4 35.4 Q45 37.4 40 36.8 Q35 37.4 30.6 35.4 Z" fill={PORTAL.BEARD} />
      <ellipse cx="40" cy="30.6" rx="4.4" ry="2.9" fill={INK} />
      <ellipse cx="38.6" cy="29.6" rx="1.4" ry="0.8" fill={PORTAL.WHITE} opacity="0.7" />

      <g className={sprite.grin}>
        <path d="M28.6 37.6 Q40 47.6 51.4 37.6 Q49.6 45.4 40 46.8 Q30.4 45.4 28.6 37.6 Z" fill={PORTAL.MOUTH} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M30 38.8 Q40 45.6 50 38.8 L49 41.4 Q40 46.6 31 41.4 Z" fill={PORTAL.TOOTH} />
        <path d="M35 42.6 V44.6 M40 43.6 V45.6 M45 42.6 V44.6" stroke={PORTAL.MUTED} strokeWidth="0.5" />
        <ellipse cx="40" cy="45.2" rx="3.2" ry="1.2" fill={PORTAL.FRUIT_RED} />
      </g>

      {OUTFIT[profession].headwear}
    </g>
  )
}

interface BandicootProps {
  profession: Profession
  pose?: BandicootPose
  className?: string
}

export function Bandicoot({ profession, pose = 'idle', className = '' }: BandicootProps) {
  const outfit = OUTFIT[profession]

  return (
    <svg viewBox="0 -12 80 124" className={`${sprite.sprite} ${sprite[pose] ?? ''} ${sprite[profession] ?? ''} ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx="40" cy="110" rx="22" ry="3" fill={INK} opacity="0.35" className={sprite.shadow} />
      <g className={sprite.whole}>
        <g className={sprite.prop}>{outfit.prop}</g>
        <g className={sprite.legLeft}>
          {outfit.legs('left')}
          {outfit.feet('left')}
        </g>
        <g className={sprite.legRight}>
          {outfit.legs('right')}
          {outfit.feet('right')}
        </g>
        <g className={sprite.body}>
          <path d="M30 47 C27.6 54 27.6 62 29 69 H51 C52.4 62 52.4 54 50 47 Z" fill="url(#npb-fur)" stroke={LINE} strokeWidth="1.1" />
          <ellipse cx="40" cy="58" rx="6.4" ry="8" fill={PORTAL.FUR_LIT} opacity="0.4" />
          <path d="M36 64 Q40 66 44 64" fill="none" stroke={LINE} strokeWidth="0.8" />
          {WAIST[profession]}
        </g>
        <g className={sprite.armLeft}>
          {outfit.arm('left')}
          {outfit.hand('left')}
        </g>
        <g className={sprite.armRight}>
          {outfit.arm('right')}
          {outfit.hand('right')}
        </g>
        <Head profession={profession} />
      </g>
      <g className={sprite.tornado} aria-hidden="true">
        <path d="M14 20 Q40 6 66 20 M10 48 Q40 34 70 48 M14 76 Q40 62 66 76 M20 100 Q40 90 60 100" fill="none" stroke={PORTAL.WHITE} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M12 34 Q40 22 68 34 M12 62 Q40 50 68 62 M16 88 Q40 78 64 88" fill="none" stroke={PORTAL.FUR_LIT} strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  )
}
