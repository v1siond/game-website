'use client'

import type { ComponentProps, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PieEyes } from './art'
import { HeroCharacter, type HeroPose } from './cup'
import { HOSE } from './palette'
import styles from './sets.module.css'

// Rubber Hose's three profession sets, the backdrop the iris opens on above the picked profession's
// sections. Each is built like a 1930s cartoon set: a watercolour sky, then a far, a mid and a near layer
// of inked cut outs that slide against each other as the pointer moves (--mx and --my from the theme
// root, the shared usePointerVars; depth through parallax, the way a cartoon camera shot cels in front of a built set). Two ink weights: a thick line
// round every silhouette, a thin one for the detail inside. The props wear pie eyes and bob on the beat,
// most loops stepped to 24 frames a second like hand drawn cels (sets.module.css). Him in the middle,
// working: typing at the terminal, playing the kit, jabbing the heavy bag.
// - System Engineer: the workshop town, pie eyed houses, the factory's smokestack puffing rings, his
//   desk with a pie eyed terminal that squashes when the pointer lands on it.
// - Musician: the vaudeville stage, a painted moon backdrop, swagged red curtains, the footlights
//   flickering, his kit with a pie eyed bass drum thumping and the gramophone's horn pumping.
// - Martial Artist: the fairground prize ring under the big top, the bunting swinging, the crowd
//   bobbing in the front row, the pie eyed heavy bag taking his rubber hose jab.
// Animated elements per set, at most 11 (each set's comment counts them).

const GROUND_Y = 172

type Depth = 'far' | 'mid' | 'near'

const DEPTH_CLASS: Record<Depth, string> = {
  far: styles.far,
  mid: styles.mid,
  near: styles.near,
}

