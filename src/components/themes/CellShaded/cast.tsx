import type { ReactNode } from 'react'
import { Burst } from './ink'
import { CEL } from './palette'

// Who and what he meets on the way to the door in the cliff, drawn the way the world draws everything (flat
// fills under the ink line the scene's canvas gives every shape, a shape marked data-bare without it): the
// bus and its stop, our own small robot guide, the raider cars, the town gate, the voice's waveform, the
// beasts of the gully, the station's console and the car it builds, the mine boss, the chest and the relic,
// the flock, the dig's tent and the relic's hologram, the gunner on his hill, the hive, the key and its
// slots, the door in the cliff and the soldiers at its foot, the salt camp, the thing from the vault, the
// satellite and the map. Each is drawn round its foot (y 0 the sand) facing him unless its doc says
// otherwise; what a scene moves inside one is a `data-fx` group. None is a character of the game: the
// robot, the bosses, the raiders, the beasts and the thing from the vault are ours (concept, Kept out).

/** A group a scene moves or fades, hidden at first when `hidden`. */
export function Fx({ name, hidden = false, transform, children }: { name: string; hidden?: boolean; transform?: string; children: ReactNode }) {
  return (
    <g data-fx={name} opacity={hidden ? 0 : undefined} transform={transform}>
      {children}
    </g>
  )
}

// ---- the road ----

/** The bus, 560 long, its door at x 0, its nose to the right. */
export function Bus() {
  return (
    <g>
      <rect x={-380} y={-250} width={560} height={210} rx={26} fill={CEL.sun} />
      <rect x={-380} y={-110} width={560} height={30} fill={CEL.orange} />
      {[-340, -250, -160, -70].map((x) => (
        <rect key={x} x={x} y={-226} width={70} height={70} rx={8} fill={CEL.noonLow} />
      ))}
      <rect x={-28} y={-226} width={56} height={186} fill={CEL.steelDark} />
      <rect x={110} y={-226} width={58} height={90} rx={10} fill={CEL.noonLow} />
      <circle cx={-260} cy={-38} r={36} fill={CEL.ink} />
      <circle cx={90} cy={-38} r={36} fill={CEL.ink} />
      <circle cx={-260} cy={-38} r={14} fill={CEL.steel} />
      <circle cx={90} cy={-38} r={14} fill={CEL.steel} />
    </g>
  )
}

/** The lone stop: a post with a sign that says nothing, and its bench. */
export function BusStop() {
  return (
    <g>
      <rect x={-6} y={-300} width={12} height={300} fill={CEL.steelDark} />
      <circle cx={0} cy={-310} r={36} fill={CEL.red} />
      <rect x={-22} y={-316} width={44} height={12} fill={CEL.paper} />
      <rect x={30} y={-60} width={120} height={14} fill={CEL.plank} />
      <rect x={40} y={-46} width={10} height={46} fill={CEL.plankShade} />
      <rect x={130} y={-46} width={10} height={46} fill={CEL.plankShade} />
    </g>
  )
}

/** A puff of dust, a cartoon cloud 160 across round its middle. */
export function Dust() {
  return (
    <g>
      {[
        [-50, 0, 40],
        [0, -24, 50],
        [54, -4, 38],
        [10, 18, 34],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={CEL.dune} />
      ))}
    </g>
  )
}

/** Our small robot guide, 120 tall, facing left toward him: a round teal body on one wheel, two lamp eyes,
 *  a stubby antenna, and one arm ([data-fx="{name}-arm"], turned at its shoulder) to wave with. */
