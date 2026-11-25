import { useId } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { DECO_COLORS as C } from './palette'
import s from './sprite.module.css'

// Him as this world's own figure, the one passenger who came up out of the sea: a passenger's white shirt
// with the sleeves rolled to the elbow, an open collar, dark braces, dark slacks and brown shoes. Drawn the
// way the genre paints its people: soft gradient fills lit from above by a cold sea light, a warm brass rim
// on the lit edge and a thin sepia line, never a hard cartoon outline. Realistic proportions (about seven
// heads tall).
//
// His traits come from HERO_IDENTITY: his brown skin, short dark hair, full dark beard and dark oval eyes.
//
// Per profession: the System Engineer in the shirt and braces; the Musician in the shirt under a dark
// waistcoat with a bow tie and a drumstick in each hand; the Martial Artist bare chested in gold Muay Thai
// shorts with the maroon band, red prajioud on the arms, wrapped hands and his own mongkhon round the head.
//
// The parts are groups that turn round their own joints (the origins in sprite.module.css): a scene poses
// them from its playhead on the shared rig (pose.ts) and shows the things his actions need, each at rest
// hidden: the spark coil he straps over his forearm and its sparks, the plate camera, its flash and the study
// card it gives, the radio handset, a coin, and the sticks for anyone sitting at a kit. Transform and opacity
// only.

// The shirt and braces rest with the arms hanging, the rig's own stand, so the System Engineer has no kit class.
const KIT_CLASS: Record<Profession, string> = {
  engineer: '',
  drummer: s.kitSticks,
  fighter: s.kitGuard,
}

const LINE = C.sepia

interface Ids {
  skin: string
  shirt: string
  copper: string
}

