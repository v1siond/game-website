'use client'

import { useEffect, useRef, useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { usePreview } from '@/themes/PreviewContext'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { NameWords } from '@/components/cv/NameWords'
import { Bonfire, type FireState } from './bonfire'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { useRun } from './run'
import { CVLink, EngineLink, HeroActions } from './links'
import { CARVED, SOUL } from './palette'
import souls from './souls.module.css'

// The hero: the ruined shrine at dusk, the circular plaza on its cliff under a grey sky, the aqueduct's
// arches behind it, the lift tower to the right and a broken arch to the left, the way the game's first
// safe place looks. He sits by a dead fire. The lighting plays once: an ember catches in the ash, the
// flame climbs the coiled sword, the gold banner says the fire is kindled, he stands up, and his name
// fades in under the scene. Then the scene is the visitor's: the fire is a button (rest: he sits down,
// drinks from the flask, gets up, and the HUD refills) and so is he (roll, which costs stamina). The
// three layers of ruins lean to the pointer (--mx, --my from the world's root).
//
// The scene keeps an aspect no wider than 2:1 and the art is cut from the middle of its 1200 by 600 view,
// so the overlay frame (h-full, aspect 2:1, centred) is always exactly the drawing and the fire and the
// knight stand on the plaza at every width.

type Phase = 'ash' | 'ember' | 'lit' | 'rise' | 'ready'

// He rises once the banner has had its moment, and the scene is the visitor's when he is fully up (the
// rise is 1.4 s in knight.module.css).
const TIMELINE: Array<[Phase, number]> = [
  ['ember', 700],
  ['lit', 1700],
  ['rise', 3400],
  ['ready', 4800],
]

const FIRE: Record<Phase, FireState> = { ash: 'out', ember: 'ember', lit: 'lit', rise: 'lit', ready: 'lit' }

const ROLL_COST = 20
const REST_SOULS = 50

// Each step lasts as long as its animation in knight.module.css, so it ends on the pose the next step
// starts from: sit down, drink sitting, rise; the roll ends back on his feet in his place.
const SIT_MS = 900
const DRINK_MS = 2200
const RISE_MS = 1400
const ROLL_MS = 1200

function useLighting(onLit: () => void): Phase {
  const preview = usePreview()
  const [phase, setPhase] = useState<Phase>('ash')
  const lit = useRef(onLit)

  useEffect(() => {
    lit.current = onLit
  })

  // The lighting plays once, on the first draw; a preview and reduced motion open on the lit fire.
  useEffect(() => {
    if (preview || prefersReducedMotion()) {
      setPhase('ready')
      return
    }
    const timers = TIMELINE.map(([next, at]) =>
      window.setTimeout(() => {
        setPhase(next)
        if (next === 'lit') lit.current()
      }, at),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [preview])

  return phase
}

// Arches of the aqueduct, pillar by pillar.
const ARCH_XS = [0, 130, 260, 390, 520, 650, 780, 910, 1040, 1170]
// Broken columns round the back of the plaza: x and height.
const COLUMNS: Array<[number, number]> = [
  [300, 120],
  [390, 70],
  [480, 150],
  [720, 96],
  [810, 140],
  [900, 60],
]

function Ruins() {
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="shrine-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SOUL.skyTop} />
          <stop offset="0.45" stopColor={SOUL.skyMid} />
          <stop offset="0.8" stopColor={SOUL.skyLow} />
          <stop offset="1" stopColor={SOUL.haze} />
        </linearGradient>
        <linearGradient id="shrine-plaza" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SOUL.ridge} />
          <stop offset="1" stopColor={SOUL.rock} />
        </linearGradient>
        <radialGradient id="shrine-firelight" cx="0.5" cy="0.86" r="0.4">
          <stop offset="0" stopColor={SOUL.ember} stopOpacity={0.35} />
          <stop offset="1" stopColor={SOUL.ember} stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={1200} height={600} fill="url(#shrine-sky)" />
      <circle cx={860} cy={360} r={70} fill={SOUL.fog} opacity={0.18} />

      {/* far: the castle on its cliffs */}
      <g className={souls.layerFar} fill={SOUL.skyMid} opacity={0.85}>
        <path d="M-40 420 L60 330 L130 350 L190 280 L240 300 L300 240 L330 250 L330 420 Z" />
        <path d="M640 420 V300 H660 V250 L672 210 L684 250 V300 H720 V270 H740 V230 L752 190 L764 230 V300 H800 V420 Z" />
        <path d="M800 420 L860 330 L940 360 L1010 300 L1100 340 L1240 290 V420 Z" />
      </g>

      {/* mid: the aqueduct and the lift tower */}
      <g className={souls.layerMid}>
        <rect x={-20} y={300} width={1240} height={26} fill={SOUL.stoneLight} opacity={0.55} />
        {ARCH_XS.map((x) => (
          <g key={x}>
            <rect x={x} y={326} width={26} height={150} fill={SOUL.stoneLight} opacity={0.5} />
            <path d={`M${x + 26} 326 Q${x + 65} 360 ${x + 104} 326 Z`} fill={SOUL.stoneLight} opacity={0.5} />
          </g>
        ))}
        <rect x={1000} y={130} width={90} height={350} fill={SOUL.ridge} />
        <path d="M990 132 L1045 90 L1100 132 Z" fill={SOUL.rock} />
        <rect x={1024} y={170} width={42} height={250} fill={SOUL.ink} opacity={0.75} />
        <path d="M1036 170 V420 M1054 170 V420" stroke={SOUL.stoneLight} strokeWidth={2} opacity={0.6} />
        <rect x={1026} y={300} width={38} height={10} fill={SOUL.leather} />
      </g>

      {/* near: the plaza on the cliff, the broken arch, the columns, a dead tree */}
      <g className={souls.layerNear}>
        <path d="M-20 470 Q300 446 600 448 Q900 446 1220 470 V600 H-20 Z" fill={SOUL.rock} />
        <ellipse cx={600} cy={520} rx={430} ry={74} fill="url(#shrine-plaza)" />
        <ellipse cx={600} cy={520} rx={330} ry={52} fill="none" stroke={SOUL.slab} strokeWidth={6} opacity={0.8} />
        <ellipse cx={600} cy={520} rx={180} ry={28} fill="none" stroke={SOUL.slab} strokeWidth={4} opacity={0.7} />
        <ellipse cx={600} cy={520} rx={360} ry={70} fill="url(#shrine-firelight)" />
        {COLUMNS.map(([x, height]) => (
          <g key={x}>
            <rect x={x} y={470 - height} width={30} height={height} fill={SOUL.ridge} />
            <rect x={x - 4} y={466} width={38} height={10} fill={SOUL.slab} />
            <path d={`M${x} ${470 - height} l10 -8 l8 6 l12 -4 v6 Z`} fill={SOUL.ridge} />
          </g>
        ))}
        <path d="M90 600 V260 Q200 150 310 260 V600 H262 V280 Q200 214 138 280 V600 Z" fill={SOUL.slab} />
        <path d="M262 300 L300 268 L318 290 L310 330 Z" fill={SOUL.ridge} />
        <path d="M940 470 Q936 400 948 350 M946 380 Q975 350 990 320 M944 400 Q912 370 902 340 M948 350 Q956 320 950 290" stroke={SOUL.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M0 600 Q80 560 200 572 Q320 586 380 600 Z M820 600 Q920 568 1040 574 Q1140 582 1200 566 V600 Z" fill={SOUL.cavern} />
        <path d="M640 586 L760 574 L790 590 L660 600 Z" fill={SOUL.ridge} />
      </g>

      <g className={souls.fogBand}>
        <rect x={-200} y={430} width={900} height={60} rx={30} fill={SOUL.fog} opacity={0.08} />
        <rect x={600} y={460} width={900} height={50} rx={25} fill={SOUL.fog} opacity={0.07} />
      </g>
    </svg>
  )
}

export function ShrineHero() {
  const run = useRun()
  const { souls: words } = useLabels()
  const phase = useLighting(() => run.announce('kindled', words.kindled))
  const script = usePoseScript('idle')
  const ready = phase === 'ready'
  // Before the lighting is done he is already sitting by the dead fire (no sitting down on the first
  // draw), then rises with it.
  const pose = ready ? script.pose : phase === 'rise' ? 'rise' : 'seated'

  const rest = () => {
    if (!ready) return
    script.play([
      { pose: 'sit', ms: SIT_MS, effect: run.rest },
      { pose: 'drink', ms: DRINK_MS, effect: () => run.earn(REST_SOULS) },
      { pose: 'rise', ms: RISE_MS },
    ])
  }

  const roll = () => {
    if (!ready || script.busy() || !run.spend(ROLL_COST)) return
    script.play([{ pose: 'roll', ms: ROLL_MS }])
  }

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden md:aspect-[2/1]">
        <Ruins />
        <div className="absolute bottom-0 left-1/2 aspect-[2/1] h-full -translate-x-1/2">
          <button
            type="button"
            onClick={rest}
            disabled={!ready}
            aria-label={words.rest}
            title={words.rest}
            className={`absolute bottom-[8%] left-[44%] h-[30%] w-[12%] ${souls.target}`}
          >
            <Bonfire state={FIRE[phase]} className="h-full w-full" />
          </button>
          <button
            type="button"
            onClick={roll}
            disabled={!ready}
            aria-label={words.roll}
            title={words.roll}
            className={`absolute bottom-[9%] left-[33%] h-[27%] w-[9%] min-w-11 ${souls.target}`}
          >
            <Knight key={ready ? `step-${script.key}` : pose} gear="knight" pose={pose} className="h-full w-full" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color:var(--soul-abyss)]" aria-hidden="true" />
      </div>

      <RecruiterHero
        render={({ name, headline, tagline, line, actions }) => (
          <div className={`${souls.heroWords} ${ready ? souls.heroWordsOn : ''} relative z-10 mx-auto -mt-10 max-w-3xl px-4 text-center sm:-mt-16`}>
            <h1 className={`${CARVED} text-[clamp(1.75rem,6.6vw,3.25rem)] uppercase tracking-[0.16em] text-[color:var(--soul-text)]`}>
              <NameWords name={name} />
            </h1>
            <div className="mx-auto mt-3 flex max-w-md items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-[color:var(--soul-glow-deep)]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[color:var(--soul-glow)]" />
              <span className="h-px flex-1 bg-[color:var(--soul-glow-deep)]" />
            </div>
            <p className={`${CARVED} mt-3 text-lg uppercase tracking-[0.2em] text-[color:var(--soul-glow)] sm:text-xl`}>{headline}</p>
            <p className="mt-3 text-base leading-relaxed text-[color:var(--soul-text-soft)]">{tagline}</p>
            <p className="mt-2 text-sm text-[color:var(--soul-text-soft)]">{line}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <HeroActions actions={actions} />
              <CVLink />
              <EngineLink />
            </div>
            <p className="mt-5 text-sm italic text-[color:var(--soul-text-soft)]">{words.restHint}</p>
          </div>
        )}
      />
    </div>
  )
}