export function Robot({ name }: { name: string }) {
  return (
    <g>
      <circle cx={0} cy={-22} r={22} fill={CEL.ink} />
      <circle cx={0} cy={-22} r={9} fill={CEL.steel} />
      <rect x={-8} y={-54} width={16} height={18} fill={CEL.steelDark} />
      <ellipse cx={0} cy={-90} rx={42} ry={40} fill={CEL.holo} />
      <path d="M18 -120 Q26 -112 32 -92 L40 -94 Q34 -116 26 -124 Z" fill={CEL.holoDeep} data-bare />
      <circle cx={-18} cy={-96} r={9} fill={CEL.sun} />
      <circle cx={2} cy={-98} r={9} fill={CEL.sun} />
      <rect x={-3} y={-150} width={6} height={22} fill={CEL.steelDark} />
      <circle cx={0} cy={-154} r={7} fill={CEL.red} />
      <g data-fx={`${name}-arm`} transform="rotate(0 -30 -80)">
        <rect x={-74} y={-86} width={46} height={12} rx={6} fill={CEL.steelDark} />
        <circle cx={-78} cy={-80} r={10} fill={CEL.steel} />
      </g>
    </g>
  )
}

/** A raider car, 300 long, nose to the right: a scrap buggy with a roll bar, spikes on its nose. */
export function RaiderCar() {
  return (
    <g>
      <path d="M-150 -40 L-130 -110 L60 -110 L120 -70 L160 -60 L150 -30 Z" fill={CEL.mesa} />
      <path d="M-60 -110 L-40 -170 L40 -170 L50 -110" fill="none" stroke={CEL.ink} strokeWidth="8" data-bare />
      <path d="M150 -60 L184 -66 L150 -48 L184 -44 L150 -36 Z" fill={CEL.steel} />
      <circle cx={-100} cy={-34} r={34} fill={CEL.ink} />
      <circle cx={100} cy={-34} r={34} fill={CEL.ink} />
      <circle cx={-100} cy={-34} r={12} fill={CEL.steel} />
      <circle cx={100} cy={-34} r={12} fill={CEL.steel} />
    </g>
  )
}

/** A rusted oil barrel, 80 wide. */
export function Barrel() {
  return (
    <g>
      <rect x={-40} y={-120} width={80} height={120} rx={8} fill={CEL.red} />
      <path d="M-40 -84 H40 M-40 -40 H40" stroke={CEL.redShade} strokeWidth="8" data-bare />
    </g>
  )
}

/** The scrap gate of the town, 300 wide: two leaves of corrugated sheet ([data-fx="gate-l|r"]) that slide
 *  apart, a sign arch over them, the plaza behind. */
export function TownGate() {
  return (
    <g>
      <rect x={-150} y={-340} width={300} height={340} fill={CEL.dune} />
      <rect x={-190} y={-380} width={40} height={380} fill={CEL.rock} />
      <rect x={150} y={-380} width={40} height={380} fill={CEL.rock} />
      <rect x={-200} y={-420} width={400} height={50} fill={CEL.plankShade} />
      <g data-fx="gate-l">
        <rect x={-150} y={-330} width={150} height={330} fill={CEL.steel} />
        <path d="M-130 -330 V0 M-100 -330 V0 M-70 -330 V0 M-40 -330 V0" stroke={CEL.steelDark} strokeWidth="6" data-bare />
      </g>
      <g data-fx="gate-r">
        <rect x={0} y={-330} width={150} height={330} fill={CEL.steel} />
        <path d="M130 -330 V0 M100 -330 V0 M70 -330 V0 M40 -330 V0" stroke={CEL.steelDark} strokeWidth="6" data-bare />
      </g>
    </g>
  )
}

/** The bounty board with three notices pinned to it. */
export function BountyBoard() {
  return (
    <g>
      <path d="M-60 0 V-170 M60 0 V-170" stroke={CEL.plankShade} strokeWidth="12" data-bare />
      <rect x={-90} y={-300} width={180} height={140} fill={CEL.plank} />
      {[-60, 0, 60].map((x, i) => (
        <g key={x}>
          <rect x={x - 24} y={-286 + (i % 2) * 8} width={48} height={60} fill={CEL.notice} />
          <circle cx={x} cy={-286 + (i % 2) * 8} r={5} fill={CEL.red} />
        </g>
      ))}
    </g>
  )
}

