import { DECO_COLORS as C } from './palette'

// The drowned city's people, all our own, drawn in its gilt and shadow round their feet and facing him (to
// the left) unless a scene turns them: the tenant gone strange on the city's tonic, ragged and barnacled,
// its eyes lit by it; the crawler that clings to a ceiling on long limbs; a little one in her raincoat with
// her lamp; the tall copper guardian that walks beside her on stilt legs with a lantern for a face; a pair
// of dancers in torn evening clothes; and the tenant who swelled himself on the tonic. Each is one group a
// scene's writer moves by its data-fx name, with named parts where an action needs them.

const LINE = C.sepia
const PALE = '#8d9a8a'

/** A tenant at its feet, hunched toward him, its body in `data-fx="{name}"`; `shade` draws it as the dark
 *  shape a lamp throws on frosted glass. */
export function Tenant({ name, shade = false }: { name: string; shade?: boolean }) {
  const ink = (fill: string) => (shade ? C.abyss : fill)
  const stroke = shade ? 'none' : LINE
  return (
    <g data-fx={name}>
      <path d="M-28 0 L-20 -112 L-2 -112 L-8 0 Z M6 0 L4 -112 L22 -112 L30 0 Z" fill={ink(C.ragsDark)} stroke={stroke} strokeWidth="3" />
      <path d="M-44 -98 Q-48 -196 -12 -222 Q30 -228 42 -196 L46 -98 L32 -84 L20 -100 L6 -86 L-8 -100 L-24 -84 Z" fill={ink(C.rags)} stroke={stroke} strokeWidth="3" />
      <path d="M36 -194 L48 -128 L36 -124 L26 -178 Z" fill={ink(C.rags)} stroke={stroke} strokeWidth="3" />
      <path d="M-30 -204 L-80 -152 L-68 -140 L-22 -178 Z" fill={ink(C.rags)} stroke={stroke} strokeWidth="3" />
      <path d="M-78 -150 L-92 -136 M-78 -150 L-94 -148 M-78 -150 L-88 -130" stroke={ink(PALE)} strokeWidth="5" strokeLinecap="round" />
      <circle cx={-20} cy={-246} r={25} fill={ink(PALE)} stroke={stroke} strokeWidth="3" />
      <path d="M-44 -252 Q-24 -284 4 -258 L2 -236 Q-6 -262 -20 -262 Q-34 -262 -42 -240 Z" fill={ink(C.ragsDark)} />
      {!shade && (
        <>
          {[
            [-18, -216, 6],
            [-4, -220, 4],
            [28, -206, 6],
            [36, -188, 4],
            [-36, -170, 5],
          ].map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={C.barnacle} stroke={LINE} strokeWidth="1.5" />
          ))}
          <circle cx={-32} cy={-248} r={12} fill={C.tonic} opacity="0.25" />
          <ellipse cx={-34} cy={-248} rx={4} ry={3} fill={C.tonic} />
          <ellipse cx={-21} cy={-250} rx={3} ry={2.6} fill={C.tonic} />
        </>
      )}
    </g>
  )
}

/** The crawler clinging to a ceiling at (0, 0), hanging under it on four long limbs, its body in
 *  `data-fx="{name}"`; turned over it crouches on a floor the same way. */
export function Crawler({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-70 0 L-58 46 L-30 58 M70 0 L64 44 L34 60 M-120 0 L-96 52 L-50 70 M118 0 L94 50 L52 70" fill="none" stroke={C.ragsDark} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={0} cy={72} rx={70} ry={26} fill={C.rags} stroke={LINE} strokeWidth="3" />
      <path d="M-30 64 Q0 54 34 66" fill="none" stroke={C.ragsDark} strokeWidth="4" />
      <circle cx={-78} cy={92} r={22} fill={PALE} stroke={LINE} strokeWidth="3" />
      <path d="M-98 82 Q-80 70 -60 84" fill={C.ragsDark} />
      <ellipse cx={-88} cy={96} rx={4} ry={3} fill={C.tonic} />
      <ellipse cx={-76} cy={99} rx={3} ry={2.6} fill={C.tonic} />
    </g>
  )
}

/** A little one at her feet in her yellow raincoat, her lamp held out toward him: her body in
 *  `data-fx="{name}"`, the lamp's glow in `data-fx="{name}-glow"`. */
