import type { ReactNode } from 'react'
import { DARK_FANTASY as P } from './palette'

// What he meets on the way down, our own and drawn in the game's ink (every shape outlined in black), each
// round its own origin, the foot of the thing at y 0 and facing left toward him unless its doc says otherwise,
// so a scene places it with one translate. What a scene moves inside a piece is a `data-fx` group named by the
// piece's `name`. None is a character of the game: the giant in stolen armour, the duelist, the blade
// fighters, the mage, the shell guards, the champion and the light are drawn ours from how each fights (the
// research notes, L131 to L164), never from how the game draws them.

const LINE = P.black

function Ink({ d, fill, width = 3 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={width} strokeLinejoin="round" />
}

/** A group a scene moves or fades, hidden at first when `hidden`. */
function Fx({ name, hidden = false, transform, children }: { name: string; hidden?: boolean; transform?: string; children: ReactNode }) {
  return (
    <g data-fx={name} opacity={hidden ? 0 : undefined} transform={transform}>
      {children}
    </g>
  )
}

// ---- the town and its well ----

/** The well's back: its posts and little roof, the rope and bucket, the dark of its mouth. 180 wide. */
export function WellBack() {
  return (
    <g>
      <Ink d="M-78 0 V-230 H-66 V0 Z M66 0 V-230 H78 V0 Z" fill={P.stoneDark} />
      <Ink d="M-100 -226 L0 -290 L100 -226 Z" fill={P.voidDeep} />
      <path d="M0 -226 V-110" stroke={P.bone} strokeWidth={2} />
      <Ink d="M-12 -112 H12 L9 -92 H-9 Z" fill={P.stoneDark} width={2} />
      <ellipse cx={0} cy={-64} rx={86} ry={14} fill={P.black} />
    </g>
  )
}

/** The well's front: the ring of stone he steps over, drawn over him as he drops in. */
export function WellFront() {
  return (
    <g>
      <Ink d="M-90 -64 Q0 -48 90 -64 V0 H-90 Z" fill={P.stoneGrey} />
      <path d="M-90 -40 Q0 -26 90 -40 M-90 -18 Q0 -6 90 -18 M-40 -58 V-36 M30 -56 V-34 M-10 -32 V-12 M60 -30 V-12" stroke={LINE} strokeWidth={2} fill="none" />
    </g>
  )
}

/** A bench, 150 wide: an iron frame and a seat 52 up, the one place of rest. */
export function Bench() {
  return (
    <g>
      <Ink d="M-75 -52 H75 V-44 H-75 Z" fill={P.stoneDark} />
      <Ink d="M-66 -44 L-60 0 H-52 L-56 -44 Z M66 -44 L60 0 H52 L56 -44 Z" fill={P.black} />
      <Ink d="M-70 -52 Q-74 -110 -40 -116 H40 Q74 -110 70 -52 L60 -52 Q62 -100 36 -104 H-36 Q-62 -100 -60 -52 Z" fill={P.black} />
    </g>
  )
}

// ---- the door and its three marks ----

/** The great door, 240 wide and 360 tall: two leaves in an arch, three marks across it ([data-fx="{name}-mark-{i}"],
 *  lit by their opacity), each leaf ([data-fx="{name}-leaf-l|r"]) free to break away. */
export function Door({ name }: { name: string }) {
  return (
    <g>
      <Ink d="M-150 0 V-300 Q-150 -420 0 -420 Q150 -420 150 -300 V0 Z" fill={P.stoneDark} />
      <Fx name={`${name}-leaf-l`}>
        <Ink d="M-120 0 V-290 Q-120 -386 0 -390 V0 Z" fill={P.voidDeep} />
      </Fx>
      <Fx name={`${name}-leaf-r`}>
        <Ink d="M120 0 V-290 Q120 -386 0 -390 V0 Z" fill={P.voidDeep} />
      </Fx>
      {[-60, 0, 60].map((x, i) => (
        <g key={x} transform={`translate(${x} -230)`}>
          <circle r={22} fill={P.black} stroke={P.stoneGrey} strokeWidth={3} />
          <Fx name={`${name}-mark-${i}`}>
            <circle r={30} fill={P.infectedGlow} opacity={0.35} />
            <path d="M0 -16 L12 0 L0 16 L-12 0 Z" fill={P.infectedBright} />
          </Fx>
        </g>
      ))}
    </g>
  )
}

/** The door seen far off in a small frame, 300 by 230, the frame's top left at its origin: how a mark far
 *  below goes dark while he is somewhere else. Hidden until a scene shows it ([data-fx="{name}"]). */
export function DoorInset({ name }: { name: string }) {
  return (
    <Fx name={name} hidden>
      <rect width={300} height={230} rx={14} fill={P.void} stroke={P.stoneGrey} strokeWidth={4} />
      <g transform="translate(150 214) scale(0.46)">
        <Door name={name} />
      </g>
    </Fx>
  )
}

// ---- the crossroads: the giant in stolen armour ----

/** The giant in stolen armour, 400 tall, facing left: a round iron shell on short legs, a helm with an eye
 *  slit lit orange; its mace arm ([data-fx="giant-arm"]) turns at the shoulder (-40, -250); its visor
 *  ([data-fx="giant-visor"]) lifts at its hinge to show the small pale face of the thief inside. */
export function Giant() {
  return (
    <g>
      <ellipse cx={0} cy={-4} rx={120} ry={12} fill={P.black} opacity={0.4} />
      <Ink d="M-60 0 V-60 H-20 V0 Z M20 0 V-60 H60 V0 Z" fill={P.shellDark} />
      <Ink d="M-130 -150 C-140 -300 140 -320 130 -150 C120 -60 -120 -60 -130 -150 Z" fill={P.shell} />
      <path d="M-100 -230 Q0 -270 100 -230 M-120 -160 Q0 -190 120 -160" stroke={P.shellMid} strokeWidth={8} fill="none" />
      <Ink d="M-110 -260 C-120 -360 30 -380 40 -300 C44 -260 -10 -250 -110 -260 Z" fill={P.stoneGrey} />
      <g transform="translate(-60 -300)">
        <circle r={22} fill={P.bone} stroke={LINE} strokeWidth={3} />
        <circle cx={-7} cy={-2} r={4} fill={P.black} />
        <circle cx={5} cy={-2} r={4} fill={P.black} />
      </g>
      <Fx name="giant-visor">
        <Ink d="M-100 -320 H-10 V-276 H-100 Z" fill={P.stoneGrey} />
        <path d="M-96 -298 H-16" stroke={P.black} strokeWidth={8} />
        <circle cx={-70} cy={-298} r={4} fill={P.infected} />
        <circle cx={-44} cy={-298} r={4} fill={P.infected} />
        <circle cx={-57} cy={-298} r={18} fill={P.infectedGlow} opacity={0.25} />
      </Fx>
      <Fx name="giant-arm" transform="rotate(0 -40 -250)">
        <Ink d="M-34 -256 L-170 -240 L-168 -226 L-32 -238 Z" fill={P.stoneDark} />
        <Ink d="M-160 -236 L-176 -60 L-164 -60 L-150 -236 Z" fill={P.copper} width={2} />
        <g transform="translate(-170 -56)">
          <circle r={42} fill={P.stoneGrey} stroke={LINE} strokeWidth={3} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M0 -40 L8 -56 L-8 -56 Z" fill={P.stoneGrey} stroke={LINE} strokeWidth={2} transform={`rotate(${a})`} />
          ))}
        </g>
      </Fx>
    </g>
  )
}