// One cut out layer of the set: wider than the frame so its parallax never shows an edge, the drawing
// centred and kept whole (meet), its ground drawn past both edges of the view box.
function Layer({ depth, children }: { depth: Depth; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute -inset-x-8 inset-y-0 ${DEPTH_CLASS[depth]}`}>
      <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMax meet" className="h-full w-full overflow-visible" focusable="false">
        {children}
      </svg>
    </div>
  )
}

// Him standing on the set at x with his feet on `ground`, `height` units tall. His figure's own view box
// (100 by 170) fills the 600 by 200 set box centred, so the group scales it and moves it into place.
function Him({ profession, pose, x, ground, height }: { profession: Profession; pose: HeroPose; x: number; ground: number; height: number }) {
  const scale = height / 200

  return (
    <g transform={`translate(${x - 300 * scale} ${ground - height}) scale(${scale})`}>
      <HeroCharacter profession={profession} pose={pose} />
    </g>
  )
}

// Pie eyes drawn in the thin line, so the slice cut from each eye still reads inside a thick drawing.
function Eyes(props: ComponentProps<typeof PieEyes>) {
  return (
    <g className={styles.thin}>
      <PieEyes {...props} />
    </g>
  )
}

// A pie eyed cloud, three puffs and a flat base.
function Cloud({ x, y, eyes = false }: { x: number; y: number; eyes?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className={styles.thick}>
      <path d="M0 20 Q-4 6 10 6 Q14 -6 28 0 Q40 -8 48 6 Q60 6 56 20 Z" fill={HOSE.highlight} />
      {eyes && <Eyes cx={28} cy={10} size={14} paper={HOSE.highlight} />}
    </g>
  )
}

// The watercolour wash a painted background is laid in: soft blooms of colour fading to nothing.
function Washes({ id, tint }: { id: string; tint: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={tint} stopOpacity={0.45} />
          <stop offset="1" stopColor={tint} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={120} cy={60} rx={160} ry={50} fill={`url(#${id})`} />
      <ellipse cx={470} cy={40} rx={140} ry={40} fill={`url(#${id})`} />
      <ellipse cx={300} cy={110} rx={220} ry={40} fill={`url(#${id})`} />
    </>
  )
}

function Ground({ fill, lip }: { fill: string; lip: string }) {
  return (
    <g className={styles.thick}>
      <path d={`M-400 ${GROUND_Y} Q0 ${GROUND_Y - 6} 300 ${GROUND_Y} T1000 ${GROUND_Y} V240 H-400 Z`} fill={fill} />
      <path d={`M-400 ${GROUND_Y + 14} Q100 ${GROUND_Y + 8} 300 ${GROUND_Y + 14} T1000 ${GROUND_Y + 12} V240 H-400 Z`} fill={lip} />
    </g>
  )
}

// ---- System Engineer: the workshop town (10 animated: clouds, three smoke rings, two houses, the
// terminal, his bob and two arms) ----

function House({ x, roof, phase }: { x: number; roof: string; phase: string }) {
  return (
    <g transform={`translate(${x} 96)`}>
      <g className={`${styles.houseBob} ${phase} ${styles.thick}`}>
        <path d="M-4 28 L24 0 L52 28 Z" fill={roof} />
        <rect x={2} y={28} width={44} height={48} fill={HOSE.paperSepia} />
        <g className={styles.thin}>
          <path d="M6 32 H42 M6 44 H42 M6 56 H42" fill="none" />
          <rect x={8} y={34} width={32} height={16} rx={8} fill={HOSE.highlight} />
          <rect x={18} y={58} width={12} height={18} rx={6} fill={HOSE.shadowDark} />
        </g>
        <Eyes cx={24} cy={42} size={18} paper={HOSE.highlight} />
      </g>
    </g>
  )
}

function Factory() {
  return (
    <g transform="translate(390 0)">
      <g className={styles.thick}>
        <rect x={72} y={52} width={20} height={70} fill={HOSE.redDark} />
        <path d="M0 122 V100 L22 86 V100 L44 86 V100 L66 86 V100 L100 86 V122 Z" fill={HOSE.shadowDark} />
        <rect x={0} y={118} width={110} height={54} fill={HOSE.redDark} />
      </g>
      <g className={styles.thin}>
        <path d="M72 64 H92 M72 76 H92" fill="none" />
        {[10, 38, 66].map((x) => (
          <rect key={x} x={x} y={130} width={18} height={20} rx={2} fill={HOSE.gold} />
        ))}
        <rect x={42} y={154} width={22} height={18} fill={HOSE.ink} />
      </g>
      {/* the smoke rings, each rising off the stack on its own delay */}
      {['[--delay:0s]', '[--delay:-0.9s]', '[--delay:-1.8s]'].map((delay) => (
        <circle key={delay} cx={82} cy={44} r={8} fill={HOSE.paper} className={`${styles.thick} ${styles.puff} ${delay}`} />
      ))}
    </g>
  )
}

// His desk and the pie eyed terminal, which squashes when the pointer lands on it.
function Desk() {
  return (
    <g className={styles.thick}>
      <rect x={250} y={138} width={120} height={8} rx={2} fill={HOSE.shadowDark} />
      <rect x={258} y={146} width={8} height={26} fill={HOSE.shadowDark} />
      <rect x={354} y={146} width={8} height={26} fill={HOSE.shadowDark} />
      <rect x={272} y={132} width={34} height={6} rx={1} fill={HOSE.paperDark} />
      <g className={`${styles.prop} ${styles.propBob}`}>
        <rect x={318} y={96} width={46} height={40} rx={8} fill={HOSE.paperDark} />
        <rect x={324} y={102} width={34} height={26} rx={6} fill={HOSE.highlight} />
        <Eyes cx={341} cy={113} size={16} paper={HOSE.highlight} />
        <path d="M335 121 Q341 125 347 121" fill="none" className={styles.thin} />
      </g>
    </g>
  )
}

function WorkshopTown() {
  return (
    <>
      <div className={`absolute inset-0 ${styles.skyDay}`} />
      <Layer depth="far">
        <Washes id="hose-set-town-wash" tint={HOSE.gold} />
        <g className={styles.cloudDrift}>
          <Cloud x={80} y={30} eyes />
          <Cloud x={420} y={18} />
        </g>
        <g className={styles.thick}>
          <path d="M-400 150 Q-150 100 40 128 Q160 92 300 122 Q430 88 560 118 Q760 96 1000 132 V200 H-400 Z" fill={HOSE.meadow} />
        </g>
        <path d="M-400 160 Q100 128 300 150 T1000 146 V200 H-400 Z" fill={HOSE.meadowDark} opacity={0.5} />
      </Layer>
      <Layer depth="mid">
        <House x={70} roof={HOSE.redDark} phase="[--delay:0s]" />
        <House x={160} roof={HOSE.blue} phase="[--delay:-0.35s]" />
        <Factory />
      </Layer>
      <Layer depth="near">
        <Ground fill={HOSE.paperDark} lip={HOSE.meadowDark} />
        <Him profession="engineer" pose="type" x={289} ground={GROUND_Y} height={74} />
        <Desk />
      </Layer>
    </>
  )
}

// ---- Musician: the vaudeville stage (10 animated: two curtains, two footlight rows, the cymbal, the
// bass drum, the gramophone horn, his bob and two arms) ----

function Star({ x, y }: { x: number; y: number }) {
  return <path transform={`translate(${x} ${y})`} d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z" fill={HOSE.gold} />
}

function PaintedDrop() {
  return (
    <>
      <rect x={-400} y={-20} width={1400} height={240} fill={HOSE.blue} />
      <Washes id="hose-set-stage-wash" tint={HOSE.highlight} />
      <g className={styles.thick}>
        <path d="M455 20 A30 30 0 1 0 485 74 A24 24 0 1 1 455 20 Z" fill={HOSE.gold} />
      </g>
      {[
        [90, 30],
        [170, 64],
        [250, 24],
        [380, 50],
        [540, 90],
      ].map(([x, y]) => (
        <Star key={`${x}-${y}`} x={x} y={y} />
      ))}
      <path d="M-400 150 Q-100 120 100 140 Q300 110 500 138 Q700 120 1000 140 V200 H-400 Z" fill={HOSE.ink} opacity={0.35} />
    </>
  )
}

function DrumKit() {
  return (
    <g className={styles.thick}>
      {/* hi hat stand and the crash cymbal that tips on every hit */}
      <path d="M232 112 V160" fill="none" />
      <ellipse cx={232} cy={112} rx={16} ry={3.5} fill={HOSE.gold} />
      <g className={styles.cymbalTip}>
        <path d="M368 96 V160" fill="none" />
        <ellipse cx={368} cy={96} rx={20} ry={4} fill={HOSE.gold} />
      </g>
      {/* snare and floor tom */}
      <rect x={244} y={132} width={34} height={16} rx={3} fill={HOSE.paper} />
      <ellipse cx={261} cy={132} rx={17} ry={4} fill={HOSE.highlight} />
      <rect x={326} y={128} width={36} height={30} rx={3} fill={HOSE.redDark} />
      <ellipse cx={344} cy={128} rx={18} ry={4} fill={HOSE.highlight} />
      {/* the pie eyed bass drum, thumping on the beat */}
      <g className={`${styles.prop} ${styles.bassThump}`}>
        <circle cx={300} cy={140} r={28} fill={HOSE.redDark} />
        <circle cx={300} cy={140} r={22} fill={HOSE.paper} />
        <Eyes cx={300} cy={136} size={20} />
        <path d="M290 148 Q300 155 310 148" fill="none" className={styles.thin} />
      </g>
    </g>
  )
}

function Gramophone() {
  return (
    <g transform="translate(470 0)" className={styles.thick}>
      <rect x={0} y={134} width={44} height={26} rx={2} fill={HOSE.shadowDark} />
      <path d="M22 134 V118" fill="none" />
      <g className={styles.hornPump}>
        <path d="M20 120 Q10 100 -10 72 Q14 64 40 70 Q28 98 26 120 Z" fill={HOSE.gold} />
        <Eyes cx={15} cy={86} size={14} paper={HOSE.gold} />
      </g>
    </g>
  )
}

function Curtain({ side }: { side: 'left' | 'right' }) {
  const mirror = side === 'right' ? 'translate(600 0) scale(-1 1)' : undefined

  return (
    <g transform={mirror}>
      <g className={`${styles.curtainSway} ${styles.thick}`}>
        <path d="M-400 -10 H70 Q40 60 64 120 Q30 150 -20 200 H-400 Z" fill={HOSE.red} />
        <g className={styles.thin}>
          <path d="M20 -10 Q4 80 -10 190 M46 -10 Q30 70 30 130" fill="none" />
        </g>
        <rect x={40} y={112} width={30} height={8} rx={4} fill={HOSE.gold} transform="rotate(-20 55 116)" />
      </g>
    </g>
  )
}

const FOOTLIGHTS = [70, 150, 230, 370, 450, 530]

function Footlights() {
  return (
    <>
      {(['even', 'odd'] as const).map((row) => (
        <g key={row} className={row === 'even' ? styles.footA : styles.footB}>
          {FOOTLIGHTS.filter((_, i) => (i % 2 === 0) === (row === 'even')).map((x) => (
            <ellipse key={x} cx={x} cy={184} rx={30} ry={14} fill={HOSE.gold} opacity={0.55} />
          ))}
        </g>
      ))}
      <g className={styles.thick}>
        {FOOTLIGHTS.map((x) => (
          <path key={x} d={`M${x - 12} 194 Q${x} 178 ${x + 12} 194 Z`} fill={HOSE.ink} />
        ))}
      </g>
    </>
  )
}

function VaudevilleStage() {
  return (
    <>
      <Layer depth="far">
        <PaintedDrop />
      </Layer>
      <Layer depth="mid">
        <g className={styles.thick}>
          <path d={`M-400 ${GROUND_Y - 12} H1000 V240 H-400 Z`} fill={HOSE.paperDark} />
        </g>
        <g className={styles.thin}>
          <path d="M-400 170 H1000 M-400 182 H1000 M-400 194 H1000" fill="none" />
        </g>
        <Him profession="drummer" pose="drum" x={300} ground={150} height={74} />
        <DrumKit />
        <Gramophone />
      </Layer>
      <Layer depth="near">
        <Curtain side="left" />
        <Curtain side="right" />
        <g className={styles.thick}>
          <path d="M-400 -10 H1000 V10 Q975 26 950 10 Q925 26 900 10 L-300 10 Q-325 26 -350 10 Q-375 26 -400 10 Z" fill={HOSE.redDark} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <path key={i} d={`M${i * 50} 8 Q${i * 50 + 25} 30 ${i * 50 + 50} 8`} fill={HOSE.redDark} />
          ))}
        </g>
        <Footlights />
      </Layer>
    </>
  )
}

