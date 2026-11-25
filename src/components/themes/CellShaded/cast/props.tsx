import { Upright, Word } from '../hud'
import { Burst, Lines, Shade } from '../ink'
import { CEL } from '../palette'

// What he blows, opens, builds and carries on the way to the vault, drawn like the rest of the wasteland
// (the stop's heavy ink line, hatched shadow sides, ink seams): the gully's rock pile and the detonator, a
// loot chest and a gun in its rarity's light, the station's console, the stolen part, the lookout tower and
// the pad with the runner it builds, the mine's head frame and the boss's throne, the relic, the dig's table
// and its hologram, the key, the salt camp's deck and lift, the vault's pillar, door and laser, the satellite,
// the map and the red edges of a fall. Each is drawn round its foot (y 0 the ground) unless its doc says
// otherwise; what a scene moves inside one is a `data-fx` group.

/** The rock pile that blocks the gully, 280 wide, its shadow side hatched. */
export function RockPile() {
  return (
    <g>
      <path d="M-140 0 L-120 -96 L-64 -140 L-10 -110 L44 -170 L104 -116 L140 0 Z" fill={CEL.mesa} />
      <Shade d="M44 -170 L104 -116 L140 0 L60 0 L70 -90 Z" fill={CEL.mesaShade} />
      <Lines d="M-64 -140 L-44 -40 M44 -170 L30 -60 M-120 -60 L-60 -50" />
    </g>
  )
}

/** The detonator: a box with a T plunger ([data-fx="plunger"], pushed down by its translate) and its wire. */
export function Detonator() {
  return (
    <g>
      <path d="M30 -10 Q120 10 200 -4" fill="none" stroke={CEL.ink} strokeWidth="4" data-bare />
      <rect x={-34} y={-52} width={68} height={52} fill={CEL.red} />
      <Shade d="M14 -52 H34 V0 H14 Z" fill={CEL.redShade} />
      <g data-fx="plunger">
        <rect x={-4} y={-112} width={8} height={62} fill={CEL.steelDark} />
        <rect x={-30} y={-120} width={60} height={12} rx={4} fill={CEL.steelDark} />
      </g>
    </g>
  )
}

/** A loot chest, 150 wide, steel with a rarity stripe: its lid ([data-fx="{name}-lid"]) flips open round its
 *  back hinge (70, -104) and its light ([data-fx="{name}-light"]) rises in the colour. */
export function Chest({ name, color }: { name: string; color: string }) {
  return (
    <g>
      <g data-fx={`${name}-light`} opacity="0">
        <path d="M-60 -100 L-110 -420 L110 -420 L60 -100 Z" fill={color} opacity={0.35} data-bare />
      </g>
      <rect x={-75} y={-100} width={150} height={100} fill={CEL.steelDark} />
      <Shade d="M30 -100 H75 V0 H30 Z" cross />
      <path d="M-75 -62 H75" stroke={color} strokeWidth="8" data-bare />
      <g data-fx={`${name}-lid`}>
        <path d="M-80 -100 L-80 -118 Q0 -140 80 -118 L80 -100 Z" fill={CEL.steel} />
      </g>
    </g>
  )
}

/** A gun in a rarity's light, 130 long round its grip, the glow behind it. */
export function LootGun({ color }: { color: string }) {
  return (
    <g>
      <circle r={70} fill={color} opacity={0.35} data-bare />
      <path d="M-64 -12 L44 -12 L66 -18 L66 -4 L44 0 L-10 0 L-20 26 L-38 26 L-32 0 L-64 0 Z" fill={color} />
      <Lines d="M-50 -6 H30" width={2.5} />
    </g>
  )
}

/** The car station's console, 100 wide: its screen ([data-fx="console-light"]) lit when the part is in. */
export function Console() {
  return (
    <g>
      <path d="M-50 0 L-50 -190 L40 -210 L50 0 Z" fill={CEL.steelDark} />
      <Shade d="M20 -206 L40 -210 L50 0 L24 0 Z" cross />
      <rect x={-36} y={-180} width={66} height={48} fill={CEL.night} />
      <rect data-fx="console-light" x={-36} y={-180} width={66} height={48} fill={CEL.uncommon} opacity="0" />
      <rect x={-16} y={-112} width={30} height={30} fill={CEL.ink} />
    </g>
  )
}

