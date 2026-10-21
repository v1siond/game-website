'use client'

import { useEffect, useRef, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useScrollScene } from '@/hooks/useScrollScene'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { HeroCharacter, type SpritePose } from './character'
import { Layer, pinePath } from './depth'
import { GROUND, PROFESSION_SKY, Sky, Soft } from './places'
import { useCut } from './cut'
import { CVLink, HeroActions } from './actions'
import { SHADE, TYPEWRITER } from './palette'
import world from './world.module.css'
import shade from './shade.module.css'

// Contact: a clearing at the end of the forest, where the fog lifts as the section scrolls in and the
// way to reach him sits beside a sprung trap, the oldest joke of a silhouette platformer. The visitor
// can spring it: he runs straight at it, the jaws snap, the screen cuts to black and he respawns at
// the start, getting up from the grass, the death the genre is played through. Reduced motion skips
// the run and the snap.
//
// Animated: the fog, his parts and his run, the two jaws, the layers' lean.

type Trap = 'ready' | 'run' | 'snap' | 'respawn'

const RUN_MS = 550
const SNAP_MS = 220
const RISE_MS = 1300

const POSE: Record<Trap, SpritePose> = { ready: 'idle', run: 'run', snap: 'fall', respawn: 'rise' }
const RUNNER: Record<Trap, string> = {
  ready: '',
  run: `${shade.runner} ${shade.runnerAtTrap}`,
  snap: `${shade.runner} ${shade.runnerAtTrap}`,
  respawn: '',
}

const JAW_BACK = 'M450 176 H435 L437 170 L440 172 L441 166 L444 168 L446 163 L450 166 Z'
const JAW_FRONT = 'M450 176 H465 L463 170 L460 172 L459 166 L456 168 L454 163 L450 166 Z'

function ClearingScene({ profession, trap }: { profession: Profession; trap: Trap }) {
  const light = PROFESSION_SKY[profession]
  const shut = trap === 'snap' ? shade.jawShut : ''

  return (
    <div className="relative h-[34vh] min-h-[220px] max-h-[380px] overflow-hidden border-y-2 border-[color:var(--sh-black)]" aria-hidden="true">
      <Sky light={light} />
      <Layer depth="far">
        {[40, 96, 150, 470, 520, 572].map((x, index) => (
          <path key={x} d={pinePath(x, 80 + (index % 3) * 20, 176)} fill={light.far} />
        ))}
      </Layer>
      <Layer depth="mid">
        <path d="M0 200 V170 Q120 150 220 166 Q300 176 380 164 Q500 150 600 170 V200 Z" fill={light.mid} />
      </Layer>
      <Layer depth="plane">
        <path d={GROUND} fill={SHADE.black} />
        <rect x={430} y={175} width={40} height={4} fill={SHADE.black} />
        <path d={JAW_BACK} fill={SHADE.black} className={`${shade.jawBack} ${shut}`} />
        <path d={JAW_FRONT} fill={SHADE.black} className={`${shade.jawFront} ${shut}`} />
        <g className={RUNNER[trap]}>
          <HeroCharacter profession={profession} pose={POSE[trap]} place={{ x: 280, y: 180, height: 54 }} />
        </g>
      </Layer>
      <Layer depth="near">
        <Soft d="M0 200 L0 110 L12 150 L24 96 L36 160 L50 130 L60 200 Z" />
        <Soft d="M600 200 L600 120 L590 160 L578 104 L566 168 L552 200 Z" />
      </Layer>
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[color:var(--sh-fog)] via-[color:var(--sh-edge)] to-transparent ${shade.fogLift}`} />
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
    timers.current.push(window.setTimeout(() => setTrap('ready'), RISE_MS))
  }

  const spring = () => {
    if (trap !== 'ready') return
    if (prefersReducedMotion()) {
      cut()
      return
    }
    setTrap('run')
    timers.current = [
      window.setTimeout(() => setTrap('snap'), RUN_MS),
      window.setTimeout(() => cut(respawn), RUN_MS + SNAP_MS),
    ]
  }

  return (
    <section ref={ref} className="relative z-20 mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="silhouette-contact-heading">
      <ClearingScene profession={profession} trap={trap} />
      <RecruiterHero
        render={({ line, actions }) => (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <h2 id="silhouette-contact-heading" className={`text-xl font-normal uppercase tracking-[0.3em] text-[color:var(--sh-heading)] ${TYPEWRITER}`}>
              {sections.contact}
            </h2>
            <p className="max-w-xl text-sm text-[color:var(--sh-muted)]">{line}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
