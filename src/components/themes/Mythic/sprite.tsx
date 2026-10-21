import { useId } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { MYTH } from './palette'
import s from './sprite.module.css'

// Him as this world's own sprite, a parody of the ash pale Spartan with the chained blades (God of War's
// Kratos, reference sheet src/assets/sprites/kratos_spritesheet.png), drawn the way the underworld
// roguelike draws its people: one dark ink line round every shape over painted gradient fills, a warm
// rim light on the lit edge. Heavy proportions from the sheet: a small shaved head, very broad
// shoulders, thick arms, a wide low stance.
//
// His traits come from HERO_IDENTITY: his brown skin with the Spartan's ash dusted over it in pale
// streaks, his dark hair as the stubble shadow on the shaved scalp, his full dark beard and dark oval
// eyes. The Spartan's marks: the red stripe over the crown and down the near (left) eye, round the near
// side of the chest to the shoulder and down the arm, the scar over the far (right) eye.
//
// Per profession: the System Engineer in the full kit (red key pattern kilt with a ragged hem, the
// harness across the chest, the pauldron, bracers with the chains wound round them, the twin blades on
// their chains), whose action is the three hit chain combo ending in a slam that burns a bracket rune
// into the floor; the Musician in the same kit with the blades crossed on his back and their hilts in
// his fists over a great bronze war drum, fire bursting from the skin on each hit; the Martial Artist
// bare chested in red Muay Thai shorts with the key trim, hand wraps, prajioud on the arms and his own
// mongkhon on the shaved head, whose actions are the knee, the elbow and the kick. Any of them can roar:
// the tattoo and the eyes light, the mouth opens, a shockwave ring leaves him.
//
// The parts are groups sprite.module.css moves with transforms only, each turning round its own joint
// (shoulder, elbow, hip, knee, given in the viewBox's units). `motion` picks the cycle.

export type SpriteMotion = 'still' | 'idle' | 'walk' | 'action' | 'roar' | 'knee' | 'elbow' | 'kick'

const MOTION_CLASS: Record<SpriteMotion, string> = {
  still: '',
  idle: s.idle,
  walk: s.walk,
  action: s.action,
  roar: s.roar,
  knee: s.knee,
  elbow: s.elbow,
  kick: s.kick,
}

const KIT_CLASS: Record<Profession, string> = {
  engineer: s.kitBlades,
  drummer: s.kitDrum,
  fighter: s.kitFists,
}

const INK = MYTH.inkLine