/** The small pale thief that wore the armour, 46 tall, scrambling away to the right. */
export function Thief() {
  return (
    <g>
      <Ink d="M-6 -4 L-12 0 M6 -4 L12 0" fill="none" width={3} />
      <ellipse cx={0} cy={-22} rx={20} ry={18} fill={P.bone} stroke={LINE} strokeWidth={3} />
      <circle cx={8} cy={-26} r={3.5} fill={P.black} />
      <circle cx={-2} cy={-26} r={3.5} fill={P.black} />
    </g>
  )
}

/** The wave the mace sends along the floor, a crest of orange light 110 wide, its front to the left. */
export function Shockwave() {
  return (
    <g>
      <path d="M-60 0 Q-50 -80 -10 -90 Q20 -40 60 0 Z" fill={P.infectedGlow} opacity={0.45} />
      <path d="M-46 0 Q-40 -56 -12 -64 Q10 -30 40 0 Z" fill={P.infectedBright} stroke={LINE} strokeWidth={3} />
    </g>
  )
}

/** Rubble of a broken floor, 260 wide: a black hole with jagged lips. */
export function Hole() {
  return (
    <g>
      <path d="M-130 0 L-110 30 L-60 18 L0 34 L60 16 L110 32 L130 0 Z" fill={P.black} />
      <Ink d="M-150 0 L-130 -14 L-110 0 Z M110 0 L132 -16 L150 0 Z M-40 4 L-24 -10 L-12 4 Z" fill={P.stoneGrey} width={2} />
    </g>
  )
}