/** The voice in his ear, a waveform of five bars 90 wide round its middle, each bar ([data-fx="{name}-{i}"])
 *  scaled by the voice. */
export function Waveform({ name }: { name: string }) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} data-fx={`${name}-${i}`} x={-45 + i * 20} y={-30} width={10} height={60} rx={5} fill={CEL.holo} transform="scale(1 0.2)" />
      ))}
    </g>
  )
}

// ---- the gully ----

/** The rock pile that blocks the gully, 260 wide. */
export function RockPile() {
  return (
    <g>
      <path d="M-130 0 L-110 -90 L-60 -130 L-10 -100 L40 -160 L100 -110 L130 0 Z" fill={CEL.rock} />
      <path d="M-60 -130 L-40 -40 M40 -160 L30 -60" stroke={CEL.ink} strokeWidth="4" data-bare />
    </g>
  )
}

/** The detonator: a box with a T plunger ([data-fx="plunger"], pushed down by its translate). */
export function Detonator() {
  return (
    <g>
      <rect x={-34} y={-50} width={68} height={50} fill={CEL.red} />
      <g data-fx="plunger">
        <rect x={-4} y={-110} width={8} height={62} fill={CEL.steelDark} />
        <rect x={-30} y={-118} width={60} height={12} rx={4} fill={CEL.steelDark} />
      </g>
    </g>
  )
}

/** A desert beast, 170 long, facing left toward him: a low four legged hide with a ridge of spikes and a
 *  wide jaw. */
export function Beast() {
  return (
    <g>
      <path d="M-50 0 L-40 -40 M-10 0 L-10 -40 M30 0 L30 -40 M60 0 L56 -40" stroke={CEL.ink} strokeWidth="12" data-bare />
      <path d="M-86 -60 Q-80 -110 -20 -110 Q60 -112 84 -70 Q80 -36 40 -36 L-60 -36 Q-90 -40 -86 -60 Z" fill={CEL.scrub} />
      <path d="M-40 -110 L-30 -132 L-20 -110 M0 -112 L10 -136 L20 -112 M40 -108 L50 -128 L58 -102" fill={CEL.scrubShade} />
      <path d="M-86 -60 L-110 -56 L-86 -44 Z" fill={CEL.paper} />
      <circle cx={-64} cy={-80} r={6} fill={CEL.crit} />
    </g>
  )
}

/** The bandit boss, 330 tall, facing left: a big raider in a horned iron mask with a cleaver. */
export function BanditBoss() {
  return (
    <g>
      <path d="M-40 0 L-34 -130 L-6 -130 L-10 0 Z M12 0 L8 -130 L36 -130 L42 0 Z" fill={CEL.denimShade} />
      <path d="M-60 -124 L-54 -250 Q0 -270 54 -250 L60 -124 Z" fill={CEL.rock} />
      <path d="M-60 -190 L60 -190 L60 -172 L-60 -172 Z" fill={CEL.plankShade} />
      <path d="M-40 -256 Q-42 -320 0 -324 Q42 -320 40 -256 Z" fill={CEL.steel} />
      <path d="M-24 -296 L-8 -288 M24 -296 L8 -288" stroke={CEL.crit} strokeWidth="7" strokeLinecap="round" data-bare />
      <path d="M-40 -310 L-70 -344 L-44 -300 M40 -310 L70 -344 L44 -300" fill={CEL.paper} />
      <path d="M-58 -200 L-104 -150 L-92 -140 L-50 -186 Z" fill={CEL.rock} />
      <path d="M-104 -150 L-130 -240 L-96 -250 L-90 -150 Z" fill={CEL.steel} />
    </g>
  )
}

