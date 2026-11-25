import type { ReactNode } from 'react'
import { REALM } from './palette'

// The armies and the great ones of the war, all our own, drawn bold and small the way the strategy view shows
// them: each people in its team colour (the kingdom blue and steel, the dead purple and bone, the horned clans
// red and iron, the forest green), a health bar over each small unit, and the ring under a selected one. Each
// stands with its feet at its origin and faces right; a scene places it with a translate (a scale of -1 turns it
// to face left) and moves the parts marked data-fx, every one carrying the unit's own name, so two of a kind on a
// stage stay apart.

const INK = REALM.stone4b

/** The ring under a selected unit: a green ellipse on the ground, `rx` wide. */
export function SelectRing({ name, rx }: { name: string; rx: number }) {
  return (
    <g data-fx={name}>
      <ellipse rx={rx} ry={rx * 0.32} fill={REALM.selectRing} opacity="0.14" />
      <ellipse rx={rx} ry={rx * 0.32} fill="none" stroke={REALM.selectRing} strokeWidth="4" />
      <ellipse rx={rx * 0.86} ry={rx * 0.26} fill="none" stroke={REALM.selectGlow} strokeWidth="1.5" opacity="0.7" />
    </g>
  )
}

/** The bar over a unit's head, filled `life` of the way in its team colour's health green. */
function HealthBar({ y, life = 1 }: { y: number; life?: number }) {
  return (
    <g>
      <rect x={-18} y={y} width={36} height={6} fill={REALM.stone1} stroke={INK} strokeWidth="1" />
      <rect x={-17} y={y + 1} width={34 * life} height={4} fill={life > 0.5 ? REALM.lifeGreen : REALM.lifeRed} />
    </g>
  )
}

interface Look {
  coat: string
  trim: string
  skin: string
  legs?: string
}

/** The shared body of the small people, 80 high: legs, a tunic in `coat`, the back arm, a head in `skin` with its
 *  own head piece, the front arm holding its tool (marked `${name}-arm`, turning about the shoulder 15, -46),
 *  what it carries before it, and its health bar. */
function Person({ name, look, head, tool, front, life = 1 }: { name: string; look: Look; head?: ReactNode; tool?: ReactNode; front?: ReactNode; life?: number }) {
  const line = { stroke: INK, strokeWidth: 2 }
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill={REALM.stone1} opacity="0.5" />
      <rect x="-9" y="-24" width="8" height="24" rx="2" fill={look.legs ?? REALM.stone15} {...line} />
      <rect x="2" y="-24" width="8" height="24" rx="2" fill={look.legs ?? REALM.stone15} {...line} />
      <path d="M-14,-52 L14,-52 L18,-20 L-18,-20 Z" fill={look.coat} {...line} />
      <path d="M-17,-23 L17,-23" stroke={look.trim} strokeWidth="3" />
      <rect x="-21" y="-50" width="8" height="22" rx="3" fill={look.coat} {...line} />
      <circle cx="0" cy="-62" r="11" fill={look.skin} {...line} />
      {head}
      {front}
      <g data-fx={`${name}-arm`}>
        <rect x="11" y="-50" width="8" height="22" rx="3" fill={look.coat} {...line} />
        {tool && <g transform="translate(16 -28)">{tool}</g>}
      </g>
      <HealthBar y={-94} life={life} />
    </g>
  )
}

const EYE = (fill: string) => <circle cx="5" cy="-62" r="2" fill={fill} />

const SWORD = <path d="M-2,4 L2,4 L3,-36 L0,-44 L-3,-36 Z" fill={REALM.steelLight} stroke={INK} strokeWidth="1.5" />
const AXE = (
  <>
    <rect x="-2" y="-40" width="4" height="46" fill={REALM.ember21} />
    <path d="M2,-40 Q22,-44 20,-22 Q12,-30 2,-26 Z" fill={REALM.steelShade} stroke={INK} strokeWidth="1.5" />
  </>
)
const TORCH = (
  <>
    <rect x="-2" y="-34" width="4" height="36" fill={REALM.ember21} />
    <path d="M-8,-34 Q0,-60 8,-34 Z" fill={REALM.chaosFireMid} />
    <path d="M-3,-35 Q0,-48 3,-35 Z" fill={REALM.chaosFireCore} />
  </>
)
const HALBERD = (
  <>
    <rect x="-2" y="-90" width="4" height="96" fill={REALM.ember21} />
    <path d="M2,-84 Q20,-82 18,-64 L2,-68 Z M-2,-90 L0,-104 L2,-90 Z" fill={REALM.steelLight} stroke={INK} strokeWidth="1.5" />
  </>
)
const CLEAVER = <path d="M-3,6 L3,6 L3,-20 L16,-22 L18,-58 L-6,-54 Z" fill={REALM.steelShade} stroke={INK} strokeWidth="2" />

