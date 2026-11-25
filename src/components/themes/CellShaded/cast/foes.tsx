import { Lines, Shade } from '../ink'
import { CEL } from '../palette'

// Who he fights on the way to the vault, all ours (story.md, Who is in it): raiders in sack hoods, gully
// hounds, the bosses GRITS, BIG DIGGS, TOWER TOMMY and BARON SALTWELL, the cliff flyers and the brood hive,
// and the old hunger in the vault. Drawn like the rest (the stop's heavy ink line, hatched shadow sides, ink
// seams), each round its foot (y 0 the ground) facing him, to the left, with what a scene moves inside it as a
// `data-fx` group.

/** A raider, 210 tall: a sack hood with stitched eyes, a scrap pauldron, a vest of hide and a pipe club. */
export function Raider() {
  return (
    <g>
      <path d="M-26 0 L-22 -86 L-4 -86 L-6 0 Z M6 0 L4 -86 L22 -86 L26 0 Z" fill={CEL.denimShade} />
      <path d="M-30 -4 L-2 -4 L-4 6 L-36 6 Z M2 -4 L30 -4 L32 6 L4 6 Z" fill={CEL.ink} />
      <path d="M-32 -82 L-28 -158 Q0 -168 28 -158 L32 -82 Z" fill={CEL.hide} />
      <Shade d="M10 -162 Q24 -162 28 -158 L32 -82 L12 -82 Z" fill={CEL.hideShade} />
      <path d="M-40 -150 Q-30 -176 -6 -168 L-10 -140 Z" fill={CEL.steelLight} />
      <path d="M-24 -160 Q-26 -208 0 -210 Q26 -208 24 -160 Z" fill={CEL.sack} />
      <Shade d="M8 -208 Q26 -206 24 -160 L10 -160 Z" fill={CEL.sackShade} />
      <Lines d="M-16 -192 l8 8 m0 -8 l-8 8 M-2 -192 l8 8 m0 -8 l-8 8 M-14 -172 h20 M-22 -160 l4 -6 M20 -160 l-4 -6" width={2.5} />
      <path d="M-30 -140 L-74 -112" stroke={CEL.ink} strokeWidth="12" strokeLinecap="round" data-bare />
      <path d="M-30 -140 L-74 -112" stroke={CEL.steelDark} strokeWidth="7" strokeLinecap="round" data-bare />
    </g>
  )
}

/** A gully hound, 190 long: a low hide on four legs, a ridge of spikes, a jaw split wide with teeth. */
export function Hound() {
  return (
    <g>
      <path d="M-50 0 L-44 -44 M-14 0 L-10 -44 M34 0 L30 -44 M64 0 L58 -44" stroke={CEL.ink} strokeWidth="13" strokeLinecap="round" data-bare />
      <path d="M-50 0 L-44 -44 M-14 0 L-10 -44 M34 0 L30 -44 M64 0 L58 -44" stroke={CEL.hide} strokeWidth="7" strokeLinecap="round" data-bare />
      <path d="M-70 -64 Q-64 -112 -10 -116 Q66 -118 92 -74 Q88 -40 50 -38 L-56 -38 Q-76 -44 -70 -64 Z" fill={CEL.hide} />
      <Shade d="M-56 -38 L50 -38 Q88 -40 92 -74 Q60 -60 -60 -60 Z" fill={CEL.hideShade} />
      <path d="M-30 -116 L-20 -142 L-10 -116 M10 -118 L22 -148 L32 -118 M48 -110 L60 -134 L66 -104" fill={CEL.paper} />
      <path d="M-70 -64 L-118 -86 L-100 -60 Z" fill={CEL.fleshShade} />
      <path d="M-70 -58 L-116 -40 L-90 -46 Z" fill={CEL.fleshShade} />
      <path d="M-106 -80 l6 8 l6 -10 l6 8 M-104 -46 l6 -7 l6 7" fill="none" stroke={CEL.paper} strokeWidth="3" data-bare />
      <circle cx={-56} cy={-82} r={6} fill={CEL.crit} />
    </g>
  )
}

