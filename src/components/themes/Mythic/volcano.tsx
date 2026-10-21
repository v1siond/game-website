import { MYTH } from './palette'
import u from './underworld.module.css'

// The volcano over the magma, the scene that opens the projects: a flat caldera of basalt between two
// ridges, the magma river at its foot. When the stage first shows it trembles, the crater bursts, lava
// rocks are thrown up and fall away on both sides, and three lava flows run down its flanks into the
// river and stay; then it rumbles and throws rocks again every few seconds while the crater glows. Drawn
// in the world's ink line over painted fills; every motion is a transform or an opacity
// (underworld.module.css, "the volcano"), and under reduced motion it stands with its flows already
// down and no rocks in the air.
//
// The viewBox meets the scene's box from the bottom, so the whole cone shows at every width; the ridges
// and the river run on past both sides of it to fill a wide scene.

const INK = MYTH.inkLine

const CONE = 'M30 200 L104 128 L118 136 L146 96 L164 74 L236 74 L254 96 L282 136 L296 128 L370 200 Z'
const CONE_LIGHT = 'M164 74 L180 74 L160 120 L128 160 L104 128 L118 136 L146 96 Z'

// The flows run from the crater lip down the flanks to the river.
const FLOWS = ['M200 78 Q206 120 198 160 Q194 182 200 196', 'M176 78 Q156 110 140 140 Q126 168 112 194', 'M226 78 Q250 118 262 150 Q272 176 290 194']

// Each rock: its size and where it lands, sideways and down from the crater (in the viewBox's units).
const ROCKS = [
  { r: 4, dx: -70, peak: -50 },
  { r: 5.5, dx: -30, peak: -62 },
  { r: 3.5, dx: 12, peak: -66 },
  { r: 5, dx: 44, peak: -56 },
  { r: 4, dx: 82, peak: -44 },
  { r: 3, dx: -100, peak: -34 },
]

export function Volcano() {
  return (
    <div className={`relative mb-8 h-56 overflow-hidden sm:h-72 ${u.volcanoScene}`} aria-hidden="true">
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="myth-lava" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={MYTH.fireCore} />
            <stop offset="0.45" stopColor={MYTH.magma} />
            <stop offset="1" stopColor={MYTH.blood} />
          </linearGradient>
          <radialGradient id="myth-crater" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={MYTH.fireCore} />
            <stop offset="0.5" stopColor={MYTH.magma} stopOpacity={0.6} />
            <stop offset="1" stopColor={MYTH.magma} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* the far ridges */}
        <path d="M-400 200 L-400 140 L-300 118 L-200 146 L-100 124 L0 150 L50 122 L90 150 L130 132 L130 200 Z M270 200 L270 134 L320 116 L360 146 L400 128 L500 150 L600 120 L700 144 L800 130 L800 200 Z" fill={MYTH.aspLow} stroke={INK} strokeWidth={2} />

        {/* the burst of light out of the crater */}
        <ellipse cx={200} cy={40} rx={18} ry={40} fill={MYTH.fireCore} className={u.burst} />

        <g className={u.tremble}>
          <path d={CONE} fill={MYTH.basalt} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d={CONE_LIGHT} fill={MYTH.aspLow} opacity={0.8} />
          <g className={u.lavaFlow}>
            {FLOWS.map((d) => (
              <g key={d}>
                <path d={d} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
                <path d={d} fill="none" stroke="url(#myth-lava)" strokeWidth={7} strokeLinecap="round" />
                <path d={d} fill="none" stroke={MYTH.fireCore} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
              </g>
            ))}
          </g>
          <ellipse cx={200} cy={76} rx={36} ry={7} fill={MYTH.magma} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={200} cy={74} rx={44} ry={16} fill="url(#myth-crater)" className={u.craterGlow} />
        </g>

        {ROCKS.map(({ r, dx, peak }, index) => (
          <g key={dx} className={u.rockX} style={{ ['--dx' as string]: `${dx}px`, ['--i' as string]: index }}>
            <circle cx={200} cy={74} r={r} fill={MYTH.magma} stroke={INK} strokeWidth={1.6} className={u.rockY} style={{ ['--peak' as string]: `${peak}px`, ['--i' as string]: index }} />
          </g>
        ))}

        {/* the magma river at its foot */}
        <path d="M-400 190 Q-300 182 -200 192 T0 190 T200 192 T400 188 T600 190 T800 188 L800 200 L-400 200 Z" fill={MYTH.magma} stroke={INK} strokeWidth={2} />
        <path d="M-400 194 Q-300 188 -200 196 T0 194 T200 196 T400 193 T600 195 T800 193" fill="none" stroke={MYTH.fireCore} strokeWidth={1.6} opacity={0.8} />
      </svg>
    </div>
  )
}