// ---- the overgrowth: the duelist ----

/** The duelist, slight and quick, 230 tall, facing left: a hooded figure in a pale green cloak cut to a point,
 *  thin black legs, a long pale needle in her hand ([data-fx="duelist-needle"], hidden while it flies). */
export function Duelist() {
  return (
    <g>
      <Ink d="M-6 0 L-2 -70 L4 -70 L2 0 Z M16 0 L12 -70 L18 -70 L22 0 Z" fill={P.black} width={2} />
      <Ink d="M-30 -60 Q8 -40 44 -60 L18 -200 Q6 -214 -6 -200 Z" fill={P.moss} />
      <Ink d="M-26 -200 C-30 -250 30 -256 30 -210 C30 -186 -20 -180 -26 -200 Z" fill={P.mossDark} />
      <path d="M-12 -212 L-6 -206 M2 -214 L8 -208" stroke={P.bone} strokeWidth={4} strokeLinecap="round" />
      <Fx name="duelist-needle">
        <Ink d="M-20 -130 L-150 -136 L-20 -124 Z" fill={P.bone} width={2} />
      </Fx>
    </g>
  )
}

/** Her needle in flight, 140 long, point to the left, the thread trailing back to her ([data-fx="thread"] is
 *  drawn by the scene). */
export function Needle() {
  return <Ink d="M0 0 L140 -6 L140 6 Z" fill={P.bone} width={2} />
}

/** Her cloak left on the ground, 90 wide. */
export function LeftCloak() {
  return <Ink d="M-46 0 Q-30 -26 0 -24 Q34 -26 46 0 Z" fill={P.moss} width={2} />
}

/** A puff of dark smoke where he breaks, 200 wide round its middle. */
export function Smoke({ name }: { name: string }) {
  return (
    <Fx name={name} hidden>
      {[
        [-50, -10, 46],
        [20, -40, 56],
        [50, 20, 40],
        [-10, 30, 50],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={P.black} opacity={0.75} />
      ))}
    </Fx>
  )
}

// ---- the village of blades ----

/** A blade fighter, lean and 270 tall, facing left: a narrow hooded body on long legs, two long curved blades
 *  for forearms, held up. */
export function BladeFighter() {
  return (
    <g>
      <Ink d="M-10 0 L-4 -110 L4 -110 L0 0 Z M18 0 L12 -110 L20 -110 L26 0 Z" fill={P.black} width={2} />
      <Ink d="M-20 -100 Q8 -90 34 -100 L22 -220 Q8 -230 -6 -220 Z" fill={P.ochreDark} />
      <Ink d="M-16 -216 C-20 -264 30 -270 30 -226 C28 -204 -8 -200 -16 -216 Z" fill={P.ochre} />
      <circle cx={-2} cy={-232} r={4} fill={P.black} />
      <Ink d="M-6 -190 Q-70 -230 -96 -300 Q-60 -250 -2 -176 Z" fill={P.bone} width={2} />
      <Ink d="M20 -190 Q-30 -260 -40 -320 Q-10 -260 26 -178 Z" fill={P.bone} width={2} />
    </g>
  )
}

/** The thrown blade, a crescent 110 across, spinning round its middle. */
export function Boomerang() {
  return <Ink d="M-55 0 Q0 -60 55 0 Q0 -30 -55 0 Z" fill={P.bone} width={2} />
}

/** The village's great gate, 300 wide and 420 tall, shut: two leaves ([data-fx="gate-l|r"]) that swing open
 *  (scaled toward their hinge) on the dark beyond. */