const STEEL_HELM = <path d="M-12,-62 Q-12,-77 0,-77 Q12,-77 12,-62 L12,-60 L-12,-60 Z M-1,-62 H12 V-58 H-1 Z" fill={REALM.steel} stroke={INK} strokeWidth="1.5" />
const ROUND_SHIELD = (
  <g>
    <circle cx="10" cy="-36" r="15" fill={REALM.kingdomBlue} stroke={REALM.goldMid} strokeWidth="3" />
    <circle cx="10" cy="-36" r="4" fill={REALM.goldMid} />
  </g>
)

/** A footman of the river kingdom: steel helm, blue tabard, sword and round shield. */
export function Footman({ name, life }: { name: string; life?: number }) {
  return <Person name={name} life={life} look={{ coat: REALM.kingdomBlue, trim: REALM.goldMid, skin: REALM.ember64, legs: REALM.steelShade }} head={STEEL_HELM} front={ROUND_SHIELD} tool={SWORD} />
}

/** A guard of the king's hall, a halberd in hand. */
export function Guard({ name }: { name: string }) {
  return <Person name={name} look={{ coat: REALM.kingdomBlue, trim: REALM.goldMid, skin: REALM.ember64, legs: REALM.steelShade }} head={STEEL_HELM} tool={HALBERD} />
}

/** One of the kingdom's folk, running. */
export function Villager({ name, tint = 0 }: { name: string; tint?: number }) {
  const coat = [REALM.ember33, REALM.moss23, REALM.riverBlue][tint % 3]
  return <Person name={name} look={{ coat, trim: REALM.riverCream, skin: REALM.ember64 }} head={<>{EYE(REALM.stone1)}</>} />
}

/** The hooded seer who warns: a grey robe to the ground, the hood up, a staff with a lantern of green light. */
export function Seer({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill={REALM.stone1} opacity="0.5" />
      <path d="M-18,-58 L18,-58 L26,0 L-26,0 Z" fill={REALM.cloakShade} stroke={INK} strokeWidth="2" />
      <path d="M-14,-58 Q-20,-92 2,-92 Q22,-90 16,-58 Z" fill={REALM.cloak} stroke={INK} strokeWidth="2" />
      <ellipse cx="5" cy="-66" rx="7" ry="8" fill={REALM.stone4a} />
      <circle cx="8" cy="-66" r="1.8" fill={REALM.plague} />
      <path d="M4,-40 Q10,-60 6,-70" stroke={REALM.earth74} strokeWidth="5" fill="none" />
      <g data-fx={`${name}-arm`}>
        <rect x="12" y="-56" width="8" height="24" rx="3" fill={REALM.cloak} stroke={INK} strokeWidth="2" />
        <g transform="translate(18 -32)">
          <rect x="-2" y="-80" width="4" height="114" fill={REALM.ember21} />
          <path d="M-8,-80 L0,-96 L8,-80 L0,-72 Z" fill={REALM.stone22} stroke={INK} strokeWidth="1.5" />
          <circle cx="0" cy="-84" r="5" fill={REALM.plague} />
        </g>
      </g>
    </g>
  )
}

