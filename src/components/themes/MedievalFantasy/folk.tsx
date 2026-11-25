import type { ReactNode } from 'react'
import { REALM } from './palette'

// The field's people, beasts and things, all our own, drawn small and bold for the strategy view the scenes
// play (scenes.tsx). Each stands with its feet (or its foot line) at its origin and faces right; a scene
// places it with a translate (a scale of -1 turns it to face left) and moves the parts marked data-fx. Every
// name a scene moves carries the unit's own key, so two of a kind on one stage stay apart.

// ---- commands ----

/** The ring under a selected unit: a green ellipse on the ground, `rx` wide. */
export function SelectRing({ name, rx }: { name: string; rx: number }) {
  return (
    <g data-fx={name}>
      <ellipse rx={rx} ry={rx * 0.3} fill="none" stroke={REALM.selectRing} strokeWidth="3" />
      <ellipse rx={rx} ry={rx * 0.3} fill={REALM.selectRing} opacity="0.12" />
    </g>
  )
}

// ---- people ----

interface Look {
  coat: string
  trim: string
  skin: string
  legs?: string
}

/** The shared body of the small people, 80 high: legs, a tunic in `coat`, the back arm, a head in `skin` with
 *  its own head piece, and the front arm holding its tool, marked `${name}-arm` and turning about the shoulder
 *  (15, -46). */
function Person({ name, look, head, tool }: { name: string; look: Look; head?: ReactNode; tool?: ReactNode }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="20" ry="5" fill={REALM.stone1} opacity="0.45" />
      <rect x="-9" y="-24" width="7" height="24" rx="2" fill={look.legs ?? REALM.stone15} />
      <rect x="2" y="-24" width="7" height="24" rx="2" fill={look.legs ?? REALM.stone15} />
      <path d="M-14,-50 L14,-50 L17,-20 L-17,-20 Z" fill={look.coat} />
      <path d="M-17,-22 L17,-22" stroke={look.trim} strokeWidth="3" />
      <rect x="-20" y="-48" width="7" height="22" rx="3" fill={look.coat} />
      <circle cx="0" cy="-60" r="11" fill={look.skin} />
      {head}
      <g data-fx={`${name}-arm`}>
        <rect x="12" y="-48" width="7" height="20" rx="3" fill={look.coat} />
        {tool && <g transform="translate(16 -28)">{tool}</g>}
      </g>
    </g>
  )
}

const HOOD = (fill: string) => <path d="M-13,-58 Q-14,-76 0,-76 Q14,-76 13,-58 L9,-58 Q8,-68 0,-68 Q-8,-68 -9,-58 Z" fill={fill} />
const CAP = (fill: string) => <path d="M-12,-63 Q0,-78 12,-63 Z" fill={fill} />
const EYE = (fill: string) => <circle cx="5" cy="-60" r="1.8" fill={fill} />

const TORCH = (
  <>
    <rect x="-2" y="-34" width="4" height="34" fill={REALM.staff} />
    <path d="M-7,-34 Q0,-56 7,-34 Z" fill={REALM.chaosFireMid} />
    <path d="M-3,-35 Q0,-46 3,-35 Z" fill={REALM.chaosFireCore} />
  </>
)
const PITCHFORK = <path d="M0,6 V-40 M-6,-40 V-52 M0,-40 V-54 M6,-40 V-52 M-6,-40 H6" stroke={REALM.staff} strokeWidth="3" fill="none" />
const SWORD = <path d="M-2,4 L2,4 L3,-34 L0,-40 L-3,-34 Z" fill={REALM.stone47} />
const HAMMER = (
  <>
    <rect x="-2" y="-30" width="4" height="32" fill={REALM.staff} />
    <rect x="-8" y="-38" width="16" height="10" fill={REALM.stone41} />
  </>
)
const STAFF_LIGHT = (
  <>
    <rect x="-2" y="-50" width="4" height="56" fill={REALM.staff} />
    <circle cx="0" cy="-54" r="6" fill={REALM.gateLight} />
  </>
)

/** One of the river kingdom's folk, with a pitchfork when it holds the wall. */
export function Villager({ name, armed = false, tint = 0 }: { name: string; armed?: boolean; tint?: number }) {
  const coat = [REALM.riverBlue, REALM.ember33, REALM.moss23][tint % 3]
  return <Person name={name} look={{ coat, trim: REALM.riverCream, skin: REALM.ember64 }} head={<>{CAP(REALM.ember21)}{EYE(REALM.stone1)}</>} tool={armed ? PITCHFORK : undefined} />
}