export function Gate() {
  return (
    <g>
      <rect x={-150} y={-420} width={300} height={420} fill={P.black} />
      <Ink d="M-170 0 V-440 H-150 V0 Z M150 0 V-440 H170 V0 Z M-180 -440 H180 V-460 H-180 Z" fill={P.ochreDark} />
      <Fx name="gate-l">
        <Ink d="M-150 0 V-420 H0 V0 Z" fill={P.ochre} />
        <path d="M-150 -300 H0 M-150 -140 H0 M-75 -420 V0" stroke={LINE} strokeWidth={4} />
      </Fx>
      <Fx name="gate-r">
        <Ink d="M150 0 V-420 H0 V0 Z" fill={P.ochre} />
        <path d="M150 -300 H0 M150 -140 H0 M75 -420 V0" stroke={LINE} strokeWidth={4} />
      </Fx>
    </g>
  )
}

/** A tall wall of poles he clings to, `height` high and 60 wide, its face at x 0, built to the right. */
export function PoleWall({ height }: { height: number }) {
  return (
    <g>
      <Ink d={`M-60 0 V${-height} H0 V0 Z`} fill={P.ochreDark} />
      {[-48, -30, -12].map((x) => (
        <path key={x} d={`M${x} 0 V${-height}`} stroke={LINE} strokeWidth={3} />
      ))}
    </g>
  )
}

// ---- the city in the rain: the mage ----

/** The mage, 260 tall, floating, facing left: a long robe that ends in tatters, a hood with one pale light
 *  for a face. */
export function Mage() {
  return (
    <g>
      <Ink d="M-50 -10 L-40 -24 L-30 -6 L-18 -22 L-6 -4 L6 -22 L18 -6 L30 -24 L44 -8 L30 -180 Q0 -196 -30 -180 Z" fill={P.robe} />
      <Ink d="M-36 -176 C-44 -250 34 -260 34 -190 C32 -164 -30 -160 -36 -176 Z" fill={P.robeDark} />
      <circle cx={-8} cy={-206} r={10} fill={P.rain} />
      <circle cx={-8} cy={-206} r={24} fill={P.rain} opacity={0.25} />
      <Ink d="M-30 -150 Q-70 -130 -84 -100 L-74 -96 Q-58 -122 -26 -132 Z" fill={P.robeDark} width={2} />
    </g>
  )
}

/** One of the mage's orbs, 36 across, that follows him. */
export function Orb() {
  return (
    <g>
      <circle r={30} fill={P.rain} opacity={0.3} />
      <circle r={16} fill={P.white} stroke={P.rain} strokeWidth={4} />
    </g>
  )
}

/** The glass floor of the upper hall, `width` wide from x 0: whole ([data-fx="glass"]) and broken into falling
 *  shards ([data-fx="shard-{i}"], hidden). */
export function GlassFloor({ width, shards }: { width: number; shards: number }) {
  const step = width / shards
  return (
    <g>
      <Fx name="glass">
        <rect x={0} y={0} width={width} height={18} fill={P.rain} opacity={0.35} stroke={P.white} strokeWidth={2} />
        {Array.from({ length: shards }, (_, i) => (
          <path key={i} d={`M${i * step} 0 L${i * step + 12} 18`} stroke={P.white} strokeWidth={1.5} opacity={0.6} />
        ))}
      </Fx>
      {Array.from({ length: shards }, (_, i) => (
        <Fx key={i} name={`shard-${i}`} hidden transform={`translate(${i * step + step / 2} 8)`}>
          <path d={`M${-step / 2 + 4} -8 L${step / 2 - 6} -6 L${step / 4} 10 Z`} fill={P.rain} opacity={0.5} stroke={P.white} strokeWidth={2} />
        </Fx>
      ))}
    </g>
  )
}

/** A ring of shattered stone where the dive lands, 300 wide, hidden until it lands ([data-fx="{name}"]). */
export function ImpactRing({ name }: { name: string }) {
  return (
    <Fx name={name} hidden>
      <ellipse cx={0} cy={0} rx={150} ry={26} fill={P.white} opacity={0.35} />
      {[-130, -80, -30, 30, 80, 130].map((x, i) => (
        <path key={x} d={`M${x} 2 L${x + 10} ${-24 - (i % 2) * 18} L${x + 22} 2 Z`} fill={P.stoneGrey} stroke={LINE} strokeWidth={2} />
      ))}
    </Fx>
  )
}