/** GRITS, the gully's boss, 340 tall: a big raider with a horned bucket for a helmet, a belly in a hide
 *  apron, a cleaver. */
export function Grits() {
  return (
    <g>
      <path d="M-44 0 L-38 -130 L-8 -130 L-12 0 Z M12 0 L8 -130 L38 -130 L44 0 Z" fill={CEL.denimShade} />
      <path d="M-54 -4 L-8 -4 L-10 8 L-60 8 Z M8 -4 L54 -4 L56 8 L10 8 Z" fill={CEL.ink} />
      <path d="M-74 -124 Q-86 -250 0 -262 Q86 -250 74 -124 Z" fill={CEL.flesh} />
      <Shade d="M30 -258 Q86 -250 74 -124 L36 -124 Q48 -200 30 -258 Z" fill={CEL.fleshShade} />
      <path d="M-60 -200 L60 -200 L58 -124 L-58 -124 Z" fill={CEL.hide} />
      <Lines d="M-40 -190 l6 60 M30 -190 l-4 60 M-60 -160 h118" width={2.5} />
      <path d="M-46 -256 L-50 -320 L46 -320 L42 -256 Z" fill={CEL.steelDark} />
      <Shade d="M20 -320 L46 -320 L42 -256 L18 -256 Z" cross />
      <path d="M-30 -294 h24 M8 -294 h22" stroke={CEL.crit} strokeWidth="8" strokeLinecap="round" data-bare />
      <path d="M-48 -312 L-90 -360 L-60 -306 Z M46 -312 L88 -360 L58 -306 Z" fill={CEL.paper} />
      <path d="M-70 -200 L-118 -150 L-104 -140 L-60 -186 Z" fill={CEL.flesh} />
      <path d="M-118 -150 L-150 -246 L-104 -258 L-98 -150 Z" fill={CEL.steelLight} />
      <Shade d="M-118 -150 L-150 -246 L-132 -250 L-110 -150 Z" />
    </g>
  )
}

/** BIG DIGGS, the mine's boss, 390 tall: a hulk in a miner's helmet with its lamp, a scrap harness, his
 *  hammer ([data-fx="hammer"], turned at his shoulder (-40, -270)) raised behind him to swing down. */
export function Diggs() {
  return (
    <g>
      <path d="M-60 0 L-50 -150 L-10 -150 L-14 0 Z M16 0 L12 -150 L52 -150 L60 0 Z" fill={CEL.denim} />
      <Shade d="M30 -150 L52 -150 L60 0 L38 0 Z" fill={CEL.denimShade} />
      <path d="M-70 -4 L-10 -4 L-12 10 L-76 10 Z M14 -4 L68 -4 L70 10 L16 10 Z" fill={CEL.ink} />
      <path d="M-96 -140 Q-112 -310 0 -322 Q112 -310 96 -140 Z" fill={CEL.flesh} />
      <Shade d="M40 -318 Q112 -310 96 -140 L50 -140 Q66 -240 40 -318 Z" fill={CEL.fleshShade} />
      <path d="M-80 -300 L60 -160 M80 -300 L-60 -160" stroke={CEL.plankShade} strokeWidth="16" data-bare />
      <path d="M-96 -200 L96 -200 L96 -176 L-96 -176 Z" fill={CEL.rock} />
      <path d="M-44 -318 Q-48 -380 0 -384 Q48 -380 44 -318 Z" fill={CEL.flesh} />
      <path d="M-50 -360 Q0 -414 50 -360 L50 -344 L-50 -344 Z" fill={CEL.sun} />
      <Shade d="M20 -400 Q44 -390 50 -360 L50 -344 L24 -344 Z" />
      <circle cx={-34} cy={-366} r={11} fill={CEL.paper} />
      <path d="M-30 -332 L-10 -326 M-36 -310 Q-14 -300 6 -312" stroke={CEL.ink} strokeWidth="6" fill="none" data-bare />
      <g data-fx="hammer" transform="rotate(0 -40 -270)">
        <path d="M-40 -270 L40 -420" stroke={CEL.ink} strokeWidth="20" strokeLinecap="round" data-bare />
        <path d="M-40 -270 L40 -420" stroke={CEL.plank} strokeWidth="12" strokeLinecap="round" data-bare />
        <path d="M2 -470 L88 -424 L64 -376 L-22 -422 Z" fill={CEL.steelDark} />
        <Shade d="M40 -446 L88 -424 L64 -376 L30 -394 Z" cross />
      </g>
    </g>
  )
}