/** A crate whose lid ([data-fx="{name}-lid"]) flips open, 130 wide. */
export function Crate({ name }: { name: string }) {
  return (
    <g>
      <rect x={-65} y={-90} width={130} height={90} fill={CEL.steelDark} />
      <path d="M-65 -60 H65" stroke={CEL.sun} strokeWidth="6" data-bare />
      <g data-fx={`${name}-lid`}>
        <rect x={-70} y={-110} width={140} height={22} fill={CEL.steel} />
      </g>
    </g>
  )
}

/** A gun in a rarity's light, 120 long, the glow behind it. */
export function LootGun({ color }: { color: string }) {
  return (
    <g>
      <circle r={70} fill={color} opacity={0.35} data-bare />
      <path d="M-60 -10 L40 -10 L60 -16 L60 -4 L40 0 L-10 0 L-20 24 L-36 24 L-30 0 L-60 0 Z" fill={color} />
    </g>
  )
}

// ---- the station ----

/** The car station's console, 90 wide, its screen ([data-fx="console-light"]) lit when the part is in. */
export function Console() {
  return (
    <g>
      <rect x={-45} y={-200} width={90} height={200} fill={CEL.steelDark} />
      <rect x={-32} y={-180} width={64} height={46} fill={CEL.night} />
      <rect data-fx="console-light" x={-32} y={-180} width={64} height={46} fill={CEL.uncommon} opacity="0" />
      <rect x={-14} y={-110} width={28} height={30} fill={CEL.ink} />
    </g>
  )
}

/** The stolen part, a cog 60 across. */
export function Part() {
  return (
    <g>
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x={-8} y={-32} width={16} height={64} fill={CEL.steel} transform={`rotate(${a})`} />
      ))}
      <circle r={22} fill={CEL.steel} />
      <circle r={9} fill={CEL.ink} />
    </g>
  )
}

/** A fast four wheeler, 320 long, nose to the right, its seat at (-20, -90). */
export function Runner() {
  return (
    <g>
      <path d="M-160 -40 L-140 -100 L-40 -100 L0 -80 L140 -76 L170 -40 Z" fill={CEL.skyDeep} />
      <path d="M-80 -100 L-60 -160 L20 -160 L30 -100" fill="none" stroke={CEL.ink} strokeWidth="8" data-bare />
      <circle cx={-110} cy={-36} r={36} fill={CEL.ink} />
      <circle cx={110} cy={-36} r={36} fill={CEL.ink} />
      <circle cx={-110} cy={-36} r={13} fill={CEL.steel} />
      <circle cx={110} cy={-36} r={13} fill={CEL.steel} />
    </g>
  )
}

// ---- the mine ----

/** The mine boss, 380 tall, facing left: a hulk in a miner's lamp helmet, a sledge in his near hand
 *  ([data-fx="sledge"], turned at the shoulder (-40, -260)). */
export function MineBoss() {
  return (
    <g>
      <path d="M-56 0 L-48 -140 L-10 -140 L-14 0 Z M16 0 L12 -140 L50 -140 L56 0 Z" fill={CEL.denimShade} />
      <path d="M-90 -130 Q-100 -300 0 -310 Q100 -300 90 -130 Z" fill={CEL.orange} />
      <path d="M-90 -200 L90 -200 L90 -180 L-90 -180 Z" fill={CEL.rock} />
      <path d="M-40 -310 Q-44 -370 0 -374 Q44 -370 40 -310 Z" fill={CEL.paperShade} />
      <path d="M-44 -360 Q0 -400 44 -360 L44 -346 L-44 -346 Z" fill={CEL.sun} />
      <circle cx={-30} cy={-354} r={9} fill={CEL.paper} />
      <path d="M-24 -332 L-8 -326" stroke={CEL.ink} strokeWidth="6" data-bare />
      <g data-fx="sledge" transform="rotate(0 -40 -260)">
        <path d="M-40 -260 L-180 -300" stroke={CEL.plankShade} strokeWidth="14" strokeLinecap="round" data-bare />
        <rect x={-220} y={-340} width={60} height={80} rx={8} fill={CEL.steelDark} />
      </g>
    </g>
  )
}