/** The old river king on his throne, his pointing arm marked `${name}-arm`; the throne is about 150 high. */
export function OldKing({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-46,0 V-150 Q0,-196 46,-150 V0 Z" fill={REALM.kingdomBlue} stroke={REALM.goldMid} strokeWidth="5" />
      <path d="M-30,-140 Q0,-170 30,-140" stroke={REALM.goldMid} strokeWidth="3" fill="none" />
      <rect x={-54} y={-56} width={108} height={22} fill={REALM.goldDark} stroke={INK} strokeWidth="2" />
      <g data-fx={`${name}-body`} transform="translate(0 -40)">
        <path d="M-18,-54 L18,-54 L24,0 L-24,0 Z" fill={REALM.blood28} stroke={INK} strokeWidth="2" />
        <path d="M-18,-54 L18,-54 L14,-42 L-14,-42 Z" fill={REALM.earth74} />
        <circle cx={0} cy={-66} r={12} fill={REALM.ember64} stroke={INK} strokeWidth="2" />
        <path d="M-10,-58 Q0,-44 10,-58 Z" fill={REALM.earth74} />
        <path d="M-12,-74 L-8,-84 L-4,-76 L0,-86 L4,-76 L8,-84 L12,-74 Z" fill={REALM.princeGold} stroke={INK} strokeWidth="1.5" />
        <g data-fx={`${name}-arm`}>
          <rect x={12} y={-52} width={8} height={24} rx={3} fill={REALM.blood28} stroke={INK} strokeWidth="2" />
        </g>
      </g>
    </g>
  )
}

/** A raider of the horned clans: tusked, a horned iron helm, red cloth, an axe or a torch. */
export function Raider({ name, torch = false, life }: { name: string; torch?: boolean; life?: number }) {
  return (
    <Person
      name={name}
      life={life}
      look={{ coat: REALM.clanRed, trim: REALM.stone22, skin: REALM.clanSkin, legs: REALM.ember21 }}
      head={
        <>
          <path d="M-12,-64 Q-12,-78 0,-78 Q12,-78 12,-64 Z" fill={REALM.stone28} stroke={INK} strokeWidth="1.5" />
          <path d="M-10,-72 Q-26,-78 -24,-94 Q-18,-80 -6,-76 Z M10,-72 Q26,-78 24,-94 Q18,-80 6,-76 Z" fill={REALM.clanHorn} stroke={INK} strokeWidth="1.5" />
          {EYE(REALM.blood40)}
          <path d="M6,-55 L8,-49 L10,-55 Z" fill={REALM.clanHorn} />
        </>
      }
      tool={torch ? TORCH : AXE}
    />
  )
}

/** One of the risen, the plague's dead: hunched, grey and purple, claws out, the dead's team purple on its rags. */
export function Risen({ name, life }: { name: string; life?: number }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill={REALM.stone1} opacity="0.5" />
      <path d="M-9,0 L-6,-26 L0,-26 L-2,0 Z M3,0 L6,-26 L11,-26 L10,0 Z" fill={REALM.deadSkin} stroke={INK} strokeWidth="2" />
      <path d="M-16,-50 Q0,-60 16,-46 L18,-22 L12,-28 L6,-20 L0,-28 L-6,-20 L-12,-28 L-18,-22 Z" fill={REALM.deadPurple} stroke={INK} strokeWidth="2" />
      <circle cx="10" cy="-54" r="11" fill={REALM.deadSkin} stroke={INK} strokeWidth="2" />
      <circle cx="15" cy="-56" r="2.2" fill={REALM.plague} />
      <path d="M14,-46 L22,-44" stroke={INK} strokeWidth="2" />
      <g data-fx={`${name}-arm`}>
        <path d="M8,-42 L38,-36 M8,-34 L36,-26" stroke={REALM.deadSkin} strokeWidth="7" strokeLinecap="round" />
        <path d="M38,-36 L46,-40 M38,-36 L46,-34 M36,-26 L44,-28 M36,-26 L43,-21" stroke={REALM.earth74} strokeWidth="2" />
      </g>
      <HealthBar y={-86} life={life} />
    </g>
  )
}