/** One painted shape with the ink line round it. */
function Inked({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
}

// ---- the shapes every outfit shares (viewBox 160 by 210, facing right, feet on y 198) ----

const HEAD = 'M72 40 Q70 22 86 20 Q100 20 101 36 L101 44 Q100 50 96 52 L76 52 Q72 48 72 40 Z'
const STUBBLE = 'M71 36 Q70 21 86 20 Q100 20 101 33 Q88 27 71 36 Z'
const HEAD_STRIPE = 'M78 20 Q84 19 87 21 L90 34 L90 46 L86 46 L85 34 Z'
const BEARD = 'M75 44 Q78 50 81 52 L100 46 Q104 50 101 58 Q96 69 86 71 Q76 69 74 58 Z'
const NECK = 'M77 50 L96 50 L99 63 L75 63 Z'
const TORSO = 'M48 66 Q82 56 118 66 L122 84 Q114 102 106 114 L62 114 Q54 102 46 84 Z'
const TORSO_SHADE = 'M48 66 Q56 64 63 63 Q57 90 65 114 L62 114 Q54 102 46 84 Z'
const CHEST_LINES = 'M66 84 Q80 92 93 84 M93 84 Q103 90 113 82 M87 95 L87 112 M77 99 Q87 101 97 99 M77 107 Q87 109 97 107'
const TORSO_STRIPE = 'M90 60 Q108 64 115 76 Q119 92 108 103 L104 99 Q112 90 110 78 Q104 69 88 65 Z'
const ASH = 'M60 76 L70 72 M100 72 L108 70 M70 104 L78 101 M98 104 L104 100'

const UPPER_ARM = {
  back: 'M40 67 Q50 57 62 66 Q61 82 57 97 L42 97 Q37 82 40 67 Z',
  front: 'M104 66 Q115 57 126 67 Q130 82 127 97 L111 97 Q103 82 104 66 Z',
}
const ARM_STRIPE = 'M115 66 L123 67 L124 92 L118 92 Z'
const FOREARM = {
  back: 'M42 94 L57 94 Q59 106 55 120 L44 120 Q40 106 42 94 Z',
  front: 'M111 94 L127 94 Q130 106 126 120 L113 120 Q109 106 111 94 Z',
}
const BRACER = {
  back: 'M41 101 L58 101 L56 118 L43 118 Z',
  front: 'M110 101 L128 101 L127 118 L112 118 Z',
}
const CHAIN_WRAP = {
  back: 'M42 105 L57 108 M42 110 L57 113 M43 115 L56 117',
  front: 'M111 105 L127 108 M111 110 L127 113 M112 115 L126 117',
}
const FIST = {
  back: 'M39 118 Q49 112 59 118 L59 130 Q49 136 39 130 Z',
  front: 'M109 118 Q119 112 130 118 L130 130 Q120 136 109 130 Z',
}
// The blades, held edge down and forward; the chain hangs in a loop from the pommel back to the bracer.
const BLADE = {
  back: 'M45 128 L53 128 L51 141 Q47 161 33 172 Q38 162 37 152 Q41 146 43 140 Z',
  front: 'M116 128 L124 128 L129 140 Q138 158 154 166 Q141 166 133 158 Q127 152 121 142 Z',
}
const BLADE_EDGE = {
  back: 'M51 141 Q47 161 33 172',
  front: 'M129 140 Q138 158 154 166',
}
const CHAIN = {
  back: 'M44 117 Q28 140 47 150',
  front: 'M114 117 Q102 142 121 150',
}

const THIGH = {
  back: 'M61 126 L79 126 L78 161 L64 161 Z',
  front: 'M89 126 L107 126 L113 158 L98 161 Z',
}
const SHIN = {
  back: 'M63 158 L78 158 L76 185 L65 185 Z',
  front: 'M98 157 L113 156 L115 185 L102 185 Z',
}
const BOOT = {
  back: 'M62 179 L79 179 L81 197 L57 199 L57 190 Z',
  front: 'M100 179 L117 179 L126 195 L100 199 Z',
}
const BARE_FOOT = {
  back: 'M63 184 L77 184 L80 196 L59 198 Z',
  front: 'M101 184 L115 184 L124 195 L101 198 Z',
}
const BOOT_WRAPS = {
  back: 'M60 184 L79 186 M59 190 L80 192',
  front: 'M101 184 L118 186 M101 190 L121 192',
}

const KILT = 'M56 114 L112 114 L124 150 L116 154 L108 146 L100 156 L92 147 L84 157 L76 147 L68 155 L60 146 L50 152 Z'
const KILT_SHADE = 'M56 114 L70 114 L66 130 L68 155 L60 146 L50 152 Z'
const BELT = 'M57 105 L111 105 L113 116 L55 116 Z'
const SHORTS = 'M56 112 L112 112 L116 142 L92 144 L85 130 L78 144 L52 142 Z'
const SHORTS_TRIM = 'M53 136 L78 138 M92 138 L115 136'

// The key pattern band along the kilt's top: one square hook per step.
const keyBand = (x0: number, x1: number, y: number) => {
  const hooks: string[] = []
  for (let x = x0; x + 8 <= x1; x += 8) hooks.push(`M${x} ${y + 6} L${x} ${y} L${x + 6} ${y} L${x + 6} ${y + 4} L${x + 3} ${y + 4} L${x + 3} ${y + 2}`)
  return hooks.join(' ')
}
const KILT_KEY = keyBand(58, 112, 117)

// ---- the parts ----

function Head({ profession, ids }: { profession: Profession; ids: GradientIds }) {
  return (
    <g className={s.head}>
      <Inked d={HEAD} fill={`url(#${ids.skin})`} />
      <ellipse cx={74} cy={40} rx={3} ry={5} fill={HERO_IDENTITY.skinShade} stroke={INK} strokeWidth={1.6} />
      <path d={STUBBLE} fill={HERO_IDENTITY.hair} opacity={0.35} />
      <path d={HEAD_STRIPE} fill={MYTH.tattoo} />
      <path d={HEAD_STRIPE} fill={MYTH.rage} className={s.rageGlow} />
      {/* the heavy brow, his eyes (near one under the stripe), the scar over the far eye, the nose */}
      <path d="M83 32 L101 30 L101 34 L84 35 Z" fill={HERO_IDENTITY.skinShade} />
      <g className={s.eyes}>
        <ellipse cx={88} cy={37} rx={2.4} ry={1.7} fill={HERO_IDENTITY.eyes} />
        <ellipse cx={97} cy={37} rx={1.7} ry={1.5} fill={HERO_IDENTITY.eyes} />
      </g>
      <g className={s.rageGlow}>
        <ellipse cx={88} cy={37} rx={2.4} ry={1.7} fill={MYTH.rageCore} />
        <ellipse cx={97} cy={37} rx={1.7} ry={1.5} fill={MYTH.rageCore} />
      </g>
      <path d="M95 31 L99 42" stroke={MYTH.ash} strokeWidth={1.2} />
      <path d="M100 38 L104 44 L100 45" fill={HERO_IDENTITY.skinShade} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <Inked d={BEARD} fill={HERO_IDENTITY.beard} />
      <path d="M80 58 Q86 64 96 58" stroke={MYTH.inkSoft} strokeWidth={1.2} fill="none" />
      <ellipse cx={93} cy={54} rx={4} ry={3.4} fill={MYTH.bloodDeep} stroke={INK} strokeWidth={1.2} className={s.mouth} />
      {profession === 'fighter' && <Mongkhon />}
    </g>
  )
}

// His own mongkhon: a red rope crown wound with white, tied at the back with two tails.
function Mongkhon() {
  return (
    <g>
      <path d="M68 33 L62 50 M70 32 L68 52" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M68 33 L62 50 M70 32 L68 52" stroke={MYTH.tattoo} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M70 32 Q86 22 102 30" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M70 32 Q86 22 102 30" fill="none" stroke={MYTH.tattoo} strokeWidth={4.6} strokeLinecap="round" />
      <path d="M70 32 Q86 22 102 30" fill="none" stroke={MYTH.bone} strokeWidth={4.6} strokeDasharray="2 4" />
      <circle cx={69} cy={33} r={3} fill={MYTH.tattoo} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

function Torso({ profession, ids }: { profession: Profession; ids: GradientIds }) {
  const armoured = profession !== 'fighter'
  return (
    <g>
      <Inked d={NECK} fill={`url(#${ids.skin})`} />
      <Inked d={TORSO} fill={`url(#${ids.skin})`} />
      <path d={TORSO_SHADE} fill={HERO_IDENTITY.skinShade} opacity={0.6} />
      <path d={CHEST_LINES} fill="none" stroke={HERO_IDENTITY.skinShade} strokeWidth={1.6} strokeLinecap="round" />
      <path d={ASH} stroke={MYTH.ash} strokeWidth={2.4} strokeLinecap="round" opacity={0.45} />
      <path d={TORSO_STRIPE} fill={MYTH.tattoo} />
      <path d={TORSO_STRIPE} fill={MYTH.rage} className={s.rageGlow} />
      {armoured && (
        <>
          {/* the harness across the chest with its round buckle, the pauldron on the far shoulder */}
          <Inked d="M52 64 L62 62 L113 106 L104 114 Z" fill={`url(#${ids.leather})`} />
          <circle cx={84} cy={87} r={4.6} fill={MYTH.bronze} stroke={INK} strokeWidth={1.6} />
          <Inked d="M39 62 Q50 51 63 59 L61 75 Q50 79 39 73 Z" fill={`url(#${ids.leather})`} />
          <path d="M42 66 Q50 61 60 64" stroke={MYTH.bronze} strokeWidth={1.6} fill="none" />
        </>
      )}
    </g>
  )
}

function Waist({ profession, ids }: { profession: Profession; ids: GradientIds }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Inked d={SHORTS} fill={`url(#${ids.kilt})`} />
        <path d={SHORTS_TRIM} stroke={MYTH.gold} strokeWidth={2.4} />
        <path d="M56 114 L112 114" stroke={MYTH.gold} strokeWidth={3} />
      </g>
    )
  }
  return (
    <g>
      <Inked d={KILT} fill={`url(#${ids.kilt})`} />
      <path d={KILT_SHADE} fill={MYTH.kiltShade} opacity={0.7} />
      <path d={KILT_KEY} fill="none" stroke={MYTH.gold} strokeWidth={1.4} />
      {/* the hanging leather straps over the kilt */}
      <Inked d="M80 116 L87 116 L87 147 L83 150 L80 147 Z" fill={`url(#${ids.leather})`} />
      <Inked d="M94 116 L101 116 L102 145 L98 148 L95 145 Z" fill={`url(#${ids.leather})`} />
      <Inked d={BELT} fill={`url(#${ids.leather})`} />
      <circle cx={84} cy={110} r={3.4} fill={MYTH.bronze} stroke={INK} strokeWidth={1.4} />
    </g>
  )
}

function Leg({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: GradientIds }) {
  const bare = profession === 'fighter'
  return (
    <g className={side === 'back' ? s.thighBack : s.thighFront}>
      <Inked d={THIGH[side]} fill={`url(#${ids.skin})`} />
      <g className={side === 'back' ? s.shinBack : s.shinFront}>
        <Inked d={SHIN[side]} fill={`url(#${ids.skin})`} />
        {bare ? (
          <>
            <Inked d={BARE_FOOT[side]} fill={`url(#${ids.skin})`} />
            <path d={BOOT_WRAPS[side]} stroke={MYTH.wrap} strokeWidth={2.4} />
          </>
        ) : (
          <>
            <Inked d={BOOT[side]} fill={`url(#${ids.leather})`} />
            <path d={BOOT_WRAPS[side]} stroke={MYTH.leatherShade} strokeWidth={1.6} />
          </>
        )}
      </g>
    </g>
  )
}

// What a fist holds: a blade on its chain, a blade's hilt as a drum beater, or the Muay Thai wraps.
function Grip({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: GradientIds }) {
  if (profession === 'fighter') {
    return (
      <>
        <Inked d={FIST[side]} fill={MYTH.wrap} />
        <path d={side === 'back' ? 'M40 123 L58 125 M40 127 L58 129' : 'M110 123 L129 125 M110 127 L129 129'} stroke={MYTH.boneShade} strokeWidth={1.2} />
      </>
    )
  }
  if (profession === 'drummer') {
    const hilt = side === 'back' ? 'M45 124 L53 124 L55 146 L43 146 Z' : 'M115 124 L123 124 L126 146 L113 146 Z'
    return (
      <>
        <Inked d={hilt} fill={MYTH.bronze} />
        <Inked d={FIST[side]} fill={`url(#${ids.skin})`} />
      </>
    )
  }
  return (
    <>
      <path d={CHAIN[side]} fill="none" stroke={INK} strokeWidth={4} className={s.chain} />
      <path d={CHAIN[side]} fill="none" stroke={MYTH.steel} strokeWidth={2.4} strokeDasharray="3 2" className={s.chain} />
      <Inked d={BLADE[side]} fill={`url(#${ids.blade})`} />
      <path d={BLADE_EDGE[side]} fill="none" stroke={MYTH.bladeFire} strokeWidth={1.8} />
      <Inked d={FIST[side]} fill={`url(#${ids.skin})`} />
    </>
  )
}

function Arm({ side, profession, ids }: { side: 'back' | 'front'; profession: Profession; ids: GradientIds }) {
  const fighter = profession === 'fighter'
  return (
    <g className={side === 'back' ? s.armBack : s.armFront}>
      <Inked d={UPPER_ARM[side]} fill={`url(#${ids.skin})`} />
      {side === 'front' && (
        <>
          <path d={ARM_STRIPE} fill={MYTH.tattoo} />
          <path d={ARM_STRIPE} fill={MYTH.rage} className={s.rageGlow} />
        </>
      )}
      {/* the prajioud, a red cloth tied round the upper arm */}
      {fighter && <Inked d={side === 'back' ? 'M42 80 L58 80 L58 86 L42 86 Z' : 'M107 80 L126 80 L126 86 L108 86 Z'} fill={MYTH.tattoo} />}
      <g className={side === 'back' ? s.foreBack : s.foreFront}>
        <Inked d={FOREARM[side]} fill={`url(#${ids.skin})`} />
        {!fighter && (
          <>
            <Inked d={BRACER[side]} fill={`url(#${ids.leather})`} />
            <path d={CHAIN_WRAP[side]} stroke={MYTH.steel} strokeWidth={1.8} />
          </>
        )}
        <Grip side={side} profession={profession} ids={ids} />
      </g>
    </g>
  )
}

// ---- the action props ----

function ChainArcs() {
  return (
    <g fill="none" strokeLinecap="round">
      <path className={s.arc1} d="M70 40 Q150 22 156 118" stroke={MYTH.bladeFire} strokeWidth={5} />
      <path className={s.arc2} d="M150 70 Q120 150 40 160" stroke={MYTH.rage} strokeWidth={5} />
      <path className={s.arc3} d="M96 4 Q160 40 140 192" stroke={MYTH.rageCore} strokeWidth={6} />
    </g>
  )
}

// The slam's mark: his code burnt into the floor as a glowing bracket rune.
function Rune() {
  return (
    <g className={s.rune}>
      <ellipse cx={128} cy={198} rx={28} ry={6} fill={MYTH.bladeFire} opacity={0.5} />
      <path d="M118 188 L110 194 L118 200 M138 188 L146 194 L138 200 M131 186 L125 202" fill="none" stroke={MYTH.rageCore} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

function WarDrum({ ids }: { ids: GradientIds }) {
  return (
    <g>
      <path d="M112 186 L106 200 M152 186 L158 200" stroke={INK} strokeWidth={3} />
      <Inked d="M106 130 L156 130 L152 186 L110 186 Z" fill={`url(#${ids.leather})`} />
      <path d="M108 136 L130 180 L152 136 M110 180 L130 136 L150 180" fill="none" stroke={MYTH.bone} strokeWidth={1.4} opacity={0.8} />
      <Inked d="M104 128 L158 128 L158 136 L104 136 Z" fill={MYTH.bronze} />
      <ellipse cx={131} cy={128} rx={27} ry={7} fill={MYTH.bone} stroke={INK} strokeWidth={2.2} />
      <g className={s.flameFront}>
        <path d="M140 126 Q134 112 142 100 Q144 112 150 106 Q152 118 146 126 Z" fill={MYTH.bladeFire} stroke={INK} strokeWidth={1.4} />
      </g>
      <g className={s.flameBack}>
        <path d="M118 126 Q112 114 120 104 Q122 114 127 110 Q128 120 124 126 Z" fill={MYTH.rage} stroke={INK} strokeWidth={1.4} />
      </g>
    </g>
  )
}

// The blades crossed on his back while his fists hold their hilts at the drum.
function BladesOnBack({ ids }: { ids: GradientIds }) {
  return (
    <g>
      <Inked d="M50 60 L58 56 L80 20 L76 18 Z" fill={`url(#${ids.blade})`} />
      <Inked d="M112 60 L104 56 L84 18 L88 16 Z" fill={`url(#${ids.blade})`} />
    </g>
  )
}

interface GradientIds {
  skin: string
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
  return { skin: `${base}skin`, leather: `${base}leather`, kilt: `${base}kilt`, blade: `${base}blade` }
}

interface SpriteProps {
  profession: Profession
  motion: SpriteMotion
  className?: string
}

/** Him as the chained blade Spartan, in a profession's kit, playing one motion. */
export function SpartanSprite({ profession, motion, className = '' }: SpriteProps) {
  const ids = useGradientIds()

  return (
    <svg viewBox="0 0 160 210" className={`overflow-visible ${className}`} aria-hidden="true">
      <Gradients ids={ids} />
      <g className={`${s.sprite} ${KIT_CLASS[profession]} ${MOTION_CLASS[motion]}`}>
        <ellipse cx={90} cy={199} rx={44} ry={5} fill={MYTH.inkLine} opacity={0.45} />
        <ellipse cx={90} cy={150} rx={70} ry={66} fill="none" stroke={MYTH.rage} strokeWidth={3} className={s.ring} />
        {profession === 'engineer' && <Rune />}
        <g className={s.body}>
          {profession === 'drummer' && <BladesOnBack ids={ids} />}
          <Arm side="back" profession={profession} ids={ids} />
          <Leg side="back" profession={profession} ids={ids} />
          <Leg side="front" profession={profession} ids={ids} />
          <Waist profession={profession} ids={ids} />
          <g className={s.chest}>
            <Torso profession={profession} ids={ids} />
            <Head profession={profession} ids={ids} />
          </g>
          {profession === 'drummer' && <WarDrum ids={ids} />}
          <Arm side="front" profession={profession} ids={ids} />
        </g>
        {profession === 'engineer' && <ChainArcs />}
      </g>
    </svg>
  )
}
