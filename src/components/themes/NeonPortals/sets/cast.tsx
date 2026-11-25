import { Neon } from '../eras'
import { Glow } from './kit'

// The run's cast and its machines, our own, drawn in code in the box's units, each standing on 0,0 (or
// centred on it where it flies), facing right unless said, in the same thick ink line as his runner.
// Moving parts are [data-np] groups the set's writer turns about a stated point. Nothing here is a character,
// creature or object of the game it evokes: the clockmaker, the pendulum man, the living storm, the firefly
// spirit, the knight, the horned beast, the hammer guard, the furnace brute and the rest are drawn new.

export const INK = '#120c1e'

// ---- the villains ----

const STORM = { body: '#2c1458', rim: '#8c5cff', swirl: '#b18cff', eye: '#ffe14d', bolt: '#e4d8ff' }

/** The living storm: a churning violet cloud with two narrow yellow eyes and a crackle of lightning,
 *  about 150 wide, centred. */
export function Storm({ grin = true }: { grin?: boolean }) {
  return (
    <g>
      <Glow r={110} color={STORM.rim} strength={0.7} />
      <path
        d="M-70 20 C-96 14 -96 -24 -66 -28 C-70 -60 -30 -74 -10 -52 C4 -82 52 -78 56 -44 C88 -48 100 -6 74 10 C92 30 66 56 40 44 C26 64 -12 64 -24 44 C-44 58 -76 46 -70 20 Z"
        fill={STORM.body}
        stroke={STORM.rim}
        strokeWidth={4}
      />
      <path d="M-50 0 C-30 -30 10 -30 24 -6 M-20 26 C0 10 30 12 50 26 M10 -40 C30 -52 50 -40 54 -24" fill="none" stroke={STORM.swirl} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <path d="M-34 -12 L-8 -4 L-12 4 L-36 -2 Z M34 -12 L8 -4 L12 4 L36 -2 Z" fill={STORM.eye} />
      {grin && <path d="M-22 20 Q0 34 22 20" fill="none" stroke={STORM.eye} strokeWidth={4} strokeLinecap="round" />}
      <path d="M60 30 L48 54 L60 54 L46 82" fill="none" stroke={STORM.bolt} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  )
}

const CLOCK = { coat: '#5a2a8a', coatShade: '#3d1a63', skin: '#f0c8a0', hair: '#f4f1ea', goggle: '#ffd34d', lens: '#5cf2ff', boot: '#2a1a12', key: '#c9a04a' }

/** The clockmaker: a tall thin old man in a long violet coat, wild white hair, brass goggles, a big wind up
 *  key on his back and a glowing orb in his hand; about 180 tall. `hand` holds the orb's arm, turned at the
 *  shoulder (12, -128). */
export function Clockmaker() {
  return (
    <g>
      <g transform="translate(-30 -120)">
        <rect x={-6} y={-4} width={24} height={8} fill={CLOCK.key} stroke={INK} strokeWidth={3} />
        <path d="M-6 0 C-30 -26 -40 0 -22 6 C-40 14 -30 34 -6 0 Z" fill={CLOCK.key} stroke={INK} strokeWidth={3} />
      </g>
      <path d="M-14 -4 L-10 -50 M10 -4 L8 -50" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M-24 0 H-2 M2 0 H26" stroke={CLOCK.boot} strokeWidth={10} strokeLinecap="round" />
      <path d="M-26 -40 L-18 -136 Q0 -146 18 -136 L30 -40 Q2 -30 -26 -40 Z" fill={CLOCK.coat} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M2 -136 L4 -44" stroke={CLOCK.coatShade} strokeWidth={4} />
      <g data-np="clock-arm">
        <path d="M12 -128 L44 -100 L58 -112" fill="none" stroke={CLOCK.coat} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={64} cy={-118} r={12} fill={CLOCK.lens} opacity={0.9} />
        <circle cx={64} cy={-118} r={22} fill={CLOCK.lens} opacity={0.25} />
      </g>
      <path d="M-4 -138 Q-10 -150 -6 -160" stroke={CLOCK.skin} strokeWidth={10} strokeLinecap="round" />
      <ellipse cx={4} cy={-172} rx={20} ry={22} fill={CLOCK.skin} stroke={INK} strokeWidth={3} />
      <path d="M20 -176 Q36 -170 22 -160" fill={CLOCK.skin} stroke={INK} strokeWidth={3} />
      <path d="M-20 -180 C-40 -200 -20 -214 -12 -196 C-14 -222 10 -222 8 -198 C18 -220 40 -206 22 -188 C34 -186 30 -174 22 -178" fill={CLOCK.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={-6} y={-184} width={30} height={12} rx={6} fill={CLOCK.goggle} stroke={INK} strokeWidth={2.5} />
      <circle cx={4} cy={-178} r={5} fill={CLOCK.lens} />
      <circle cx={17} cy={-178} r={5} fill={CLOCK.lens} />
      <path d="M2 -156 Q12 -150 20 -156" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )
}

/** The clockmaker's sky fortress, our own: a brass hull of gears and spires on two propellers, about 170
 *  wide, centred. */
export function Fortress() {
  return (
    <g>
      <path d="M-84 0 Q-80 34 0 40 Q80 34 84 0 Z" fill="#6a4a2a" stroke={INK} strokeWidth={4} />
      <rect x={-70} y={-22} width={140} height={24} fill="#8a6a3a" stroke={INK} strokeWidth={4} />
      <path d="M-50 -22 V-60 L-38 -76 L-26 -60 V-22 Z M20 -22 V-70 L34 -92 L48 -70 V-22 Z" fill="#5a3f8a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={-2} cy={-30} r={22} fill="#c9a04a" stroke={INK} strokeWidth={4} />
      <circle cx={-2} cy={-30} r={8} fill={INK} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-60 + i * 28} y={-14} width={12} height={10} fill="#ffd34d" />
      ))}
      <path d="M-84 -4 H-104 M84 -4 H104 M-110 -16 V8 M110 -16 V8" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  )
}