/** A raider: hooded, ragged, a torch held high, quick to run. */
export function Raider({ name }: { name: string }) {
  return <Person name={name} look={{ coat: REALM.blood19, trim: REALM.stone22, skin: REALM.ember64 }} head={<>{HOOD(REALM.blood15)}{EYE(REALM.chaosFireCore)}</>} tool={TORCH} />
}

/** One of the risen, the plague's dead: grey, slow, the arms out ahead. */
export function Risen({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="20" ry="5" fill={REALM.stone1} opacity="0.45" />
      <rect x="-9" y="-24" width="7" height="24" rx="2" fill={REALM.night20a} />
      <rect x="2" y="-24" width="7" height="24" rx="2" fill={REALM.night20a} />
      <path d="M-14,-50 L14,-50 L17,-20 L13,-24 L8,-18 L2,-24 L-4,-18 L-10,-24 L-17,-20 Z" fill={REALM.stone28} />
      <circle cx="4" cy="-58" r="11" fill={REALM.frost75} />
      <circle cx="9" cy="-59" r="2" fill={REALM.plague} />
      <path d="M8,-46 L36,-42 M6,-38 L34,-32" stroke={REALM.frost66} strokeWidth="6" strokeLinecap="round" />
    </g>
  )
}

/** A soldier of the river kingdom in its blue, sword in hand. */
export function Soldier({ name }: { name: string }) {
  return (
    <g data-fx={`${name}-whole`}>
      <Person
        name={name}
        look={{ coat: REALM.kingdomBlue, trim: REALM.goldMid, skin: REALM.ember64 }}
        head={<path d="M-12,-60 Q-12,-74 0,-74 Q12,-74 12,-60 L12,-58 L-12,-58 Z" fill={REALM.stone47} />}
        tool={SWORD}
      />
      <path d="M-24,-46 L-8,-46 L-8,-26 Q-16,-18 -24,-26 Z" fill={REALM.kingdomBlue} stroke={REALM.goldMid} strokeWidth="2.5" />
    </g>
  )
}

/** The young prince, our own: a gold circlet, a white tabard on the kingdom's blue, a red cloak, his sword arm
 *  marked `${name}-arm` to point. */
export function Prince({ name }: { name: string }) {
  return (
    <g>
      <path d="M-14,-50 Q-30,-20 -26,0 L-6,-4 Z" fill={REALM.warlordRed} />
      <Person
        name={name}
        look={{ coat: REALM.riverCream, trim: REALM.princeGold, skin: REALM.ember71, legs: REALM.kingdomBlue }}
        head={
          <>
            <path d="M-11,-64 Q0,-74 11,-64 Q4,-60 -11,-58 Z" fill={REALM.ember29} />
            <path d="M-11,-68 L-7,-74 L-3,-68 L1,-75 L5,-68 L9,-74 L11,-66 Z" fill={REALM.princeGold} />
            {EYE(REALM.stone1)}
          </>
        }
        tool={SWORD}
      />
    </g>
  )
}

/** A hooded carter of the grain carts. */
export function Carter({ name }: { name: string }) {
  return <Person name={name} look={{ coat: REALM.ember27, trim: REALM.ember21, skin: REALM.ember64 }} head={<>{HOOD(REALM.ember21)}</>} />
}

/** A mage of the tower city: a deep blue robe to the ground, a pointed hood and a staff of light. */
export function Mage({ name }: { name: string }) {
  return (
    <g>
      <path d="M-16,-50 L16,-50 L20,0 L-20,0 Z" fill={REALM.night21} />
      <Person name={name} look={{ coat: REALM.night21, trim: REALM.gateLight, skin: REALM.ember71, legs: REALM.night21 }} head={<path d="M-13,-58 L0,-92 L13,-58 Z" fill={REALM.night23} />} tool={STAFF_LIGHT} />
    </g>
  )
}

/** One of the horned clans, ram horned, in ochre, hammer in hand. */
export function ClansFolk({ name }: { name: string }) {
  return (
    <Person
      name={name}
      look={{ coat: REALM.clanOchre, trim: REALM.ember21, skin: REALM.moss27 }}
      head={
        <>
          <path d="M-8,-68 Q-24,-74 -20,-58 Q-16,-64 -9,-62 Z M8,-68 Q24,-74 20,-58 Q16,-64 9,-62 Z" fill={REALM.clanHorn} />
          {EYE(REALM.stone1)}
        </>
      }
      tool={HAMMER}
    />
  )
}