/** TOWER TOMMY on his hill, the hill 460 wide and 150 high: he sits behind a heavy gun on a scrap chair
 *  ([data-fx="tommy"] slumps), the gun's muzzle at (-150, -190). */
export function Tommy() {
  return (
    <g>
      <path d="M-230 0 Q-150 -130 0 -150 Q150 -136 240 0 Z" fill={CEL.coastRidge} />
      <Shade d="M60 -146 Q150 -136 240 0 L120 0 Q120 -80 60 -146 Z" fill={CEL.coastRidgeShade} />
      <g transform="translate(20 -148)">
        <path d="M30 0 L30 -96 L80 -96 L84 0 Z" fill={CEL.rust} />
        <g data-fx="tommy">
          <path d="M14 -40 L8 -132 Q34 -146 58 -132 L52 -40 Z" fill={CEL.hide} />
          <path d="M14 -136 Q12 -172 34 -176 Q56 -172 54 -136 Z" fill={CEL.sack} />
          <Lines d="M22 -158 l8 6 m0 -6 l-8 6" width={2.5} />
          <path d="M60 -170 L100 -190 L62 -150 Z" fill={CEL.red} />
        </g>
        <rect x={-70} y={-62} width={110} height={48} fill={CEL.steelDark} />
        <Shade d="M0 -62 H40 V-14 H0 Z" cross />
        <rect x={-170} y={-50} width={104} height={18} fill={CEL.ink} />
        <path d="M-40 -14 L-60 0 M10 -14 L30 0" stroke={CEL.ink} strokeWidth="8" data-bare />
      </g>
    </g>
  )
}

/** The brood hive, a hill of pale flesh 340 wide: three white eyes ([data-fx="eye-{i}"]) that burst when
 *  shot, its veins and its maw. */
export const HIVE_EYES = [
  [-70, -170],
  [10, -210],
  [86, -160],
] as const

export function Hive() {
  return (
    <g>
      <path d="M-170 0 Q-190 -220 -40 -266 Q130 -296 176 -120 Q190 -40 164 0 Z" fill={CEL.flesh} />
      <Shade d="M90 -270 Q160 -230 176 -120 Q190 -40 164 0 L90 0 Q130 -140 90 -270 Z" fill={CEL.fleshShade} />
      <path d="M-120 -60 Q-60 -130 0 -86 M20 -220 Q80 -186 128 -110 M-140 -150 Q-110 -200 -60 -220" stroke={CEL.epic} strokeWidth="5" fill="none" data-bare />
      <path d="M-60 -40 Q0 -90 60 -40 Q0 -10 -60 -40 Z" fill={CEL.ink} />
      <path d="M-50 -42 l10 10 l10 -12 l10 12 l10 -12 l10 12 l10 -10" fill="none" stroke={CEL.paper} strokeWidth="3" data-bare />
      {HIVE_EYES.map(([x, y], i) => (
        <g key={x} data-fx={`eye-${i}`}>
          <circle cx={x} cy={y} r={24} fill={CEL.white} />
          <circle cx={x - 6} cy={y} r={8} fill={CEL.ink} />
        </g>
      ))}
    </g>
  )
}

/** A cliff flyer, 140 across round its body, diving at him from the upper right: leather wings swept back, a
 *  hooked beak. */
