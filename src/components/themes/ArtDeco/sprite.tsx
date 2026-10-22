import { useId, type AnimationEvent } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { DECO_COLORS as C } from './palette'
import s from './sprite.module.css'

// Him as this world's own figure, a parody of the plane crash survivor of the undersea city (BioShock's
// Jack): the 1960 charcoal cable knit sweater with the ribbed crew neck, cuffs and hem, dark slacks, brown
// shoes, the steel pipe wrench in the right hand and the left hand rewired by the electric plasmid, its
// veins glowing blue under the skin with sparks crawling over the fingers. Drawn the way that game paints
// its people: soft gradient fills lit from above by a cold sea light, a warm brass rim on the lit edge and
// a thin sepia line, never a hard cartoon outline. Realistic proportions (about seven heads tall).
//
// His traits come from HERO_IDENTITY: his brown skin, short dark hair, full dark beard and dark oval eyes.
//
// Per profession: the System Engineer in the sweater, whose action is the electric bolt thrown from the
// plasmid hand (the zap that rewires a machine in that game); the Musician in the sweater with a bow
// tie, a brass deco snare slung at the waist, a drumstick in each hand and the plasmid hand's stick
// sparking on every hit; the Martial Artist bare chested in gold Muay Thai shorts with the maroon band,
// red prajioud on the arms, wrapped hands and his own mongkhon round the head, whose action is the knee
// then the round kick, the plasmid veins still lit.
//
// Every one can idle (breath, blink, the wrench tapping), walk, swing the wrench, zap, hold an audio diary
// up by his face and listen (a held pose that loops while the tape runs), and come back
// through the revival chamber: a column of light, the body knitting together from the feet up. The parts
// are groups sprite.module.css turns round their own joints (transform and opacity only). A one shot
// motion runs a clock animation on the root group and reports its end through onDone.

export type DecoMotion = 'still' | 'idle' | 'walk' | 'swing' | 'zap' | 'drum' | 'strike' | 'revive' | 'listen' | 'pull'

/** The one shot motions; the rest loop. */
export const ONE_SHOT: ReadonlySet<DecoMotion> = new Set(['swing', 'zap', 'drum', 'strike', 'revive', 'pull'])

/** Each profession's action, the way the survivor would do that job. */
export const PROFESSION_ACTION: Record<Profession, DecoMotion> = {
  engineer: 'zap',
  drummer: 'drum',
  fighter: 'strike',
}

const MOTION_CLASS: Record<DecoMotion, string> = {
  still: '',
  idle: s.idle,
  walk: s.walk,
  swing: s.swing,
  zap: s.zap,
  drum: s.drum,
  strike: s.strike,
  revive: s.revive,
  listen: s.listen,
  pull: s.pull,
}

const KIT_CLASS: Record<Profession, string> = {
  engineer: s.kitWrench,
  drummer: s.kitSticks,
  fighter: s.kitGuard,
}

const LINE = C.sepia

interface Ids {
  skin: string
  knit: string
  steel: string
  glow: string
}

