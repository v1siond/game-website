import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { NOIR } from './palette'
import s from './detective.module.css'

// Him as this world's own figure, a parody of the 1947 city detective of the noir crime game (the pale
// pinched fedora with its wide dark band, the grey three piece suit with the single breasted jacket worn
// open over the waistcoat, the red tie, the pistol at his hip, the badge held up, the notebook that chimes
// on a clue), cut the way the heist world cuts everything: flat ink, paper and one red, no gradient, depth
// from hard shadow shapes and halftone dots, a sharp silhouette. The fedora's brim throws a hard shadow
// over his brow; under it his own face: brown skin, short dark hair at the temples, the full dark beard,
// dark oval eyes (HERO_IDENTITY).
//
// Per profession, the way that detective would:
// - System Engineer: the full suit; his action is the notebook scribble, the pencil working and a red
//   clue mark popping over the page.
// - Musician: jacket off, waistcoat and rolled sleeves, the tie loosened, the hat kept, sticks on a snare.
// - Martial Artist: hat and jacket off, a vest and braces, his own mongkhon on his head, red gloves and
//   white prajioud on the arms; the guard, then the jab.
// Every profession has the hat tip idle, a two step walk, the badge flash on a hover of the element
// that carries `badgeHost` and the interrogation lean on a hover of the one that carries `leanHost`.
//
// Parts are groups moved with transform only, each turning round its own joint (shoulder, elbow, hip),
// given in the 64 by 96 viewBox's units; detective.module.css picks the cycle from data-motion. The eyes
// stay at y 17.5, where the cut-in's eye strip crops them.

/** Class names a parent puts on itself so a hover over it plays the badge flash or the lean. */
export const DETECTIVE_HOST = { badge: s.badgeHost, lean: s.leanHost } as const

export type DetectiveMotion = 'still' | 'idle' | 'act' | 'walk'

const SKIN = HERO_IDENTITY.skin
const SHADE = HERO_IDENTITY.skinShade
const BEARD = HERO_IDENTITY.beard

interface Trousers {
  fill: string
  crease: string
}

interface Kit {
  // the torso, drawn over the legs and under the arms
  torso: (dots: string) => ReactNode
  // the upper sleeve, then the forearm (bare skin where the sleeves are rolled or off)
  sleeve: string
  forearm: string
  // what sits in the hands while he acts, and what he wears on his head
  backProp: ReactNode
  frontProp: ReactNode
  head: ReactNode
  trousers: Trousers
  hand: 'bare' | 'glove'
  band: boolean
}

// ---- head ----

// The pale fedora: a tapered crown pinched at the front with the centre dent, the wide dark band, the
// brim snapped down with its dark underside; the crown's shadow side cut hard like the face's.
const FEDORA = (
  <g className={s.hat}>
    <path d="M22.6 11 L24.4 3.6 Q28 1.4 32 2.6 Q36 1.4 39.6 3.6 L41.4 11 Z" fill={NOIR.fog} />
    <path d="M22.6 11 L24.4 3.6 Q26 2.4 27.6 2.2 L27.2 11 Z" fill={NOIR.ash} />
    <path d="M32 2.8 L32 6.6 M27.8 2.6 L29.4 7 M36.2 2.6 L34.6 7" fill="none" stroke={NOIR.ash} strokeWidth={0.8} />
    <path d="M23.4 7.2 L40.6 7.2 L41.4 11 L22.6 11 Z" fill={NOIR.ink} />
    <path d="M12.5 13.4 Q32 7.6 51.5 13.4 L49.5 14.8 Q32 10.6 14.5 14.8 Z" fill={NOIR.fog} />
    <path d="M12.5 13.4 Q14 14.4 14.5 14.8 Q32 10.6 49.5 14.8 L48.4 15.6 Q32 11.8 15.6 15.6 Z" fill={NOIR.ink} />
    <path d="M44 10.6 Q48 11.4 50.4 12.8" fill="none" stroke={NOIR.paper} strokeWidth={0.6} />
  </g>
)

const MONGKHON = (
  <g className={s.hat}>
    <path d="M22.5 14 Q23 6.5 32 6.5 Q41 6.5 41.5 14 Q37 11 32 11 Q27 11 22.5 14 Z" fill={BEARD} />
    <path d="M22 12 Q32 8 42 12 L42 14.4 Q32 10.4 22 14.4 Z" fill={NOIR.paper} stroke={NOIR.ink} strokeWidth={0.5} />
    <path d="M41 11.6 L47.5 5.6 L48.8 7 L42.6 13 Z" fill={NOIR.paper} stroke={NOIR.ink} strokeWidth={0.5} />
  </g>
)