/** One of the forest folk: long lived, moss haired, a green cloak. */
export function ForestFolk({ name }: { name: string }) {
  return (
    <Person
      name={name}
      look={{ coat: REALM.forestMoss, trim: REALM.moss15, skin: REALM.ember71, legs: REALM.forestBark }}
      head={
        <>
          <path d="M-12,-62 Q-16,-78 0,-76 Q16,-78 12,-62 Q16,-50 10,-44 Q8,-60 0,-66 Q-8,-60 -10,-44 Q-16,-50 -12,-62 Z" fill={REALM.moss15} />
          {EYE(REALM.stone1)}
        </>
      }
    />
  )
}

// ---- riders and beasts ----

/** A rider of the river kingdom on his horse, a pennant on his lance; about 130 high. */
export function Rider({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="46" ry="7" fill={REALM.stone1} opacity="0.45" />
      <path d="M-34,-6 L-30,-44 M-18,-6 L-20,-44 M18,-6 L20,-44 M32,-6 L30,-44" stroke={REALM.ember21} strokeWidth="7" strokeLinecap="round" />
      <path d="M-40,-44 Q-40,-70 0,-70 Q36,-70 42,-56 L58,-82 L68,-74 L52,-44 Z" fill={REALM.ember27} />
      <path d="M-40,-50 Q-56,-46 -54,-30" stroke={REALM.ember21} strokeWidth="6" fill="none" />
      <path d="M-10,-70 L10,-70 L12,-104 L-12,-104 Z" fill={REALM.riverBlue} />
      <circle cx="0" cy="-114" r="10" fill={REALM.stone47} />
      <path d="M10,-96 L60,-150" stroke={REALM.staff} strokeWidth="4" />
      <path d="M60,-150 L40,-140 L56,-134 Z" fill={REALM.riverCream} />
    </g>
  )
}

/** The grain cart: a wagon on two wheels heaped with sacks, its near sack slit open in `${name}-dust`. */
export function Cart({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-60,-30 L60,-30 L56,-60 L-56,-60 Z" fill={REALM.ember27} stroke={REALM.ember16} strokeWidth="3" />
      {[-36, -6, 24].map((x) => (
        <ellipse key={x} cx={x} cy={-72} rx={20} ry={16} fill={REALM.earth48} stroke={REALM.ember21} strokeWidth="2" />
      ))}
      <path d="M60,-40 L92,-44" stroke={REALM.ember21} strokeWidth="5" />
      {[-30, 30].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-16} r={16} fill="none" stroke={REALM.ember16} strokeWidth="5" />
          <path d={`M${x - 16},-16 H${x + 16} M${x},-32 V0`} stroke={REALM.ember16} strokeWidth="3" />
        </g>
      ))}
      <g data-fx={`${name}-dust`} opacity="0">
        <ellipse cx={-6} cy={-66} rx={34} ry={20} fill={REALM.plague} opacity="0.55" />
        {[-20, -4, 10, 22].map((x, i) => (
          <circle key={x} cx={x} cy={-40 + i * 6} r={4} fill={REALM.plague} />
        ))}
      </g>
      <g data-fx={`${name}-fire`} opacity="0">
        <path d="M-50,-60 Q-40,-130 -20,-80 Q-6,-150 10,-84 Q26,-136 44,-62 Z" fill={REALM.chaosFireMid} />
        <path d="M-30,-62 Q-20,-104 -6,-70 Q6,-112 22,-64 Z" fill={REALM.chaosFireCore} />
      </g>
    </g>
  )
}

/** The war drum of the horned clans on its cart. */
export function DrumCart() {
  return (
    <g>
      <path d="M-70,-24 H70" stroke={REALM.ember16} strokeWidth="10" />
      {[-46, 46].map((x) => (
        <circle key={x} cx={x} cy={-18} r={18} fill="none" stroke={REALM.ember16} strokeWidth="6" />
      ))}
      <ellipse cx={0} cy={-80} rx={58} ry={52} fill={REALM.clanOchre} stroke={REALM.ember16} strokeWidth="4" />
      <ellipse cx={-50} cy={-80} rx={12} ry={52} fill={REALM.riverCream} stroke={REALM.ember16} strokeWidth="4" />
      <path d="M-40,-120 L40,-40 M-40,-40 L40,-120" stroke={REALM.ember21} strokeWidth="3" />
    </g>
  )
}