function Painted({ d, fill, className }: { d: string; fill: string; className?: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={0.9} strokeLinejoin="round" className={className} />
}

// ---- shapes (viewBox 120 by 180, facing right, feet on y 172) ----

const HEAD = 'M51 28 Q51 15 62 15 Q74 15 74.5 28 L74.5 34 Q73 41 66 44 L58 44 Q51 40 51 34 Z'
const HAIR = 'M50 29 Q48 12 62 12.5 Q76 13 75.5 26 Q71 19.5 63 19.5 Q56 20 53.5 30 Z'
const BEARD = 'M51.5 31 Q52.5 44 59 48.5 Q66 51 71.5 46.5 Q75.5 41.5 75 32 Q72 36.5 68 36.5 Q63 37.5 58 34.5 Q55 33 53 31 Z'
const NECK = 'M57 41 L67 41 L67.5 51 L56.5 51 Z'
const SWEATER = 'M45 51 Q61 45.5 79 51 L80.5 90 Q62 93.5 43.5 90 Z'
const SWEATER_SHADE = 'M45 51 Q50 49.5 54 48.6 Q49 70 52 92 L43.5 90 Z'
const CABLES = 'M53 56 q3 4 0 8 q-3 4 0 8 q3 4 0 8 M62 55 q3 4 0 8 q-3 4 0 8 q3 4 0 8 M71 55 q3 4 0 8 q-3 4 0 8 q3 4 0 8'
const RIB_HEM = 'M44 86 Q62 89.5 80.5 86'
const CHEST = 'M45 51 Q61 46 79 51 L79.5 88 Q62 91 44.5 88 Z'
const CHEST_LINES = 'M51 64 Q57 68 62 64 Q67 68 74 64 M62 70 V86 M55 76 Q62 78 69 76'
const SLACKS = 'M44 88 L80 88 L80 99 L44 99 Z'
const SHORTS = 'M43 86 L81 86 L82 108 L64 108 L62 100 L60 108 L42 108 Z'

const THIGH = {
  back: 'M46 96 L61 96 L60 133 L49 133 Z',
  front: 'M62 96 L78 96 L75 133 L63 133 Z',
}
const SHIN = {
  back: 'M49 131 L60 131 L59 166 L50 166 Z',
  front: 'M63 131 L75 131 L73.5 166 L64 166 Z',
}
const SHOE = {
  back: 'M48.5 164 L60.5 164 Q67 166 67 172 L48.5 172 Z',
  front: 'M62.5 164 L75 164 Q81.5 166 81.5 172 L62.5 172 Z',
}
const FOOT = {
  back: 'M50 164 L59 164 Q64 167 64 171 L50 171 Z',
  front: 'M64.5 164 L73 164 Q78.5 167 78.5 171 L64.5 171 Z',
}

const UPPER_ARM = {
  back: 'M43.5 51 L54.5 52 L53.5 77 L45 77 Z',
  front: 'M67.5 52 L78.5 51 L78 77 L69.5 77 Z',
}
const FOREARM = {
  back: 'M45 75 L53.5 75 L52.5 96 L46 96 Z',
  front: 'M69.5 75 L78 75 L77 96 L70.5 96 Z',
}
// The sweater sleeve pushed up the plasmid forearm so the veins show.
const PUSHED_SLEEVE = 'M69 74.5 L78.5 74.5 L78 82 Q73.5 84 69.5 82 Z'
const VEINS = 'M72 84 L73.5 89 L72.5 93 M75 85 L74 90 L75.5 95 M73.5 89 L75.5 91'
const CUFF = { back: 'M45 92.5 L53 92.5', front: 'M70 92.5 L77.5 92.5' }

const HAND_X = { back: 49.5, front: 73.8 }

// ---- the parts ----

function Head({ profession, ids }: { profession: Profession; ids: Ids }) {
  return (
    <g className={s.head}>
      <Painted d={HEAD} fill={`url(#${ids.skin})`} />
      <ellipse cx={54.5} cy={30} rx={2.4} ry={3.6} fill={HERO_IDENTITY.skinShade} />
      <Painted d={HAIR} fill={HERO_IDENTITY.hair} />
      <Painted d={BEARD} fill={HERO_IDENTITY.beard} />
      <path d="M64 41 Q68 42.5 71.5 40.5" stroke={C.sepia} strokeWidth={0.9} fill="none" />
      <path d="M74 25.5 Q77 30.5 74.5 32.5" fill={HERO_IDENTITY.skinShade} />
      <path d="M64.5 24.5 L71 23.6 M73 23.8 L75 24.4" stroke={HERO_IDENTITY.hair} strokeWidth={1.3} strokeLinecap="round" />
      <g className={s.eyes}>
        <ellipse cx={68.2} cy={28.2} rx={1.5} ry={2} fill={HERO_IDENTITY.eyes} />
        <ellipse cx={73.6} cy={28.4} rx={0.9} ry={1.8} fill={HERO_IDENTITY.eyes} />
        <circle cx={68.6} cy={27.6} r={0.45} fill={C.ivory} />
      </g>
      {profession === 'fighter' && <Mongkhon />}
    </g>
  )
}

// His mongkhon: a braided maroon ring round the head with the gold binding and the tail rising behind.
function Mongkhon() {
  return (
    <g>
      <path d="M50 22.5 Q62 17.5 75.5 21.5" fill="none" stroke={C.blood} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M51 22 Q62 17 75 21" fill="none" stroke={C.gold} strokeWidth={0.8} strokeDasharray="2 2" />
      <path d="M51 22 Q42 14 44 4 Q47 12 53 19" fill={C.blood} stroke={LINE} strokeWidth={0.8} />
      <rect x={46} y={9} width={3.2} height={2.4} fill={C.gold} transform="rotate(-25 47.6 10.2)" />
    </g>
  )
}

function Torso({ profession, ids }: { profession: Profession; ids: Ids }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Painted d={CHEST} fill={`url(#${ids.skin})`} />
        <path d={CHEST_LINES} fill="none" stroke={HERO_IDENTITY.skinShade} strokeWidth={0.9} />
      </g>
    )
  }

  return (
    <g>
      <Painted d={SWEATER} fill={`url(#${ids.knit})`} />
      <path d={SWEATER_SHADE} fill={C.knitShade} opacity={0.55} />
      <path d={CABLES} fill="none" stroke={C.knitLight} strokeWidth={1.4} opacity={0.75} />
      <path d={RIB_HEM} fill="none" stroke={C.knitShade} strokeWidth={3.2} />
      <path d="M54 49.5 Q62 55.5 70 49.5" fill="none" stroke={C.knitShade} strokeWidth={3} strokeLinecap="round" />
      {profession === 'drummer' && <path d="M58 50 L62 52.5 L66 50 L66 55 L62 52.5 L58 55 Z" fill={C.abyss} stroke={LINE} strokeWidth={0.6} />}
    </g>
  )
}