function Head({ head, dots, hatShade }: { head: ReactNode; dots: string; hatShade: boolean }) {
  return (
    <g>
      <rect x={28} y={28} width={8} height={6} fill={SHADE} />
      <circle cx={22.6} cy={19} r={2.4} fill={SHADE} />
      <circle cx={41.4} cy={19} r={2.4} fill={SKIN} />
      <ellipse cx={32} cy={19} rx={9.5} ry={10.5} fill={SKIN} />
      {/* the lit side and the shadow side of the face, cut hard */}
      <path d="M32 8.5 Q22.5 9 22.5 19 Q23 26 27 29 L30 18 Z" fill={SHADE} />
      <path d="M22.4 12 L24.4 12 L24 18 L22.3 17 Z M41.6 12 L39.6 12 L40 18 L41.7 17 Z" fill={BEARD} />
      {hatShade && (
        <>
          <path d="M22.5 12 L41.5 12 Q40 16.4 32 15.4 Q24 16.4 22.5 12 Z" fill={SHADE} />
          <path d="M22.5 12 L41.5 12 Q40 16.4 32 15.4 Q24 16.4 22.5 12 Z" fill={dots} />
        </>
      )}
      <path d="M25.4 14.4 L30 15.3 M34 15.3 L38.6 14.4" stroke={NOIR.ink} strokeWidth={1.2} />
      <g className={s.eyes}>
        <ellipse cx={28} cy={17.5} rx={1.5} ry={2.1} fill={HERO_IDENTITY.eyes} />
        <ellipse cx={36} cy={17.5} rx={1.5} ry={2.1} fill={HERO_IDENTITY.eyes} />
      </g>
      <path d="M32 18 L33.8 22.6 L31.2 22.6 Z" fill={SHADE} />
      <path d="M22.5 19.5 Q23 27 27 31 Q32 34.5 37 31 Q41 27 41.5 19.5 Q40 24 37.5 24.6 Q32 22.8 26.5 24.6 Q24 24 22.5 19.5 Z" fill={BEARD} />
      <path d="M29.6 27 L34.4 27" stroke={SHADE} strokeWidth={1} />
      {head}
    </g>
  )
}

// ---- torsos ----

// The three piece: the grey single breasted jacket hangs open over the matching waistcoat, the white
// shirt and the red tie in the collar's V, long notched lapels rolling to the waist, the pistol's grip
// in its holster at the hip where the jacket swings open.
const SUIT = (dots: string) => (
  <>
    <path d="M18 34 Q32 29 46 34 L47 65 L17 65 Z" fill={NOIR.ash} />
    <path d="M18 34 Q24 31.5 28 31 L26.5 65 L17 65 Z" fill={NOIR.smoke} />
    <path d="M18 34 Q24 31.5 28 31 L26.5 65 L17 65 Z" fill={dots} />
    <path d="M28 31 L36 31 L38.6 50 L40.4 65 L23.6 65 L25.4 50 Z" fill={NOIR.coal} />
    <path d="M28 31 L32 42 L36 31 Z" fill={NOIR.paper} />
    <path d="M31 33 L33 33 L33.6 41 L32 42.6 L30.4 41 Z" fill={NOIR.red} />
    <path d="M27.4 42 L32 46.2 L36.6 42 L37.4 58 L32 61 L26.6 58 Z" fill={NOIR.smoke} />
    <circle cx={32} cy={48.6} r={0.7} fill={NOIR.fog} />
    <circle cx={32} cy={52.4} r={0.7} fill={NOIR.fog} />
    <circle cx={32} cy={56.2} r={0.7} fill={NOIR.fog} />
    <path d="M28 31 L25.4 33 L24.6 37.6 L27.6 39 L25.8 50 L27.4 42 Z M36 31 L38.6 33 L39.4 37.6 L36.4 39 L38.2 50 L36.6 42 Z" fill={NOIR.ash} stroke={NOIR.ink} strokeWidth={0.5} />
    <path d="M25.8 50 Q25 58 23.6 65 M38.2 50 Q39 58 40.4 65" fill="none" stroke={NOIR.ink} strokeWidth={0.6} />
    <path d="M39.4 39.4 L43.4 39" stroke={NOIR.ink} strokeWidth={0.6} />
    <path d="M38.8 57 L42.6 57 L42.2 64 L39.2 64 Z" fill={NOIR.ink} />
    <path d="M39.4 54.6 L42.2 54.2 L42.6 57.4 L39.6 57.6 Z" fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth={0.4} />
  </>
)