// ---- the spire: the shell guards and the sleeper ----

/** A heavy guard, 190 tall, facing left; `name` names its curled ball ([data-fx="{name}-ball"], an iron shell
 *  rolling, its spin [data-fx="{name}-spin"]) and its open stance ([data-fx="{name}-open"]), one of the two
 *  shown at a time. */
export function ShellGuard({ name, curled }: { name: string; curled: boolean }) {
  return (
    <g>
      <Fx name={`${name}-ball`} hidden={!curled}>
        <g data-fx={`${name}-spin`}>
          <circle cy={-70} r={70} fill={P.shell} stroke={LINE} strokeWidth={3} />
          <path d="M-70 -70 H70 M0 -140 V0 M-50 -120 L50 -20 M50 -120 L-50 -20" stroke={P.shellMid} strokeWidth={8} />
        </g>
      </Fx>
      <Fx name={`${name}-open`} hidden={curled}>
        <Ink d="M-30 0 V-50 H-10 V0 Z M14 0 V-50 H34 V0 Z" fill={P.shellDark} />
        <Ink d="M-56 -50 C-70 -170 70 -180 60 -50 Z" fill={P.shell} />
        <Ink d="M-40 -150 C-50 -200 20 -210 24 -160 Z" fill={P.stoneGrey} />
        <circle cx={-22} cy={-168} r={4} fill={P.infected} />
        <Ink d="M-50 -110 L-110 -170 L-100 -176 L-40 -120 Z" fill={P.bone} width={2} />
      </Fx>
    </g>
  )
}

/** A stair of `steps` steps climbing to the right, `rise` by `run` each, from x 0 on the floor. */
export function Stair({ steps, rise, run }: { steps: number; rise: number; run: number }) {
  const d = Array.from({ length: steps }, (_, i) => `L${i * run} ${-(i + 1) * rise} L${(i + 1) * run} ${-(i + 1) * rise}`).join(' ')
  return <Ink d={`M0 0 ${d} L${steps * run} 0 Z`} fill={P.stoneDark} />
}

/** The sleeper's bed, 200 wide: a long bed with a pale shape asleep under a sheet, its dream a pale haze
 *  ([data-fx="{name}-dream"]) that flares when struck. */
export function Bed({ name }: { name: string }) {
  return (
    <g>
      <Fx name={`${name}-dream`} hidden>
        <ellipse cx={0} cy={-80} rx={140} ry={70} fill={P.dream} opacity={0.5} />
      </Fx>
      <Ink d="M-100 0 V-60 H100 V0 H90 V-20 H-90 V0 Z" fill={P.voidDeep} />
      <Ink d="M-100 -60 V-110 H-84 V-60 Z" fill={P.voidDeep} />
      <Ink d="M-80 -60 Q-70 -92 -40 -86 Q20 -96 90 -70 V-60 Z" fill={P.bone} />
      <circle cx={-66} cy={-80} r={14} fill={P.dream} stroke={LINE} strokeWidth={2} />
    </g>
  )
}

// ---- the deep tunnels: the trap ----

/** A lantern on a pole, 220 tall, its warm light. */
export function Lantern() {
  return (
    <g>
      <rect x={-3} y={-220} width={6} height={220} fill={P.black} />
      <circle cx={0} cy={-226} r={40} fill={P.lantern} opacity={0.18} />
      <Ink d="M-12 -240 H12 L8 -212 H-8 Z" fill={P.lantern} width={2} />
    </g>
  )
}

/** A low round door in the rock, 120 wide. */
export function DenDoor() {
  return <Ink d="M-60 0 V-110 Q-60 -170 0 -170 Q60 -170 60 -110 V0 Z" fill={P.black} />
}

