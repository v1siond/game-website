import type { ReactNode } from 'react'
import { MYTH } from './palette'

// The people of the journey, drawn in his figure's language (one ink line round painted shapes), each in a 60
// by 80 box with the feet on y 78, all our own: the young apprentice who walks it with him, facing right as
// he does; and facing left towards him, the pale stranger who feels no pain, a grave walker in rusted mail,
// the smith of the lake in her leather apron, and the old seer bound to a dead tree. Each comes in the
// frames its scenes show (data-frame), one shown at a time by a scene's writer.

const INK = MYTH.inkLine

function Inked({ d, fill, width = 2 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={width} strokeLinejoin="round" />
}

/** One frame of a figure, shown when it is the first. */
const Frame = ({ name, first, children }: { name: string; first: boolean; children: ReactNode }) => (
  <g data-frame={name} visibility={first ? undefined : 'hidden'}>
    {children}
  </g>
)

// ---- the apprentice: about twelve, a green wool hood and cloak, a sling at the belt ----

/** The apprentice's frames, in the order a scene may show them. */
export const YOUTH_FRAMES = ['stand', 'walk', 'reach', 'sling', 'crouch', 'sit', 'pull'] as const
export type YouthFrame = (typeof YOUTH_FRAMES)[number]

const HOOD = 'M22 14 Q30 4 40 12 L42 26 Q34 30 24 26 Z'
const FACE = 'M30 16 Q38 15 40 22 Q39 28 33 28 Q29 26 30 16 Z'
const CLOAK = 'M22 26 Q32 22 40 26 L44 56 Q32 60 18 56 Z'

/** The hooded head, the face turned right, and the cloak to the knee; `lean` tips it all forward. */
function YouthBody({ lean = 0 }: { lean?: number }) {
  return (
    <g transform={`rotate(${lean} 31 56)`}>
      <Inked d={CLOAK} fill={MYTH.hood} />
      <path d="M22 26 L26 56" stroke={MYTH.hoodShade} strokeWidth={3} />
      <Inked d={HOOD} fill={MYTH.hood} />
      <Inked d={FACE} fill={MYTH.youthSkin} width={1.4} />
      <circle cx={36} cy={21} r={1.2} fill={INK} />
      <path d="M26 44 L42 44" stroke={MYTH.leather} strokeWidth={3} />
      <path d="M24 46 Q22 54 26 58" fill="none" stroke={MYTH.leatherShade} strokeWidth={1.4} />
      <g data-fx="youth-pouch" opacity={0}>
        <path d="M30 26 L34 34" stroke={MYTH.leatherShade} strokeWidth={1.2} />
        <Inked d="M31 33 Q30 39 34 40 Q38 39 37 33 Z" fill={MYTH.leather} width={1.2} />
      </g>
    </g>
  )
}

const LEGS: Record<'stand' | 'walk' | 'crouch', string> = {
  stand: 'M26 56 L25 76 L30 76 L31 58 Z M34 56 L36 76 L41 76 L39 56 Z',
  walk: 'M26 56 L20 75 L25 77 L31 58 Z M34 56 L40 75 L45 75 L39 56 Z',
  crouch: 'M24 62 L18 70 L22 78 L30 66 Z M36 62 L42 70 L40 78 L46 76 L42 64 Z',
}

const ARM = (d: string) => <Inked d={d} fill={MYTH.hood} width={1.6} />
const HAND = (x: number, y: number) => <circle cx={x} cy={y} r={2.6} fill={MYTH.youthSkin} stroke={INK} strokeWidth={1.2} />

/** The stones of the sling, glowing once the light has lit them. */
const Stones = ({ x, y }: { x: number; y: number }) => (
  <g data-fx="youth-stones" opacity={0}>
    <circle cx={x} cy={y} r={6} fill={MYTH.lightHigh} opacity={0.6} />
    <circle cx={x} cy={y} r={2.6} fill={MYTH.fireCore} />
  </g>
)

export function Youth({ first = 'stand' }: { first?: YouthFrame }) {
  const frame = (name: YouthFrame, body: ReactNode) => (
    <Frame key={name} name={name} first={first === name}>
      {body}
    </Frame>
  )
  return (
    <>
      <ellipse cx={31} cy={78} rx={14} ry={2.4} fill={INK} opacity={0.4} />
      {frame('stand', <><Inked d={LEGS.stand} fill={MYTH.woolShade} /><YouthBody />{ARM('M38 28 L42 44 L38 45 L35 30 Z')}{HAND(40, 46)}</>)}
      {frame('walk', <><Inked d={LEGS.walk} fill={MYTH.woolShade} /><YouthBody lean={4} />{ARM('M38 28 L46 40 L43 43 L35 31 Z')}{HAND(45, 43)}</>)}
      {frame('reach', <><Inked d={LEGS.stand} fill={MYTH.woolShade} /><YouthBody lean={6} />{ARM('M38 28 L52 30 L52 34 L37 33 Z')}{HAND(54, 32)}</>)}
      {frame('sling', <><Inked d={LEGS.walk} fill={MYTH.woolShade} /><YouthBody lean={-4} />{ARM('M36 26 L42 6 L46 8 L40 28 Z')}{HAND(44, 6)}<path d="M44 6 Q58 -4 54 12" fill="none" stroke={MYTH.leatherShade} strokeWidth={1.4} /><Stones x={54} y={12} /></>)}
      {frame('crouch', <><Inked d={LEGS.crouch} fill={MYTH.woolShade} /><g transform="translate(0 8)"><YouthBody lean={14} /></g>{ARM('M40 38 L50 46 L47 49 L37 41 Z')}{HAND(50, 48)}</>)}
      {frame('sit', <><Inked d="M22 64 L44 64 L46 72 L20 72 Z" fill={MYTH.woolShade} /><g transform="translate(0 14) rotate(-16 31 56)"><YouthBody /></g><path d="M16 26 Q12 22 16 18" fill="none" stroke={MYTH.snow} strokeWidth={1.4} opacity={0.8} /></>)}
      {frame('pull', <><Inked d={LEGS.walk} fill={MYTH.woolShade} /><YouthBody lean={-12} />{ARM('M36 30 L54 34 L53 38 L35 34 Z')}{HAND(56, 36)}<Stones x={22} y={44} /></>)}
    </>
  )
}

// ---- the pale stranger: thin, grey skinned, barefoot in the snow, a hooded cloak; he smiles when struck ----

export const STRANGER_FRAMES = ['stand', 'knock', 'strike', 'fall', 'clinched', 'pained', 'down'] as const
export type StrangerFrame = (typeof STRANGER_FRAMES)[number]

const PALE = '#b8c0c4'
const PALE_SHADE = '#7f888c'
const CRACK = 'M26 32 L30 40 L27 46 M34 36 L32 44'

function StrangerBody({ lean = 0, cracked = false, face = 'smile' }: { lean?: number; cracked?: boolean; face?: 'smile' | 'pain' }) {
  return (
    <g transform={`rotate(${lean} 30 76)`}>
      <Inked d="M22 28 Q30 22 38 28 L40 58 L20 58 Z" fill="#3e4448" />
      <Inked d="M24 30 L36 30 L35 56 L25 56 Z" fill={PALE} />
      {cracked && <path d={CRACK} fill="none" stroke={MYTH.ember} strokeWidth={1.4} />}
      <Inked d="M22 8 Q30 0 38 8 L38 22 Q30 28 22 22 Z" fill="#3e4448" />
      <Inked d="M24 12 Q30 8 34 12 L34 22 Q28 26 24 22 Z" fill={PALE} />
      <circle cx={26} cy={16} r={1.2} fill={INK} />
      <path d={face === 'smile' ? 'M24 21 Q27 23 30 21' : 'M24 22 Q27 19 30 22'} fill="none" stroke={INK} strokeWidth={1.2} />
      <Inked d="M24 56 L22 76 L28 76 L29 58 Z M32 56 L34 76 L40 76 L36 56 Z" fill={PALE_SHADE} />
    </g>
  )
}

export function Stranger({ first = 'stand' }: { first?: StrangerFrame }) {
  const frame = (name: StrangerFrame, body: ReactNode) => (
    <Frame key={name} name={name} first={first === name}>
      {body}
    </Frame>
  )
  const arm = (d: string) => <Inked d={d} fill={PALE} width={1.6} />
  return (
    <>
      <ellipse cx={30} cy={78} rx={14} ry={2.4} fill={INK} opacity={0.4} />
      {frame('stand', <><StrangerBody />{arm('M24 30 L20 48 L24 49 L27 32 Z')}</>)}
      {frame('knock', <><StrangerBody lean={-4} />{arm('M24 30 L8 24 L8 28 L24 34 Z')}</>)}
      {frame('strike', <><StrangerBody lean={-10} />{arm('M24 30 L2 30 L2 35 L24 35 Z')}<circle cx={1} cy={32} r={3.4} fill={PALE} stroke={INK} strokeWidth={1.2} /></>)}
      {frame('fall', <g transform="rotate(40 30 76) translate(6 -8)"><StrangerBody />{arm('M24 30 L36 14 L40 16 L28 32 Z')}</g>)}
      {frame('clinched', <><StrangerBody lean={-14} cracked />{arm('M24 30 L12 40 L15 43 L27 34 Z')}</>)}
      {frame('pained', <><StrangerBody lean={8} cracked face="pain" />{arm('M28 30 L38 44 L35 46 L26 34 Z')}</>)}
      {frame('down', <g transform="translate(-6 40) rotate(-84 30 76)"><StrangerBody cracked face="pain" /></g>)}
    </>
  )
}

// ---- a grave walker: slow, stooped, in rusted mail, a notched blade hanging ----

export function Walker() {
  return (
    <>
      <ellipse cx={30} cy={78} rx={14} ry={2.4} fill={INK} opacity={0.4} />
      <Inked d="M24 56 L22 76 L28 76 L29 58 Z M33 56 L35 76 L41 76 L37 56 Z" fill="#4a4038" />
      <g transform="rotate(-10 30 60)">
        <Inked d="M20 26 Q30 20 40 26 L42 58 L18 58 Z" fill="#6a5a48" />
        <path d="M21 32 H41 M20 38 H42 M20 44 H42 M19 50 H42" stroke="#8a6a3a" strokeWidth={1.4} strokeDasharray="2 2" />
        <Inked d="M22 8 Q30 2 38 8 L38 22 Q30 28 22 22 Z" fill="#9aa28a" />
        <circle cx={26} cy={14} r={2.2} fill={MYTH.frost} />
        <Inked d="M20 8 Q30 -2 40 8 L38 12 Q30 6 22 12 Z" fill="#5a4a3a" />
      </g>
      <path d="M18 34 L8 62" stroke={INK} strokeWidth={4} />
      <path d="M18 34 L8 62" stroke={MYTH.steelShade} strokeWidth={2.2} />
    </>
  )
}

// ---- the smith: a broad old woman in a leather apron, her hammer up or down on the anvil ----

export function Smith({ first = 'up' }: { first?: 'up' | 'down' }) {
  return (
    <>
      <ellipse cx={30} cy={78} rx={16} ry={2.4} fill={INK} opacity={0.4} />
      <Inked d="M22 58 L20 76 L28 76 L29 60 Z M33 58 L35 76 L42 76 L38 58 Z" fill={MYTH.woolShade} />
      <Inked d="M16 28 Q30 20 44 28 L46 60 L14 60 Z" fill="#8a5a5a" />
      <Inked d="M20 32 L40 32 L42 66 L18 66 Z" fill={MYTH.leather} />
      <Inked d="M22 10 Q30 4 38 10 L38 24 Q30 30 22 24 Z" fill="#d8a888" />
      <Inked d="M20 12 Q30 0 40 12 Q36 8 30 9 Q24 9 20 14 Z" fill="#d8d0c4" />
      <path d="M36 20 L34 26" stroke={INK} strokeWidth={1} />
      <circle cx={25} cy={16} r={1.2} fill={INK} />
      {(['up', 'down'] as const).map((pose) => (
        <Frame key={pose} name={pose} first={first === pose}>
          {pose === 'up' ? (
            <>
              <Inked d="M18 30 L10 12 L14 10 L22 28 Z" fill="#8a5a5a" width={1.6} />
              <path d="M12 10 L4 -8" stroke={INK} strokeWidth={3.4} />
              <Inked d="M-4 -12 L10 -6 L8 0 L-6 -6 Z" fill={MYTH.iron} />
            </>
          ) : (
            <>
              <Inked d="M18 30 L6 42 L9 45 L22 34 Z" fill="#8a5a5a" width={1.6} />
              <path d="M7 44 L-4 52" stroke={INK} strokeWidth={3.4} />
              <Inked d="M-12 46 L-2 56 L-6 60 L-16 50 Z" fill={MYTH.iron} />
            </>
          )}
        </Frame>
      ))}
    </>
  )
}

// ---- the seer: an old man bound to a dead tree, calm, his eyes white; cut free, he points across the sea ----

export function Seer({ first = 'bound' }: { first?: 'bound' | 'free' | 'point' }) {
  const body = (
    <>
      <Inked d="M22 26 Q30 20 38 26 L40 60 L20 60 Z" fill="#5a5a6a" />
      <Inked d="M22 56 L22 76 L28 76 L29 58 Z M32 56 L34 76 L40 76 L37 56 Z" fill="#3a3a48" />
      <Inked d="M23 8 Q30 2 37 8 L37 22 Q30 28 23 22 Z" fill="#d0b498" />
      <Inked d="M23 18 Q30 34 37 18 Q34 28 30 30 Q26 28 23 18 Z" fill="#e8e4dc" />
      <circle cx={26} cy={13} r={1.6} fill={MYTH.frostCore} stroke={INK} strokeWidth={0.6} />
    </>
  )
  return (
    <>
      <Frame name="bound" first={first === 'bound'}>
        {body}
        <path d="M18 30 Q30 36 42 30 M18 46 Q30 52 42 46" fill="none" stroke={MYTH.leather} strokeWidth={3} />
      </Frame>
      <Frame name="free" first={first === 'free'}>
        {body}
        <Inked d="M22 30 L18 48 L22 49 L25 32 Z" fill="#5a5a6a" width={1.4} />
      </Frame>
      <Frame name="point" first={first === 'point'}>
        {body}
        <Inked d="M24 30 L2 18 L2 22 L24 34 Z" fill="#5a5a6a" width={1.4} />
      </Frame>
    </>
  )
}