/** The stolen part, a cog 60 across round its middle. */
export function Part() {
  return (
    <g>
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x={-8} y={-32} width={16} height={64} fill={CEL.steelLight} transform={`rotate(${a})`} />
      ))}
      <circle r={22} fill={CEL.steelLight} />
      <circle r={9} fill={CEL.ink} />
    </g>
  )
}

/** The raiders' lookout tower, 360 tall: a platform of scrap on four stilts, a sheet roof. */
export function Tower() {
  return (
    <g>
      <path d="M-70 0 L-50 -300 M70 0 L50 -300 M-60 -150 L60 -150 M-66 -60 L56 -240 M66 -60 L-56 -240" stroke={CEL.ink} strokeWidth="14" data-bare />
      <path d="M-70 0 L-50 -300 M70 0 L50 -300" stroke={CEL.plankShade} strokeWidth="8" data-bare />
      <rect x={-90} y={-320} width={180} height={26} fill={CEL.plank} />
      <path d="M-100 -320 L-90 -360 L90 -360 L100 -320" fill={CEL.sheet} />
      <path d="M-100 -470 L110 -490 L100 -460 L-104 -444 Z" fill={CEL.rust} />
      <path d="M-90 -450 L-90 -360 M90 -470 L90 -360" stroke={CEL.ink} strokeWidth="8" data-bare />
    </g>
  )
}

/** The station's pad, 360 wide: a steel plate with the build light's emitters at each end. */
export function Pad() {
  return (
    <g>
      <path d="M-180 0 L-160 -24 L160 -24 L180 0 Z" fill={CEL.steelDark} />
      <path d="M-150 -12 H150" stroke={CEL.holo} strokeWidth="5" strokeDasharray="18 10" data-bare />
      {[-190, 190].map((x) => (
        <g key={x}>
          <rect x={x - 12} y={-150} width={24} height={150} fill={CEL.steel} />
          <circle cx={x} cy={-150} r={12} fill={CEL.holo} />
        </g>
      ))}
    </g>
  )
}

/** His runner, 340 long round its middle, nose to the right, its seat at (-30, -96): a buggy of clean steel
 *  and sky blue with a roll cage and big wheels. */
export function Runner() {
  return (
    <g>
      <path d="M-170 -44 L-150 -104 L-40 -108 L10 -84 L150 -80 L176 -44 Z" fill={CEL.skyDeep} />
      <Shade d="M-170 -44 L-160 -70 L176 -70 L176 -44 Z" fill={CEL.holoDeep} />
      <path d="M-90 -106 L-70 -176 L20 -176 L34 -96" fill="none" stroke={CEL.ink} strokeWidth="9" data-bare />
      <path d="M150 -80 L170 -110 L184 -76" fill={CEL.steelLight} />
      {[-116, 116].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-40} r={40} fill={CEL.ink} />
          <circle cx={x} cy={-40} r={15} fill={CEL.steel} />
        </g>
      ))}
    </g>
  )
}

/** The runner as the build light draws it, in blue lines only: its outline and a grid over it. */
export function RunnerGrid() {
  return (
    <g fill="none" stroke={CEL.holo} strokeWidth="4" opacity="0.9">
      <path d="M-170 -44 L-150 -104 L-40 -108 L10 -84 L150 -80 L176 -44 Z M-90 -106 L-70 -176 L20 -176 L34 -96" data-bare />
      <circle cx={-116} cy={-40} r={40} data-bare />
      <circle cx={116} cy={-40} r={40} data-bare />
      <path d="M-160 -60 H170 M-150 -80 H160 M-100 -110 V-40 M-40 -108 V-40 M20 -88 V-40 M80 -84 V-40" strokeWidth="2" data-bare />
    </g>
  )
}