/** A bone soldier of the dead: a skeleton with a notched sword and a purple shield. */
export function BoneSoldier({ name, life }: { name: string; life?: number }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill={REALM.stone1} opacity="0.5" />
      <path d="M-6,0 V-26 M6,0 V-26 M0,-26 V-54 M-12,-48 H12 M-11,-42 H11 M-9,-36 H9" stroke={REALM.earth74} strokeWidth="4" strokeLinecap="round" />
      <path d="M-10,-26 H10" stroke={REALM.earth74} strokeWidth="5" />
      <circle cx="2" cy="-64" r="11" fill={REALM.earth74} stroke={INK} strokeWidth="2" />
      <circle cx="6" cy="-66" r="2.6" fill={REALM.frostIceBright} />
      <path d="M-2,-56 H8" stroke={INK} strokeWidth="2" />
      <path d="M-22,-50 L-4,-50 L-4,-26 Q-13,-18 -22,-26 Z" fill={REALM.deadPurple} stroke={INK} strokeWidth="2" />
      <g data-fx={`${name}-arm`}>
        <path d="M6,-48 L18,-28" stroke={REALM.earth74} strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(18 -28)">{SWORD}</g>
      </g>
      <HealthBar y={-88} life={life} />
    </g>
  )
}

/** The stitched brute, a hulk sewn from the dead: a fat grey body crossed with stitches, a hook and a cleaver,
 *  its cleaver arm marked `${name}-arm` (turning about 30, -110); about 170 high. */
export function StitchedBrute({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="56" ry="11" fill={REALM.stone1} opacity="0.55" />
      <path d="M-30,0 L-26,-46 L-6,-46 L-10,0 Z M8,0 L6,-46 L28,-46 L32,0 Z" fill={REALM.deadSkin} stroke={INK} strokeWidth="2.5" />
      <path d="M-58,-60 Q-64,-150 -10,-160 Q54,-160 60,-90 Q62,-40 30,-38 L-34,-38 Q-58,-40 -58,-60 Z" fill={REALM.deadSkin} stroke={INK} strokeWidth="3" />
      <path d="M-40,-120 Q-10,-100 30,-128 M-46,-80 Q0,-60 50,-88 M-10,-158 L-4,-40" stroke={REALM.blood24} strokeWidth="3" fill="none" />
      <path d="M-34,-118 l-4,-6 M-24,-112 l-4,-6 M-14,-110 l-3,-6 M-4,-110 l-2,-6 M8,-114 l0,-6 M18,-118 l2,-6 M-30,-74 l-3,-6 M-16,-70 l-2,-6 M0,-68 l0,-6 M16,-72 l2,-6 M32,-78 l3,-6" stroke={INK} strokeWidth="2" />
      <ellipse cx="-14" cy="-96" rx="16" ry="10" fill={REALM.plague} opacity="0.55" />
      <circle cx="18" cy="-162" r="17" fill={REALM.deadSkin} stroke={INK} strokeWidth="2.5" />
      <circle cx="24" cy="-166" r="3" fill={REALM.plague} />
      <path d="M14,-152 L32,-150" stroke={INK} strokeWidth="2" />
      <path d="M-56,-110 L-82,-64 M-82,-64 Q-96,-56 -86,-44" stroke={REALM.deadSkin} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-86,-44 Q-100,-36 -92,-24 M-86,-44 Q-78,-30 -88,-22" stroke={REALM.steelShade} strokeWidth="4" fill="none" />
      <g data-fx={`${name}-arm`}>
        <path d="M30,-110 L68,-70" stroke={REALM.deadSkin} strokeWidth="14" strokeLinecap="round" />
        <g transform="translate(68 -70) scale(1.6)">{CLEAVER}</g>
      </g>
      <HealthBar y={-196} />
    </g>
  )
}

/** A grain cart heaped with sacks, its sacks split green in `${name}-dust`. */
export function Cart({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-60,-30 L60,-30 L56,-60 L-56,-60 Z" fill={REALM.ember27} stroke={INK} strokeWidth="3" />
      {[-36, -6, 24].map((x) => (
        <ellipse key={x} cx={x} cy={-72} rx={20} ry={16} fill={REALM.earth48} stroke={INK} strokeWidth="2" />
      ))}
      {[-30, 30].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-16} r={16} fill="none" stroke={REALM.ember16} strokeWidth="5" />
          <path d={`M${x - 16},-16 H${x + 16} M${x},-32 V0`} stroke={REALM.ember16} strokeWidth="3" />
        </g>
      ))}
      <g data-fx={`${name}-dust`} opacity="0">
        <ellipse cx={-6} cy={-80} rx={60} ry={34} fill={REALM.plague} opacity="0.4" />
        <ellipse cx={-6} cy={-70} rx={34} ry={20} fill={REALM.plague} opacity="0.6" />
      </g>
    </g>
  )
}