/** The scrap throne, 160 wide. */
export function Throne() {
  return (
    <g>
      <rect x={-80} y={-110} width={160} height={110} fill={CEL.rock} />
      <path d="M-80 -110 L-60 -300 L-20 -260 L0 -320 L20 -260 L60 -300 L80 -110 Z" fill={CEL.plankShade} />
    </g>
  )
}

/** The alien relic, 70 tall round its middle: a pale spiral shell of light, no writing on it. */
export function Relic() {
  return (
    <g>
      <circle r={60} fill={CEL.epic} opacity={0.3} data-bare />
      <path d="M0 -36 Q30 -30 28 0 Q26 30 0 34 Q-26 30 -22 6 Q-18 -14 2 -12 Q16 -8 12 6" fill={CEL.holo} />
      <circle cx={0} cy={0} r={6} fill={CEL.white} />
    </g>
  )
}

// ---- the dig ----

/** A diving flyer, 120 across, its wings swept back as it dives at him from the upper right. */
export function Flyer() {
  return (
    <g>
      <path d="M0 0 L-60 -30 L-20 -6 L-50 20 Z" fill={CEL.magenta} />
      <path d="M0 0 L40 -40 L20 0 Z" fill={CEL.magenta} />
      <ellipse cx={-6} cy={0} rx={30} ry={14} fill={CEL.rock} transform="rotate(-30)" />
      <path d="M-30 14 L-46 22 L-30 22 Z" fill={CEL.sun} />
    </g>
  )
}

/** The dig's tent, 300 wide, with its work table ([data-fx="table-top"] at (0, -100)). */
export function Tent() {
  return (
    <g>
      <path d="M-150 0 L0 -300 L150 0 Z" fill={CEL.paperShade} />
      <path d="M-60 0 L0 -180 L60 0 Z" fill={CEL.rock} />
      <rect x={-110} y={-100} width={220} height={14} fill={CEL.plank} />
      <rect x={-100} y={-86} width={12} height={86} fill={CEL.plankShade} />
      <rect x={88} y={-86} width={12} height={86} fill={CEL.plankShade} />
    </g>
  )
}

/** A shiny boulder, `r` across. */
export function Boulder({ r }: { r: number }) {
  return (
    <g>
      <path d={`M${-r} 0 Q${-r} ${-r * 1.2} 0 ${-r * 1.1} Q${r} ${-r * 1.2} ${r} 0 Z`} fill={CEL.steel} />
      <path d={`M${-r * 0.4} ${-r * 0.8} L${-r * 0.1} ${-r * 0.5}`} stroke={CEL.white} strokeWidth="6" strokeLinecap="round" data-bare />
    </g>
  )
}

/** The key the relic shows, three slots in a row 240 wide round its middle, each slot's piece
 *  ([data-fx="{name}-{i}"]) hidden until won. */
export function KeySlots({ name, color }: { name: string; color: string }) {
  return (
    <g>
      <rect x={-130} y={-40} width={260} height={80} rx={14} fill={CEL.ink} opacity={0.7} data-bare />
      {[-80, 0, 80].map((x, i) => (
        <g key={x}>
          <rect x={x - 30} y={-28} width={60} height={56} rx={8} fill="none" stroke={CEL.holo} strokeWidth="4" strokeDasharray="8 6" data-bare />
          <g data-fx={`${name}-${i}`} opacity="0">
            <path d={`M${x - 24} -22 H${x + 24} V22 H${x - 24} Z`} fill={color} />
          </g>
        </g>
      ))}
    </g>
  )
}

/** The relic's hologram over the table: a door cut in a cliff, the count of two hundred as tally marks, and
 *  the key's three empty slots, in the hologram's light. */
