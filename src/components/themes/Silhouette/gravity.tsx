'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter, type SpritePose } from './character'
import { Sky } from './places'
import { SHADE, SKY, TYPEWRITER } from './palette'
import { Panel } from './cards'
import world from './world.module.css'
import shade from './shade.module.css'

// The Muay Thai record in a gravity room, the switch a silhouette puzzle platformer flips to turn the
// level upside down: he trains on the floor of a cave under a crimson sky, and the switch drops him to
// the ceiling and back, where he lands on his feet and goes on kicking. His achievements fall into
// place from the new "down" each time (and once, from above, when the section comes into view).
//
// Animated: his parts, his flip, one fall per achievement.

const LAND_MS = 600

const CRIMSON = SKY.crimson
const ROOTS = 'M0 0 H600 V18 Q560 22 540 18 L536 34 L530 18 Q470 24 420 18 L414 40 L408 18 Q300 26 220 18 L214 30 L208 18 Q120 22 80 18 L76 44 L70 18 Q40 20 0 18 Z'
const FLOOR = 'M0 160 V140 Q150 136 300 140 T600 138 V160 Z'

function GravityRoom({ flipped, pose }: { flipped: boolean; pose: SpritePose }) {
  return (
    <div className="relative h-44 overflow-hidden border-2 border-[color:var(--sh-black)] sm:h-52" aria-hidden="true">
      <Sky light={CRIMSON} />
      <svg viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" focusable="false">
        <path d="M0 140 L90 96 L170 130 L260 88 L340 132 L430 92 L520 128 L600 100 V140 Z" fill={CRIMSON.far} />
        <path d={ROOTS} fill={SHADE.black} />
        <path d={FLOOR} fill={SHADE.black} />
        <g className={`${shade.gravity} ${flipped ? shade.gravityFlipped : ''}`}>
          <HeroCharacter profession="fighter" pose={pose} place={{ x: 282, y: 140, height: 58 }} />
        </g>
      </svg>
    </div>
  )
}

export function GravityRecord({ martialArts }: { martialArts: MartialArts }) {
  const { shade: words } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.15 })
  const [flipped, setFlipped] = useState(false)
  const [flips, setFlips] = useState(0)
  const [pose, setPose] = useState<SpritePose>('act')
  const landing = useRef(0)

  useEffect(() => () => window.clearTimeout(landing.current), [])

  const flip = () => {
    setFlipped((current) => !current)
    setFlips((count) => count + 1)
    setPose('idle')
    window.clearTimeout(landing.current)
    landing.current = window.setTimeout(() => setPose('act'), LAND_MS)
  }

  const { achievements } = martialArts.primary
  const fall = flipped ? shade.fallUp : shade.fallDown

  return (
    <div ref={ref}>
      <Panel>
        <h3 className={`mb-4 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-heading)] ${TYPEWRITER}`}>{martialArts.primary.title}</h3>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <GravityRoom flipped={flipped} pose={pose} />
            <button
              type="button"
              aria-pressed={flipped}
              onClick={flip}
              className={`${world.button} mt-4 inline-flex min-h-[44px] items-center border-2 border-[color:var(--sh-text)] bg-[color:var(--sh-void)] px-4 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-text)] hover:bg-[color:var(--sh-glow)] hover:text-[color:var(--sh-black)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)] ${TYPEWRITER}`}
            >
              {words.flipGravity}
            </button>
          </div>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-4 grid gap-3 sm:grid-cols-2',
              fact: 'border-l-2 border-[color:var(--sh-black)] bg-[color:var(--sh-panel)] p-3',
              term: 'text-sm uppercase tracking-[0.25em] text-[color:var(--sh-dim)]',
              value: 'mt-1 text-sm text-[color:var(--sh-text)]',
              achievements: 'space-y-2',
              achievement: 'text-sm text-[color:var(--sh-muted)]',
            }}
            renderAchievement={(achievement) => (
              <span
                key={flips}
                className={`flex items-start gap-1.5 border-l-2 border-[color:var(--sh-rim)] bg-[color:var(--sh-night)] p-2 ${triggered ? fall : 'opacity-0'}`}
                style={{ '--i': achievements.indexOf(achievement) } as CSSProperties}
              >
                <span className="text-[color:var(--sh-dim)]" aria-hidden="true">
                  -
                </span>
                {achievement}
              </span>
            )}
          />
        </div>
      </Panel>
    </div>
  )
}