/** A clans' longship: a dragon prow, shields along its side, a red sail in `${name}-sail` and oars in
 *  `${name}-oars`; about 340 long. */
export function Longship({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <g data-fx={`${name}-oars`}>
        {[-100, -60, -20, 20, 60].map((x) => (
          <path key={x} d={`M${x},-4 L${x - 24},40`} stroke={REALM.ember21} strokeWidth="5" />
        ))}
      </g>
      <path d="M-170,-24 Q-160,14 -110,14 L120,14 Q160,14 176,-50 L156,-36 Q144,-12 116,-12 L-110,-12 Q-140,-12 -150,-50 Z" fill={REALM.ember27} stroke={INK} strokeWidth="4" />
      <path d="M176,-50 Q196,-84 178,-104 Q170,-84 160,-74 Z" fill={REALM.ember27} stroke={INK} strokeWidth="3" />
      <circle cx="182" cy="-92" r="3" fill={REALM.blood40} />
      {[-110, -70, -30, 10, 50, 90].map((x) => (
        <circle key={x} cx={x} cy={-6} r={11} fill={x % 20 === 0 ? REALM.clanRed : REALM.stone28} stroke={INK} strokeWidth="2" />
      ))}
      <path d="M-10,-12 V-230" stroke={REALM.ember16} strokeWidth="8" />
      <g data-fx={`${name}-sail`}>
        <path d="M-90,-220 H70 Q86,-140 70,-60 H-90 Q-74,-140 -90,-220 Z" fill={REALM.clanRed} stroke={INK} strokeWidth="3" />
        <path d="M-34,-170 L-10,-120 L14,-170 M-40,-110 H20" stroke={REALM.stone4b} strokeWidth="9" fill="none" />
      </g>
    </g>
  )
}

/** The clans' war drum, a great hide drum on a frame. */
export function WarDrum() {
  return (
    <g>
      <path d="M-50,0 L-40,-40 M50,0 L40,-40" stroke={REALM.ember16} strokeWidth="8" />
      <ellipse cx={0} cy={-80} rx={52} ry={46} fill={REALM.ember33} stroke={INK} strokeWidth="4" />
      <ellipse cx={-44} cy={-80} rx={12} ry={46} fill={REALM.riverCream} stroke={INK} strokeWidth="4" />
      <path d="M-36,-118 L40,-44 M-36,-42 L40,-116" stroke={REALM.ember21} strokeWidth="3" />
    </g>
  )
}

/** The clans' warlord, our own, twice their size: horned and tusked, his axe arm marked `${name}-arm` (turning
 *  about 30, -124); the red of the fouled well over him in `${name}-red`, which drains out. About 190 high. */
export function Warlord({ name }: { name: string }) {
  const body = (skin: string, cloth: string) => (
    <>
      <rect x="-28" y="-60" width="22" height="60" rx="6" fill={cloth} stroke={INK} strokeWidth="2.5" />
      <rect x="6" y="-60" width="22" height="60" rx="6" fill={cloth} stroke={INK} strokeWidth="2.5" />
      <path d="M-46,-140 L46,-140 L38,-54 L-38,-54 Z" fill={skin} stroke={INK} strokeWidth="3" />
      <path d="M-38,-64 H38" stroke={REALM.ember16} strokeWidth="7" />
      <path d="M-46,-140 Q-60,-150 -54,-120 L-40,-118 Z M46,-140 Q60,-150 54,-120 L40,-118 Z" fill={REALM.stone28} stroke={INK} strokeWidth="2" />
      <circle cx="8" cy="-156" r="24" fill={skin} stroke={INK} strokeWidth="3" />
      <path d="M-4,-170 Q-38,-186 -34,-146 Q-26,-162 -10,-160 Z M20,-170 Q54,-186 50,-146 Q44,-162 28,-160 Z" fill={REALM.clanHorn} stroke={INK} strokeWidth="2" />
      <path d="M14,-142 L18,-132 L22,-142 Z M2,-142 L4,-134 L8,-142 Z" fill={REALM.clanHorn} />
    </>
  )
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="50" ry="10" fill={REALM.stone1} opacity="0.55" />
      {body(REALM.clanSkin, REALM.ember21)}
      <circle cx="20" cy="-160" r="3.5" fill={REALM.stone1} />
      <g data-fx={`${name}-red`}>
        {body(REALM.warlordRed, REALM.blood19)}
        <circle cx="20" cy="-160" r="4.5" fill={REALM.chaosFireCore} />
      </g>
      <g data-fx={`${name}-arm`}>
        <path d="M30,-124 L76,-92" stroke={REALM.clanSkin} strokeWidth="16" strokeLinecap="round" />
        <g transform="translate(78 -92) rotate(-30) scale(1.9)">{AXE}</g>
      </g>
    </g>
  )
}