export function Hologram() {
  return (
    <g>
      <path d="M-160 0 L-40 -360 L40 -360 L160 0 Z" fill={CEL.holo} opacity={0.18} data-bare />
      <path d="M-130 -150 L-120 -330 L120 -330 L130 -150 Z" fill="none" stroke={CEL.holo} strokeWidth="4" data-bare />
      <path d="M-40 -170 V-280 Q0 -310 40 -280 V-170 Z" fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      {[0, 1].map((g) => (
        <path key={g} d={`M${-110 + g * 50} -300 v30 m8 -30 v30 m8 -30 v30 m8 -30 v30 m-36 22 l40 -44`} stroke={CEL.holo} strokeWidth="3" data-bare />
      ))}
      {[-60, 0, 60].map((x) => (
        <rect key={x} x={x - 20} y={-140} width={40} height={36} rx={6} fill="none" stroke={CEL.holo} strokeWidth="4" strokeDasharray="6 5" data-bare />
      ))}
    </g>
  )
}

// ---- the hill, the hive and the door ----

/** A hilltop gunner behind his heavy gun, 160 tall, facing left; he slumps ([data-fx="gunner"]). */
export function Gunner() {
  return (
    <g>
      <path d="M-200 0 Q-120 -120 0 -130 Q140 -120 220 0 Z" fill={CEL.mesa} />
      <g transform="translate(20 -128)">
        <rect x={-60} y={-40} width={100} height={40} fill={CEL.steelDark} />
        <rect x={-130} y={-30} width={80} height={14} fill={CEL.ink} />
        <g data-fx="gunner">
          <path d="M10 -40 L4 -130 Q30 -144 52 -130 L46 -40 Z" fill={CEL.rock} />
          <circle cx={28} cy={-150} r={22} fill={CEL.paperShade} />
          <path d="M14 -154 L24 -150" stroke={CEL.ink} strokeWidth="5" data-bare />
        </g>
      </g>
    </g>
  )
}

/** The hive, a hill of pale flesh 340 wide with three eyes ([data-fx="eye-{i}"]) that burst when shot. */
export function Hive() {
  return (
    <g>
      <path d="M-170 0 Q-180 -220 -40 -260 Q120 -290 170 -120 Q186 -40 160 0 Z" fill={CEL.paperShade} />
      <path d="M-120 -60 Q-60 -120 0 -80 M20 -200 Q80 -170 120 -110" stroke={CEL.magenta} strokeWidth="6" fill="none" data-bare />
      {[
        [-60, -170],
        [10, -200],
        [80, -160],
      ].map(([x, y], i) => (
        <g key={x} data-fx={`eye-${i}`}>
          <circle cx={x} cy={y} r={20} fill={CEL.white} />
          <circle cx={x - 6} cy={y} r={9} fill={CEL.crit} />
        </g>
      ))}
    </g>
  )
}

/** A brood flyer the hive throws, 50 across. */
export function Brood() {
  return (
    <g>
      <ellipse rx={22} ry={16} fill={CEL.magenta} />
      <path d="M-10 -12 L-26 -30 L0 -16 Z M10 -12 L26 -30 L4 -16 Z" fill={CEL.paperShade} />
    </g>
  )
}

/** The great door in the cliff, the cliff 520 wide and 600 tall: the door's two halves ([data-fx="door-l|r"])
 *  slide apart on the light behind ([data-fx="door-light"]). */
export function CliffDoor() {
  return (
    <g>
      <path d="M-260 0 L-240 -560 L-120 -600 L120 -590 L250 -540 L260 0 Z" fill={CEL.mesaShade} />
      <path d="M-110 0 V-330 Q0 -400 110 -330 V0 Z" fill={CEL.ink} />
      <g data-fx="door-light" opacity="0">
        <path d="M-110 0 V-330 Q0 -400 110 -330 V0 Z" fill={CEL.uncommon} opacity={0.7} data-bare />
      </g>
      <g data-fx="door-l">
        <path d="M-110 0 V-330 Q-60 -364 0 -366 V0 Z" fill={CEL.steelDark} />
        <circle cx={-40} cy={-200} r={18} fill={CEL.uncommon} />
      </g>
      <g data-fx="door-r">
        <path d="M110 0 V-330 Q60 -364 0 -366 V0 Z" fill={CEL.steelDark} />
        <circle cx={40} cy={-200} r={18} fill={CEL.uncommon} />
      </g>
    </g>
  )
}