/** A longship of the clans, its sail in `${name}-sail` filling as it goes; 300 long. */
export function Longship({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-150,-20 Q-150,10 -110,10 L110,10 Q150,10 160,-40 L140,-30 Q130,-10 110,-10 L-110,-10 Q-136,-10 -140,-40 Z" fill={REALM.ember27} stroke={REALM.ember16} strokeWidth="4" />
      {[-90, -50, -10, 30, 70].map((x) => (
        <circle key={x} cx={x} cy={-4} r={9} fill={REALM.clanOchre} stroke={REALM.ember16} strokeWidth="2" />
      ))}
      <path d="M0,-10 V-200" stroke={REALM.ember16} strokeWidth="7" />
      <g data-fx={`${name}-sail`}>
        <path d="M-70,-190 H70 Q80,-120 70,-50 H-70 Q-60,-120 -70,-190 Z" fill={REALM.riverCream} stroke={REALM.ember21} strokeWidth="3" />
        <path d="M-70,-120 H70" stroke={REALM.warlordRed} strokeWidth="14" />
      </g>
    </g>
  )
}

// ---- the great ones ----

/** The stone guardian of the cursed blade: a giant of carved stone, its hand raised in warning in
 *  `${name}-arm` (turning about its shoulder, 40, -250), its blocks in `${name}-block-i` so it can crumble;
 *  about 300 high. */
export function Guardian({ name }: { name: string }) {
  const blocks = [
    { d: 'M-50,0 L-40,-120 L-6,-120 L-10,0 Z' },
    { d: 'M10,0 L6,-120 L40,-120 L50,0 Z' },
    { d: 'M-64,-120 L64,-120 L56,-250 L-56,-250 Z' },
    { d: 'M-30,-250 L30,-250 L26,-310 L-26,-310 Z' },
    { d: 'M-56,-250 L-90,-130 L-66,-122 L-40,-220 Z' },
  ]
  return (
    <g data-fx={name}>
      {blocks.map(({ d }, i) => (
        <path key={i} data-fx={`${name}-block-${i}`} d={d} fill={REALM.stone33} stroke={REALM.stone15} strokeWidth="4" />
      ))}
      <path d="M-40,-200 L40,-200 M-40,-160 L40,-160 M-14,-294 L-6,-284 M14,-294 L6,-284" stroke={REALM.frostIceMid} strokeWidth="3" />
      <g data-fx={`${name}-arm`}>
        <path d="M40,-246 L110,-300 L124,-284 L56,-222 Z" fill={REALM.stone33} stroke={REALM.stone15} strokeWidth="4" />
        <path d="M110,-300 L118,-340 L128,-338 L130,-296 L140,-330 L148,-326 L136,-286 Z" fill={REALM.stone41} stroke={REALM.stone15} strokeWidth="3" />
      </g>
    </g>
  )
}

/** The cursed blade in its pedestal of ice, its cold glow in `${name}-glow`. */
export function Pedestal({ name }: { name: string }) {
  return (
    <g>
      <path d="M-50,0 L-40,-80 L40,-80 L50,0 Z" fill={REALM.frostIceDark} stroke={REALM.frostIceMid} strokeWidth="3" />
      <ellipse data-fx={`${name}-glow`} cx={0} cy={-150} rx={50} ry={90} fill={REALM.frostIceBright} opacity="0.25" />
      <path d="M-4,-80 L-4,-210 L0,-226 L4,-210 L4,-80 Z" fill={REALM.frostIceBright} stroke={REALM.night14} strokeWidth="2" />
      <path d="M-22,-196 H22" stroke={REALM.night14} strokeWidth="6" />
      <rect x={-4} y={-232} width={8} height={30} fill={REALM.night14} />
    </g>
  )
}

/** A chanting stone of the summoners' ring, its runes lit in `${name}-runes` and its crack in `${name}-crack`. */
export function ChantStone({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-26,0 L-20,-140 Q0,-156 20,-140 L26,0 Z" fill={REALM.stone22} stroke={REALM.stone8} strokeWidth="3" />
      <path data-fx={`${name}-runes`} d="M-6,-120 L6,-110 L-6,-100 M-8,-80 H8 M0,-70 V-50" stroke={REALM.cinderGlow} strokeWidth="4" fill="none" />
      <path data-fx={`${name}-crack`} d="M-4,-150 L6,-110 L-6,-70 L4,-30 L-2,0" stroke={REALM.bgVoid} strokeWidth="5" fill="none" opacity="0" />
    </g>
  )
}