const WAISTCOAT = (dots: string) => (
  <>
    <path d="M19 34 Q32 29.5 45 34 L45 64 L19 64 Z" fill={NOIR.paper} />
    <path d="M19 34 Q22 32.4 25 31.8 L24 64 L19 64 Z" fill={dots} />
    <path d="M23 34 L32 44 L41 34 L43 62 L21 62 Z" fill={NOIR.ink} />
    <path d="M30.4 32 L33.6 32 L34.4 40 L32 42.4 L29.6 40 Z" fill={NOIR.red} transform="rotate(8 32 37)" />
    <circle cx={32} cy={50} r={0.8} fill={NOIR.paper} />
    <circle cx={32} cy={56} r={0.8} fill={NOIR.paper} />
  </>
)

const VEST = (dots: string) => (
  <>
    <path d="M20 34 Q32 30 44 34 L45 64 L19 64 Z" fill={NOIR.paper} />
    <path d="M20 34 Q23 32.4 26 31.8 L24.6 64 L19 64 Z" fill={dots} />
    <path d="M27 31.6 Q32 36 37 31.6" fill={SKIN} />
    <path d="M24 33 L26 64 M40 33 L38 64" stroke={NOIR.ink} strokeWidth={1.8} />
  </>
)

// ---- props ----

const NOTEBOOK = (
  <g className={s.notebook} transform="rotate(100 16 60)">
    <rect x={11} y={53} width={10} height={12} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth={0.8} />
    <path d="M12.6 56 H19 M12.6 58.4 H18 M12.6 60.8 H19.2" stroke={NOIR.ash} strokeWidth={0.6} />
    <path className={s.clue} d="M16 44 L17.2 47.4 L20.8 46.4 L18.4 49 L20.8 51.6 L17.2 50.6 L16 54 L14.8 50.6 L11.2 51.6 L13.6 49 L11.2 46.4 L14.8 47.4 Z" fill={NOIR.red} />
  </g>
)

const PENCIL = <path className={s.notebook} d="M48.6 59.4 L52.6 51.4 L53.8 52 L49.8 60 Z" fill={NOIR.paper} stroke={NOIR.ink} strokeWidth={0.4} />

const stick = (x: number, toX: number) => <path d={`M${x} 60 L${toX} 70`} stroke={NOIR.paper} strokeWidth={1.4} strokeLinecap="round" />

const SNARE = (
  <g>
    <rect x={23} y={64} width={18} height={7} fill={NOIR.red} />
    <ellipse cx={32} cy={64} rx={9} ry={2.2} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth={0.6} />
    <path d="M23 71 L41 71 M26 64 L26 71 M32 66 L32 71 M38 64 L38 71" stroke={NOIR.ink} strokeWidth={0.6} />
  </g>
)

const KITS: Record<Profession, Kit> = {
  engineer: { torso: SUIT, sleeve: NOIR.ash, forearm: NOIR.ash, backProp: NOTEBOOK, frontProp: PENCIL, head: FEDORA, trousers: { fill: NOIR.ash, crease: NOIR.smoke }, hand: 'bare', band: false },
  drummer: { torso: WAISTCOAT, sleeve: NOIR.paper, forearm: SKIN, backProp: stick(16, 22), frontProp: stick(48, 42), head: FEDORA, trousers: { fill: NOIR.ink, crease: NOIR.ash }, hand: 'bare', band: false },
  fighter: { torso: VEST, sleeve: SKIN, forearm: SKIN, backProp: null, frontProp: null, head: MONGKHON, trousers: { fill: NOIR.ink, crease: NOIR.ash }, hand: 'glove', band: true },
}

// ---- limbs ----

interface ArmProps {
  side: 'back' | 'front'
  kit: Kit
  dots: string
  extra?: ReactNode
}

// Back arm points mirrored round x 32: upper arm, forearm, hand.
const ARM = {
  front: { upper: 'M41.5 34.5 L46.5 35 L49 48.5 L44 49 Z', fore: 'M44 47.5 L49 47.5 L50.3 58 L45.7 58.5 Z', hand: [48, 60] },
  back: { upper: 'M22.5 34.5 L17.5 35 L15 48.5 L20 49 Z', fore: 'M20 47.5 L15 47.5 L13.7 58 L18.3 58.5 Z', hand: [16, 60] },
} as const