/** The mine's head frame over its mouth in the cliff, 420 wide. */
export function MineHead() {
  return (
    <g>
      <path d="M-210 0 L-200 -300 L-120 -360 L60 -380 L200 -320 L210 0 Z" fill={CEL.mesa} />
      <Shade d="M60 -380 L200 -320 L210 0 L110 0 Z" fill={CEL.mesaShade} />
      <path d="M-90 0 L-90 -150 Q0 -200 90 -150 L90 0 Z" fill={CEL.ink} />
      <path d="M-100 0 L-100 -160 L100 -160 L100 0 M-100 -160 L0 -200 L100 -160" fill="none" stroke={CEL.plank} strokeWidth="14" data-bare />
      <path d="M-160 -380 L-120 -560 L-80 -380 M-140 -470 H-100" fill="none" stroke={CEL.ink} strokeWidth="10" data-bare />
      <circle cx={-120} cy={-560} r={22} fill={CEL.steelDark} />
    </g>
  )
}

/** The boss's throne of scrap, 170 wide. */
export function Throne() {
  return (
    <g>
      <rect x={-85} y={-110} width={170} height={110} fill={CEL.rust} />
      <path d="M-85 -110 L-64 -300 L-24 -258 L0 -330 L24 -258 L64 -300 L85 -110 Z" fill={CEL.sheetShade} />
      <Shade d="M24 -258 L64 -300 L85 -110 L30 -110 Z" cross />
      <Lines d="M-60 -60 H60 M-40 -200 l20 30" />
    </g>
  )
}

/** The relic, 80 tall round its middle: a spiral shell of pale stone lit purple from inside, nothing written
 *  on it. */
export function Relic() {
  return (
    <g>
      <circle r={66} fill={CEL.eldritch} opacity={0.3} data-bare />
      <path d="M0 -38 Q32 -32 30 0 Q28 32 0 36 Q-28 32 -24 6 Q-20 -16 2 -14 Q18 -10 14 6" fill={CEL.steelLight} />
      <circle r={7} fill={CEL.eldritch} />
    </g>
  )
}

/** The dig, 440 wide round the work table whose top is at y -100: the shiny boulders it is dug among, a
 *  survey pole with its flag, a crate and a shovel stuck in the dirt. */
export function Dig() {
  return (
    <g>
      {[
        [-150, 110],
        [170, 80],
      ].map(([x, r]) => (
        <g key={x}>
          <path d={`M${x - r} 0 Q${x - r} ${-r * 1.3} ${x} ${-r * 1.2} Q${x + r} ${-r * 1.3} ${x + r} 0 Z`} fill={CEL.steelLight} />
          <Shade d={`M${x + r * 0.2} ${-r * 1.22} Q${x + r} ${-r * 1.3} ${x + r} 0 L${x + r * 0.3} 0 Z`} fill={CEL.steel} />
          <path d={`M${x - r * 0.5} ${-r * 0.9} l${r * 0.25} ${r * 0.25}`} stroke={CEL.white} strokeWidth="7" strokeLinecap="round" data-bare />
        </g>
      ))}
      <path d="M-230 0 V-300" stroke={CEL.ink} strokeWidth="10" data-bare />
      <path d="M-230 0 V-300" stroke={CEL.paper} strokeWidth="5" strokeDasharray="20 20" data-bare />
      <path d="M-230 -300 L-170 -284 L-230 -266 Z" fill={CEL.orange} />
      <rect x={-120} y={-100} width={240} height={16} fill={CEL.plank} />
      <path d="M-110 -84 V0 M110 -84 V0" stroke={CEL.plankShade} strokeWidth="12" data-bare />
      <rect x={-60} y={-70} width={80} height={70} fill={CEL.plank} />
      <Shade d="M-10 -70 H20 V0 H-10 Z" />
      <path d="M220 0 L180 -150" stroke={CEL.plankShade} strokeWidth="8" data-bare />
      <path d="M216 -10 L240 -30 L230 6 Z" fill={CEL.steel} />
    </g>
  )
}