/** The web he wakes in, 260 wide round its middle: strands to the walls and the wrap round him ([data-fx="wrap"]). */
export function Web() {
  return (
    <g stroke={P.bone} strokeWidth={2} fill="none" opacity={0.85}>
      <path d="M0 0 L-260 -300 M0 0 L240 -320 M0 0 L-300 120 M0 0 L280 160 M0 0 L20 -400" />
      <path d="M-90 -100 Q0 -60 80 -110 M-120 40 Q0 60 100 60 M-170 -190 Q0 -120 150 -200" />
      <g data-fx="wrap">
        <ellipse cx={0} cy={60} rx={70} ry={120} fill={P.bone} opacity={0.35} />
        <path d="M-60 0 Q0 30 60 0 M-66 50 Q0 80 66 50 M-60 110 Q0 140 60 110 M-40 160 Q0 180 40 160" />
      </g>
    </g>
  )
}

/** The den's sleeper, a great pale shape curled on the floor, 320 wide, its dream ([data-fx="{name}-dream"]). */
export function DenSleeper({ name }: { name: string }) {
  return (
    <g>
      <Fx name={`${name}-dream`} hidden>
        <ellipse cx={0} cy={-90} rx={200} ry={90} fill={P.dream} opacity={0.5} />
      </Fx>
      <Ink d="M-160 0 C-170 -120 120 -170 160 -40 C164 -20 150 0 130 0 Z" fill={P.bone} />
      <path d="M-120 -40 Q0 -120 120 -50 M-90 -10 Q10 -70 110 -20" stroke={P.dustDark} strokeWidth={4} fill="none" />
    </g>
  )
}

// ---- the abyss ----

/** A tendril of the dark, 300 tall, rising from the pit by its scale ([data-fx="{name}"], scaled from its root). */
export function Tendril({ name }: { name: string }) {
  return (
    <Fx name={name} transform="scale(1 0)">
      <path d="M-20 0 Q-40 -120 10 -200 Q40 -260 0 -300 Q30 -250 10 -190 Q-10 -110 20 0 Z" fill={P.black} stroke={P.voidDeep} strokeWidth={4} />
    </Fx>
  )
}

/** The lighthouse on its rock, 520 tall: a ladder up its side, the lamp room and its switch ([data-fx="switch"])
 *  and the beam ([data-fx="beam"], turned round the lamp at (0, -470), hidden until lit). */
export function Lighthouse() {
  return (
    <g>
      <Ink d="M-160 0 Q-120 -80 -50 -90 H60 Q130 -80 170 0 Z" fill={P.stoneDark} />
      <Ink d="M-50 -90 L-36 -430 H36 L50 -90 Z" fill={P.bone} />
      <path d="M-44 -200 H44 M-40 -320 H40" stroke={LINE} strokeWidth={6} />
      <path d="M-58 -90 V-440 M-74 -90 V-440 M-74 -120 H-58 M-74 -170 H-58 M-74 -220 H-58 M-74 -270 H-58 M-74 -320 H-58 M-74 -370 H-58 M-74 -420 H-58" stroke={LINE} strokeWidth={3} />
      <Ink d="M-50 -430 H50 V-500 H-50 Z" fill={P.stoneDark} />
      <Fx name="beam" hidden transform="rotate(0 0 -470)">
        <path d="M0 -470 L-900 -640 L-900 -300 Z" fill={P.white} opacity={0.3} />
      </Fx>
      <circle data-fx="lamp" cx={0} cy={-470} r={18} fill={P.white} opacity={0.2} />
      <Fx name="switch" transform="rotate(-40 40 -440)">
        <path d="M40 -440 L40 -486" stroke={LINE} strokeWidth={6} strokeLinecap="round" />
      </Fx>
      <Ink d="M-60 -500 L0 -540 L60 -500 Z" fill={P.black} />
    </g>
  )
}

/** The void fountain, a dark plume 120 wide rising from a basin ([data-fx="plume"], scaled from the basin). */
export function VoidFountain() {
  return (
    <g>
      <Fx name="plume" transform="scale(1 0.2)">
        <path d="M-50 0 Q-70 -150 -20 -260 Q0 -300 20 -260 Q70 -150 50 0 Z" fill={P.black} opacity={0.85} />
        <path d="M-20 -40 Q-30 -140 0 -220 M20 -60 Q30 -140 10 -200" stroke={P.voidPurple} strokeWidth={6} fill="none" />
      </Fx>
      <Ink d="M-80 0 Q-80 -24 -60 -24 H60 Q80 -24 80 0 Z" fill={P.stoneDark} />
    </g>
  )
}