function Waist({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Painted d={SHORTS} fill={C.gold} />
        <path d="M43 86 L81 86 L81 91 L43 91 Z" fill={C.blood} />
        <path d="M46 102 L58 104 M66 104 L79 102" stroke={C.brassDark} strokeWidth={0.9} />
      </g>
    )
  }

  return (
    <g>
      <Painted d={SLACKS} fill={C.slacks} />
      <rect x={44} y={88} width={36} height={3} fill={C.shoe} />
      <rect x={60} y={88.2} width={4} height={2.6} fill={C.brassMid} />
    </g>
  )
}

function Leg({ side, profession }: { side: 'back' | 'front'; profession: Profession }) {
  const bare = profession === 'fighter'
  const thighClass = side === 'back' ? s.thighBack : s.thighFront
  const shinClass = side === 'back' ? s.shinBack : s.shinFront

  return (
    <g className={thighClass}>
      <Painted d={THIGH[side]} fill={bare ? HERO_IDENTITY.skin : C.slacks} />
      <g className={shinClass}>
        {bare ? (
          <>
            <Painted d={SHIN[side]} fill={HERO_IDENTITY.skin} />
            <Painted d={FOOT[side]} fill={HERO_IDENTITY.skinShade} />
          </>
        ) : (
          <>
            <Painted d={SHIN[side]} fill={C.slacks} />
            <Painted d={SHOE[side]} fill={C.shoe} />
          </>
        )}
      </g>
    </g>
  )
}

// The steel pipe wrench, gripped at the hand and hanging along the leg: the handle, the hook jaw and its
// knurled adjusting nut, a rust bloom where the jaw meets the handle.
function Wrench({ ids }: { ids: Ids }) {
  return (
    <g>
      <Painted d="M47.6 97 L51.4 97 L51.4 128 L47.6 128 Z" fill={`url(#${ids.steel})`} />
      <Painted d="M45 126 L53 126 L53 131 L58.5 131 L58.5 137 L50 137 L50 141 L45 141 Z" fill={`url(#${ids.steel})`} />
      <rect x={45.4} y={130.5} width={4.4} height={4} fill={C.rust} opacity={0.8} />
      <path d="M46 133 H50 M46 135 H50" stroke={C.steelShade} strokeWidth={0.6} />
    </g>
  )
}

function Stick({ x }: { x: number }) {
  return <path d={`M${x} 99 L${x + 18} 88`} stroke={C.goldBright} strokeWidth={1.8} strokeLinecap="round" />
}

function Sparks() {
  return (
    <g className={s.sparks} fill="none" stroke={C.bolt} strokeWidth={0.9} strokeLinecap="round">
      <path d="M70 98 L67 101 L69 103 L66 106" />
      <path d="M77 97 L80 100 L78 102 L81 105" />
      <path d="M73 102 L73 106 L75 108" stroke={C.boltCore} />
    </g>
  )
}