function Painted({ d, fill, className }: { d: string; fill: string; className?: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={0.9} strokeLinejoin="round" className={className} />
}

// ---- shapes (viewBox 120 by 180, facing right, feet on y 172) ----

const VIEW = { width: 120, height: 180 }
const SOLES_Y = 172

/** The share of his drawn height that sits under his soles, so a scene can drop the drawing by it and stand
 * the soles on its box bottom. */
export const SOLE_DROP = (VIEW.height - SOLES_Y) / VIEW.height

const HEAD = 'M51 28 Q51 15 62 15 Q74 15 74.5 28 L74.5 34 Q73 41 66 44 L58 44 Q51 40 51 34 Z'
const HAIR = 'M50 29 Q48 12 62 12.5 Q76 13 75.5 26 Q71 19.5 63 19.5 Q56 20 53.5 30 Z'
const BEARD = 'M51.5 31 Q52.5 44 59 48.5 Q66 51 71.5 46.5 Q75.5 41.5 75 32 Q72 36.5 68 36.5 Q63 37.5 58 34.5 Q55 33 53 31 Z'
const NECK = 'M57 41 L67 41 L67.5 51 L56.5 51 Z'
const SHIRT = 'M45 51 Q61 45.5 79 51 L80.5 90 Q62 93.5 43.5 90 Z'
const SHIRT_SHADE = 'M45 51 Q50 49.5 54 48.6 Q49 70 52 92 L43.5 90 Z'
// The open collar's two points and the placket down the front with its buttons.
const COLLAR = 'M55 48.5 L61 55 L58 57 L53.5 50 Z M69 48.5 L63 55 L66 57 L70.5 50 Z'
const PLACKET = 'M62 55 V89'
const BUTTONS = [62, 70, 78, 86]
// The braces from the shoulders to the waistband, and the Musician's waistcoat with its V.
const BRACES = 'M52.5 50 L54.5 88 M71.5 50 L69.5 88'
const WAISTCOAT = 'M45 53 Q50 51 55 50.5 L62 70 L69 50.5 Q74 51 79 53 L80 89 Q62 92 44 89 Z'
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
// The shirt sleeve rolled up over the elbow, a fat cuff of folded cloth.
const ROLL = {
  back: 'M44 72 L54 72.5 L53.8 79 Q49 80.5 44.6 79 Z',
  front: 'M68.8 72.5 L78.5 72 L78.2 79 Q73.5 80.5 69.4 79 Z',
}

const HAND_X = { back: 49.5, front: 73.8 }
const HAND_Y = 99

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
      <g>
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
      <Painted d={SHIRT} fill={`url(#${ids.shirt})`} />
      <path d={SHIRT_SHADE} fill={C.shirtShade} opacity={0.45} />
      <path d={PLACKET} stroke={C.shirtShade} strokeWidth={0.9} />
      {BUTTONS.map((y) => (
        <circle key={y} cx={63.4} cy={y} r={0.75} fill={C.shirtShade} />
      ))}
      {profession === 'drummer' ? (
        <>
          <Painted d={WAISTCOAT} fill={C.waistcoat} />
          <path d="M57.5 50 L62 53 L66.5 50 L66.5 55.5 L62 53 L57.5 55.5 Z" fill={C.blood} stroke={LINE} strokeWidth={0.6} />
          {[74, 80, 86].map((y) => (
            <circle key={y} cx={62.6} cy={y} r={0.9} fill={C.gold} />
          ))}
        </>
      ) : (
        <>
          <path d={BRACES} stroke={C.braces} strokeWidth={2.6} strokeLinecap="round" />
          <path d={COLLAR} fill={C.shirt} stroke={LINE} strokeWidth={0.6} />
        </>
      )}
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

  return <Painted d={SLACKS} fill={C.slacks} />
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

function Stick({ x }: { x: number }) {
  return <path className={s.sticks} d={`M${x} ${HAND_Y} L${x + 18} ${HAND_Y - 11}`} stroke={C.goldBright} strokeWidth={1.8} strokeLinecap="round" />
}

function Hand({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: Ids }) {
  const x = HAND_X[side]
  // The Muay Thai wrap makes the fist larger and ivory; a bare fist takes the skin's light.
  const fist = profession === 'fighter' ? { rx: 4.4, ry: 4.2, fill: C.ivory } : { rx: 3.6, ry: 3.8, fill: `url(#${ids.skin})` }

  return (
    <g>
      <Stick x={x} />
      <ellipse cx={x} cy={HAND_Y} {...fist} stroke={LINE} strokeWidth={0.9} />
    </g>
  )
}

function Arm({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: Ids }) {
  const bare = profession === 'fighter'
  const upperClass = side === 'back' ? s.armBack : s.armFront
  const foreClass = side === 'back' ? s.foreBack : s.foreFront
  const front = side === 'front'

  return (
    <g className={upperClass}>
      <Painted d={UPPER_ARM[side]} fill={bare ? `url(#${ids.skin})` : `url(#${ids.shirt})`} />
      {bare && <path d={side === 'back' ? 'M44 60 L54.5 61' : 'M68 61 L78.5 60'} stroke={C.blood} strokeWidth={3} strokeLinecap="round" />}
      <g className={foreClass}>
        <Painted d={FOREARM[side]} fill={`url(#${ids.skin})`} />
        {bare && <path d={side === 'back' ? 'M45.5 90 L52.5 90 M45.5 93 L52.5 93' : 'M70 90 L77 90 M70 93 L77 93'} stroke={C.ivory} strokeWidth={2} />}
        {front && <Coil ids={ids} />}
        <Hand side={side} profession={profession} ids={ids} />
        {front && (
          <>
            <Sparks />
            <Coin />
            <StudyCard />
            <Handset />
            <PlateCamera />
          </>
        )}
      </g>
      {!bare && <Painted d={ROLL[side]} fill={`url(#${ids.shirt})`} />}
    </g>
  )
}

// ---- the action props ----

// The spark coil taken off a dead machine and strapped over his forearm: a brass bracer, copper windings
// and a small glass bulb, buckled on with two straps.
function Coil({ ids }: { ids: Ids }) {
  return (
    <g className={s.coil}>
      <rect x={68.6} y={80} width={10.2} height={12} rx={1.6} fill={`url(#${ids.copper})`} stroke={LINE} strokeWidth={0.8} />
      <path d="M69 82.5 L78.4 81.5 M69 85 L78.4 84 M69 87.5 L78.4 86.5 M69 90 L78.4 89" stroke={C.copperDark} strokeWidth={0.8} />
      <path d="M68.4 80.6 H79 M68.4 91.4 H79" stroke={C.shoe} strokeWidth={1.4} />
      <circle cx={79.6} cy={86} r={1.8} fill={C.bolt} stroke={LINE} strokeWidth={0.5} />
    </g>
  )
}

// The coil's sparks crawling over his fingers.
function Sparks() {
  return (
    <g className={s.sparks} fill="none" stroke={C.bolt} strokeWidth={0.9} strokeLinecap="round">
      <path d="M70 98 L67 101 L69 103 L66 106" />
      <path d="M77 97 L80 100 L78 102 L81 105" />
      <path d="M73 102 L73 106 L75 108" stroke={C.boltCore} />
      <path d="M80 86 L83 84 L82 88 L85 87" />
    </g>
  )
}

// A coin between his fingers, fed to a machine.
function Coin() {
  return <circle className={s.coin} cx={76.4} cy={102.5} r={2.4} fill={C.goldBright} stroke={C.brassDark} strokeWidth={0.6} />
}

// The study card the camera gives, filled in: cream, ruled, a sketch of what he studied in its corner.
function StudyCard() {
  return (
    <g className={s.card}>
      <rect x={72} y={98} width={14} height={10} fill={C.cream} stroke={LINE} strokeWidth={0.6} />
      <path d="M74 101 H80 M74 103.5 H84 M74 106 H82" stroke={C.sepia} strokeWidth={0.5} />
      <circle cx={83} cy={100.6} r={1.4} fill={C.blood} />
    </g>
  )
}

// The radio's handset at his ear, drawn turned with the forearm's raised angle undone (about 185 degrees
// round the hand) so it lies along his jaw.
function Handset() {
  return (
    <g className={s.handset} transform={`rotate(185 ${HAND_X.front} ${HAND_Y})`}>
      <path d="M70 84 Q73.5 82 77 84 L77 99 Q73.5 101 70 99 Z" fill={C.abyss} stroke={LINE} strokeWidth={0.7} />
      <rect x={68.5} y={82} width={10} height={5} rx={2} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth={0.6} />
      <rect x={68.5} y={96} width={10} height={5} rx={2} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth={0.6} />
    </g>
  )
}

// The plate camera held up to his eye: a wooden box, its folded bellows and the lens to the right, and the
// flash pan over it. Drawn turned like the handset, so it stands upright by his face.
function PlateCamera() {
  return (
    <g className={s.camera} transform={`rotate(185 ${HAND_X.front} ${HAND_Y})`}>
      <rect x={64} y={87} width={12} height={12} rx={1} fill={C.cabinetTop} stroke={LINE} strokeWidth={0.8} />
      <path d="M76 88.5 L82 90 L82 96 L76 97.5 Z" fill={C.sepia} stroke={LINE} strokeWidth={0.6} />
      <path d="M78 89 V97 M80 89.5 V96.5" stroke={C.cabinetMid} strokeWidth={0.6} />
      <circle cx={83.5} cy={93} r={2.6} fill={C.steelShade} stroke={C.brassMid} strokeWidth={0.8} />
      <path d="M66 87 V82 M64 82 H74" stroke={C.brassMid} strokeWidth={1.2} />
      <g className={s.flash}>
        <circle cx={69} cy={80} r={9} fill={C.boltCore} opacity={0.85} />
        <circle cx={69} cy={80} r={18} fill={C.ivory} opacity={0.35} />
      </g>
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
      <linearGradient id={ids.shirt} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.ivory} />
        <stop offset="0.5" stopColor={C.shirt} />
        <stop offset="1" stopColor={C.shirtShade} />
      </linearGradient>
      <linearGradient id={ids.copper} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.copperDark} />
        <stop offset="0.5" stopColor={C.copper} />
        <stop offset="1" stopColor={C.copperDark} />
      </linearGradient>
    </defs>
  )
}