// ---- Martial Artist: the fairground prize ring (9 animated: the flag, the bunting, the bag, the
// impact star, two crowd rows, his bob and two arms) ----

const TENT_STRIPES = [-6, -4, -2, 0, 2, 4]

function BigTop() {
  return (
    <g className={styles.thick}>
      {TENT_STRIPES.map((i) => (
        <path key={i} d={`M300 30 L${300 + i * 34} 128 L${300 + (i + 2) * 34} 128 Z`} fill={i % 4 === 0 ? HOSE.red : HOSE.paper} />
      ))}
      {TENT_STRIPES.map((i) => (
        <path key={`wall-${i}`} d={`M${300 + i * 34} 128 H${300 + (i + 2) * 34} V160 H${300 + i * 34} Z`} fill={i % 4 === 0 ? HOSE.paper : HOSE.red} />
      ))}
      <path d="M300 30 V8" fill="none" />
      <path d="M300 8 L322 14 L300 20 Z" fill={HOSE.red} className={styles.flagWave} />
    </g>
  )
}

function Bunting() {
  return (
    <g className={`${styles.buntingSway} ${styles.thick}`}>
      <path d="M-400 40 Q300 90 1000 40" fill="none" />
      {[-60, 20, 100, 180, 260, 340, 420, 500, 580, 660].map((x, i) => (
        <path key={x} d={`M${x} ${58 + Math.sin(i) * 2} l12 2 l-4 16 Z`} fill={i % 2 === 0 ? HOSE.gold : HOSE.blue} />
      ))}
    </g>
  )
}

