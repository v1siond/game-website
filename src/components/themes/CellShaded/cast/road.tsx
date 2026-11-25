import { Upright, Word } from '../hud'
import { HATCH, Lines, Shade } from '../ink'
import { CEL } from '../palette'

// The road into town and the town itself, drawn like the rest of the wasteland (a heavy ink line round every
// silhouette from the stop's `cel.heavy`, hatched shadow sides, ink seams and rivets): the rusted bus and its
// stop, the scrap welcome sign, our little robot guide, the raiders' runner cars, an oil barrel, the town's
// sheet metal gate and its bounty board. Each is drawn round its foot (y 0 the ground), facing him (to the
// left) unless its doc says otherwise; what a scene moves inside one is a `data-fx` group. None is drawn from
// the game: the robot and the cars are ours.

/** The bus, 560 long, its door at x 0, its nose to the right: a rusted coach of riveted sheet, dented. */
export function Bus() {
  return (
    <g>
      <path d="M-380 -40 L-380 -236 Q-380 -256 -360 -256 L130 -256 Q176 -254 184 -200 L192 -40 Z" fill={CEL.sheet} />
      <Shade d="M-380 -110 L192 -110 L192 -40 L-380 -40 Z" fill={CEL.rust} />
      <Shade d="M80 -200 Q120 -230 150 -196 L140 -150 Q100 -170 80 -150 Z" fill={CEL.rust} cross />
      {[-344, -256, -168, -80].map((x) => (
        <g key={x}>
          <rect x={x} y={-232} width={70} height={68} rx={6} fill={CEL.inkSoft} />
          <path d={`M${x + 10} ${-222} l20 0`} stroke={CEL.paper} strokeWidth="5" strokeLinecap="round" data-bare />
        </g>
      ))}
      <rect x={-28} y={-232} width={56} height={192} fill={CEL.sheetShade} />
      <Lines d="M0 -232 V-40" />
      <path d="M112 -232 L168 -232 Q176 -200 176 -160 L112 -160 Z" fill={CEL.inkSoft} />
      <Lines d="M-380 -150 H192 M-200 -140 l18 6 M-120 -70 l26 -4 M40 -60 l20 6" width={2.5} />
      {[-360, -300, -240, -180, -120, -60].map((x) => (
        <circle key={x} cx={x} cy={-246} r={2.5} fill={CEL.ink} data-bare />
      ))}
      {[-262, 92].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-38} r={38} fill={CEL.ink} />
          <circle cx={x} cy={-38} r={15} fill={CEL.steel} />
        </g>
      ))}
    </g>
  )
}

/** The lone stop: a post of scrap with a round sign that says nothing, a shelter of corrugated sheet and its
 *  bench. */
export function BusStop() {
  return (
    <g>
      <path d="M-120 0 L-120 -250 L110 -280 L110 0" fill="none" stroke={CEL.rock} strokeWidth="12" data-bare />
      <path d="M-150 -240 L140 -282 L146 -262 L-144 -222 Z" fill={CEL.sheet} />
      <Shade d="M-150 -240 L140 -282 L146 -262 L-144 -222 Z" />
      <rect x={-90} y={-70} width={170} height={14} fill={CEL.plank} />
      <rect x={-80} y={-56} width={10} height={56} fill={CEL.plankShade} />
      <rect x={60} y={-56} width={10} height={56} fill={CEL.plankShade} />
      <rect x={-196} y={-320} width={12} height={320} fill={CEL.steelDark} />
      <circle cx={-190} cy={-330} r={34} fill={CEL.red} />
      <rect x={-210} y={-336} width={40} height={12} fill={CEL.paper} />
    </g>
  )
}

/** The welcome sign at the edge of town, 260 wide: a board of scrap on two posts, the town's name and its
 *  count of people, the 12 struck out and 11 scrawled under it. Ours, like the town. */