/** The flame and smoke behind the falling fortress, trailing to the left of 0,0, `len` long. */
export function FlameTrail({ len = 260 }: { len?: number }) {
  return (
    <g>
      <path d={`M0 -24 Q${-len * 0.5} -40 ${-len} -6 Q${-len * 0.5} 30 0 24 Z`} fill="#3a2a4a" opacity={0.55} />
      <path d={`M0 -18 Q${-len * 0.35} -24 ${-len * 0.6} 0 Q${-len * 0.35} 22 0 18 Z`} fill="#ff6a2a" opacity={0.85} />
      <path d={`M0 -9 Q${-len * 0.2} -12 ${-len * 0.32} 0 Q${-len * 0.2} 12 0 9 Z`} fill="#ffe08a" />
    </g>
  )
}

/** The firefly spirit: the guardian grown large, a glowing winged bug with a long light tail, centred. */
export function Spirit() {
  return (
    <g>
      <Glow r={110} color="#ffe14d" strength={0.8} />
      <path d="M-20 10 Q-90 40 -150 20" fill="none" stroke="#fff6a8" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      <ellipse cx={-22} cy={-34} rx={22} ry={40} fill="#c9f6ff" opacity={0.75} transform="rotate(-28 -22 -34)" />
      <ellipse cx={22} cy={-34} rx={22} ry={40} fill="#c9f6ff" opacity={0.75} transform="rotate(28 22 -34)" />
      <circle r={34} fill="#fff6a8" stroke="#3a2a08" strokeWidth={4} />
      <path d="M-14 -6 Q-8 -14 -2 -6 M2 -6 Q8 -14 14 -6" fill="none" stroke="#3a2a08" strokeWidth={4} strokeLinecap="round" />
      <path d="M-10 10 Q0 18 10 10" fill="none" stroke="#3a2a08" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

const PENDULUM = { coat: '#1f6a66', coatShade: '#134744', skin: '#e2d8c8', hat: '#16202a', band: '#5ff0c8', rod: '#c9a04a', bob: '#ffd34d', boot: '#1a1210' }

/** The pendulum man, our own: a gaunt figure in a long teal coat and a tall hat, a long nose and a thin
 *  moustache, facing left, his pendulum staff upright in his near hand. [data-np="pend-body"] is all of him
 *  above the knees (bent at -60 to kneel), [data-np="pend-staff"] the staff, turned at his grip (-30, -120);
 *  its bob is the scene's own, so it can fly. About 210 tall. */
export function PendulumMan() {
  return (
    <g>
      <path d="M-10 -2 V-60 M12 -2 V-60" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M-26 0 H-4 M2 0 H24" stroke={PENDULUM.boot} strokeWidth={10} strokeLinecap="round" />
      <g data-np="pend-body">
        <path d="M-30 -50 L-20 -150 Q0 -160 20 -150 L32 -50 Q0 -40 -30 -50 Z" fill={PENDULUM.coat} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M-2 -150 L-6 -52 M-22 -100 H22" stroke={PENDULUM.coatShade} strokeWidth={4} />
        <path d="M14 -146 L30 -96 L24 -70" fill="none" stroke={PENDULUM.coat} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-6 -152 Q-4 -160 -2 -166" stroke={PENDULUM.skin} strokeWidth={10} strokeLinecap="round" />
        <ellipse cx={-2} cy={-180} rx={16} ry={20} fill={PENDULUM.skin} stroke={INK} strokeWidth={3} />
        <path d="M-16 -184 L-38 -176 L-16 -172 Z" fill={PENDULUM.skin} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M-20 -168 Q-28 -160 -34 -164 M-16 -168 Q-8 -160 -2 -164" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={-8} cy={-188} r={3} fill={INK} />
        <path d="M-20 -194 L-2 -192" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <rect x={-24} y={-200} width={44} height={8} rx={3} fill={PENDULUM.hat} stroke={INK} strokeWidth={2.5} />
        <rect x={-16} y={-246} width={28} height={48} rx={3} fill={PENDULUM.hat} stroke={INK} strokeWidth={2.5} />
        <rect x={-16} y={-214} width={28} height={7} fill={PENDULUM.band} />
        <g data-np="pend-staff">
          <path d="M-30 -230 V-40" stroke={PENDULUM.rod} strokeWidth={7} strokeLinecap="round" />
          <circle cx={-30} cy={-234} r={8} fill={PENDULUM.bob} stroke={INK} strokeWidth={3} />
        </g>
        <path d="M-12 -144 L-28 -118" stroke={PENDULUM.coat} strokeWidth={12} strokeLinecap="round" />
        <circle cx={-30} cy={-120} r={8} fill={PENDULUM.skin} stroke={INK} strokeWidth={2.5} />
      </g>
    </g>
  )
}

/** The pendulum's bob, the weight the pendulum man flies at him: a heavy brass disc with a glowing rim,
 *  centred. */
export function Bob() {
  return (
    <g>
      <Glow r={44} color={PENDULUM.band} strength={0.8} />
      <circle r={22} fill={PENDULUM.bob} stroke={INK} strokeWidth={4} />
      <circle r={12} fill="none" stroke="#c88a1a" strokeWidth={4} />
    </g>
  )
}

// ---- the bosses' muscle ----

const FURNACE = { suit: '#b8642c', suitShade: '#7a3e1a', rivet: '#ffd08a', tank: '#5a5a6a', tankLit: '#8a8a9a', skin: '#d8a07a', visor: '#1a1a22', glow: '#ff8a3d', nozzle: '#3a3a44' }

/** The furnace brute, our own: a squat wide stoker in a riveted boiler suit, two fuel tanks on his back
 *  over his shoulders, a welder's helmet with a glowing slit, his flame gun held low in both fists, seen
 *  from the front. [data-np="furnace-top"] is all of him above the hips (let down to sit), [data-np="furnace-gun"]
 *  the gun, turned at his fists (0, -110) to sweep; its muzzle is at (0, -40) of the gun turned to 0. About
 *  230 tall. */
export function FurnaceBrute() {
  return (
    <g>
      <rect x={-62} y={-80} width={46} height={80} rx={12} fill={FURNACE.suitShade} stroke={INK} strokeWidth={5} />
      <rect x={16} y={-80} width={46} height={80} rx={12} fill={FURNACE.suitShade} stroke={INK} strokeWidth={5} />
      <path d="M-70 -6 h58 M12 -6 h58" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <g data-np="furnace-top">
        <rect x={-110} y={-236} width={44} height={120} rx={20} fill={FURNACE.tank} stroke={INK} strokeWidth={5} />
        <rect x={66} y={-236} width={44} height={120} rx={20} fill={FURNACE.tank} stroke={INK} strokeWidth={5} />
        <path d="M-96 -228 V-130 M80 -228 V-130" stroke={FURNACE.tankLit} strokeWidth={6} strokeLinecap="round" />
        <path d="M-84 -90 Q-96 -200 0 -210 Q96 -200 84 -90 Q60 -66 0 -64 Q-60 -66 -84 -90 Z" fill={FURNACE.suit} stroke={INK} strokeWidth={5} />
        <path d="M-40 -200 V-80 M40 -200 V-80" stroke={FURNACE.suitShade} strokeWidth={6} />
        {[-60, -20, 20, 60].map((x) => (
          <circle key={x} cx={x} cy={-150} r={5} fill={FURNACE.rivet} stroke={INK} strokeWidth={2} />
        ))}
        <path d="M-44 -206 Q-50 -262 0 -266 Q50 -262 44 -206 Q22 -196 0 -196 Q-22 -196 -44 -206 Z" fill={FURNACE.tank} stroke={INK} strokeWidth={5} />
        <rect x={-30} y={-242} width={60} height={14} rx={6} fill={FURNACE.visor} stroke={INK} strokeWidth={3} />
        <rect data-np="furnace-eyes" x={-24} y={-238} width={48} height={6} rx={3} fill={FURNACE.glow} />
        <path d="M-80 -170 Q-104 -130 -40 -112 M80 -170 Q104 -130 40 -112" fill="none" stroke={FURNACE.suit} strokeWidth={28} strokeLinecap="round" />
        <g data-np="furnace-gun">
          <rect x={-14} y={-118} width={28} height={78} rx={8} fill={FURNACE.nozzle} stroke={INK} strokeWidth={4} />
          <rect x={-20} y={-52} width={40} height={14} rx={5} fill={FURNACE.tank} stroke={INK} strokeWidth={4} />
          <path d="M0 -118 Q60 -160 96 -200" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        </g>
        <circle cx={-26} cy={-112} r={18} fill={FURNACE.skin} stroke={INK} strokeWidth={4} />
        <circle cx={26} cy={-112} r={18} fill={FURNACE.skin} stroke={INK} strokeWidth={4} />
        <g data-np="furnace-stars" opacity={0}>
          {[0, 1, 2].map((i) => (
            <path key={i} d="M0 -9 L3 -3 L9 -3 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-9 -3 L-3 -3 Z" fill="#ffd34d" stroke={INK} strokeWidth={2} transform={`translate(${36 * Math.cos((i * 2 * Math.PI) / 3)} ${-290 + 10 * Math.sin((i * 2 * Math.PI) / 3)})`} />
          ))}
        </g>
      </g>
    </g>
  )
}

/** A shard of blue glass in the furnace brute's ring, about 90 tall, standing on 0,0. */
export function Shard({ tall = 90 }: { tall?: number }) {
  return (
    <g>
      <path d={`M-22 0 L-16 ${-tall * 0.7} L2 ${-tall} L20 ${-tall * 0.6} L24 0 Z`} fill="#3a6ad8" stroke="#0e1a4a" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M-10 -6 L-6 ${-tall * 0.66} L2 ${-tall * 0.9}`} fill="none" stroke="#b8d8ff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

// ---- the portals ----

/** One of the machine's portals: a neon ring `r` wide, its inside the colour `fill`; [data-np] `name` is its
 *  light, faded by the writer. */
export function PortalRing({ r, color, name, fill = '#0b0626' }: { r: number; color: string; name?: string; fill?: string }) {
  const ring = `M${-r} 0 A${r} ${r * 1.12} 0 1 1 ${r} 0 A${r} ${r * 1.12} 0 1 1 ${-r} 0 Z`
  return (
    <g>
      <path d={ring} fill={fill} stroke="#2a2250" strokeWidth={10} />
      <g data-np={name} opacity={name ? 0.15 : 1}>
        <path d={ring} fill={color} opacity={0.25} />
        <path d={`M${-r * 0.6} 0 A${r * 0.6} ${r * 0.7} 0 1 1 ${r * 0.6} 0`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.5} />
        <Neon d={ring} color={color} width={Math.max(3, r / 14)} />
      </g>
    </g>
  )
}

// ---- the village ----

const KNIGHT = { steel: '#b9c4d6', shade: '#7c879a', tabard: '#c0392b', plume: '#ffd34d', blade: '#eef3fa' }

/** A village knight seen from the front, a long sword held high in his right hand: the sword arm turns at
 *  the shoulder (-34, -112) as [data-np="knight-arm"]; [data-np="knight-back"] covers his visor and tabard
 *  with plain steel, the back of him, for a writer that turns him round; about 170 tall. */
export function Knight() {
  return (
    <g>
      <rect x={-26} y={-60} width={18} height={60} rx={6} fill={KNIGHT.shade} stroke={INK} strokeWidth={3} />
      <rect x={8} y={-60} width={18} height={60} rx={6} fill={KNIGHT.shade} stroke={INK} strokeWidth={3} />
      <path d="M-36 -124 H36 L32 -50 H-32 Z" fill={KNIGHT.steel} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-20 -118 H20 L18 -44 H-18 Z" fill={KNIGHT.tabard} stroke={INK} strokeWidth={3} />
      <path d="M0 -110 V-60 M-12 -86 H12" stroke={KNIGHT.plume} strokeWidth={5} />
      <rect x={38} y={-118} width={14} height={50} rx={6} fill={KNIGHT.steel} stroke={INK} strokeWidth={3} />
      <path d="M-26 -126 Q-28 -176 0 -176 Q28 -176 26 -126 Z" fill={KNIGHT.steel} stroke={INK} strokeWidth={3.5} />
      <path d="M-18 -148 H18" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M0 -176 Q-6 -200 14 -206 Q8 -190 22 -186" fill={KNIGHT.plume} stroke={INK} strokeWidth={2.5} />
      <g data-np="knight-back" opacity={0}>
        <path d="M-36 -124 H36 L32 -50 H-32 Z" fill={KNIGHT.shade} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M0 -120 V-54" stroke={KNIGHT.steel} strokeWidth={4} />
        <path d="M-26 -126 Q-28 -176 0 -176 Q28 -176 26 -126 Z" fill={KNIGHT.shade} stroke={INK} strokeWidth={3.5} />
      </g>
      <g data-np="knight-arm">
        <rect x={-50} y={-120} width={14} height={46} rx={6} fill={KNIGHT.steel} stroke={INK} strokeWidth={3} />
        <circle cx={-43} cy={-72} r={9} fill={KNIGHT.shade} stroke={INK} strokeWidth={3} />
        <path d="M-43 -76 L-43 -190" stroke={KNIGHT.blade} strokeWidth={9} strokeLinecap="round" />
        <path d="M-43 -76 L-43 -190" stroke={INK} strokeWidth={2} opacity={0.4} />
        <path d="M-58 -78 H-28" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  )
}

/** A goat at the roadside, side on, about 60 tall. */
export function Goat() {
  return (
    <g>
      <path d="M-24 0 V-22 M-12 0 V-22 M12 0 V-22 M22 0 V-22" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={0} cy={-32} rx={32} ry={16} fill="#f2ede0" stroke={INK} strokeWidth={3} />
      <path d="M26 -40 L38 -58 L50 -50 L44 -36 Z" fill="#f2ede0" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M38 -58 Q34 -72 44 -72 M44 -58 Q46 -70 54 -66" fill="none" stroke="#8a6a4a" strokeWidth={4} strokeLinecap="round" />
      <path d="M48 -38 L46 -28" stroke="#d8d0c0" strokeWidth={4} strokeLinecap="round" />
      <circle cx={42} cy={-52} r={2.5} fill={INK} />
    </g>
  )
}

/** A fat toad in the road, about 30 tall. */
export function Toad() {
  return (
    <g>
      <ellipse cx={0} cy={-14} rx={24} ry={15} fill="#6fbf4a" stroke={INK} strokeWidth={3} />
      <circle cx={-10} cy={-28} r={6} fill="#6fbf4a" stroke={INK} strokeWidth={2.5} />
      <circle cx={10} cy={-28} r={6} fill="#6fbf4a" stroke={INK} strokeWidth={2.5} />
      <circle cx={-10} cy={-28} r={2.5} fill={INK} />
      <circle cx={10} cy={-28} r={2.5} fill={INK} />
      <path d="M-12 -12 Q0 -6 12 -12" fill="none" stroke={INK} strokeWidth={2.5} />
    </g>
  )
}

/** A cottage of the village, `w` wide: white walls, dark beams, a thatched roof, a lit window. */
export function Cottage({ w = 150, flip = false }: { w?: number; flip?: boolean }) {
  const h = w * 0.55
  return (
    <g transform={flip ? 'scale(-1 1)' : undefined}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill="#f3ead2" stroke={INK} strokeWidth={3} />
      <path d={`M${-w / 2} ${-h * 0.5} H${w / 2} M${-w / 4} ${-h} V0 M${w / 4} ${-h} V0`} stroke="#5a3a20" strokeWidth={5} />
      <rect x={-w * 0.12} y={-h * 0.45} width={w * 0.16} height={h * 0.45} fill="#6a3f1e" stroke={INK} strokeWidth={2.5} />
      <rect x={w * 0.3} y={-h * 0.8} width={w * 0.12} height={w * 0.1} fill="#ffd36a" stroke={INK} strokeWidth={2.5} />
      <path d={`M${-w / 2 - 14} ${-h} L${-w * 0.1} ${-h - w * 0.42} L${w / 2 + 14} ${-h} Z`} fill="#d9a441" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${-w * 0.36} ${-h - 6} L${-w * 0.14} ${-h - w * 0.34} M${-w * 0.06} ${-h - 4} L${-w * 0.1} ${-h - w * 0.36} M${w * 0.24} ${-h - 6} L${-w * 0.02} ${-h - w * 0.36}`} stroke="#a8782a" strokeWidth={3} />
    </g>
  )
}