function Ring() {
  return (
    <g className={styles.thick}>
      <rect x={120} y={150} width={360} height={24} fill={HOSE.redDark} />
      <rect x={130} y={92} width={10} height={60} fill={HOSE.gold} />
      <rect x={460} y={92} width={10} height={60} fill={HOSE.gold} />
      {[100, 116, 132].map((y) => (
        <path key={y} d={`M135 ${y} Q300 ${y + 4} 465 ${y}`} fill="none" />
      ))}
    </g>
  )
}

// The heavy bag on its chain, swinging back from every jab, and the star where the glove lands.
function HeavyBag() {
  return (
    <>
      <g className={styles.thick}>
        <path d="M380 40 V58" fill="none" />
      </g>
      <g className={`${styles.prop} ${styles.bagSwing} ${styles.thick}`}>
        <path d="M380 58 V70" fill="none" />
        <rect x={364} y={70} width={32} height={62} rx={14} fill={HOSE.shadowDark} />
        <rect x={364} y={86} width={32} height={6} fill={HOSE.gold} />
        <Eyes cx={380} cy={104} size={16} paper={HOSE.shadowDark} />
      </g>
      <path d="M362 100 l-6 -10 l-2 9 l-10 -2 l8 7 l-8 6 l10 -1 l2 9 l5 -10 Z" fill={HOSE.highlight} className={`${styles.thick} ${styles.impact}`} />
    </>
  )
}