/** The giant of cinders, our own: a hulk of black stone and ember, his cracks glowing; about 420 high. */
export function CinderGiant({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx={0} cy={-220} rx={200} ry={260} fill={REALM.cinderGlow} opacity="0.14" />
      <path d="M-70,0 L-60,-150 L-10,-150 L-20,0 Z M20,0 L14,-150 L64,-150 L76,0 Z" fill={REALM.cinder} />
      <path d="M-110,-140 Q-130,-340 -20,-380 Q90,-390 120,-320 Q140,-220 110,-140 Z" fill={REALM.cinder} />
      <path d="M-50,-330 L-30,-270 L-60,-210 M40,-350 L20,-290 L60,-230 M-10,-200 L10,-160" stroke={REALM.cinderGlow} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M-110,-320 L-170,-200 L-150,-110 L-120,-116 L-136,-200 L-80,-290 Z M110,-320 L170,-220 L160,-120 L130,-124 L138,-214 L86,-290 Z" fill={REALM.cinder} />
      <circle cx={-10} cy={-400} r={44} fill={REALM.cinder} />
      <path d="M-50,-420 L-70,-470 L-30,-436 M30,-420 L50,-470 L10,-436" fill={REALM.cinder} stroke={REALM.cinderGlow} strokeWidth="3" />
      <ellipse cx={-26} cy={-402} rx={8} ry={5} fill={REALM.cinderGlow} />
      <ellipse cx={8} cy={-402} rx={8} ry={5} fill={REALM.cinderGlow} />
    </g>
  )
}

/** The horned clans' warlord, our own, twice their size: the red of the fouled spring over him in
 *  `${name}-red`, which drains out when he is cleansed; his arms in `${name}-arm`. About 170 high. */
export function Warlord({ name }: { name: string }) {
  const body = (skin: string, coat: string) => (
    <>
      <rect x="-26" y="-56" width="20" height="56" rx="6" fill={coat} />
      <rect x="6" y="-56" width="20" height="56" rx="6" fill={coat} />
      <path d="M-42,-130 L42,-130 L36,-50 L-36,-50 Z" fill={skin} />
      <path d="M-36,-60 H36" stroke={REALM.ember16} strokeWidth="6" />
      <circle cx="8" cy="-146" r="22" fill={skin} />
      <path d="M-4,-160 Q-34,-176 -30,-140 Q-24,-154 -10,-150 Z M20,-160 Q50,-176 46,-140 Q40,-154 26,-150 Z" fill={REALM.clanHorn} />
      <circle cx="18" cy="-148" r="3" fill={REALM.stone1} />
    </>
  )
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="0" rx="46" ry="9" fill={REALM.stone1} opacity="0.5" />
      {body(REALM.moss27, REALM.clanOchre)}
      <g data-fx={`${name}-red`}>
        {body(REALM.warlordRed, REALM.blood19)}
        <circle cx="18" cy="-148" r="4" fill={REALM.chaosFireCore} />
      </g>
      <g data-fx={`${name}-arm`}>
        <path d="M30,-124 L74,-96 L66,-82 L24,-104 Z" fill={REALM.clanOchre} stroke={REALM.ember16} strokeWidth="2" />
      </g>
    </g>
  )
}

/** A tree of the forest that pulls up its roots and walks: its roots in `${name}-roots`; about 300 high. */
export function WalkingTree({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <g data-fx={`${name}-roots`}>
        <path d="M-10,-40 Q-40,-10 -60,0 M10,-40 Q40,-10 60,0 M0,-40 Q-6,-10 -4,0" stroke={REALM.forestBark} strokeWidth="12" fill="none" strokeLinecap="round" />
      </g>
      <path d="M-18,-40 Q-24,-160 -8,-220 L8,-220 Q24,-160 18,-40 Z" fill={REALM.forestBark} />
      <path d="M-6,-200 Q-60,-230 -80,-200 M6,-200 Q60,-240 84,-210" stroke={REALM.forestBark} strokeWidth="10" fill="none" strokeLinecap="round" />
      {[
        [-60, -250, 70],
        [10, -290, 90],
        [70, -240, 64],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={REALM.forestMoss} stroke={REALM.moss15} strokeWidth="4" />
      ))}
      <circle cx={-6} cy={-150} r={5} fill={REALM.spirit} />
      <circle cx={10} cy={-150} r={5} fill={REALM.spirit} />
    </g>
  )
}

/** A spirit of the forest: a pale wisp with a tail of light. */
export function Spirit({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <path d="M0,0 Q-40,-20 -90,-10 Q-40,6 0,10 Z" fill={REALM.spirit} opacity="0.5" />
      <circle cx={6} cy={4} r={14} fill={REALM.spirit} />
      <circle cx={6} cy={4} r={30} fill={REALM.spirit} opacity="0.3" />
    </g>
  )
}