function useIds(): Ids {
  const base = useId().replace(/:/g, '')
  return { skin: `${base}skin`, shirt: `${base}shirt`, copper: `${base}copper` }
}

interface SpriteProps {
  profession: Profession
  /** Its size where it is drawn inside another SVG (the theatre's canvas). */
  box?: { width: number; height: number }
  className?: string
}

/** Him as the passenger who came up out of the sea, standing in a profession's kit; a scene poses his
 *  groups from its playhead (pose.ts). */
export function SurvivorSprite({ profession, box, className = '' }: SpriteProps) {
  const ids = useIds()

  return (
    <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} {...box} className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <Gradients ids={ids} />
      <g className={`${s.sprite} ${KIT_CLASS[profession]}`}>
        <ellipse className={s.shadow} cx={62} cy={172.5} rx={26} ry={3.4} fill={C.abyss} fillOpacity={0.5} />
        <g className={s.body}>
          <Arm side="back" profession={profession} ids={ids} />
          <Leg side="back" profession={profession} />
          <Leg side="front" profession={profession} />
          <Waist profession={profession} />
          <g>
            <path d={NECK} fill={HERO_IDENTITY.skinShade} />
            <Torso profession={profession} ids={ids} />
            <Head profession={profession} ids={ids} />
          </g>
          <Arm side="front" profession={profession} ids={ids} />
        </g>
      </g>
    </svg>
  )
}
