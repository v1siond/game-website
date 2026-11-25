import { useId } from 'react'
import { COLORS as C, TROOP, TROOP_ORDER } from './palette'
import { Shadow } from './props'

// The crocodile king's people, our own, drawn as the props are (props.tsx): rendered volumes in the shared
// gradients, lit from the upper right, a dark edge. The snappers, his small soldiers in iron helmets; the king
// himself, a hulking crocodile on two legs with a pale plated belly, a gold tooth, a tilted spiked crown and a
// purple sash (in the ring his gloves and gold trunks); his cardboard likeness on its wheeled stand; the
// gentle giant he caged for refusing him; and the fortress, the mechanical crocodile head he moored off the
// isle. Each stands on its own 0 0 unless said; moving parts are data-fx groups its place turns about a stated
// point. Nothing here is a character, name, crest or object of the game it evokes.

const EDGE = C.shadow
const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }

export const CROC = { dark: '#2e4a1e', mid: '#5e8a3a', belly: '#eadc9c', bellyShade: '#b8a868', eye: '#ffe14d', sash: '#7a3aa8', glove: '#7a3aa8' }

/** A crocodile's eye: a yellow ball with a slit, at x y. */
const Eye = ({ x, y, r = 8 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={CROC.eye} {...LINE} strokeWidth={2} />
    <ellipse cx={x - r * 0.25} cy={y} rx={r * 0.22} ry={r * 0.7} fill={EDGE} />
  </g>
)

/** A row of teeth along a jaw from x0 to x1 at y, pointing down (or up with `up`). */
const Teeth = ({ x0, x1, y, size = 6, up = false }: { x0: number; x1: number; y: number; size?: number; up?: boolean }) => {
  const n = Math.max(2, Math.floor(Math.abs(x1 - x0) / (size * 1.6)))
  const step = (x1 - x0) / n
  const d = Array.from({ length: n }, (_, i) => `M${x0 + i * step} ${y} l${step / 2} ${up ? -size : size} l${step / 2} ${up ? size : -size}`).join(' ')
  return <path d={d} fill="#fffbe8" stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round" />
}

/** A snapper, one of the king's soldiers: a small crocodile up on his hind legs in an iron helmet, his long
 *  snout to the left, about 130 tall. */
export function Snapper() {
  return (
    <g>
      <Shadow width={100} />
      <path d="M14 -34 Q56 -30 82 -4 Q50 -12 14 -16 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-16 -32 L-20 0 L-2 0 L-4 -32 Z M6 -32 L8 0 L26 0 L20 -32 Z" fill={CROC.dark} {...LINE} />
      <path d="M-28 -44 Q-32 -94 0 -98 Q28 -96 28 -44 Q22 -24 0 -24 Q-24 -24 -28 -44 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-24 -46 Q-26 -84 -6 -90 L-4 -30 Q-18 -30 -24 -46 Z" fill={CROC.belly} {...LINE} strokeWidth={2} />
      <path d="M-24 -56 H-6 M-25 -68 H-6 M-22 -80 H-6" stroke={CROC.bellyShade} strokeWidth={2} />
      <path d="M-6 -100 Q-6 -128 14 -130 Q32 -126 28 -104 Q26 -96 10 -94 L-58 -96 Q-68 -100 -60 -110 Q-30 -114 -6 -112 Z" fill="url(#tp-croc)" {...LINE} />
      <Teeth x0={-56} x1={-10} y={-96} size={5} />
      <circle cx={-58} cy={-106} r={2.4} fill={EDGE} />
      <Eye x={10} y={-120} r={7} />
      <path d="M-12 -122 Q-10 -148 14 -150 Q36 -148 36 -122 Z" fill="url(#tp-iron)" {...LINE} />
      <path d="M12 -150 L14 -164 L18 -150" fill="url(#tp-iron)" {...LINE} strokeWidth={2} />
      <path d="M-14 -122 H38" stroke={EDGE} strokeWidth={4} strokeLinecap="round" />
      <path d="M-20 -78 Q-40 -66 -46 -50" fill="none" stroke={CROC.dark} strokeWidth={10} strokeLinecap="round" />
    </g>
  )
}

/** The crown he wears tilted: a gold band of five spikes, its foot on 0 0. */
const Crown = () => (
  <g>
    <path d="M-40 0 L-44 -40 L-26 -18 L-14 -50 L0 -20 L14 -50 L26 -18 L44 -40 L40 0 Z" fill="url(#tp-gold)" {...LINE} />
    {[-26, 0, 26].map((x) => (
      <circle key={x} cx={x} cy={-8} r={5} fill={C.sunsetRed} stroke={EDGE} strokeWidth={1.6} />
    ))}
  </g>
)

/** The crocodile king, facing left: his tail out behind, short thick legs, a great pear of a body with its
 *  pale plated belly, a long head and snout with a gold tooth, two yellow eyes and the tilted crown; a purple
 *  sash, or in the ring his gold trunks and purple gloves. About 420 tall. His near arm (`king-arm`) turns at
 *  the shoulder -40 -250; his whole body (`king-body`) about his feet. */
export function CrocKing({ boxer = false }: { boxer?: boolean }) {
  const fist = boxer ? <circle cx={0} cy={0} r={34} fill={CROC.glove} {...LINE} /> : <circle cx={0} cy={0} r={20} fill="url(#tp-croc)" {...LINE} />
  return (
    <g data-fx="king-body">
      <Shadow width={300} />
      <path d="M70 -80 Q170 -70 230 -6 Q150 -30 60 -40 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-70 -90 L-80 0 L-30 0 L-30 -90 Z M20 -90 L26 0 L76 0 L66 -90 Z" fill={CROC.dark} {...LINE} />
      <path d="M-86 0 l8 -14 l8 14 M-40 0 l6 -12 l6 12" fill="#fffbe8" stroke={EDGE} strokeWidth={1.4} />
      {/* the far arm behind him */}
      <path d="M40 -250 Q70 -200 60 -150" fill="none" stroke={CROC.dark} strokeWidth={34} strokeLinecap="round" />
      <g transform="translate(60 -140)">{boxer ? <circle r={30} fill="#5a2a80" {...LINE} /> : <circle r={18} fill={CROC.dark} {...LINE} />}</g>
      <path d="M-120 -120 Q-140 -310 -20 -330 Q100 -330 110 -200 Q120 -96 56 -76 L-86 -76 Q-122 -86 -120 -120 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-112 -126 Q-128 -276 -56 -306 L-24 -92 Q-96 -90 -112 -126 Z" fill={CROC.belly} {...LINE} />
      {[-130, -170, -210, -250].map((y) => (
        <path key={y} d={`M${-120 + (y + 130) * -0.08} ${y} Q-70 ${y + 8} -30 ${y + 4}`} fill="none" stroke={CROC.bellyShade} strokeWidth={3} />
      ))}
      {boxer ? (
        <path d="M-122 -120 Q-10 -100 112 -120 L110 -76 Q-10 -60 -120 -80 Z" fill="url(#tp-gold)" {...LINE} />
      ) : (
        <path d="M-60 -312 L100 -150 L84 -126 L-84 -296 Z" fill={CROC.sash} {...LINE} />
      )}
      {/* the head: the skull over the shoulders, the long snout to the left */}
      <path d="M-40 -316 Q-50 -400 30 -410 Q100 -404 94 -340 Q88 -306 44 -300 L-170 -306 Q-200 -318 -182 -344 Q-110 -356 -40 -350 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-176 -306 Q-110 -290 40 -300" fill="none" stroke={EDGE} strokeWidth={3} />
      <Teeth x0={-174} x1={-20} y={-306} size={9} />
      <path d="M-90 -306 l7 12 l7 -12 Z" fill="url(#tp-gold)" stroke={EDGE} strokeWidth={1.6} />
      <circle cx={-178} cy={-332} r={4} fill={EDGE} />
      <path d="M-20 -384 Q4 -400 40 -392" fill="none" stroke={CROC.dark} strokeWidth={10} strokeLinecap="round" />
      <Eye x={-8} y={-372} r={13} />
      <Eye x={34} y={-378} r={12} />
      <g transform="translate(36 -404) rotate(16)">
        <Crown />
      </g>
      {/* the near arm, forward at whoever he faces */}
      <g data-fx="king-arm">
        <path d="M-40 -250 Q-110 -220 -130 -170" fill="none" stroke={EDGE} strokeWidth={42} strokeLinecap="round" />
        <path d="M-40 -250 Q-110 -220 -130 -170" fill="none" stroke={CROC.mid} strokeWidth={36} strokeLinecap="round" />
        <g transform="translate(-136 -160)">{fist}</g>
      </g>
    </g>
  )
}

/** The king's cardboard likeness: a flat painted board of him on a wooden brace and a wheeled base, about 360
 *  tall, its foot on 0 0; its two halves (`cut-left`, `cut-right`) fall apart about their feet when it is hit. */
export function CutOut() {
  const id = useId().replace(/:/g, '')
  const board = (
    <g>
      <path d="M-120 -40 Q-140 -230 -30 -250 Q70 -250 80 -150 Q86 -60 40 -40 Z" fill={CROC.mid} stroke="#2a1c10" strokeWidth={6} />
      <path d="M-110 -50 Q-120 -200 -60 -226 L-30 -50 Z" fill={CROC.belly} />
      <path d="M-60 -236 L80 -110 L66 -94 L-76 -222 Z" fill={CROC.sash} />
      <path d="M-40 -240 Q-46 -300 20 -306 Q76 -300 72 -250 Q66 -230 30 -226 L-150 -232 Q-170 -242 -156 -262 Q-100 -270 -40 -266 Z" fill={CROC.mid} stroke="#2a1c10" strokeWidth={6} />
      <Teeth x0={-150} x1={-20} y={-232} size={8} />
      <circle cx={-6} cy={-280} r={12} fill={CROC.eye} />
      <circle cx={30} cy={-284} r={11} fill={CROC.eye} />
      <g transform="translate(30 -302) rotate(16) scale(0.8)">
        <Crown />
      </g>
      <path d="M-120 -40 Q-140 -230 -30 -250 Q70 -250 80 -150 Q86 -60 40 -40 Z" fill="none" stroke="#c8a878" strokeWidth={3} strokeDasharray="10 8" opacity={0.6} />
    </g>
  )
  return (
    <g>
      <defs>
        <clipPath id={`${id}-l`}>
          <path d="M-400 -400 H-40 L-20 -300 L-50 -200 L-24 -120 L-46 0 H-400 Z" />
        </clipPath>
        <clipPath id={`${id}-r`}>
          <path d="M400 -400 H-40 L-20 -300 L-50 -200 L-24 -120 L-46 0 H400 Z" />
        </clipPath>
      </defs>
      <Shadow width={260} />
      <rect x={-130} y={-46} width={230} height={24} fill="url(#tp-wood)" {...LINE} />
      {[-100, 70].map((x) => (
        <circle key={x} cx={x} cy={-12} r={12} fill="url(#tp-iron)" {...LINE} />
      ))}
      <g data-fx="cut-left">
        <g transform="translate(0 -40)" clipPath={`url(#${id}-l)`}>
          {board}
        </g>
      </g>
      <g data-fx="cut-right">
        <g transform="translate(0 -40)" clipPath={`url(#${id}-r)`}>
          {board}
        </g>
      </g>
    </g>
  )
}

/** The gentle giant, a huge mild crocodile swimming to the right, the water line on y 0, about 520 long:
 *  big round friendly eyes, a smile, his back ridged where the troop rides. */
export function GentleGiant() {
  return (
    <g>
      <path d="M-220 -10 Q-300 -20 -340 4 Q-280 6 -220 14 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-230 10 Q-240 -110 -60 -120 Q120 -126 170 -70 L280 -60 Q310 -50 300 -30 Q290 -14 200 -14 L170 6 Q0 30 -230 10 Z" fill="url(#tp-croc)" {...LINE} />
      <path d="M-200 -70 Q-60 -150 140 -96" fill="none" stroke={CROC.dark} strokeWidth={4} strokeDasharray="14 10" />
      {[-170, -120, -70, -20, 30, 80].map((x) => (
        <path key={x} d={`M${x - 14} ${-112 - (x > 0 ? 4 : 0)} l14 -22 l14 22`} fill={CROC.dark} {...LINE} strokeWidth={2} />
      ))}
      <path d="M180 -30 Q240 -22 296 -36" fill="none" stroke={EDGE} strokeWidth={3} />
      <path d="M200 -32 Q236 -16 262 -30" fill="none" stroke={EDGE} strokeWidth={3} />
      <circle cx={292} cy={-52} r={4} fill={EDGE} />
      <circle cx={180} cy={-112} r={20} fill="#fffbe8" {...LINE} />
      <circle cx={186} cy={-112} r={9} fill={EDGE} />
      <circle cx={190} cy={-116} r={3} fill="#ffffff" />
      <path d="M160 -134 Q180 -142 200 -132" fill="none" stroke={CROC.dark} strokeWidth={5} strokeLinecap="round" />
    </g>
  )
}

/** The giant's cage on the shore: iron bars on a stone sill, its door (`cage-door`) hinged at its left edge
 *  x -150, and five padlocks in the troop's colours (`lock-<i>`). 300 wide, 260 tall. */
export function GiantCage() {
  return (
    <g>
      <rect x={-170} y={-18} width={340} height={18} fill="url(#tp-keep)" {...LINE} />
      <rect x={-160} y={-270} width={320} height={16} fill="url(#tp-iron)" {...LINE} />
      {[-150, 150].map((x) => (
        <rect key={x} x={x - 7} y={-260} width={14} height={244} fill="url(#tp-iron)" {...LINE} strokeWidth={2} />
      ))}
      <g data-fx="cage-door">
        {[-110, -70, -30, 10, 50, 90, 130].map((x) => (
          <rect key={x} x={x - 5} y={-256} width={10} height={238} fill="url(#tp-iron)" stroke={EDGE} strokeWidth={1.6} />
        ))}
        <rect x={-150} y={-150} width={300} height={12} fill="url(#tp-iron)" {...LINE} strokeWidth={2} />
      </g>
      {TROOP_ORDER.map((ape, i) => (
        <g key={ape} data-fx={`lock-${i}`} transform={`translate(${-100 + i * 50} -132)`}>
          <path d="M-9 -6 V-16 Q0 -26 9 -16 V-6" fill="none" stroke="url(#tp-iron)" strokeWidth={5} />
          <rect x={-13} y={-8} width={26} height={22} rx={4} fill={TROOP[ape]} {...LINE} strokeWidth={2} />
        </g>
      ))}
    </g>
  )
}

/** The fortress, the king's mechanical crocodile head moored on the sea, facing right: an iron hull with
 *  the open jaw and teeth, red lit eyes (`fortress-eyes`), a smokestack with its smoke (`fortress-smoke`), the
 *  sea foaming at its foot. About 420 wide and 300 tall, its water line on 0 0. */
export function Fortress() {
  return (
    <g>
      <path d="M-200 0 Q-210 -150 -120 -200 Q-20 -240 80 -200 L200 -150 Q226 -140 214 -118 L60 -110 L210 -70 Q220 -40 190 -30 L60 -24 Q0 4 -200 0 Z" fill="url(#tp-iron)" {...LINE} />
      <path d="M60 -110 L210 -70" stroke={EDGE} strokeWidth={4} />
      <Teeth x0={70} x1={200} y={-112} size={10} />
      <Teeth x0={70} x1={190} y={-34} size={10} up />
      <path d="M-120 -200 Q-40 -260 60 -214" fill="none" stroke="#6a7078" strokeWidth={8} />
      {[-160, -110, -60, -10, 40].map((x) => (
        <circle key={x} cx={x} cy={-60} r={4} fill="#2a2e34" />
      ))}
      <rect x={-140} y={-300} width={44} height={110} fill="url(#tp-iron)" {...LINE} />
      <rect x={-146} y={-310} width={56} height={16} fill="#2a2e34" {...LINE} strokeWidth={2} />
      <g data-fx="fortress-smoke" opacity="0.7">
        <circle cx={-110} cy={-340} r={26} fill="#5a5e66" />
        <circle cx={-80} cy={-380} r={34} fill="#4a4e56" />
        <circle cx={-40} cy={-420} r={40} fill="#3a3e46" />
      </g>
      <g data-fx="fortress-eyes">
        <ellipse cx={20} cy={-182} rx={22} ry={14} fill="#ff3a2a" {...LINE} />
        <ellipse cx={20} cy={-182} rx={10} ry={6} fill="#ffd0a0" />
        <ellipse cx={100} cy={-176} rx={16} ry={11} fill="#ff3a2a" {...LINE} strokeWidth={2} />
      </g>
      <path d="M-230 2 Q-200 -10 -170 2 T-110 2 T-50 2 T10 2 T70 2 T130 2 T190 2 T250 2" fill="none" stroke="#e6f6ff" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </g>
  )
}