/** Armoured soldiers at the door's foot, five small figures 70 tall in a row 200 wide. */
export function Soldiers() {
  return (
    <g>
      {[-100, -50, 0, 50, 100].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d="M-12 0 L-10 -40 L10 -40 L12 0 Z" fill={CEL.steelDark} />
          <rect x={-14} y={-60} width={28} height={22} fill={CEL.steel} />
          <circle cx={0} cy={-68} r={10} fill={CEL.steel} />
        </g>
      ))}
    </g>
  )
}

// ---- the salt flats ----

/** The camp on stilts: a deck 400 wide `high` above the sand from x 0, its wall, the empty chest on it. */
export function SaltCamp({ high }: { high: number }) {
  return (
    <g>
      {[20, 160, 300, 380].map((x) => (
        <rect key={x} x={x} y={-high} width={16} height={high} fill={CEL.plankShade} />
      ))}
      <rect x={0} y={-high - 20} width={420} height={24} fill={CEL.plank} />
      <rect x={380} y={-high - 140} width={40} height={124} fill={CEL.plankShade} />
    </g>
  )
}

/** The elevator cage, 140 wide and 260 tall ([data-fx="cage"], raised by its translate). */
export function Cage() {
  return (
    <g data-fx="cage">
      <rect x={-70} y={-260} width={140} height={14} fill={CEL.steelDark} />
      <rect x={-70} y={-12} width={140} height={14} fill={CEL.steelDark} />
      <path d="M-66 -250 V-6 M-30 -250 V-6 M30 -250 V-6 M66 -250 V-6" stroke={CEL.steelDark} strokeWidth="6" data-bare />
    </g>
  )
}

/** A raider coming over the wall, 200 tall, facing left. */
export function Raider() {
  return (
    <g>
      <path d="M-24 0 L-20 -80 L-4 -80 L-6 0 Z M6 0 L4 -80 L20 -80 L24 0 Z" fill={CEL.denimShade} />
      <path d="M-30 -76 L-26 -150 Q0 -160 26 -150 L30 -76 Z" fill={CEL.rock} />
      <path d="M-22 -154 Q-24 -196 0 -198 Q24 -196 22 -154 Z" fill={CEL.paperShade} />
      <path d="M-14 -178 L-4 -174" stroke={CEL.ink} strokeWidth="5" data-bare />
      <path d="M-26 -140 L-64 -110" stroke={CEL.steelDark} strokeWidth="8" strokeLinecap="round" data-bare />
    </g>
  )
}

// ---- the court before the door ----

/** A stone pillar, 90 wide and 320 tall. */
export function Pillar() {
  return (
    <g>
      <rect x={-45} y={-320} width={90} height={320} fill={CEL.steel} />
      <rect x={-56} y={-340} width={112} height={26} fill={CEL.steelDark} />
      <path d="M-20 -300 V-20 M20 -300 V-20" stroke={CEL.steelDark} strokeWidth="5" data-bare />
    </g>
  )
}

/** The thing from the vault, 640 tall, rising behind the court: a great dark body with one eye (its lid,
 *  [data-fx="lid"], scaled shut) and a tentacle ([data-fx="tentacle"]) reaching down to the court, with
 *  three glowing weak points on it ([data-fx="spot-{i}"]). */
