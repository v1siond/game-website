import type { ReactNode } from 'react'
import { REALM } from './palette'

// The field's units, buildings and spell marks, drawn small for the strategy view the scenes play (scenes.tsx).
// Each stands with its feet (or its foot line) at its origin and faces right; a scene places it with a
// translate and moves the parts marked data-fx. Every name a scene moves carries the unit's own key, so two
// of a kind on one stage stay apart.

// ---- commands ----

/** The ring under a selected unit: a green ellipse on the ground, `rx` wide. */
export function SelectRing({ name, rx }: { name: string; rx: number }) {
  return (
    <g data-fx={name} opacity="0">
      <ellipse rx={rx} ry={rx * 0.3} fill="none" stroke={REALM.selectRing} strokeWidth="3" />
      <ellipse rx={rx} ry={rx * 0.3} fill={REALM.selectRing} opacity="0.12" />
    </g>
  )
}

/** The order marker: chevrons closing on a point of the ground, and the point's ring. */
export function OrderMarker({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <ellipse rx="26" ry="8" fill="none" stroke={REALM.selectRing} strokeWidth="3" />
      {[-1, 1].map((side) => (
        <path key={side} d={`M${side * 30},-34 L${side * 10},-12 L${side * 22},-12`} fill="none" stroke={REALM.selectGlow} strokeWidth="4" strokeLinejoin="round" />
      ))}
    </g>
  )
}

/** A dragged selection box over a group, `width` by `height` above its foot line. */
export function SelectBox({ name, width, height }: { name: string; width: number; height: number }) {
  return (
    <g data-fx={name} opacity="0">
      <rect x={-width / 2} y={-height} width={width} height={height} fill={REALM.selectRing} fillOpacity="0.08" stroke={REALM.selectRing} strokeWidth="2.5" strokeDasharray="10 6" />
    </g>
  )
}

/** A small four point star: a coin's glint, a stun's spark. */
export function Glint({ name, size = 14, fill = REALM.levelGold }: { name: string; size?: number; fill?: string }) {
  const s = size
  return (
    <g data-fx={name} opacity="0">
      <path d={`M0,${-s} L${s * 0.25},${-s * 0.25} L${s},0 L${s * 0.25},${s * 0.25} L0,${s} L${-s * 0.25},${s * 0.25} L${-s},0 L${-s * 0.25},${-s * 0.25} Z`} fill={fill} />
    </g>
  )
}