export function Flyer() {
  return (
    <g>
      <path d="M0 0 L-20 -60 L30 -48 L50 -80 L60 -20 Z" fill={CEL.hideShade} />
      <path d="M0 0 L60 30 L74 -4 L90 20 L60 -20 Z" fill={CEL.hide} />
      <ellipse cx={0} cy={0} rx={36} ry={16} fill={CEL.hide} transform="rotate(-30)" />
      <path d="M-28 16 L-56 30 L-30 26 Z" fill={CEL.sun} />
      <circle cx={-16} cy={8} r={4} fill={CEL.crit} data-bare />
    </g>
  )
}

/** BARON SALTWELL, 240 tall: a thin baron in a tall hat and a long coat, a scrap cane. */
export function Baron() {
  return (
    <g>
      <path d="M-20 0 L-16 -90 L-2 -90 L-4 0 Z M4 0 L2 -90 L16 -90 L20 0 Z" fill={CEL.ink} />
      <path d="M-36 -40 L-30 -170 Q0 -180 30 -170 L40 -40 Z" fill={CEL.redShade} />
      <Shade d="M12 -176 Q30 -174 30 -170 L40 -40 L18 -40 Z" />
      <path d="M-20 -176 Q-22 -206 0 -208 Q22 -206 20 -176 Z" fill={CEL.flesh} />
      <path d="M-26 -206 L-22 -270 L22 -270 L26 -206 Z" fill={CEL.ink} />
      <path d="M-40 -206 H40" stroke={CEL.ink} strokeWidth="8" data-bare />
      <path d="M-16 -190 q8 6 16 0" stroke={CEL.ink} strokeWidth="3" fill="none" data-bare />
      <path d="M-30 -120 L-60 -10" stroke={CEL.steelLight} strokeWidth="6" data-bare />
    </g>
  )
}

/** THE OLD HUNGER, 660 tall, rising behind the court: a dark body cracked with purple light, one great eye
 *  (its lid, [data-fx="lid"], scaled shut) and a tentacle ([data-fx="tentacle"]) reaching down to the court
 *  with three purple weak points on it ([data-fx="spot-{i}"]). */
export const SPOTS = [
  [-300, -170],
  [-312, -84],
  [-250, -250],
] as const

export function Hunger() {
  return (
    <g>
      <path d="M-210 0 Q-280 -400 -90 -640 Q60 -700 190 -556 Q310 -300 230 0 Z" fill={CEL.night} />
      <Shade d="M80 -660 Q190 -620 190 -556 Q310 -300 230 0 L120 0 Q200 -300 80 -660 Z" fill={CEL.nightHigh} cross />
      <path d="M-140 -120 L-90 -260 L-120 -380 M120 -140 L80 -300 M-40 -560 L0 -620 L40 -580" fill="none" stroke={CEL.eldritch} strokeWidth="6" data-bare />
      <path d="M-180 -620 L-230 -700 L-150 -650 Z M150 -600 L220 -690 L170 -590 Z" fill={CEL.steelDark} />
      <g transform="translate(0 -440)">
        <ellipse rx={84} ry={60} fill={CEL.sun} />
        <circle r={32} fill={CEL.eldritch} />
        <circle r={13} fill={CEL.ink} />
        <g data-fx="lid">
          <ellipse rx={88} ry={64} fill={CEL.nightLow} />
          <path d="M-88 0 Q0 30 88 0" fill="none" stroke={CEL.ink} strokeWidth="5" data-bare />
        </g>
      </g>
      <g data-fx="tentacle">
        <path d="M-160 -300 Q-310 -284 -336 -160 Q-356 -40 -282 0 L-236 0 Q-300 -60 -282 -160 Q-252 -250 -140 -262 Z" fill={CEL.nightLow} />
        <Shade d="M-282 0 L-236 0 Q-300 -60 -282 -160 Q-300 -90 -282 0 Z" cross />
        {SPOTS.map(([x, y], i) => (
          <g key={x + y} data-fx={`spot-${i}`}>
            <circle cx={x} cy={y} r={18} fill={CEL.eldritch} />
            <circle cx={x - 5} cy={y - 5} r={5} fill={CEL.white} data-bare />
          </g>
        ))}
      </g>
    </g>
  )
}