function Crowd({ row, offset }: { row: 'A' | 'B'; offset: number }) {
  return (
    <g className={`${row === 'A' ? styles.crowdA : styles.crowdB} ${styles.thick}`}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = offset + i * 80

        return (
          <g key={i}>
            <path d={`M${x - 18} 204 Q${x - 18} 180 ${x} 180 Q${x + 18} 180 ${x + 18} 204 Z`} fill={HOSE.ink} />
            <circle cx={x} cy={172} r={11} fill={HOSE.shadowDark} />
            <rect x={x - 9} y={157} width={18} height={8} rx={2} fill={HOSE.ink} />
            <rect x={x - 14} y={164} width={28} height={3} rx={1.5} fill={HOSE.ink} />
          </g>
        )
      })}
    </g>
  )
}

function PrizeRing() {
  return (
    <>
      <div className={`absolute inset-0 ${styles.skyDusk}`} />
      <Layer depth="far">
        <Washes id="hose-set-ring-wash" tint={HOSE.orange} />
        <g className={styles.thick}>
          <path d="M-400 150 Q0 132 300 146 T1000 140 V200 H-400 Z" fill={HOSE.meadow} />
        </g>
        <BigTop />
      </Layer>
      <Layer depth="mid">
        <Bunting />
        <Ring />
        <HeavyBag />
        <Him profession="fighter" pose="jab" x={326} ground={152} height={70} />
      </Layer>
      <Layer depth="near">
        <Crowd row="A" offset={-40} />
        <Crowd row="B" offset={0} />
      </Layer>
    </>
  )
}

const SETS: Record<Profession, () => ReactNode> = {
  engineer: WorkshopTown,
  drummer: VaudevilleStage,
  fighter: PrizeRing,
}

// The picked profession's set in its inked frame. Decorative: the sections below carry the content.
export function ProfessionSet({ profession }: { profession: Profession }) {
  const Set = SETS[profession]

  return (
    <div className={`relative mb-10 h-44 overflow-hidden sm:h-64 lg:h-72 ${styles.frame}`} aria-hidden="true">
      <Set />
    </div>
  )
}