export function LittleOne({ name, lampUp = false }: { name: string; lampUp?: boolean }) {
  const lamp = lampUp ? { x: -16, y: -150 } : { x: -30, y: -64 }
  return (
    <g data-fx={name}>
      <path d="M-14 0 V-22 H-4 V0 Z M4 0 V-22 H14 V0 Z" fill={C.shoe} />
      <path d="M-26 -18 L-16 -92 Q0 -100 16 -92 L26 -18 Z" fill={C.raincoat} stroke={LINE} strokeWidth="2.5" />
      <path d="M8 -92 L16 -18 L26 -18 L16 -92 Z" fill={C.raincoatShade} opacity="0.6" />
      <path d="M-6 -80 V-24" stroke={C.raincoatShade} strokeWidth="2" />
      <circle cx={-2} cy={-106} r={17} fill="#a9744e" stroke={LINE} strokeWidth="2" />
      <path d="M-24 -104 Q-22 -132 0 -132 Q22 -132 20 -104 Q12 -124 -2 -124 Q-16 -124 -24 -104 Z" fill={C.raincoat} stroke={LINE} strokeWidth="2.5" />
      <circle cx={-9} cy={-106} r={2} fill={C.abyss} />
      <circle cx={2} cy={-107} r={2} fill={C.abyss} />
      <path d={`M-14 -80 L${lamp.x + 4} ${lamp.y - 8}`} stroke={C.raincoat} strokeWidth="9" strokeLinecap="round" />
      <g transform={`translate(${lamp.x} ${lamp.y})`}>
        <circle data-fx={`${name}-glow`} cx={0} cy={0} r={46} fill={C.lamp} opacity="0.35" />
        <path d="M-7 -14 H7 L9 -10 V8 H-9 V-10 Z" fill={C.goldBright} stroke={C.brassDark} strokeWidth="2" />
        <path d="M-3 -18 H3 V-14 H-3 Z M-8 -14 Q0 -24 8 -14" fill="none" stroke={C.brassDark} strokeWidth="2" />
        <circle cx={0} cy={-1} r={4} fill={C.ivory} />
      </g>
    </g>
  )
}

/** The guardian at its feet, standing over her: its whole body in `data-fx="{name}"`, its body over the hips
 *  in `data-fx="{name}-body"` (it leans down from them), its lantern face in `data-fx="{name}-head"` and the
 *  light it lowers on whoever comes near in `data-fx="{name}-beam"`. */
export function Guardian({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-34 0 L-48 -150 L-24 -300 M34 0 L44 -150 L22 -300" fill="none" stroke={C.copperDark} strokeWidth="16" strokeLinejoin="round" />
      <path d="M-34 0 L-48 -150 L-24 -300 M34 0 L44 -150 L22 -300" fill="none" stroke={C.copper} strokeWidth="8" strokeLinejoin="round" />
      {[-48, 44].map((x) => (
        <circle key={x} cx={x} cy={-150} r={12} fill={C.brassMid} stroke={LINE} strokeWidth="3" />
      ))}
      <path d="M-50 0 H-18 M18 0 H50" stroke={C.copperDark} strokeWidth="10" strokeLinecap="round" />
      <g data-fx={`${name}-body`}>
        <rect x={-56} y={-430} width={112} height={140} rx={30} fill={C.copper} stroke={LINE} strokeWidth="4" />
        <path d="M-56 -390 H56 M-56 -330 H56" stroke={C.copperDark} strokeWidth="5" />
        {[-40, -14, 14, 40].map((x) => (
          <g key={x}>
            <circle cx={x} cy={-400} r={4} fill={C.brassMid} />
            <circle cx={x} cy={-320} r={4} fill={C.brassMid} />
          </g>
        ))}
        <path d="M-54 -410 L-84 -330 L-76 -230 M54 -410 L76 -330 L70 -232" fill="none" stroke={C.copperDark} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M-12 -430 V-456 M12 -430 V-456" stroke={C.copperDark} strokeWidth="8" />
        <g data-fx={`${name}-head`}>
          <path data-fx={`${name}-beam`} d="M-30 -500 L-330 -250 L-210 -170 Z" fill={C.lamp} opacity="0" />
          <path d="M-34 -456 H34 V-530 H-34 Z" fill={C.abyss} stroke={C.brassMid} strokeWidth="5" />
          <path d="M-26 -464 H26 V-522 H-26 Z" fill={C.lamp} opacity="0.85" />
          <path d="M-8 -470 Q0 -500 8 -470 Z" fill={C.fire} />
          <path d="M0 -464 V-522 M-26 -493 H26" stroke={C.brassDark} strokeWidth="3" />
          <path d="M-42 -530 H42 L30 -548 H-30 Z M-16 -548 H16 L8 -566 H-8 Z" fill={C.copper} stroke={LINE} strokeWidth="3" />
          <path d="M-44 -456 H44" stroke={C.copperDark} strokeWidth="8" />
        </g>
      </g>
    </g>
  )
}

/** A dancer of the ballroom at its feet, in torn evening clothes, `gown` her or him in tails; its body in
 *  `data-fx="{name}"`, drawn facing right (away from him) as it dances. */