/** The pit fiend that comes up out of the fouled well: a horned demon of red hide and black wings, his claws
 *  marked `${name}-arm`; about 300 high. */
export function PitFiend({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-40,-200 Q-180,-320 -220,-160 Q-160,-210 -120,-150 Q-90,-200 -60,-150 Z M40,-200 Q180,-320 220,-160 Q160,-210 120,-150 Q90,-200 60,-150 Z" fill={REALM.stone8b} stroke={INK} strokeWidth="3" />
      <path d="M-70,-40 Q-90,-230 0,-250 Q90,-230 70,-40 Z" fill={REALM.blood31} stroke={INK} strokeWidth="4" />
      <path d="M-40,-200 Q0,-180 40,-200 M-50,-150 Q0,-130 50,-150 M-54,-100 Q0,-80 54,-100" stroke={REALM.blood10} strokeWidth="4" fill="none" />
      <path d="M-36,-262 Q-80,-300 -70,-340 Q-56,-300 -24,-276 Z M36,-262 Q80,-300 70,-340 Q56,-300 24,-276 Z" fill={REALM.clanHorn} stroke={INK} strokeWidth="3" />
      <circle cx="0" cy="-262" r="34" fill={REALM.blood31} stroke={INK} strokeWidth="4" />
      <path d="M-18,-268 L-6,-262 M18,-268 L6,-262" stroke={REALM.chaosFireCore} strokeWidth="6" strokeLinecap="round" />
      <path d="M-16,-244 L-10,-234 L-4,-244 L2,-234 L8,-244 L14,-234 L18,-244" stroke={REALM.ash100} strokeWidth="3" fill="none" />
      <g data-fx={`${name}-arm`}>
        <path d="M60,-200 Q130,-200 150,-130" stroke={REALM.blood31} strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M150,-130 L160,-96 M150,-130 L170,-110 M150,-130 L140,-98" stroke={REALM.clanHorn} strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M-60,-200 Q-120,-180 -130,-120" stroke={REALM.blood31} strokeWidth="26" strokeLinecap="round" fill="none" />
    </g>
  )
}

/** A mage of the tower city, fleeing: a violet robe to the ground and a pointed hood. */
export function Mage({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-16,-52 L16,-52 L22,0 L-22,0 Z" fill={REALM.mageViolet} stroke={INK} strokeWidth="2" />
      <circle cx="0" cy="-62" r="11" fill={REALM.ember71} stroke={INK} strokeWidth="2" />
      <path d="M-14,-58 L0,-96 L14,-58 Z" fill={REALM.mageViolet} stroke={INK} strokeWidth="2" />
      <path d="M12,-46 L26,-60" stroke={REALM.mageViolet} strokeWidth="7" strokeLinecap="round" />
    </g>
  )
}

/** A tree of the forest that pulls up its roots and walks, its eyes lit: its roots in `${name}-roots`; about 300
 *  high. */