/** The relic's hologram over the table, round its foot on the table: a door in a cliff, the count of two
 *  hundred and the key's three empty slots, in the hologram's blue. */
export function Hologram() {
  return (
    <g>
      <path d="M-170 0 L-50 -380 L50 -380 L170 0 Z" fill={CEL.holo} opacity={0.18} data-bare />
      <path d="M-140 -160 L-130 -350 L130 -350 L140 -160 Z" fill="none" stroke={CEL.holo} strokeWidth="4" data-bare />
      <path d="M-50 -180 V-290 Q0 -326 50 -290 V-180 Z" fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      <Upright>
        <Word text="200" y={-316} size={40} fill={CEL.holo} line={0} />
      </Upright>
      {[-64, 0, 64].map((x) => (
        <rect key={x} x={x - 22} y={-146} width={44} height={38} rx={6} fill="none" stroke={CEL.holo} strokeWidth="4" strokeDasharray="6 5" data-bare />
      ))}
    </g>
  )
}

/** The key, three slots in a row 270 wide round its middle, each slot's piece ([data-fx="{name}-{i}"])
 *  hidden until won, the last slot's mark ([data-fx="{name}-missing"]) pulsing. */
export function KeySlots({ name, color }: { name: string; color: string }) {
  return (
    <g>
      <rect x={-140} y={-46} width={280} height={92} rx={16} fill={CEL.inkSoft} />
      {[-86, 0, 86].map((x, i) => (
        <g key={x}>
          <rect x={x - 32} y={-32} width={64} height={64} rx={8} fill="none" stroke={CEL.holo} strokeWidth="4" strokeDasharray="8 6" data-bare />
          <g data-fx={`${name}-${i}`} opacity="0">
            <path d={`M${x - 26} -26 H${x + 26} V26 H${x - 26} Z`} fill={color} />
            <path d={`M${x - 12} -12 L${x + 12} 12 M${x + 12} -12 L${x - 12} 12`} stroke={CEL.ink} strokeWidth="4" data-bare />
          </g>
        </g>
      ))}
      <g data-fx={`${name}-missing`} opacity="0" transform="translate(86 0)">
        <Upright>
          <Word text="?" size={48} fill={CEL.holo} line={6} />
        </Upright>
      </g>
    </g>
  )
}

/** The salt camp's deck on stilts, 620 wide from x -60, `high` over the ground, with its wall at the far end
 *  and the chest's place at x 400. */
export function SaltDeck({ high }: { high: number }) {
  return (
    <g>
      {[-40, 120, 280, 440, 540].map((x) => (
        <rect key={x} x={x} y={-high} width={18} height={high} fill={CEL.plankShade} />
      ))}
      <path d={`M-30 -40 L120 ${-high} M130 -40 L280 ${-high} M290 -40 L440 ${-high}`} stroke={CEL.plankShade} strokeWidth="8" data-bare />
      <rect x={-70} y={-high - 22} width={640} height={26} fill={CEL.plank} />
      <Shade d={`M-70 ${-high + 4} H570 V${-high - 6} H-70 Z`} />
      <rect x={520} y={-high - 170} width={50} height={150} fill={CEL.sheet} />
      <path d={`M520 ${-high - 170} l10 -30 l10 30 l10 -30 l10 30 l10 -30 l0 30`} fill={CEL.steelLight} />
    </g>
  )
}

/** The lift's cage, 150 wide and 270 tall, open on his side. */
export function Lift() {
  return (
    <g>
      <rect x={-75} y={-272} width={150} height={16} fill={CEL.steelDark} />
      <rect x={-75} y={-14} width={150} height={16} fill={CEL.steelDark} />
      <path d="M-70 -260 V-10 M70 -260 V-10 M30 -260 V-10" stroke={CEL.ink} strokeWidth="8" data-bare />
    </g>
  )
}