function Arm({ side, kit, dots, extra }: ArmProps) {
  const arm = ARM[side]
  const [hx, hy] = arm.hand
  const glove = kit.hand === 'glove'
  return (
    <g className={side === 'front' ? s.frontUpper : s.backUpper}>
      <path d={arm.upper} fill={kit.sleeve} stroke={NOIR.ink} strokeWidth={0.6} />
      {side === 'back' && <path d={arm.upper} fill={dots} />}
      {kit.band && <path d={side === 'front' ? 'M42.4 39 L47.6 39.4 L48 41.6 L42.8 41.4 Z' : 'M21.6 39 L16.4 39.4 L16 41.6 L21.2 41.4 Z'} fill={NOIR.paper} />}
      <g className={side === 'front' ? s.frontFore : s.backFore}>
        <path d={arm.fore} fill={kit.forearm} stroke={NOIR.ink} strokeWidth={0.6} />
        {side === 'front' ? kit.frontProp : kit.backProp}
        <circle cx={hx} cy={hy} r={glove ? 3.6 : 2.6} fill={glove ? NOIR.red : SKIN} stroke={NOIR.ink} strokeWidth={0.6} />
        {extra}
      </g>
    </g>
  )
}

// The badge, held up in the front hand on a hover: the city police shield under its spread wing crest,
// an ink star at its heart, its flash behind.
const BADGE = (
  <g className={s.badge} transform="rotate(80 48 60)">
    <path className={s.flash} d="M48 48 L50 55 L57 52 L52.4 58 L59 62 L51.6 62.4 L53 70 L48 64.6 L43 70 L44.4 62.4 L37 62 L43.6 58 L39 52 L46 55 Z" fill={NOIR.paper} />
    <path d="M43.6 55.4 Q46 53.8 48 55 Q50 53.8 52.4 55.4 L50.6 56.2 L45.4 56.2 Z" fill={NOIR.fog} stroke={NOIR.ink} strokeWidth={0.5} />
    <path d="M48 57.2 L48.8 59 L50.6 59 L49.2 60.2 L49.7 62 L48 60.9 L46.3 62 L46.8 60.2 L45.4 59 L47.2 59 Z" fill={NOIR.ink} />
  </g>
)

function Legs({ trousers }: { trousers: Trousers }) {
  return (
    <>
      <g className={s.backLeg}>
        <path d="M22 62 L31 62 L30 89 L23 89 Z" fill={trousers.fill} />
        <path d="M23 86.6 L30.1 86.6" stroke={trousers.crease} strokeWidth={0.5} />
        <path d="M21 88 L31 88 L32 92 L19.5 92 Q19.5 89 21 88 Z" fill={NOIR.ink} />
      </g>
      <g className={s.frontLeg}>
        <path d="M33 62 L42 62 L41 89 L34 89 Z" fill={trousers.fill} />
        <path d="M37.5 64 L37.5 88 M33.9 86.6 L41.1 86.6" stroke={trousers.crease} strokeWidth={0.5} />
        <path d="M33 88 L43 88 Q45 89 45 92 L32.5 92 Z" fill={NOIR.ink} />
        <path d="M38 89.4 L43 89.6" stroke={NOIR.fog} strokeWidth={0.5} />
      </g>
    </>
  )
}

interface DetectiveProps {
  profession: Profession
  motion?: DetectiveMotion
  className?: string
}

export function Detective({ profession, motion = 'idle', className = '' }: DetectiveProps) {
  const kit = KITS[profession]
  const dotsId = `noir-dots-${useId().replace(/:/g, '')}`
  const dots = `url(#${dotsId})`

  return (
    <svg viewBox="0 0 64 96" className={`overflow-visible ${className}`} data-motion={motion} data-kit={profession} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={dotsId} width={2} height={2} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={0.45} fill={NOIR.ash} />
        </pattern>
      </defs>
      <path d="M12 93 L52 93 L48 95 L16 95 Z" fill={NOIR.ink} />
      <g className={s.body}>
        <Legs trousers={kit.trousers} />
        <g className={s.breath}>{kit.torso(dots)}</g>
        {profession === 'drummer' && SNARE}
        <Arm side="back" kit={kit} dots={dots} />
        <Head head={kit.head} dots={dots} hatShade={profession !== 'fighter'} />
        <Arm side="front" kit={kit} dots={dots} extra={BADGE} />
      </g>
    </svg>
  )
}
