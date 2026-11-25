import type { ReactNode } from 'react'
import { MYTH } from './palette'

// The monsters, gods and people of the run, all our own, drawn in his figure's language (one ink line round
// painted shapes). The giants are drawn at their own size in field units round an anchor a scene places
// (their feet, a neck's root, a wrist), each part a scene moves marked data-fx: the sea serpent's head and
// jaw, the war god with his crown of fire and the bladed legs out of his back, the chained Titan of the desert
// with the temple on his back, the bronze giant of the harbour, the undead king of the bog and his hammer, the
// stone steeds of the island, the earth Titan's hand and the winged horse. The figures of his own size come in
// the frames their scenes show (data-frame), one shown at a time: the harpies, the seer on her ropes, the
// griffin rider and the winged man.

const INK = MYTH.inkLine

export function Inked({ d, fill, width = 3 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={width} strokeLinejoin="round" />
}

/** One frame of a figure, shown when it is the first. */
const Frame = ({ name, first, children }: { name: string; first: boolean; children: ReactNode }) => (
  <g data-frame={name} visibility={first ? undefined : 'hidden'}>
    {children}
  </g>
)

// ---- the sea serpent's king head (the hero scene): origin at the root of the skull, the snout to the right ----

export function SerpentHead() {
  return (
    <g>
      {/* the frill of spines down the back of the skull */}
      <Inked d="M-30 -40 L-120 -130 L-20 -80 L-110 -20 L-20 -10 L-90 60 L10 20 Z" fill={MYTH.serpentShade} />
      {/* the lower jaw on its hinge, the teeth up */}
      <g data-fx="serpent-jaw">
        <Inked d="M10 10 Q140 24 300 6 L292 40 Q150 84 16 66 Z" fill={MYTH.serpentBelly} width={4} />
        <path d="M70 18 l12 -22 l12 22 M120 20 l12 -24 l12 24 M170 18 l12 -24 l12 24 M220 14 l12 -22 l12 22 M262 10 l10 -18 l10 18" fill={MYTH.bone} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      </g>
      {/* the skull and snout, the horns and the brow */}
      <Inked d="M0 -60 Q70 -130 200 -110 L320 -64 Q344 -42 318 -20 L180 -4 Q70 6 0 40 Q-24 -10 0 -60 Z" fill={MYTH.serpent} width={4} />
      <path d="M60 -40 Q140 -70 260 -50 M90 -10 Q170 -26 280 -30" fill="none" stroke={MYTH.serpentShade} strokeWidth={5} />
      <path d="M80 -8 l12 22 l12 -20 M130 -10 l12 24 l12 -24 M180 -12 l12 24 l12 -24 M230 -16 l12 22 l12 -22 M276 -20 l10 18 l10 -18" fill={MYTH.bone} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <Inked d="M50 -90 L-50 -230 L100 -110 Z" fill={MYTH.bone} />
      <Inked d="M120 -112 L80 -250 L170 -116 Z" fill={MYTH.boneShade} />
      <Inked d="M150 -104 Q200 -118 240 -92 L210 -80 Q180 -94 150 -90 Z" fill={MYTH.serpentShade} />
      <ellipse cx={204} cy={-76} rx={18} ry={11} fill={MYTH.fireCore} stroke={INK} strokeWidth={3} />
      <path d="M204 -86 L204 -66" stroke={INK} strokeWidth={4} />
      <circle cx={306} cy={-48} r={5} fill={INK} />
    </g>
  )
}

/** The serpent's neck from its root in the sea to the skull: an ink edge, the green body and the pale belly,
 *  each the same curve, rewritten as the head moves (scenes.tsx). */
export function SerpentNeck({ d }: { d: string }) {
  return (
    <g data-fx="serpent-neck">
      <path d={d} fill="none" stroke={INK} strokeWidth={150} strokeLinecap="round" />
      <path d={d} fill="none" stroke={MYTH.serpent} strokeWidth={136} strokeLinecap="round" />
      <path d={d} fill="none" stroke={MYTH.serpentShade} strokeWidth={30} strokeDasharray="10 36" strokeLinecap="round" opacity={0.7} />
      <path d={d} fill="none" stroke={MYTH.serpentBelly} strokeWidth={34} strokeLinecap="round" transform="translate(30 6)" opacity={0.85} />
    </g>
  )
}

// ---- the war god (About far off, Services face to face): origin at his feet, facing left towards him ----

/** One bladed leg out of his back: a jointed limb ending in a long hooked blade, swung round its root. */
function BladeLeg({ name, turn }: { name: string; turn: number }) {
  return (
    <g data-fx={name} transform={`rotate(${turn} 40 -470)`}>
      <Inked d="M40 -470 L180 -640 L196 -626 L66 -458 Z" fill={MYTH.godPlate} width={4} />
      <Inked d="M180 -640 Q300 -560 330 -380 Q290 -500 196 -620 Z" fill={MYTH.steel} width={4} />
      <path d="M190 -630 Q290 -540 320 -400" fill="none" stroke={MYTH.fireRed} strokeWidth={4} />
    </g>
  )
}

export function WarGod() {
  return (
    <g>
      <BladeLeg name="god-leg-0" turn={-28} />
      <BladeLeg name="god-leg-1" turn={-4} />
      {/* the legs in greaves, the kilt of black bronze plates */}
      <Inked d="M-80 0 L-60 -260 L-10 -260 L-20 0 Z M30 0 L20 -260 L80 -260 L100 0 Z" fill={MYTH.godBronze} width={4} />
      <path d="M-70 -120 H-16 M28 -120 H86" stroke={MYTH.godPlate} strokeWidth={10} />
      <Inked d="M-110 -240 L110 -240 L130 -320 L-130 -320 Z" fill={MYTH.godPlate} width={4} />
      <path d="M-90 -250 L-100 -316 M-40 -250 L-44 -318 M10 -250 L8 -318 M60 -250 L66 -316" stroke={MYTH.godBronze} strokeWidth={6} />
      {/* the chest plate, the shoulders and the far arm */}
      <Inked d="M-140 -320 Q-150 -500 -60 -560 L80 -560 Q160 -500 140 -320 Z" fill={MYTH.godBronze} width={4} />
      <path d="M-90 -470 Q0 -430 90 -470 M-80 -400 Q0 -370 80 -400" fill="none" stroke={MYTH.godPlate} strokeWidth={8} />
      <Inked d="M100 -540 L190 -420 L160 -300 L130 -310 L150 -410 L80 -500 Z" fill={MYTH.godBronze} width={4} />
      {/* the near arm, raised to strike */}
      <g data-fx="god-arm">
        <Inked d="M-80 -540 L-200 -470 L-260 -560 L-230 -580 L-190 -510 L-100 -580 Z" fill={MYTH.godBronze} width={4} />
        <Inked d="M-250 -570 L-300 -700 L-280 -706 L-226 -580 Z" fill={MYTH.steel} width={3} />
      </g>
      {/* the helm and the face, the beard and the crown of fire */}
      <Inked d="M-60 -560 Q-70 -660 0 -680 Q70 -660 60 -560 Z" fill={MYTH.godPlate} width={4} />
      <path d="M-40 -620 H40" stroke={INK} strokeWidth={10} />
      <path d="M-34 -620 H-12 M12 -620 H34" stroke={MYTH.fireCore} strokeWidth={5} />
      <Inked d="M-50 -590 Q-60 -530 0 -510 Q60 -530 50 -590 Q30 -560 0 -566 Q-30 -560 -50 -590 Z" fill={MYTH.fireRed} />
      <g data-fx="god-fire">
        <Inked d="M-70 -650 Q-110 -760 -50 -820 Q-40 -760 -10 -770 Q-20 -860 40 -900 Q40 -800 70 -790 Q100 -840 90 -720 Q100 -690 70 -650 Z" fill={MYTH.fire} />
        <path d="M-40 -660 Q-60 -740 -20 -770 Q0 -720 20 -760 Q50 -720 40 -660 Z" fill={MYTH.fireCore} />
      </g>
    </g>
  )
}

// ---- the chained Titan of the desert (Work): origin at the near hand's heel on the sand, his head to its right ----

export function Titan() {
  return (
    <g>
      {/* the temple strapped on his back, the chains over his shoulders */}
      <g transform="translate(260 -980)">
        <Inked d="M-180 0 L180 0 L200 30 L-200 30 Z" fill={MYTH.sandLow} />
        <Inked d="M-150 -210 L0 -290 L150 -210 Z" fill={MYTH.sandLow} />
        {[-130, -70, -10, 50, 110].map((x) => (
          <rect key={x} x={x} y={-210} width={24} height={210} fill={MYTH.marble} stroke={INK} strokeWidth={3} />
        ))}
        <Inked d="M-30 0 L-30 -120 Q0 -150 30 -120 L30 0 Z" fill={MYTH.inkLine} />
      </g>
      {/* the back and shoulder, bent under the temple */}
      <Inked d="M-60 -600 Q60 -1000 460 -980 Q700 -920 760 -620 L620 -520 Q400 -700 120 -520 Z" fill={MYTH.titan} width={5} />
      <path d="M100 -760 Q300 -900 600 -820 M60 -660 Q300 -800 640 -700" fill="none" stroke={MYTH.titanShade} strokeWidth={10} />
      {[[-20, -780, 520, -980], [700, -700, 420, -980]].map(([x1, y1, x2, y2]) => (
        <path key={x1} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={MYTH.chain} strokeWidth={16} strokeDasharray="22 10" />
      ))}
      {/* the near arm down to the hand on the sand */}
      <g data-fx="titan-arm">
        <Inked d="M40 -640 L-40 -120 L80 -110 L160 -580 Z" fill={MYTH.titan} width={5} />
        <Inked d="M-90 0 Q-100 -90 -40 -130 L90 -130 Q150 -90 140 0 Z" fill={MYTH.titanShade} width={5} />
        <path d="M-60 0 V-60 M-10 0 V-70 M40 0 V-70 M90 0 V-60" stroke={INK} strokeWidth={4} />
        {/* the chain hanging from the wrist cuff, the one he climbs */}
        <Inked d="M-60 -150 L110 -150 L120 -210 L-50 -210 Z" fill={MYTH.chain} />
        <path data-fx="titan-chain" d="M10 -150 Q-20 -60 -150 0" fill="none" stroke={MYTH.chain} strokeWidth={14} strokeDasharray="18 8" />
      </g>
      {/* the head under its brow, a beard of stone, the eye opening */}
      <g transform="translate(820 -520)">
        <Inked d="M-140 -200 Q-60 -330 80 -300 Q200 -260 220 -120 Q220 40 120 120 L-60 140 Q-170 40 -140 -200 Z" fill={MYTH.titan} width={5} />
        <Inked d="M-80 40 Q40 100 160 40 Q140 200 40 260 Q-60 200 -80 40 Z" fill={MYTH.titanShade} width={4} />
        <Inked d="M-120 -120 Q20 -180 200 -110 L200 -80 Q40 -140 -110 -90 Z" fill={MYTH.titanShade} />
        <g data-fx="titan-eye" opacity={0}>
          <ellipse cx={60} cy={-60} rx={34} ry={14} fill={MYTH.fireCore} stroke={INK} strokeWidth={4} />
          <circle cx={60} cy={-60} r={8} fill={INK} />
        </g>
        <path data-fx="titan-lid" d="M24 -60 Q60 -72 96 -60" stroke={INK} strokeWidth={6} fill="none" />
      </g>
    </g>
  )
}

// ---- the bronze giant of the harbour (Projects): origin between his feet, facing left ----

export function Colossus() {
  return (
    <g>
      <Inked d="M-140 0 L-110 -420 L-30 -420 L-40 0 Z M30 0 L40 -420 L120 -420 L150 0 Z" fill={MYTH.giant} width={5} />
      <path d="M-100 -200 H-40 M44 -200 H120" stroke={MYTH.giantLight} strokeWidth={8} opacity={0.5} />
      <Inked d="M-180 -400 L-150 -820 Q0 -890 160 -820 L190 -400 Z" fill={MYTH.giant} width={5} />
      <path d="M-120 -780 Q0 -820 130 -780 L120 -620 Q0 -580 -110 -620 Z" fill={MYTH.giantLight} opacity={0.45} />
      <path d="M-140 -470 H170" stroke={MYTH.giantLight} strokeWidth={10} opacity={0.6} />
      {/* the far arm hangs */}
      <Inked d="M150 -820 L230 -520 L180 -500 L120 -760 Z" fill={MYTH.giant} width={5} />
      {/* the head: the beard, the laurel, the eyes; the cracks of his finisher hidden till it lands */}
      <g data-fx="colossus-head">
        <Inked d="M-90 -840 L-90 -1060 Q0 -1140 90 -1060 L90 -840 Z" fill={MYTH.giant} width={5} />
        <Inked d="M-88 -930 Q-80 -820 0 -806 Q80 -820 88 -930 Q50 -890 0 -896 Q-50 -890 -88 -930 Z" fill={MYTH.giant} width={4} />
        <path d="M-60 -880 q10 14 22 0 M-12 -868 q10 14 22 0 M36 -880 q10 14 22 0" fill="none" stroke={INK} strokeWidth={3} />
        <path d="M-104 -1060 Q0 -1160 104 -1060" fill="none" stroke={MYTH.gold} strokeWidth={14} />
        <path d="M-84 -1080 l-24 -16 M-50 -1108 l-18 -24 M50 -1108 l18 -24 M84 -1080 l24 -16" stroke={MYTH.gold} strokeWidth={9} />
        <g data-fx="colossus-eyes">
          <ellipse cx={-36} cy={-990} rx={16} ry={9} fill={MYTH.giantEye} />
          <ellipse cx={36} cy={-990} rx={16} ry={9} fill={MYTH.giantEye} />
        </g>
        <path data-fx="colossus-jaw" d="M-40 -900 H40 V-880 H-40 Z" fill={INK} />
        <path data-fx="colossus-cracks" d="M-70 -1040 L-30 -980 L-60 -930 M60 -1050 L20 -990 L70 -940 L40 -880" fill="none" stroke={MYTH.fireCore} strokeWidth={8} opacity={0} />
      </g>
      {/* the near arm, raised and brought down on the quay; its fist */}
      <g data-fx="colossus-arm">
        <Inked d="M-150 -820 L-360 -620 L-320 -580 L-120 -740 Z" fill={MYTH.giant} width={5} />
        <circle cx={-350} cy={-596} r={60} fill={MYTH.giantLight} stroke={INK} strokeWidth={5} />
        <path d="M-380 -620 H-320 M-384 -596 H-316" stroke={INK} strokeWidth={3} />
      </g>
    </g>
  )
}

// ---- the undead king of the bog (Bands): origin at his feet, facing left, the hammer in his near hand ----

export function UndeadKing() {
  return (
    <g>
      <Inked d="M-90 0 L-70 -300 L-10 -300 L-20 0 Z M20 0 L20 -300 L80 -300 L100 0 Z" fill={MYTH.rotShade} width={4} />
      {/* the mail coat of rot to the knee, the crown, the hollow eyes */}
      <Inked d="M-140 -200 L-120 -640 Q0 -700 120 -640 L140 -200 Q0 -170 -140 -200 Z" fill={MYTH.mail} width={5} />
      <path d="M-120 -560 H120 M-124 -480 H124 M-128 -400 H128 M-132 -320 H132 M-136 -250 H136" stroke={MYTH.rotShade} strokeWidth={5} strokeDasharray="6 8" />
      <Inked d="M-150 -640 Q0 -720 150 -640 L130 -600 Q0 -650 -130 -600 Z" fill={MYTH.rot} />
      <Inked d="M-60 -680 Q-70 -820 0 -840 Q70 -820 60 -680 Z" fill={MYTH.rot} width={4} />
      <path d="M-70 -820 L-60 -880 L-30 -840 L0 -900 L30 -840 L60 -880 L70 -820 Z" fill={MYTH.bronze} stroke={INK} strokeWidth={3} />
      <ellipse cx={-26} cy={-770} rx={12} ry={8} fill={MYTH.giantEye} />
      <ellipse cx={22} cy={-770} rx={10} ry={8} fill={MYTH.giantEye} />
      <path d="M-30 -730 L30 -730" stroke={INK} strokeWidth={5} />
      <Inked d="M120 -630 L190 -380 L150 -370 L90 -600 Z" fill={MYTH.mail} width={4} />
      {/* the near arm and the hammer it swings down */}
      <g data-fx="king-arm">
        <Inked d="M-110 -630 L-250 -500 L-220 -470 L-90 -580 Z" fill={MYTH.mail} width={4} />
        <circle cx={-240} cy={-488} r={26} fill={MYTH.rot} stroke={INK} strokeWidth={4} />
        <g data-fx="king-hammer">
          <Inked d="M-250 -500 L-610 -760 L-590 -784 L-230 -520 Z" fill={MYTH.leather} width={4} />
          <Inked d="M-660 -860 L-520 -700 L-580 -650 L-720 -810 Z" fill={MYTH.mail} width={5} />
          <path d="M-680 -820 L-560 -690" stroke={MYTH.rotShade} strokeWidth={6} />
        </g>
      </g>
    </g>
  )
}

// ---- a stone steed of the island (Ventures): origin at its hind hoof, the head to the right, reared round its hindquarters ----

export function Steed({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <Inked d="M0 0 L20 -260 L110 -280 L120 0 L80 0 L70 -180 L40 -180 L40 0 Z" fill={MYTH.steedShade} width={5} />
      <Inked d="M-20 -260 Q-30 -440 120 -460 L420 -470 Q520 -470 540 -360 L520 -260 L80 -240 Z" fill={MYTH.steed} width={5} />
      <path d="M120 -420 Q300 -440 480 -420" fill="none" stroke={MYTH.steedShade} strokeWidth={10} />
      <Inked d="M380 -250 L360 0 L320 0 L330 -250 Z M480 -260 L500 0 L460 0 L440 -260 Z" fill={MYTH.steedShade} width={5} />
      {/* the neck and the head, the stone mane */}
      <Inked d="M440 -440 L560 -700 Q620 -760 680 -700 L720 -600 L680 -580 L600 -620 L540 -380 Z" fill={MYTH.steed} width={5} />
      <path d="M470 -470 L570 -700 M500 -460 L590 -690" stroke={MYTH.steedShade} strokeWidth={14} />
      <circle cx={640} cy={-690} r={8} fill={INK} />
      {/* the collar and the chain to the island */}
      <Inked d="M520 -560 L600 -600 L620 -560 L540 -520 Z" fill={MYTH.bronze} />
    </g>
  )
}

// ---- the earth Titan's hand (Contact): origin at the heel of the palm, the fingers up and curling ----

export function EarthHand() {
  return (
    <g>
      <Inked d="M-260 400 L-220 0 Q-200 -80 -100 -90 L220 -80 Q300 -40 280 60 L240 400 Z" fill={MYTH.earth} width={6} />
      <path d="M-200 100 Q0 60 240 100 M-180 220 Q20 190 230 230" fill="none" stroke={MYTH.earthShade} strokeWidth={12} />
      {[-180, -80, 30, 140].map((x, i) => (
        <Inked key={x} d={`M${x} -80 L${x - 10} ${-300 - i * 20} Q${x + 40} ${-360 - i * 20} ${x + 90} ${-300 - i * 20} L${x + 90} -80 Z`} fill={MYTH.earth} width={5} />
      ))}
      <Inked d="M240 -20 Q380 -80 400 -200 L340 -220 Q320 -120 230 -100 Z" fill={MYTH.earth} width={5} />
      {[-150, -40, 70, 180].map((x) => (
        <path key={x} d={`M${x - 20} -160 q20 -16 40 0`} fill="none" stroke={MYTH.moss} strokeWidth={14} strokeLinecap="round" />
      ))}
      <path d="M-200 -60 Q0 -110 240 -60" fill="none" stroke={MYTH.moss} strokeWidth={22} strokeLinecap="round" />
    </g>
  )
}

// ---- the winged horse (Ventures): origin under his seat, the head to the right; the wings beat round their root ----

export function WingedHorse() {
  return (
    <g>
      <g data-fx="horse-wing-far" transform="rotate(-20 -10 -40)">
        <Inked d="M-10 -40 Q-160 -260 -340 -280 Q-260 -200 -280 -140 Q-200 -120 -190 -60 Q-100 -60 -10 -40 Z" fill={MYTH.wingShade} />
      </g>
      <Inked d="M-140 -20 Q-150 -90 -60 -100 L120 -100 Q200 -100 210 -30 L190 30 L-120 40 Z" fill={MYTH.wing} width={4} />
      <Inked d="M-110 30 L-150 140 L-120 146 L-80 40 Z M-60 36 L-70 150 L-40 150 L-30 36 Z M120 30 L150 140 L180 132 L150 26 Z M160 20 L220 120 L246 106 L190 16 Z" fill={MYTH.wingShade} width={3} />
      <Inked d="M150 -90 L230 -230 Q270 -260 300 -220 L320 -170 L290 -160 L250 -190 L210 -60 Z" fill={MYTH.wing} width={4} />
      <path d="M170 -100 L240 -230" stroke={MYTH.gold} strokeWidth={10} />
      <circle cx={280} cy={-214} r={5} fill={INK} />
      <Inked d="M-140 -60 Q-220 -40 -240 40 Q-200 0 -150 -10 Z" fill={MYTH.gold} />
      <g data-fx="horse-wing">
        <Inked d="M0 -80 Q-120 -330 -330 -380 Q-240 -290 -260 -220 Q-170 -190 -170 -120 Q-80 -110 0 -80 Z" fill={MYTH.wing} width={4} />
        <path d="M-60 -120 Q-150 -220 -270 -260 M-40 -100 Q-110 -170 -220 -200" fill="none" stroke={MYTH.wingShade} strokeWidth={5} />
      </g>
    </g>
  )
}

// ---- the harpy (About): his size, facing left, on her wings ----

export function Harpy() {
  return (
    <>
      <Inked d="M36 28 Q50 6 60 18 Q54 22 56 30 Q50 28 48 36 Q44 32 40 38 Z" fill={MYTH.crimson} width={2} />
      <Inked d="M28 28 Q12 8 2 22 Q8 24 6 32 Q12 30 14 38 Q18 34 22 40 Z" fill={MYTH.terracottaDeep} width={2} />
      <Inked d="M24 26 Q32 22 38 28 L36 52 L26 52 Z" fill={MYTH.boneShade} width={2} />
      <Inked d="M26 52 L36 52 L40 66 L22 66 Z" fill={MYTH.crimson} width={2} />
      <path d="M26 66 L22 76 L18 78 M34 66 L36 76 L40 78" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <Inked d="M24 12 Q30 6 37 12 L37 24 Q31 28 25 24 Z" fill={MYTH.boneShade} width={2} />
      <Inked d="M22 10 Q30 0 40 8 Q42 18 38 26 Q36 14 30 12 Q24 14 22 22 Z" fill={MYTH.inkSoft} width={2} />
      <path d="M26 17 L29 18" stroke={MYTH.fireCore} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M24 22 L20 23 L24 25" fill={MYTH.bone} stroke={INK} strokeWidth={1.2} />
    </>
  )
}

// ---- the seer of the temple (About): her size a little under his, in white, hanging from her ropes or stood ----

export const SEER_FRAMES = ['hang', 'stand'] as const
export type SeerFrame = (typeof SEER_FRAMES)[number]

function SeerHead() {
  return (
    <>
      <Inked d="M24 6 Q32 0 40 6 L40 18 Q32 22 26 18 Z" fill={MYTH.oldSkin} width={1.6} />
      <Inked d="M22 6 Q30 -4 42 4 L44 30 Q38 22 38 12 Q30 8 26 14 L22 28 Z" fill={MYTH.inkSoft} width={1.6} />
      <circle cx={36} cy={11} r={1.2} fill={INK} />
    </>
  )
}

export function Seer({ first = 'hang' }: { first?: SeerFrame }) {
  return (
    <>
      <Frame name="hang" first={first === 'hang'}>
        <Inked d="M28 20 L22 -10 L26 -12 L32 18 Z M36 20 L42 -10 L46 -8 L40 20 Z" fill={MYTH.oldSkin} width={1.4} />
        <SeerHead />
        <Inked d="M24 20 Q32 16 40 20 L46 70 Q32 76 18 70 Z" fill={MYTH.robe} width={2} />
        <path d="M28 26 L24 68 M36 26 L40 68" stroke={MYTH.robeShade} strokeWidth={1.6} />
      </Frame>
      <Frame name="stand" first={first === 'stand'}>
        <SeerHead />
        <Inked d="M24 20 Q32 16 40 20 L46 76 Q32 80 18 76 Z" fill={MYTH.robe} width={2} />
        <path d="M28 26 L24 74 M36 26 L40 74" stroke={MYTH.robeShade} strokeWidth={1.6} />
        <Inked d="M38 24 L52 34 L50 38 L36 30 Z" fill={MYTH.robe} width={1.6} />
        <circle cx={53} cy={36} r={2.4} fill={MYTH.oldSkin} stroke={INK} strokeWidth={1.2} />
      </Frame>
    </>
  )
}

// ---- the griffin and its rider (Ventures): facing left, diving, then falling in flames ----

export function GriffinRider() {
  return (
    <>
      <g data-fx="griffin-wing">
        <Inked d="M50 30 Q70 -20 110 -30 Q100 -10 104 6 Q90 10 88 24 Q70 22 50 30 Z" fill={MYTH.griffinShade} width={2} />
      </g>
      <Inked d="M14 34 Q20 20 44 22 L80 26 Q96 30 92 46 L74 56 L30 54 Z" fill={MYTH.griffin} width={2} />
      <path d="M78 50 L96 64 L100 60 M40 54 L34 70 L40 72" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <Inked d="M18 30 Q4 20 8 10 Q16 4 26 12 L30 24 Z" fill={MYTH.bone} width={2} />
      <path d="M6 12 L0 16 L6 18" fill={MYTH.gold} stroke={INK} strokeWidth={1.4} />
      <circle cx={14} cy={13} r={1.4} fill={INK} />
      {/* the rider, a spear couched */}
      <Inked d="M46 22 L44 4 Q52 -2 58 4 L58 22 Z" fill={MYTH.crimson} width={2} />
      <Inked d="M46 4 Q50 -6 58 -2 L58 4 Z" fill={MYTH.bronze} width={1.6} />
      <path d="M60 10 L4 30" stroke={INK} strokeWidth={3.4} />
      <path d="M60 10 L4 30" stroke={MYTH.leather} strokeWidth={1.8} />
      <g data-fx="griffin-fire" opacity={0}>
        <path d="M20 40 Q30 10 50 26 Q60 0 76 20 Q90 10 92 40 Q60 64 20 40 Z" fill={MYTH.fire} stroke={INK} strokeWidth={1.6} />
        <path d="M40 40 Q50 24 60 34 Q70 26 76 40 Q58 50 40 40 Z" fill={MYTH.fireCore} />
      </g>
    </>
  )
}

// ---- the winged man of the chasm (Muay Thai): old and sinewy, his size, facing left, great feathered wings ----

export const WINGED_FRAMES = ['grab', 'held', 'torn'] as const
export type WingedFrame = (typeof WINGED_FRAMES)[number]

/** His wings, spread from his back; a scene hides them when they are torn off. */
function Wings() {
  return (
    <g data-fx="winged-wings">
      <Inked d="M38 24 Q70 -20 120 -24 Q104 -4 110 10 Q90 14 92 30 Q70 26 42 36 Z" fill={MYTH.feather} width={2} />
      <path d="M50 26 Q80 0 110 -10 M52 32 Q78 18 100 16" fill="none" stroke={MYTH.featherShade} strokeWidth={1.6} />
      <Inked d="M30 24 Q20 -24 -10 -40 Q0 -16 -6 -2 Q10 4 8 20 Q20 18 30 30 Z" fill={MYTH.featherShade} width={2} />
    </g>
  )
}

function WingedBody({ arms }: { arms: string }) {
  return (
    <>
      <Inked d="M28 50 L24 76 L30 76 L34 52 Z M38 50 L42 76 L48 76 L44 50 Z" fill={MYTH.oldSkin} width={1.8} />
      <Inked d="M26 24 Q36 18 46 24 L44 54 L28 54 Z" fill={MYTH.oldSkin} width={1.8} />
      <Inked d="M26 46 L46 46 L48 58 L24 58 Z" fill={MYTH.robeShade} width={1.6} />
      <Inked d="M28 6 Q36 0 44 6 L44 20 Q36 24 28 20 Z" fill={MYTH.oldSkin} width={1.6} />
      <Inked d="M26 14 Q24 28 34 30 Q44 28 44 18 Q38 22 34 22 Q30 22 26 14 Z" fill={MYTH.bone} width={1.4} />
      <Inked d="M26 6 Q34 -4 46 4 L44 10 Q36 4 28 10 Z" fill={MYTH.bone} width={1.4} />
      <circle cx={31} cy={12} r={1.2} fill={INK} />
      <Inked d={arms} fill={MYTH.oldSkin} width={1.6} />
    </>
  )
}

export function WingedMan({ first = 'grab' }: { first?: WingedFrame }) {
  return (
    <>
      <Frame name="grab" first={first === 'grab'}>
        <Wings />
        <WingedBody arms="M28 26 L8 22 L8 26 L26 32 Z M40 28 L14 34 L14 38 L40 34 Z" />
      </Frame>
      <Frame name="held" first={first === 'held'}>
        <Wings />
        <WingedBody arms="M28 26 L12 34 L14 38 L30 32 Z M40 28 L22 40 L24 44 L42 34 Z" />
      </Frame>
      <Frame name="torn" first={first === 'torn'}>
        <WingedBody arms="M28 26 L20 6 L24 4 L32 24 Z M42 28 L54 8 L58 10 L46 30 Z" />
        <path d="M34 26 L44 24 M36 30 L46 30" stroke={MYTH.fireRed} strokeWidth={2.4} />
      </Frame>
    </>
  )
}

/** The wings he tears off and glides on, shown at his hands by the scene once torn. */
export function TornWings() {
  return (
    <g data-fx="torn-wings" opacity={0}>
      <Inked d="M0 0 Q-120 -40 -220 10 Q-160 20 -150 50 Q-80 40 0 20 Z" fill={MYTH.featherShade} />
      <Inked d="M0 0 Q120 -50 240 0 Q170 14 160 46 Q80 36 0 20 Z" fill={MYTH.feather} />
      <path d="M20 8 Q120 -20 210 6 M20 14 Q90 0 160 30" fill="none" stroke={MYTH.featherShade} strokeWidth={4} />
    </g>
  )
}