/** A broken stone pillar of the vault's court, 100 wide and 330 tall, its shadow side hatched. */
export function Pillar() {
  return (
    <g>
      <path d="M-50 0 L-50 -310 L-20 -330 L20 -318 L50 -334 L50 0 Z" fill={CEL.steelLight} />
      <Shade d="M20 -318 L50 -334 L50 0 L20 0 Z" fill={CEL.steel} />
      <Lines d="M-20 -300 V-20 M-50 -200 l30 10 M-40 -90 l20 -8" />
      <path d="M-58 -10 Q0 -40 58 -10 L58 0 L-58 0 Z" fill={CEL.snow} />
    </g>
  )
}

/** The vault's door in the cliff, 540 wide and 620 tall: its two halves ([data-fx="door-l|r"]) slide apart on
 *  the light behind ([data-fx="door-light"]). */
export function VaultDoor() {
  return (
    <g>
      <path d="M-270 0 L-250 -580 L-120 -620 L120 -610 L260 -560 L270 0 Z" fill={CEL.vaultRidge} />
      <Shade d="M120 -610 L260 -560 L270 0 L150 0 Z" fill={CEL.vaultRidgeShade} />
      <path d="M-120 0 V-340 Q0 -420 120 -340 V0 Z" fill={CEL.ink} />
      <g data-fx="door-light" opacity="0">
        <path d="M-120 0 V-340 Q0 -420 120 -340 V0 Z" fill={CEL.eldritch} opacity={0.75} data-bare />
      </g>
      <g data-fx="door-l">
        <path d="M-120 0 V-340 Q-64 -378 0 -380 V0 Z" fill={CEL.steelDark} />
        <circle cx={-44} cy={-210} r={18} fill={CEL.eldritch} />
      </g>
      <g data-fx="door-r">
        <path d="M120 0 V-340 Q64 -378 0 -380 V0 Z" fill={CEL.steelDark} />
        <Shade d="M60 -370 Q100 -360 120 -340 V0 H60 Z" cross />
        <circle cx={44} cy={-210} r={18} fill={CEL.eldritch} />
      </g>
      <path d="M-270 0 Q-200 -50 -120 -10 M120 -10 Q200 -60 270 0" fill={CEL.snow} />
    </g>
  )
}

/** The eye's laser, a beam 900 long out to the left from its root, turned by the scene. */
export function Laser() {
  return (
    <g>
      <rect x={-900} y={-12} width={900} height={24} fill={CEL.eldritch} data-bare />
      <rect x={-900} y={-4} width={900} height={8} fill={CEL.white} data-bare />
    </g>
  )
}

/** The satellite, a small bright point with two panels, crossing the stars. */
export function Satellite() {
  return (
    <g>
      <circle r={26} fill={CEL.holo} opacity={0.35} data-bare />
      <rect x={-30} y={-6} width={20} height={12} fill={CEL.steel} />
      <rect x={10} y={-6} width={20} height={12} fill={CEL.steel} />
      <circle r={8} fill={CEL.white} />
    </g>
  )
}

/** The map he unfolds, 240 by 160 round its middle ([data-fx="map"] unfolds by its x scale), with new vaults
 *  across it ([data-fx="pin-{i}"], lit in turn). */
export const PINS = [
  [-76, -34],
  [-22, 44],
  [44, -50],
  [86, 22],
  [-86, 50],
  [12, -6],
  [70, -12],
] as const

export function WorldMap() {
  return (
    <g data-fx="map">
      <path d="M-120 -80 L-40 -64 L40 -86 L120 -64 V80 L40 64 L-40 86 L-120 64 Z" fill={CEL.notice} />
      <Shade d="M-40 -64 L40 -86 L40 64 L-40 86 Z" fill={CEL.paperShade} opacity={0.2} />
      <path d="M-96 10 Q-40 -34 0 0 Q40 34 96 -22" stroke={CEL.groundShade} strokeWidth="4" fill="none" data-bare />
      {PINS.map(([x, y], i) => (
        <g key={i} data-fx={`pin-${i}`} opacity="0">
          <Burst x={x} y={y} r={13} fill={CEL.legendary} />
        </g>
      ))}
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