export function VaultThing() {
  return (
    <g>
      <path d="M-200 0 Q-260 -400 -80 -620 Q60 -680 180 -540 Q300 -300 220 0 Z" fill={CEL.night} />
      <g transform="translate(0 -440)">
        <ellipse rx={80} ry={56} fill={CEL.sun} />
        <circle r={30} fill={CEL.crit} />
        <circle r={12} fill={CEL.ink} />
        <g data-fx="lid">
          <ellipse rx={84} ry={60} fill={CEL.nightLow} />
        </g>
      </g>
      <g data-fx="tentacle">
        <path d="M-160 -300 Q-300 -280 -330 -160 Q-350 -40 -280 0 L-240 0 Q-300 -60 -280 -160 Q-250 -250 -140 -260 Z" fill={CEL.nightLow} />
        {[
          [-300, -170],
          [-310, -80],
          [-250, -250],
        ].map(([x, y], i) => (
          <circle key={x + y} data-fx={`spot-${i}`} cx={x} cy={y} r={14} fill={CEL.uncommon} />
        ))}
      </g>
    </g>
  )
}

/** The eye's laser, a beam 900 long out to the left from its root, turned by the scene. */
export function Laser() {
  return (
    <g>
      <rect x={-900} y={-10} width={900} height={20} fill={CEL.crit} data-bare />
      <rect x={-900} y={-4} width={900} height={8} fill={CEL.sun} data-bare />
    </g>
  )
}

// ---- the night ----

/** The satellite's light, a small bright point with two panels, crossing the stars. */
export function Satellite() {
  return (
    <g>
      <circle r={22} fill={CEL.holo} opacity={0.35} data-bare />
      <rect x={-26} y={-5} width={18} height={10} fill={CEL.steel} />
      <rect x={8} y={-5} width={18} height={10} fill={CEL.steel} />
      <circle r={7} fill={CEL.white} />
    </g>
  )
}

/** The map he unfolds, 220 by 150 round its middle ([data-fx="map"] unfolds by its x scale), with new doors
 *  across it ([data-fx="pin-{i}"], lit in turn). */
export const PINS = [
  [-70, -30],
  [-20, 40],
  [40, -46],
  [80, 20],
  [-80, 46],
  [10, -6],
  [66, -10],
] as const

export function WorldMap() {
  return (
    <g data-fx="map">
      <rect x={-110} y={-75} width={220} height={150} fill={CEL.paper} />
      <path d="M-110 -75 L-36 -60 L36 -80 L110 -60 V75 L36 60 L-36 80 L-110 60 Z" fill={CEL.notice} />
      <path d="M-36 -60 V80 M36 -80 V60" stroke={CEL.paperShade} strokeWidth="3" data-bare />
      <path d="M-90 10 Q-40 -30 0 0 Q40 30 90 -20" stroke={CEL.duneShade} strokeWidth="4" fill="none" data-bare />
      {PINS.map(([x, y], i) => (
        <g key={i} data-fx={`pin-${i}`} opacity="0">
          <Burst x={x} y={y} r={12} fill={CEL.legendary} />
        </g>
      ))}
    </g>
  )
}

/** The respawn pad nearby, its ring glowing in the dark, 220 wide. */
export function Pad() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={110} ry={18} fill={CEL.steelDark} />
      <ellipse cx={0} cy={0} rx={90} ry={12} fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      <path d="M-90 0 L-70 -200 L70 -200 L90 0 Z" fill={CEL.holo} opacity={0.12} data-bare />
    </g>
  )
}

/** The frame's edges gone red while he is down: clear round him, deepening to the crit red past the screen's
 *  edges, a gradient on a field wider than any screen so no edge of it shows. */
export function RedEdges() {
  return (
    <g data-fx="red-edges" opacity="0">
      <defs>
        <radialGradient id="cel-red-edges" gradientUnits="userSpaceOnUse" cx={0} cy={-260} r={900}>
          <stop offset="0.45" stopColor={CEL.crit} stopOpacity="0" />
          <stop offset="1" stopColor={CEL.crit} stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect x={-2400} y={-2000} width={4800} height={3200} fill="url(#cel-red-edges)" data-bare />
    </g>
  )
}