export function WalkingTree({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <g data-fx={`${name}-roots`}>
        <path d="M-10,-40 Q-40,-10 -60,0 M10,-40 Q40,-10 60,0 M0,-40 Q-6,-10 -4,0" stroke={REALM.forestBark} strokeWidth="13" fill="none" strokeLinecap="round" />
      </g>
      <path d="M-20,-40 Q-26,-160 -8,-220 L8,-220 Q26,-160 20,-40 Z" fill={REALM.forestBark} stroke={INK} strokeWidth="3" />
      <path d="M-6,-200 Q-60,-230 -84,-196 M6,-200 Q60,-240 88,-206" stroke={REALM.forestBark} strokeWidth="12" fill="none" strokeLinecap="round" />
      {[
        [-62, -250, 70],
        [10, -292, 92],
        [72, -242, 66],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={REALM.forestMoss} stroke={REALM.moss15} strokeWidth="5" />
      ))}
      <circle cx={-6} cy={-150} r={5} fill={REALM.spirit} />
      <circle cx={10} cy={-150} r={5} fill={REALM.spirit} />
    </g>
  )
}

/** A wisp of the forest: a pale light with a tail. */
export function Wisp({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <path d="M0,0 Q-40,-20 -90,-10 Q-40,6 0,10 Z" fill={REALM.spirit} opacity="0.5" />
      <circle cx={6} cy={4} r={30} fill={REALM.spirit} opacity="0.3" />
      <circle cx={6} cy={4} r={14} fill={REALM.spirit} />
    </g>
  )
}

/** The giant of cinders, the demons' lord, our own: a horned hulk of black stone and ember, his cracks and eyes
 *  glowing green and orange, a great blade in his arm marked `${name}-arm`; about 460 high. */
export function CinderGiant({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx={0} cy={-230} rx={220} ry={280} fill={REALM.blightFire} opacity="0.1" />
      <path d="M-74,0 L-62,-150 L-10,-150 L-20,0 Z M20,0 L14,-150 L66,-150 L80,0 Z" fill={REALM.cinder} stroke={INK} strokeWidth="4" />
      <path d="M-116,-140 Q-136,-350 -20,-390 Q96,-400 126,-330 Q146,-226 116,-140 Z" fill={REALM.cinder} stroke={INK} strokeWidth="4" />
      <path d="M-50,-340 L-30,-280 L-60,-220 M40,-360 L20,-300 L60,-240 M-10,-210 L10,-170" stroke={REALM.cinderGlow} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M-112,-330 L-174,-210 L-152,-114 L-122,-120 L-138,-206 L-82,-298 Z" fill={REALM.cinder} stroke={INK} strokeWidth="3" />
      <circle cx={-10} cy={-414} r={46} fill={REALM.cinder} stroke={INK} strokeWidth="4" />
      <path d="M-46,-440 Q-110,-470 -96,-520 Q-80,-470 -30,-452 Z M26,-440 Q90,-470 76,-520 Q60,-470 10,-452 Z" fill={REALM.stone22} stroke={REALM.cinderGlow} strokeWidth="3" />
      <ellipse cx={-28} cy={-416} rx={9} ry={5} fill={REALM.blightFireCore} />
      <ellipse cx={8} cy={-416} rx={9} ry={5} fill={REALM.blightFireCore} />
      <g data-fx={`${name}-arm`}>
        <path d="M112,-320 L176,-220 L166,-120 L136,-124 L144,-214 L88,-290 Z" fill={REALM.cinder} stroke={INK} strokeWidth="3" />
        <path d="M150,-130 L170,-140 L250,-460 L230,-470 Z" fill={REALM.stone22} stroke={REALM.blightFire} strokeWidth="4" />
      </g>
    </g>
  )
}

/** A horned fiend of the demon host: black and red, a curved blade. */
export function Fiend({ name }: { name: string }) {
  return (
    <Person
      name={name}
      look={{ coat: REALM.blood15, trim: REALM.blightFire, skin: REALM.blood31, legs: REALM.stone8b }}
      head={
        <>
          <path d="M-8,-70 Q-24,-86 -14,-100 Q-12,-84 -2,-74 Z M8,-70 Q24,-86 14,-100 Q12,-84 2,-74 Z" fill={REALM.clanHorn} stroke={INK} strokeWidth="1.5" />
          {EYE(REALM.blightFireCore)}
        </>
      }
      tool={<path d="M-2,6 L2,6 Q20,-20 4,-50 Q8,-20 -2,6 Z" fill={REALM.steelShade} stroke={REALM.blightFire} strokeWidth="2" />}
    />
  )
}