export function WelcomeSign() {
  return (
    <g>
      <rect x={-110} y={-260} width={14} height={260} fill={CEL.rock} />
      <rect x={96} y={-250} width={14} height={250} fill={CEL.rock} />
      <path d="M-140 -300 L140 -320 L150 -180 L-134 -170 Z" fill={CEL.sheet} />
      <Shade d="M-140 -300 L-60 -306 L-70 -174 L-134 -170 Z" fill={CEL.rust} />
      <circle cx={-118} cy={-290} r={4} fill={CEL.ink} data-bare />
      <circle cx={128} cy={-306} r={4} fill={CEL.ink} data-bare />
      <Upright>
        <g transform="rotate(-3)">
          <Word text="DUSTWATER" y={-268} size={50} fill={CEL.paper} line={7} />
          <Word text="POP. 12" x={-30} y={-212} size={34} fill={CEL.paper} line={6} />
          <path d="M14 -212 L60 -210" stroke={CEL.crit} strokeWidth="6" strokeLinecap="round" data-bare />
          <Word text="11" x={86} y={-196} size={34} fill={CEL.crit} line={6} />
        </g>
      </Upright>
    </g>
  )
}

/** Our little robot guide, 150 tall, facing left toward him: a squat tin can of cream and rust on one tread,
 *  two round lamp eyes, an antenna with a pennant, and one arm ([data-fx="{name}-arm"], turned at its shoulder
 *  (-34, -84)) to wave with. */
export function Robot({ name }: { name: string }) {
  return (
    <g>
      <rect x={-46} y={-34} width={92} height={34} rx={17} fill={CEL.inkSoft} />
      {[-26, 0, 26].map((x) => (
        <circle key={x} cx={x} cy={-17} r={9} fill={CEL.steel} />
      ))}
      <rect x={-14} y={-48} width={28} height={16} fill={CEL.steelDark} />
      <path d="M-44 -50 L-48 -126 Q-46 -140 -30 -140 L30 -140 Q46 -140 44 -126 L40 -50 Z" fill={CEL.paper} />
      <Shade d="M14 -140 L30 -140 Q46 -140 44 -126 L40 -50 L18 -50 Z" fill={CEL.paperShade} />
      <path d="M-44 -82 L42 -82 L41 -66 L-45 -66 Z" fill={CEL.rust} />
      <circle cx={-22} cy={-110} r={14} fill={CEL.ink} />
      <circle cx={-22} cy={-110} r={9} fill={CEL.sun} />
      <circle cx={10} cy={-110} r={14} fill={CEL.ink} />
      <circle cx={10} cy={-110} r={9} fill={CEL.sun} />
      <path d="M-10 -92 Q-6 -88 -2 -92" fill="none" stroke={CEL.ink} strokeWidth="3" data-bare />
      <path d="M20 -140 L24 -190" stroke={CEL.ink} strokeWidth="4" data-bare />
      <path d="M24 -190 L50 -182 L24 -174 Z" fill={CEL.red} />
      <g data-fx={`${name}-arm`} transform="rotate(0 -34 -84)">
        <path d="M-34 -84 L-74 -96" stroke={CEL.ink} strokeWidth="11" strokeLinecap="round" data-bare />
        <path d="M-34 -84 L-74 -96" stroke={CEL.steel} strokeWidth="6" strokeLinecap="round" data-bare />
        <path d="M-84 -108 L-70 -102 L-74 -90 L-88 -96 Z" fill={CEL.steelDark} />
      </g>
    </g>
  )
}

/** A raiders' runner car, 320 long, nose to the left: a buggy welded from scrap with a roll cage, a spiked ram
 *  and big rear wheels, a raider in a sack hood at the wheel. */
export function RunnerCar() {
  return (
    <g>
      <path d="M-160 -44 L-140 -96 L-40 -108 L60 -132 L150 -124 L166 -50 Z" fill={CEL.rust} />
      <Shade d="M-160 -44 L-150 -70 L166 -70 L166 -50 Z" fill={CEL.rock} />
      <path d="M-20 -110 L0 -190 L90 -190 L110 -128" fill="none" stroke={CEL.ink} strokeWidth="9" data-bare />
      <path d="M-160 -80 L-196 -90 L-160 -70 L-198 -64 L-160 -56 Z" fill={CEL.steelLight} />
      <g transform="translate(40 -132)">
        <path d="M-18 0 Q-22 -46 0 -48 Q22 -46 18 0 Z" fill={CEL.sack} />
        <Lines d="M-12 -30 l8 8 m0 -8 l-8 8 M-4 -14 h12" width={2.5} />
      </g>
      <circle cx={-110} cy={-38} r={34} fill={CEL.ink} />
      <circle cx={-110} cy={-38} r={12} fill={CEL.steel} />
      <circle cx={110} cy={-44} r={44} fill={CEL.ink} />
      <circle cx={110} cy={-44} r={15} fill={CEL.steel} />
    </g>
  )
}

