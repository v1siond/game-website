import { useId, useLayoutEffect, useRef, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import {
  BAKELITE,
  BRASS,
  CHROME,
  CREAM,
  OLIVE,
  OLIVE_DARK,
  PHOSPHOR,
  POSTER_INK,
  SHELTER_BLUE,
  SHELTER_BLUE_DARK,
  SHELTER_YELLOW,
  WARNING_RED,
} from './palette'
import { dwellerJoints, setDwellerPose, type DwellerPose } from './pose'
import d from './dweller.module.css'

// Him on a stage, side on and facing right, the way he acts in every scene: the shelter dweller drawn as the
// atomic age poster cartoon (a big round head on a small body, one thick ink line round every flat fill), in
// his own looks from HERO_IDENTITY (brown skin, short dark hair, the full beard, the dark eye) and the blue
// jumpsuit with the yellow collar, stripe and cuffs, the wrist computer strapped on his near forearm. The badge
// cards, the terminal's access screen and the wrist terminal's status tube show him side on too (DwellerSprite),
// the tube in its green line tone.
//
// Per profession: the System Engineer in the jumpsuit; the Musician in it with a stick in each fist; the
// Martial Artist with the suit rolled down to the waist, bare chested, his hands wrapped and his mongkhon on.
//
// One jointed rig in the 100 by 150 box (dweller.module.css): both shoulders on one point (52, 58), the
// elbows (52, 74), the hips side by side (49 and 55, 96), the knees (120), the whole of him round his feet,
// so a negative turn swings a limb forward, to the right, and nothing comes apart at a joint. His near side
// is the rig's right, the far its left, drawn behind him a shade darker. A scene poses him (pose.ts): the
// pistol and its flash in his near hand, the bobblehead and its bobbing head in it, the syringe in his far
// hand, the radio held at his chest and its dial.

/** His box: the viewBox's size and the y his soles stand on. */
export const DWELLER_VIEW = { width: 100, height: 150, soles: 144 } as const

const SKIN = HERO_IDENTITY.skin
const SKIN_SHADE = HERO_IDENTITY.skinShade
const HAIR = HERO_IDENTITY.hair
const EYE = HERO_IDENTITY.eyes
const LINE = { stroke: POSTER_INK, strokeWidth: 2, strokeLinejoin: 'round' as const }

function Shape({ d: path, fill }: { d: string; fill: string }) {
  return <path d={path} fill={fill} {...LINE} />
}

type Side = 'back' | 'front'

const CLASSES: Record<Side, { arm: string; fore: string; thigh: string; shin: string }> = {
  back: { arm: d.armBack, fore: d.foreBack, thigh: d.thighBack, shin: d.shinBack },
  front: { arm: d.armFront, fore: d.foreFront, thigh: d.thighFront, shin: d.shinFront },
}

// ---- the shapes, facing right, soles on y 144 ----

const HEAD = 'M31 30 Q31 9 52 9 Q73 9 73 30 Q73 49 52 51 Q31 49 31 30 Z'
const HAIR_CAP = 'M31.5 28 Q30 8 52 8 Q68 8 72 20 Q62 14 54 16 Q46 15 42 20 Q38 26 39 34 Q34 34 31.5 28 Z'
const BEARD = 'M44 36 Q44 50 56 52 Q70 50 73 36 Q70 41 66 41 Q60 38 54 41 Q48 41 44 36 Z'
const GRIN = 'M62 40.5 Q68 45 72.5 39.5 Q68 41.5 62 40.5 Z'
const NOSE = 'M72 28 Q78 31 72.5 34'

const TORSO = 'M41 52 Q52 47 62 52 L64 98 L40 98 Z'
const UPPER = 'M47 55 L57 55 L56 76 L48 76 Z'
const FORE = 'M48 72 L56 72 L55.5 89 L48.5 89 Z'
const HAND = { x: 52, y: 92 }

const HIP: Record<Side, number> = { back: 49, front: 55 }
const thigh = (x: number) => `M${x - 6} 94 L${x + 6} 94 L${x + 5} 121 L${x - 5} 121 Z`
const shin = (x: number) => `M${x - 5} 118 L${x + 5} 118 L${x + 4.5} 137 L${x - 4} 137 Z`
const boot = (x: number) => `M${x - 5} 135 L${x + 5} 135 Q${x + 13} 136.5 ${x + 13} 144 L${x - 5} 144 Z`

interface Kit {
  /** The suit's blue or his bare skin on the chest and the upper arms. */
  chest: string
  sleeve: string
  /** What the near and far hands hold besides the scene's props. */
  hand: (side: Side) => ReactNode
  /** Over the head: the mongkhon. */
  crown: ReactNode
}

// A drumstick in the fist, down the forearm's line past the hand.
const STICK = <path d="M52 92 L52 112" stroke={POSTER_INK} strokeWidth={3.2} strokeLinecap="round" />

const KIT: Record<Profession, Kit> = {
  engineer: { chest: SHELTER_BLUE, sleeve: SHELTER_BLUE, hand: () => null, crown: null },
  drummer: { chest: SHELTER_BLUE, sleeve: SHELTER_BLUE, hand: () => STICK, crown: null },
  fighter: {
    chest: SKIN,
    sleeve: SKIN,
    hand: () => null,
    crown: (
      <g>
        <path d="M33 21 Q52 9 71 19" fill="none" stroke={POSTER_INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M33 21 Q52 9 71 19" fill="none" stroke={WARNING_RED} strokeWidth={4} strokeLinecap="round" />
        <Shape d="M34 20 Q25 12 28 4 Q34 12 38 18 Z" fill={WARNING_RED} />
      </g>
    ),
  },
}

function Head({ crown }: { crown: ReactNode }) {
  return (
    <g>
      <Shape d={HEAD} fill={SKIN} />
      <Shape d={HAIR_CAP} fill={HAIR} />
      <Shape d={BEARD} fill={HAIR} />
      <Shape d={GRIN} fill={CREAM} />
      <path d={NOSE} fill={SKIN} {...LINE} />
      <ellipse cx={46} cy={31} rx={3.4} ry={4.4} fill={SKIN_SHADE} {...LINE} />
      <ellipse cx={64} cy={26} rx={2} ry={3.2} fill={EYE} />
      <path d="M60 20.5 L67 20" stroke={HAIR} strokeWidth={2.2} strokeLinecap="round" />
      {crown}
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={TORSO} fill={SKIN} />
        <path d="M58 62 Q63 66 63 70 M57 78 H63 M57 86 H63" fill="none" stroke={POSTER_INK} strokeWidth={1.2} />
        {/* the suit rolled down to the waist, its sleeves tied round it */}
        <Shape d="M39.5 86 L64.5 86 L64.5 98 L39.5 98 Z" fill={SHELTER_BLUE} />
        <Shape d="M58 88 L68 94 L65 97 L56 92 Z" fill={SHELTER_BLUE_DARK} />
      </g>
    )
  }
  return (
    <g>
      <Shape d={TORSO} fill={SHELTER_BLUE} />
      <path d="M59.5 56 L61.5 56 L62.5 86 L60.5 86 Z" fill={SHELTER_YELLOW} />
      <Shape d="M43 50 L60 50 L58 56 L45 56 Z" fill={SHELTER_YELLOW} />
      <Shape d="M40 86 L64 86 L64 91 L40 91 Z" fill={SHELTER_BLUE_DARK} />
      <Shape d="M58 85.5 L64.5 85.5 L64.5 91.5 L58 91.5 Z" fill={SHELTER_YELLOW} />
      <path d="M45 60 Q43 70 44.5 80" fill="none" stroke={CREAM} strokeWidth={1.4} opacity={0.5} strokeLinecap="round" />
    </g>
  )
}

function Leg({ side }: { side: Side }) {
  const x = HIP[side]
  const suit = side === 'back' ? SHELTER_BLUE_DARK : SHELTER_BLUE
  return (
    <g className={CLASSES[side].thigh}>
      <Shape d={thigh(x)} fill={suit} />
      <g className={CLASSES[side].shin}>
        <Shape d={shin(x)} fill={suit} />
        <Shape d={boot(x)} fill={BAKELITE} />
      </g>
    </g>
  )
}

// The wrist computer round the near forearm: the olive housing, the green screen and its pip, one dial.
function WristComputer() {
  return (
    <g>
      <Shape d="M46.5 76 L57.5 76 L57.5 87 L46.5 87 Z" fill={OLIVE} />
      <rect x={48.5} y={78} width={7} height={5.5} fill={PHOSPHOR} className={d.screen} />
      <rect x={48.5} y={78} width={7} height={5.5} fill={WARNING_RED} className={d.alarm} />
      <path d="M52 83 L52 79" stroke={POSTER_INK} strokeWidth={1} className={d.needle} />
      <circle cx={49.5} cy={85} r={1} fill={SHELTER_YELLOW} />
    </g>
  )
}

// The atomic age pistol in the near fist, along the forearm so it points wherever the forearm does: the grip
// in the fist, the chunky barrel with two cooling rings past it, the red emitter tip and the flash beyond.
function Pistol() {
  return (
    <g className={d.pistol}>
      <Shape d="M49 90 L55 90 L54.5 106 L49.5 106 Z" fill={OLIVE_DARK} />
      <path d="M49.3 96 H54.7 M49.4 100 H54.6" stroke={SHELTER_YELLOW} strokeWidth={1.4} />
      <Shape d="M49.8 106 L54.2 106 L53.5 110 L50.5 110 Z" fill={WARNING_RED} />
      <path className={d.flash} d="M52 110 L55 116 L60 114 L56.5 119 L61 123 L54.5 121.5 L52 128 L49.5 121.5 L43 123 L47.5 119 L44 114 L49 116 Z" fill={SHELTER_YELLOW} {...LINE} />
    </g>
  )
}

// The bobblehead he takes off its stand: a little cartoon figure on a round base, its big head on a spring.
export function Bobblehead({ headClass }: { headClass?: string }) {
  return (
    <g>
      <Shape d="M-7 0 L7 0 L6 -3 L-6 -3 Z" fill={SHELTER_YELLOW} />
      <Shape d="M-3 -3 L3 -3 L2.5 -10 L-2.5 -10 Z" fill={SHELTER_BLUE} />
      <g className={headClass}>
        <circle cx={0} cy={-15} r={6} fill={CREAM} {...LINE} />
        <path d="M-2 -14 Q0 -12 2 -14" fill="none" stroke={POSTER_INK} strokeWidth={0.9} />
      </g>
    </g>
  )
}

// The syringe in the far fist, its needle down: the glass with the red dose, the plunger up.
function Syringe() {
  return (
    <g className={d.syringe}>
      <Shape d="M50 84 L54 84 L54 98 L50 98 Z" fill={CHROME} />
      <rect x={50.8} y={90} width={2.4} height={7} fill={WARNING_RED} />
      <path d="M52 98 L52 104" stroke={POSTER_INK} strokeWidth={1} />
      <path d="M49 84 H55 M52 84 V80" stroke={POSTER_INK} strokeWidth={1.4} />
    </g>
  )
}

// The bakelite radio he holds at his chest on the bands stage: the arched red case, the cream grille, the dial
// window with its needle that the tuning turns.
function Radio() {
  return (
    <g className={d.radio}>
      <Shape d="M56 82 L56 68 Q56 60 66 60 Q76 60 76 68 L76 82 Z" fill={WARNING_RED} />
      <rect x={58.5} y={66} width={7} height={12} rx={1} fill={CREAM} {...LINE} strokeWidth={1} />
      <circle cx={70.5} cy={70} r={3.6} fill={CREAM} {...LINE} strokeWidth={1} />
      <path className={d.dial} d="M70.5 70 L70.5 67" stroke={POSTER_INK} strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={70.5} cy={78} r={2} fill={BRASS} />
    </g>
  )
}

function Arm({ side, profession, held }: { side: Side; profession: Profession; held?: ReactNode }) {
  const kit = KIT[profession]
  const near = side === 'front'
  const sleeve = near ? kit.sleeve : kit.sleeve === SKIN ? SKIN_SHADE : SHELTER_BLUE_DARK
  const wrapped = profession === 'fighter'
  return (
    <g className={CLASSES[side].arm}>
      <Shape d={UPPER} fill={sleeve} />
      <g className={CLASSES[side].fore}>
        <Shape d={FORE} fill={wrapped ? SKIN : sleeve} />
        {!wrapped && <path d="M48.3 87 L55.7 87" stroke={SHELTER_YELLOW} strokeWidth={3} />}
        {near && <WristComputer />}
        {kit.hand(side)}
        {near ? <Pistol /> : <Syringe />}
        <circle cx={HAND.x} cy={HAND.y} r={4.8} fill={wrapped ? CREAM : SKIN} {...LINE} />
        {held}
      </g>
    </g>
  )
}

/** His figure's groups in the 100 by 150 box, at rest; a stage places it and poses its joints (pose.ts). */
export function DwellerFigure({ profession }: { profession: Profession }) {
  const kit = KIT[profession]
  return (
    <g className={d.dweller}>
      <ellipse cx={52} cy={145} rx={20} ry={3} fill={POSTER_INK} opacity={0.35} />
      <g className={d.body}>
        <Arm side="back" profession={profession} />
        <Leg side="back" />
        <Leg side="front" />
        <Torso profession={profession} />
        <Head crown={kit.crown} />
        <Radio />
        <Arm
          side="front"
          profession={profession}
          held={
            <g className={d.held}>
              <g transform={`translate(${HAND.x} ${HAND.y - 3})`}>
                <Bobblehead headClass={d.heldHead} />
              </g>
            </g>
          }
        />
      </g>
    </g>
  )
}

export type DwellerTone = 'poster' | 'phosphor'

// The tube's green line tone: each colour's lightness turned over and drawn in the phosphor green, so the dark
// ink line glows brightest and the fills sit in darker greens on the glass, the way a green screen draws him.
const PHOSPHOR_MATRIX = [
  '-0.021 -0.0413 -0.0077 0 0.07',
  '-0.3 -0.59 -0.11 0 1',
  '-0.024 -0.0472 -0.0088 0 0.08',
  '0 0 0 1 0',
].join(' ')

/** Him standing in one pose on a card (the Muay Thai badges, the terminal's access screen, the wrist terminal's
 *  status tube): his figure in its own box, the pose written on its joints once it is on the page, the way a
 *  stage writes a frame. */
export function DwellerSprite({ profession, pose, tone = 'poster', className = '' }: { profession: Profession; pose: DwellerPose; tone?: DwellerTone; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const filter = `dweller-tone-${useId().replace(/:/g, '')}`
  useLayoutEffect(() => {
    if (ref.current) setDwellerPose(dwellerJoints(ref.current), pose)
  }, [pose])
  return (
    <svg ref={ref} viewBox={`0 0 ${DWELLER_VIEW.width} ${DWELLER_VIEW.height}`} className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      {tone === 'phosphor' && (
        <filter id={filter} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={PHOSPHOR_MATRIX} />
        </filter>
      )}
      <g filter={tone === 'phosphor' ? `url(#${filter})` : undefined}>
        <DwellerFigure profession={profession} />
      </g>
    </svg>
  )
}