function Hand({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: Ids }) {
  const x = HAND_X[side]
  const wrapped = profession === 'fighter'

  return (
    <g>
      {side === 'back' && profession === 'engineer' && <Wrench ids={ids} />}
      {profession === 'drummer' && <Stick x={x} />}
      <ellipse cx={x} cy={99} rx={wrapped ? 4.4 : 3.6} ry={wrapped ? 4.2 : 3.8} fill={wrapped ? C.ivory : `url(#${ids.skin})`} stroke={LINE} strokeWidth={0.9} />
      {side === 'front' && <ellipse cx={x} cy={99} rx={7} ry={7} fill={`url(#${ids.glow})`} className={s.palmGlow} />}
    </g>
  )
}

function Arm({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: Ids }) {
  const bare = profession === 'fighter'
  const upperClass = side === 'back' ? s.armBack : s.armFront
  const foreClass = side === 'back' ? s.foreBack : s.foreFront
  const plasmid = side === 'front'

  return (
    <g className={upperClass}>
      <Painted d={UPPER_ARM[side]} fill={bare ? `url(#${ids.skin})` : `url(#${ids.knit})`} />
      {bare && <path d={side === 'back' ? 'M44 60 L54.5 61' : 'M68 61 L78.5 60'} stroke={C.blood} strokeWidth={3} strokeLinecap="round" />}
      <g className={foreClass}>
        <Painted d={FOREARM[side]} fill={bare || plasmid ? `url(#${ids.skin})` : `url(#${ids.knit})`} />
        {plasmid && !bare && <Painted d={PUSHED_SLEEVE} fill={C.knit} />}
        {plasmid && <path d={VEINS} fill="none" stroke={C.bolt} strokeWidth={0.9} strokeLinecap="round" className={s.veins} />}
        {!plasmid && !bare && <path d={CUFF[side]} stroke={C.knitShade} strokeWidth={2.6} />}
        {bare && <path d={side === 'back' ? 'M45.5 90 L52.5 90 M45.5 93 L52.5 93' : 'M70 90 L77 90 M70 93 L77 93'} stroke={C.ivory} strokeWidth={2} />}
        <Hand side={side} profession={profession} ids={ids} />
        {plasmid && <Sparks />}
        {plasmid && <Recorder />}
      </g>
    </g>
  )
}

// ---- the action props ----

// The audio diary in the plasmid hand, shown only while he listens. Drawn turned with the forearm's
// listening angle undone (about 185 degrees round the hand), so it stands upright by his face.
function Recorder() {
  return (
    <g className={s.recorder} transform="rotate(185 73.8 99)">
      <rect x={66} y={88} width={16} height={11} rx={1.5} fill={C.steel} stroke={LINE} strokeWidth={0.8} />
      <rect x={67.5} y={89.5} width={7} height={6} fill={C.bronze} />
      <circle cx={69.5} cy={92.5} r={1.4} fill={C.abyss} />
      <circle cx={72.8} cy={92.5} r={1.4} fill={C.abyss} />
      <path d="M76 90 V97 M78 90 V97 M80 90 V97" stroke={C.steelShade} strokeWidth={0.7} />
      <circle cx={68.5} cy={97.3} r={0.9} fill={C.spark} />
    </g>
  )
}

// The bolt thrown from the plasmid hand, forked, with the white core inside the blue.
function Bolt() {
  return (
    <g className={s.bolt} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M80 72 L92 66 L89 60 L104 54 L101 48 L118 40" stroke={C.bolt} strokeWidth={3.2} />
      <path d="M80 72 L92 66 L89 60 L104 54 L101 48 L118 40" stroke={C.boltCore} strokeWidth={1.2} />
      <path d="M92 66 L106 70 L104 76 L117 78" stroke={C.bolt} strokeWidth={1.8} />
    </g>
  )
}

// The wrench's swing: a pale arc of the head's path, there only in the swing's hit frames.
function SwingArc() {
  return <path className={s.arc} d="M30 40 Q64 0 108 52 Q104 92 84 120" fill="none" stroke={C.ivory} strokeWidth={3} strokeLinecap="round" opacity={0} />
}