/** A rusted oil barrel, 84 wide. */
export function Barrel() {
  return (
    <g>
      <rect x={-42} y={-124} width={84} height={124} rx={8} fill={CEL.red} />
      <Shade d="M14 -124 H34 Q42 -124 42 -116 V-8 Q42 0 34 0 H14 Z" fill={CEL.redShade} />
      <Lines d="M-42 -86 H42 M-42 -40 H42" />
      <ellipse cx={0} cy={-124} rx={42} ry={8} fill={CEL.rust} />
    </g>
  )
}

/** The town's gate, 320 wide: two leaves of corrugated sheet ([data-fx="gate-l|r"]) that slide apart between
 *  scrap posts topped with spikes, the dark street behind, a control box at the left post for the robot. */
export function TownGate() {
  return (
    <g>
      <rect x={-160} y={-340} width={320} height={340} fill={CEL.inkSoft} />
      <path d="M-160 -60 L-60 -120 L60 -100 L160 -60 L160 0 L-160 0 Z" fill={CEL.sheetShade} />
      {[-200, 160].map((x) => (
        <g key={x}>
          <rect x={x} y={-400} width={40} height={400} fill={CEL.rock} />
          <path d={`M${x} -400 L${x + 8} -440 L${x + 16} -400 L${x + 24} -450 L${x + 32} -400 L${x + 40} -436 L${x + 40} -400 Z`} fill={CEL.steelLight} />
        </g>
      ))}
      <g data-fx="gate-l">
        <rect x={-160} y={-330} width={160} height={330} fill={CEL.sheet} />
        <path d="M-150 -330 V0 M-120 -330 V0 M-90 -330 V0 M-60 -330 V0 M-30 -330 V0" stroke={CEL.sheetShade} strokeWidth="7" data-bare />
        <Shade d="M-160 -330 H-110 V0 H-160 Z" fill={CEL.rust} />
      </g>
      <g data-fx="gate-r">
        <rect x={0} y={-330} width={160} height={330} fill={CEL.sheet} />
        <path d="M150 -330 V0 M120 -330 V0 M90 -330 V0 M60 -330 V0 M30 -330 V0" stroke={CEL.sheetShade} strokeWidth="7" data-bare />
        <Shade d="M100 -200 Q130 -230 160 -200 V-120 H100 Z" fill={CEL.rust} cross />
      </g>
      <rect x={-236} y={-200} width={36} height={50} fill={CEL.steelDark} />
      <circle cx={-218} cy={-184} r={8} fill={CEL.crit} />
    </g>
  )
}

/** The bounty board, 220 wide on two posts: notices pinned to its planks, and the new bounty
 *  ([data-fx="{name}-new"], round (40, -260)) that flips up on it. */
export function BountyBoard({ name }: { name: string }) {
  return (
    <g>
      <path d="M-80 0 V-180 M80 0 V-180" stroke={CEL.plankShade} strokeWidth="14" data-bare />
      <rect x={-110} y={-330} width={220} height={170} fill={CEL.plank} />
      <rect x={-110} y={-330} width={220} height={170} fill={HATCH} opacity={0.15} data-bare />
      <Lines d="M-110 -274 H110 M-110 -218 H110" width={2.5} />
      {[-70, -20].map((x, i) => (
        <g key={x}>
          <rect x={x - 22} y={-310 + i * 10} width={44} height={58} fill={CEL.notice} />
          <circle cx={x} cy={-310 + i * 10} r={5} fill={CEL.red} />
        </g>
      ))}
      <g data-fx={`${name}-new`} opacity="0" transform="translate(50 -250)">
        <rect x={-40} y={-56} width={80} height={100} fill={CEL.sun} />
        <Upright>
          <Word text="!" y={-10} size={64} fill={CEL.crit} line={8} />
          <Word text="BOUNTY" y={30} size={20} fill={CEL.ink} line={0} />
        </Upright>
        <circle cx={0} cy={-56} r={6} fill={CEL.red} />
      </g>
    </g>
  )
}