// ---- the temple: the chained champion ----

/** The fallen champion, 340 tall, facing left: a tall frame in a torn cloak, a broken crested helm with one
 *  orange eye, its long blade ([data-fx="champion-blade"], turned at the hand (-50, -190)). */
export function Champion() {
  return (
    <g>
      <Ink d="M-30 0 L-22 -120 H-6 L-12 0 Z M14 0 L8 -120 H24 L30 0 Z" fill={P.black} width={2} />
      <Ink d="M-70 -90 L-60 -60 L-40 -84 L-20 -56 L0 -84 L20 -60 L40 -86 L60 -62 L70 -100 L40 -250 Q0 -270 -40 -250 Z" fill={P.torn} />
      <Ink d="M-40 -250 C-50 -330 40 -340 40 -262 C38 -240 -30 -236 -40 -250 Z" fill={P.stoneGrey} />
      <Ink d="M-4 -318 L10 -360 L18 -352 L8 -316 Z" fill={P.stoneGrey} width={2} />
      <circle cx={-16} cy={-282} r={6} fill={P.infected} />
      <circle cx={-16} cy={-282} r={16} fill={P.infectedGlow} opacity={0.3} />
      <Fx name="champion-blade" transform="rotate(0 -50 -190)">
        <Ink d="M-46 -196 L-56 -184 L-250 -260 L-244 -272 Z" fill={P.blade} width={2} />
        <Ink d="M-60 -200 L-40 -180" fill="none" width={6} />
      </Fx>
    </g>
  )
}

/** A chain hanging `length` from the vault to its end at the origin. */
export function Chain({ length }: { length: number }) {
  return (
    <g>
      {Array.from({ length: Math.ceil(length / 26) }, (_, i) => (
        <ellipse key={i} cx={0} cy={-i * 26 - 13} rx={7} ry={14} fill="none" stroke={P.stoneGrey} strokeWidth={4} />
      ))}
    </g>
  )
}

/** A pillar of fire, 90 wide and 520 tall, rising from the floor by its scale ([data-fx="{name}"]). */
export function FirePillar({ name }: { name: string }) {
  return (
    <Fx name={name} transform="scale(1 0)">
      <path d="M-45 0 Q-60 -260 -20 -520 Q0 -440 20 -520 Q60 -260 45 0 Z" fill={P.infected} opacity={0.85} />
      <path d="M-20 0 Q-30 -200 0 -400 Q30 -200 20 0 Z" fill={P.infectedBright} />
    </Fx>
  )
}

// ---- the light behind the door ----

/** The light, a great radiant shape 360 tall hanging in the air round its middle: a pale body under a halo,
 *  wide wings of light, two burning eyes. */
export function DoorLight() {
  return (
    <g>
      <circle r={260} fill={P.white} opacity={0.35} />
      <path d="M0 -40 Q-260 -200 -380 -60 Q-220 -60 -40 40 Z M0 -40 Q260 -200 380 -60 Q220 -60 40 40 Z" fill={P.white} opacity={0.8} />
      <path d="M-50 -120 Q0 -170 50 -120 L40 180 Q0 200 -40 180 Z" fill={P.white} stroke={P.spiritGold} strokeWidth={3} />
      <circle cx={0} cy={-170} r={70} fill="none" stroke={P.spiritGold} strokeWidth={6} />
      <circle cx={-14} cy={-110} r={7} fill={P.infected} />
      <circle cx={14} cy={-110} r={7} fill={P.infected} />
    </g>
  )
}

/** A ledge floating in the light, 160 wide, its top at the origin. */
export function Ledge() {
  return <Ink d="M-80 0 H80 L60 30 L20 40 L-30 34 L-64 24 Z" fill={P.stoneGrey} />
}

/** A beam of light 60 wide and 1600 long, turned round its root at the origin ([data-fx="{name}"]). */
export function Beam({ name }: { name: string }) {
  return (
    <Fx name={name} hidden>
      <rect x={-30} y={-1600} width={60} height={1600} fill={P.white} opacity={0.6} />
      <rect x={-10} y={-1600} width={20} height={1600} fill={P.white} />
    </Fx>
  )
}