export function Dancer({ name, gown }: { name: string; gown: boolean }) {
  return (
    <g data-fx={name}>
      {gown ? (
        <path d="M-36 0 L-30 -14 L-40 -6 L-20 -150 Q0 -160 20 -150 L40 -6 L28 -16 L34 0 L14 -12 L0 0 L-14 -12 Z" fill={C.bloodDark} stroke={LINE} strokeWidth="3" />
      ) : (
        <>
          <path d="M-22 0 L-16 -112 L0 -112 L-4 0 Z M6 0 L4 -112 L20 -112 L24 0 Z" fill={C.abyss} stroke={LINE} strokeWidth="3" />
          <path d="M-28 -100 L-24 -200 Q0 -212 24 -200 L28 -100 L44 -60 L34 -40 L22 -96 Z" fill={C.cabinetMid} stroke={LINE} strokeWidth="3" />
          <path d="M-8 -206 L0 -170 L8 -206 Z" fill={C.cream} />
        </>
      )}
      {gown && <path d="M-20 -150 L-16 -206 Q0 -214 16 -206 L20 -150 Z" fill={C.bloodDark} stroke={LINE} strokeWidth="3" />}
      <path d="M14 -196 L46 -236 L52 -228 L22 -186 Z" fill={gown ? PALE : C.cabinetMid} stroke={LINE} strokeWidth="2.5" />
      <path d="M-14 -196 L-30 -140" stroke={gown ? PALE : C.cabinetMid} strokeWidth="10" strokeLinecap="round" />
      <circle cx={2} cy={-232} r={22} fill={PALE} stroke={LINE} strokeWidth="3" />
      <path d={gown ? 'M-22 -228 Q-24 -262 4 -258 Q28 -256 24 -230 Q30 -206 18 -196 Q16 -226 2 -244 Q-10 -232 -22 -228 Z' : 'M-20 -236 Q-18 -258 4 -256 Q24 -256 22 -238 Q8 -246 -20 -236 Z'} fill={C.ragsDark} />
      <ellipse cx={14} cy={-234} rx={3.4} ry={2.6} fill={C.tonic} />
    </g>
  )
}

/** The tenant who swelled himself on the tonic, about twice his height, glowing through the cracks in his
 *  skin, one shoulder rimed with frost and the other crackling: his body in `data-fx="{name}"`, the arm he
 *  shields his eyes with in `data-fx="{name}-arm"` and his glow in `data-fx="{name}-glow"`. */
export function Giant({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse data-fx={`${name}-glow`} cx={0} cy={-300} rx={240} ry={300} fill={C.giantGlow} opacity="0.16" />
      <path d="M-70 0 L-60 -200 L-10 -200 L-20 0 Z M20 0 L14 -200 L64 -200 L76 0 Z" fill={C.ragsDark} stroke={LINE} strokeWidth="4" />
      <path d="M-120 -190 Q-150 -420 -40 -470 Q60 -490 120 -420 Q150 -300 110 -190 Z" fill={C.rags} stroke={LINE} strokeWidth="4" />
      <path d="M-60 -420 L-30 -360 L-60 -300 L-20 -240 M40 -440 L20 -380 L60 -320 L30 -250" fill="none" stroke={C.giantGlow} strokeWidth="6" strokeLinecap="round" />
      <path d="M-90 -440 L-130 -470 L-100 -430 L-150 -440 L-104 -410" fill={C.bolt} opacity="0.7" />
      <path d="M96 -440 L118 -476 L126 -440 L150 -460 L132 -424" fill="none" stroke={C.bolt} strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 -400 L160 -300 L150 -170 L118 -170 L118 -290 L80 -360 Z" fill={C.rags} stroke={LINE} strokeWidth="4" />
      <circle cx={134} cy={-160} r={30} fill={PALE} stroke={LINE} strokeWidth="4" />
      <circle cx={-56} cy={-490} r={42} fill={PALE} stroke={LINE} strokeWidth="4" />
      <path d="M-98 -492 Q-80 -540 -30 -526 L-20 -506 Q-60 -520 -98 -492 Z" fill={C.ragsDark} />
      <ellipse cx={-80} cy={-492} rx={7} ry={5} fill={C.giantGlow} />
      <ellipse cx={-58} cy={-494} rx={6} ry={4.4} fill={C.giantGlow} />
      <g data-fx={`${name}-arm`}>
        <path d="M-90 -420 L-170 -300 L-150 -180 L-114 -186 L-130 -296 L-60 -380 Z" fill={C.rags} stroke={LINE} strokeWidth="4" />
        <circle cx={-134} cy={-172} r={34} fill={PALE} stroke={LINE} strokeWidth="4" />
      </g>
    </g>
  )
}