// A brass deco snare at the waist: chevron lugs, the cream head, the gold rims.
function Snare() {
  return (
    <g>
      <path d="M78 98 L110 98 L108 114 L80 114 Z" fill={C.brassMid} stroke={LINE} strokeWidth={0.9} />
      <path d="M82 98 L86 114 M92 98 L94 106 L96 98 M102 98 L102 114" stroke={C.goldBright} strokeWidth={0.9} />
      <ellipse cx={94} cy={98} rx={16} ry={3.4} fill={C.cream} stroke={C.gold} strokeWidth={1.4} />
      <path d="M78 113 L44 92" stroke={C.shoe} strokeWidth={1.4} />
      <g className={s.hitSpark}>
        <path d="M90 92 L88 86 M96 91 L98 84 M93 92 V83" stroke={C.bolt} strokeWidth={1.1} strokeLinecap="round" />
      </g>
    </g>
  )
}

// The revival chamber's light: a column of sea glow with brass rings where he is put back together.
function Chamber() {
  return (
    <g className={s.chamber}>
      <rect x={34} y={0} width={56} height={172} fill={C.waterGlow} opacity={0.22} />
      <rect x={52} y={0} width={20} height={172} fill={C.boltCore} opacity={0.25} />
      <ellipse cx={62} cy={172} rx={30} ry={5} fill="none" stroke={C.gold} strokeWidth={1.6} />
      <ellipse cx={62} cy={10} rx={30} ry={5} fill="none" stroke={C.gold} strokeWidth={1.6} />
    </g>
  )
}

function Gradients({ ids }: { ids: Ids }) {
  return (
    <defs>
      {/* cold sea light from the upper left, a warm brass rim on the lit edge */}
      <linearGradient id={ids.skin} x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor={HERO_IDENTITY.skinShade} />
        <stop offset="0.5" stopColor={HERO_IDENTITY.skin} />
        <stop offset="0.92" stopColor={HERO_IDENTITY.skin} />
        <stop offset="1" stopColor={C.bronze} />
      </linearGradient>
      <linearGradient id={ids.knit} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.knitLight} />
        <stop offset="0.45" stopColor={C.knit} />
        <stop offset="1" stopColor={C.knitShade} />
      </linearGradient>
      <linearGradient id={ids.steel} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.steelShade} />
        <stop offset="0.5" stopColor={C.steel} />
        <stop offset="1" stopColor={C.steelShade} />
      </linearGradient>
      <radialGradient id={ids.glow}>
        <stop offset="0" stopColor={C.boltCore} stopOpacity={0.9} />
        <stop offset="0.5" stopColor={C.bolt} stopOpacity={0.5} />
        <stop offset="1" stopColor={C.bolt} stopOpacity={0} />
      </radialGradient>
    </defs>
  )
}

function useIds(): Ids {
  const base = useId().replace(/:/g, '')
  return { skin: `${base}skin`, knit: `${base}knit`, steel: `${base}steel`, glow: `${base}glow` }
}

interface SpriteProps {
  profession: Profession
  motion: DecoMotion
  /** Called when a one shot motion has played out. */
  onDone?: () => void
  className?: string
}

/** Him as the wrench and plasmid survivor of the undersea city, in a profession's kit, playing one motion. */
export function SurvivorSprite({ profession, motion, onDone, className = '' }: SpriteProps) {
  const ids = useIds()
  const finish = (event: AnimationEvent<SVGGElement>) => {
    if (event.target !== event.currentTarget || !ONE_SHOT.has(motion)) return
    onDone?.()
  }

  return (
    <svg viewBox="0 0 120 180" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <Gradients ids={ids} />
      <g className={`${s.sprite} ${KIT_CLASS[profession]} ${MOTION_CLASS[motion]}`} onAnimationEnd={finish}>
        <Chamber />
        <ellipse cx={62} cy={172.5} rx={26} ry={3.4} fill={C.abyss} opacity={0.5} />
        <g className={s.body}>
          <Arm side="back" profession={profession} ids={ids} />
          <Leg side="back" profession={profession} />
          <Leg side="front" profession={profession} />
          <Waist profession={profession} />
          <g className={s.chest}>
            <path d={NECK} fill={HERO_IDENTITY.skinShade} />
            <Torso profession={profession} ids={ids} />
            <Head profession={profession} ids={ids} />
          </g>
          {profession === 'drummer' && <Snare />}
          <Arm side="front" profession={profession} ids={ids} />
          <SwingArc />
        </g>
        <Bolt />
      </g>
    </svg>
  )
}
