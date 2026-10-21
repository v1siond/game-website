'use client'

import { useEffect, useRef, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useScrollScene } from '@/hooks/useScrollScene'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { HeroCharacter, type SpritePose } from './character'
import { GiantSpider } from './spider'
import { Layer } from './depth'
import { GROUND, PROFESSION_SKY, Sky, Soft } from './places'
import { useCut } from './cut'
import { CVLink, HeroActions } from './actions'
import { SHADE, TYPEWRITER } from './palette'
import world from './world.module.css'
import shade from './shade.module.css'

// Contact: the edge of the city at the end of the page, past the last factory, where the fog lifts as
// the section scrolls in and the way to reach him sits beside a bear trap on the path, the oldest joke
// of a silhouette platformer. The visitor can spring it: he runs straight at it, the jaws snap, the
// screen cuts to black and he drops back in from above at the checkpoint, the death the genre is
// played through. The scene stands beside the words from a laptop up and above them on a phone.
// The spider, lame since the trap line, lurks at the left edge and flinches back when the jaws snap.
// Reduced motion skips the run and the snap.
//
// Animated: the fog, his parts and his run or drop, the two jaws, the layers' lean, the spider.

type Trap = 'ready' | 'run' | 'snap' | 'respawn'

const RUN_MS = 550
const SNAP_MS = 220
const DROP_MS = 900

const POSE: Record<Trap, SpritePose> = {
  ready: 'idle',
  run: 'run',
  snap: 'fall',
  respawn: 'hang',
}
const RUNNER: Record<Trap, string> = {
  ready: '',
  run: `${shade.runner} ${shade.runnerAtTrap}`,
  snap: `${shade.runner} ${shade.runnerAtTrap}`,
  respawn: shade.dropIn,
}

const JAW_BACK = 'M400 176 H385 L387 170 L390 172 L391 166 L394 168 L396 163 L400 166 Z'
const JAW_FRONT = 'M400 176 H415 L413 170 L410 172 L409 166 L406 168 L404 163 L400 166 Z'

// The city's far edge: chimneys and a gasholder, and the chain link fence in front of them.
const CHIMNEYS = [150, 196, 420, 452]
const FENCE_POSTS = [120, 200, 280, 360, 440]

function ClearingScene({ profession, trap }: { profession: Profession; trap: Trap }) {
  const light = PROFESSION_SKY[profession]
  const shut = trap === 'snap' ? shade.jawShut : ''

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-2 border-[color:var(--sh-black)]" aria-hidden="true">
      <Sky light={light} />
      <Layer depth="far">
        <path d="M0 176 V150 H130 V130 H230 V146 H300 V120 H380 V140 H470 V126 H600 V176 Z" fill={light.far} />
        {CHIMNEYS.map((x) => (
          <rect key={x} x={x} y={70} width={10} height={80} fill={light.far} />
        ))}
        <path d="M250 120 A40 40 0 0 1 330 120 Z" fill={light.far} />
      </Layer>
      <Layer depth="mid">
        <path d="M0 200 V172 Q150 164 300 170 T600 168 V200 Z" fill={light.mid} />
        {FENCE_POSTS.map((x) => (
          <rect key={x} x={x} y={120} width={4} height={54} fill={light.mid} />
        ))}
        <path
          d="M120 124 H444 M120 172 H444 M120 124 L170 172 M170 124 L120 172 M200 124 L250 172 M250 124 L200 172 M280 124 L330 172 M330 124 L280 172 M360 124 L410 172 M410 124 L360 172"
          stroke={light.mid}
          strokeWidth={1}
          fill="none"
        />
      </Layer>
      <Layer depth="plane">
        <path d={GROUND} fill={SHADE.black} />
        <GiantSpider pose={trap === 'snap' ? 'flinch' : 'lurk'} lame place={{ x: -70, y: 180, height: 120 }} />
        <rect x={380} y={175} width={40} height={4} fill={SHADE.black} />
        <path d={JAW_BACK} fill={SHADE.black} className={`${shade.jawBack} ${shut}`} />
        <path d={JAW_FRONT} fill={SHADE.black} className={`${shade.jawFront} ${shut}`} />
        <g className={RUNNER[trap]}>
          <HeroCharacter profession={profession} pose={POSE[trap]} place={{ x: 180, y: 180, height: 54 }} />
        </g>
      </Layer>
      <Layer depth="near">
        <Soft d="M150 200 L156 120 L166 122 L162 200 Z M440 200 L446 136 L456 138 L452 200 Z" />
      </Layer>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[color:var(--sh-fog)] via-[color:var(--sh-edge)] to-transparent ${shade.fogLift}`}
      />
    </div>
  )
}

export function Clearing({ profession }: { profession: Profession }) {
  const { sections, shade: words } = useLabels()
  const cut = useCut()
  const { ref } = useScrollScene<HTMLElement>({})
  const [trap, setTrap] = useState<Trap>('ready')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const respawn = () => {
    setTrap('respawn')
    timers.current.push(window.setTimeout(() => setTrap('ready'), DROP_MS))
  }

  const spring = () => {
    if (trap !== 'ready') return
    if (prefersReducedMotion()) {
      cut()
      return
    }
    setTrap('run')
    timers.current = [window.setTimeout(() => setTrap('snap'), RUN_MS), window.setTimeout(() => cut(respawn), RUN_MS + SNAP_MS)]
  }

  return (
    <section
      ref={ref}
      className="relative z-20 mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      aria-labelledby="silhouette-contact-heading"
    >
      <ClearingScene profession={profession} trap={trap} />
      <RecruiterHero
        render={({ line, actions }) => (
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <h2 id="silhouette-contact-heading" className={`text-xl font-normal uppercase tracking-[0.3em] text-[color:var(--sh-heading)] ${TYPEWRITER}`}>
              {sections.contact}
            </h2>
            <p className="max-w-xl text-sm text-[color:var(--sh-muted)]">{line}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <HeroActions actions={actions} />
              <CVLink />
              <button
                type="button"
                onClick={spring}
                disabled={trap !== 'ready'}
                className={`${world.button} inline-flex min-h-[44px] items-center border-2 border-dashed border-[color:var(--sh-muted)] bg-[color:var(--sh-void)] px-4 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-muted)] hover:text-[color:var(--sh-text)] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)]`}
              >
                {words.springTrap}
              </button>
            </div>
          </div>
        )}
      />
    </section>
  )
}