/** The column of gold light a hero levels up in, 120 wide and 420 high over his feet. */
export function LevelColumn({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <defs>
        <linearGradient id={`${name}-fade`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={REALM.levelGold} stopOpacity="0.9" />
          <stop offset="100%" stopColor={REALM.levelGold} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="-60" y="-420" width="120" height="420" fill={`url(#${name}-fade)`} />
      <rect x="-18" y="-420" width="36" height="420" fill={REALM.ash100} opacity="0.35" />
      <ellipse rx="80" ry="20" fill={REALM.levelGold} opacity="0.5" />
    </g>
  )
}

/** A ring of power on the ground, spreading out from its middle. */
export function AuraRing({ name, fill = REALM.frostIceMid }: { name: string; fill?: string }) {
  return (
    <g data-fx={name} opacity="0">
      <ellipse rx="100" ry="26" fill="none" stroke={fill} strokeWidth="5" />
      <ellipse rx="100" ry="26" fill={fill} opacity="0.12" />
    </g>
  )
}

/** One shard of ice falling point first, 60 long, its point at the origin. */
export function IceShard({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <polygon points="0,0 9,-38 4,-60 -4,-60 -9,-38" fill={REALM.frostIceMid} />
      <polygon points="0,-4 4,-36 0,-56" fill={REALM.frostIceBright} />
    </g>
  )
}

// ---- units ----

/** The shared body of the small units: legs, a tunic in `coat`, arms, a head in `skin` and the unit's own head
 *  piece and tool. The tool arm is marked `${name}-arm`, turning about the shoulder (6, -46). 80 high. */
function Body({ name, coat, trim, skin, head, tool }: { name: string; coat: string; trim: string; skin: string; head: ReactNode; tool: ReactNode }) {
  return (
    <>
      <ellipse cx="0" cy="0" rx="20" ry="5" fill={REALM.stone1} opacity="0.45" />
      <rect x="-9" y="-24" width="7" height="24" rx="2" fill={REALM.stone15} />
      <rect x="2" y="-24" width="7" height="24" rx="2" fill={REALM.stone15} />
      <path d="M-14,-50 L14,-50 L17,-20 L-17,-20 Z" fill={coat} />
      <path d="M-17,-22 L17,-22" stroke={trim} strokeWidth="3" />
      <rect x="-20" y="-48" width="7" height="22" rx="3" fill={coat} />
      <circle cx="0" cy="-60" r="11" fill={skin} />
      {head}
      <g data-fx={`${name}-arm`}>
        <rect x="12" y="-48" width="7" height="20" rx="3" fill={coat} />
        <g transform="translate(16 -28)">{tool}</g>
      </g>
    </>
  )
}

/** A worker with his pick, `pale` for the frost realm's dead worker. */
export function Worker({ name, pale = false }: { name: string; pale?: boolean }) {
  const skin = pale ? REALM.frost75 : REALM.ember71
  const coat = pale ? REALM.night20a : REALM.ember33
  return (
    <g data-fx={name}>
      <Body
        name={name}
        coat={coat}
        trim={pale ? REALM.frostIceDark : REALM.ember21}
        skin={skin}
        head={
          <>
            <path d="M-12,-63 Q0,-78 12,-63 Z" fill={pale ? REALM.night15a : REALM.ember21} />
            <circle cx="5" cy="-60" r="1.8" fill={pale ? REALM.frostIceMid : REALM.stone1} />
          </>
        }
        tool={
          <>
            <rect x="-2" y="-30" width="4" height="34" fill={REALM.ember27} />
            <path d="M-12,-30 Q0,-38 12,-30 L10,-27 Q0,-33 -10,-27 Z" fill={REALM.stone41} />
          </>
        }
      />
      <g data-fx={`${name}-sack`} opacity="0">
        <ellipse cx="-16" cy="-48" rx="11" ry="10" fill={REALM.ember28} />
        <circle cx="-14" cy="-55" r="3" fill={REALM.goldBright} />
      </g>
    </g>
  )
}

const SOLDIER_COATS = {
  ours: { coat: REALM.warbandRed, trim: REALM.goldMid, skin: REALM.ember64, helm: REALM.stone41 },
  enemy: { coat: REALM.kingdomBlue, trim: REALM.goldMid, skin: REALM.ember64, helm: REALM.stone47 },
  raised: { coat: REALM.night20a, trim: REALM.frostIceDark, skin: REALM.frost66, helm: REALM.night23a },
} as const

/** A soldier with a helm, a shield and a sword: ours, the enemy's or one of the raised dead. */
export function Soldier({ name, side }: { name: string; side: keyof typeof SOLDIER_COATS }) {
  const look = SOLDIER_COATS[side]
  return (
    <g data-fx={name}>
      <Body
        name={name}
        coat={look.coat}
        trim={look.trim}
        skin={look.skin}
        head={
          <>
            <path d="M-12,-60 Q-12,-74 0,-74 Q12,-74 12,-60 L12,-58 L-12,-58 Z" fill={look.helm} />
            <rect x="2" y="-62" width="9" height="3" fill={side === 'raised' ? REALM.frostIceBright : REALM.stone1} />
          </>
        }
        tool={<path d="M-2,4 L2,4 L3,-34 L0,-40 L-3,-34 Z" fill={REALM.stone47} />}
      />
      <path d="M-24,-46 L-8,-46 L-8,-26 Q-16,-18 -24,-26 Z" fill={look.coat} stroke={look.trim} strokeWidth="2.5" />
    </g>
  )
}

/** A creep of the wild camps: a hunched tusked beast, 70 high. */
export function Creep({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="30" ry="6" fill={REALM.stone1} opacity="0.45" />
      <rect x="-20" y="-22" width="9" height="22" rx="3" fill={REALM.moss24} />
      <rect x="8" y="-22" width="9" height="22" rx="3" fill={REALM.moss24} />
      <ellipse cx="-2" cy="-36" rx="30" ry="20" fill={REALM.moss27} />
      <path d="M-26,-48 Q-6,-64 18,-50" fill="none" stroke={REALM.moss23} strokeWidth="6" />
      <ellipse cx="-24" cy="-42" rx="14" ry="12" fill={REALM.moss28} />
      <path d="M-34,-38 Q-40,-46 -36,-54" fill="none" stroke={REALM.ember77} strokeWidth="3.5" />
      <circle cx="-28" cy="-46" r="2.5" fill={REALM.chaosFireBright} />
    </g>
  )
}

/** The enemy champion: a horned brute with a great axe, 150 high, facing left at the hero. Its axe arm is
 *  marked `${name}-arm`, turning about its shoulder (-30, -110). */
export function Champion({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="46" ry="9" fill={REALM.stone1} opacity="0.5" />
      <rect x="-26" y="-50" width="18" height="50" rx="5" fill={REALM.blood19} />
      <rect x="8" y="-50" width="18" height="50" rx="5" fill={REALM.blood19} />
      <path d="M-40,-116 L40,-116 L34,-46 L-34,-46 Z" fill={REALM.blood27} />
      <path d="M-34,-60 L34,-60" stroke={REALM.goldDark} strokeWidth="5" />
      <circle cx="0" cy="-128" r="20" fill={REALM.blood33} />
      <path d="M-14,-140 Q-34,-160 -40,-140 M14,-140 Q34,-160 40,-140" fill="none" stroke={REALM.ember77} strokeWidth="6" strokeLinecap="round" />
      <circle cx="-8" cy="-130" r="3" fill={REALM.chaosFireCore} />
      <rect x="20" y="-110" width="14" height="40" rx="5" fill={REALM.blood27} />
      <g data-fx={`${name}-arm`}>
        <rect x="-44" y="-112" width="14" height="44" rx="5" fill={REALM.blood27} />
        <rect x="-41" y="-150" width="6" height="100" fill={REALM.ember27} />
        <path d="M-38,-150 Q-78,-140 -70,-110 Q-52,-122 -38,-120 Z" fill={REALM.stone47} />
      </g>
    </g>
  )
}

// ---- buildings and places ----

/** The town hall in its five stages, each marked `${name}-${i}` and rising from the foot line: the foundation,
 *  the walls and door, the roof, the towers, the battlements and banner pole. Plus the scaffold of a stage going
 *  up (`${name}-scaffold`) and the banner (`${name}-banner`). 260 wide. */
export const HALL_STAGES = 5

export function Hall({ name }: { name: string }) {
  return (
    <g>
      <g data-fx={`${name}-0`}>
        <rect x="-130" y="-16" width="260" height="16" fill={REALM.stone27} />
        <rect x="-130" y="-16" width="260" height="4" fill={REALM.stone41} />
      </g>
      <g data-fx={`${name}-1`}>
        <rect x="-100" y="-110" width="200" height="94" fill={REALM.stone33} />
        <path d="M-100,-80 L100,-80 M-100,-50 L100,-50" stroke={REALM.stone22} strokeWidth="3" />
        <path d="M-22,-16 L-22,-60 Q0,-80 22,-60 L22,-16 Z" fill={REALM.ember16c} />
        <rect x="-70" y="-90" width="16" height="22" fill={REALM.goldDark} opacity="0.8" />
        <rect x="54" y="-90" width="16" height="22" fill={REALM.goldDark} opacity="0.8" />
      </g>
      <g data-fx={`${name}-2`}>
        <path d="M-118,-110 L0,-190 L118,-110 Z" fill={REALM.blood24} />
        <path d="M-118,-110 L0,-190 L118,-110" fill="none" stroke={REALM.goldMid} strokeWidth="4" />
      </g>
      <g data-fx={`${name}-3`}>
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${side * 118} 0)`}>
            <rect x="-22" y="-190" width="44" height="174" fill={REALM.stone28} />
            <path d="M-28,-190 L0,-240 L28,-190 Z" fill={REALM.blood24} />
          </g>
        ))}
      </g>
      <g data-fx={`${name}-4`}>
        {[-80, -40, 40, 80].map((x) => (
          <rect key={x} x={x - 9} y="-128" width="18" height="18" fill={REALM.stone33} />
        ))}
        <rect x="-3" y="-290" width="6" height="104" fill={REALM.stone47} />
      </g>
      <g data-fx={`${name}-banner`} opacity="0">
        <path d="M3,-288 L60,-276 L48,-262 L60,-248 L3,-252 Z" fill={REALM.warbandRed} stroke={REALM.goldMid} strokeWidth="2" />
      </g>
      <g data-fx={`${name}-scaffold`} opacity="0">
        <path d="M-140,0 L-140,-210 M140,0 L140,-210 M-140,-70 L140,-70 M-140,-140 L140,-140 M-140,0 L-60,-70 M140,0 L60,-70" stroke={REALM.ember43} strokeWidth="5" fill="none" />
      </g>
    </g>
  )
}

/** The barracks: a long timber house with a door that glows as a soldier is trained (`${name}-door`). 200 wide. */
export function Barracks({ name }: { name: string }) {
  return (
    <g>
      <rect x="-100" y="-110" width="200" height="110" fill={REALM.ember21a} />
      <path d="M-100,-110 L100,-110 M-100,-60 L100,-60" stroke={REALM.ember16c} strokeWidth="5" />
      <path d="M-116,-110 L0,-170 L116,-110 Z" fill={REALM.blood22} />
      <rect x="-30" y="-74" width="60" height="74" fill={REALM.stone5c} />
      <rect data-fx={`${name}-door`} x="-30" y="-74" width="60" height="74" fill={REALM.chaosFireBright} opacity="0" />
      <path d="M-60,-150 L-60,-188 L-30,-178 L-60,-170" fill={REALM.warbandRed} />
    </g>
  )
}

/** The rally flag soldiers gather at. */
export function RallyFlag() {
  return (
    <g>
      <rect x="-2" y="-96" width="4" height="96" fill={REALM.ember47} />
      <path d="M2,-94 L44,-84 L2,-72 Z" fill={REALM.warbandRed} stroke={REALM.goldMid} strokeWidth="2" />
    </g>
  )
}

/** A gold mine in its rock, the mouth lit gold; `${name}-light` is the column of light a claim raises over it,
 *  in the realm's `light`. 180 wide. */
export function GoldMine({ name, light }: { name: string; light: string }) {
  return (
    <g>
      <g data-fx={`${name}-light`} opacity="0">
        <path d="M-50,-40 L-26,-280 L26,-280 L50,-40 Z" fill={light} opacity="0.35" />
        <ellipse cx="0" cy="-30" rx="80" ry="20" fill={light} opacity="0.4" />
      </g>
      <path d="M-90,0 Q-80,-110 0,-120 Q80,-110 90,0 Z" fill={REALM.stone22a} />
      <path d="M-60,-40 Q-40,-90 10,-96" fill="none" stroke={REALM.stone33} strokeWidth="5" />
      <path d="M-30,0 L-30,-48 Q0,-70 30,-48 L30,0 Z" fill={REALM.stone3c} />
      <path d="M-24,0 L-24,-44 Q0,-62 24,-44 L24,0 Z" fill={REALM.goldDark} opacity="0.6" />
      <circle cx="-48" cy="-70" r="6" fill={REALM.goldBright} />
      <circle cx="44" cy="-56" r="5" fill={REALM.goldBright} />
    </g>
  )
}
