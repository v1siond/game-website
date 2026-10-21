'use client'

import type { CSSProperties } from 'react'
import type { ScenePhase } from '@/lib/scroll/progress'
import { useScrollScene } from '@/hooks/useScrollScene'
import { HeroCharacter } from './character'
import { pinePath } from './depth'
import { Sky } from './places'
import { SHADE, SKY } from './palette'
import shade from './shade.module.css'

// About him, read while the giant spider chases him through the thicket: the bio is set as a silent
// film intertitle, and under it a low strip of forest where he runs left to right as the visitor
// scrolls, the spider's body on its thread and its long legs stabbing the ground at his heels. When
// the section has scrolled in he has outrun it and stands at the strip's end. Reduced motion and the
// World Select preview start there (useScrollScene starts them done).
//
// Animated: him (moved by --scene-progress) and his parts, the spider (moved by it), two stabbing legs.

const POSE: Record<ScenePhase, 'idle' | 'run'> = {
  idle: 'run',
  playing: 'run',
  done: 'idle',
}

const THICKET = [20, 70, 520, 572]
const WEBS = 'M110 20 L160 90 M110 20 L110 96 M110 20 L64 88 M90 46 Q110 54 130 46 M78 70 Q110 82 146 70'

// Each leg from the body at (0, 0), its foot on the ground 100 below.
const LEGS = ['M0 0 Q-40 -10 -56 30 L-70 100', 'M0 0 Q30 -14 44 26 L52 100']

function Spider() {
  return (
    <g>
      <line x1={0} y1={-400} x2={0} y2={-6} stroke={SHADE.black} strokeWidth={1.2} />
      {LEGS.map((d, index) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={SHADE.black}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={shade.stab}
          style={{ '--i': index } as CSSProperties}
        />
      ))}
      <ellipse cx={8} cy={-6} rx={20} ry={14} fill={SHADE.black} />
      <ellipse cx={-10} cy={4} rx={10} ry={9} fill={SHADE.black} />
    </g>
  )
}

export function ChaseAbout({ bio }: { bio: string }) {
  const { ref, phase } = useScrollScene<HTMLDivElement>({
    start: 0.95,
    end: 0.25,
  })

  return (
    <div ref={ref}>
      <p className="mx-auto max-w-2xl border-y border-[color:var(--sh-fog)] py-5 text-center text-sm leading-loose tracking-wide text-[color:var(--sh-text)] sm:text-base">{bio}</p>
      <div className="relative mt-6 h-28 overflow-hidden border-y-2 border-[color:var(--sh-black)] sm:h-36" aria-hidden="true">
        <Sky light={SKY.dawn} />
        <svg viewBox="0 0 600 120" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
          {THICKET.map((x) => (
            <path key={x} d={pinePath(x, 100, 112)} fill={SKY.dawn.far} />
          ))}
          <path d={WEBS} stroke={SKY.dawn.rim} strokeWidth={0.6} fill="none" opacity={0.5} />
          <path d="M-400 112 Q150 104 300 110 T1000 108 V140 H-400 Z" fill={SHADE.black} />
          <g className={shade.runAway}>
            <HeroCharacter profession="engineer" pose={POSE[phase]} place={{ x: 60, y: 112, height: 40 }} />
          </g>
          <g className={shade.chase}>
            <Spider />
          </g>
        </svg>
      </div>
    </div>
  )
}
