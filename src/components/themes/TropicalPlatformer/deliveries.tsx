'use client'

import type { CSSProperties, ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter } from './character'
import { BarrelArt, MuzzleBurst } from './barrel'
import { COLORS as C } from './palette'
import d from './deliveries.module.css'

// Two sections the jungle delivers the source's way:
// - Barrel smash (services): he runs in, hoists a barrel and throws it at the boards; it bursts into
//   staves with a white flash and the boards pop out of the burst.
// - Vulture drop (Muay Thai): the source's vulture flaps in from the right over the record, the record
//   hanging from its talons; it lets go, the record drops into its place and bounces, the bird flies off.
//
// Pattern: the shared usePoseSequence plays three beats once the section is in view (useSectionTrigger, so
// it plays once); every beat ends on its figure wrapper's own animationend. The section's reaction is one
// CSS keyframe from the second beat on that ends at the section's own place and look
// (deliveries.module.css). Timing, barrel: run 400 ms, throw 1300 ms (the barrel leaves his hands 700 ms
// in, bursts on the boards at 900 ms and the boards are up by 1250 ms), leave 520 ms. Vulture: fly in
// 650 ms, drop 600 ms (the record falls 300 ms and bounces twice), fly off 650 ms. Reduced motion: no
// figure, the section rests in place from the start.

type Beat = 'in' | 'act' | 'leave' | 'gone' | 'still'

const ENTRANCE: readonly Beat[] = ['in', 'act', 'leave']

function useBeats() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const { pose, onOwnAnimationEnd } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'gone', still: 'still' })
  const playing = triggered && (pose === 'in' || pose === 'act' || pose === 'leave')
  return { ref, triggered, pose, playing, onOwnAnimationEnd }
}

// The staves a burst barrel flies apart into, each thrown its own way (--dx, --dy, --turn).
const STAVES = [
  { dx: '-40px', dy: '-50px', turn: '-120deg' },
  { dx: '30px', dy: '-60px', turn: '140deg' },
  { dx: '-30px', dy: '30px', turn: '90deg' },
  { dx: '45px', dy: '25px', turn: '-80deg' },
]

/** Services: the boards popped out of the barrel he throws at them. */
export function BarrelSmash({ children }: { children: ReactNode }) {
  const { ref, triggered, pose, playing, onOwnAnimationEnd } = useBeats()

  return (
    <div ref={ref} className={`relative ${d.stage}`} data-on={triggered || undefined} data-beat={pose}>
      <div className={`relative ${d.smashed}`}>{children}</div>
      {playing && (
        <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-32 w-28" aria-hidden="true">
          <div className={`h-full w-full ${d.runner}`} onAnimationEnd={onOwnAnimationEnd}>
            <HeroCharacter profession="engineer" pose={pose === 'act' ? 'throw' : 'run'} className="h-full w-full" />
          </div>
          {pose === 'act' && (
            <>
              <BarrelArt mark="plain" className={`absolute left-16 top-0 h-12 w-10 ${d.flyingBarrel}`} />
              <span className={`absolute left-[17rem] top-0 h-14 w-14 ${d.blast}`}>
                <MuzzleBurst className="h-full w-full" />
                {STAVES.map((stave) => (
                  <span
                    key={stave.turn}
                    className={`absolute left-6 top-5 h-5 w-2 rounded-sm bg-[color:var(--tp-plank)] ${d.stave}`}
                    style={{ '--dx': stave.dx, '--dy': stave.dy, '--turn': stave.turn } as CSSProperties}
                  />
                ))}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// The source's vulture, side on and facing left: a bald pink head on a long neck, the white ruff, a
// hooked orange beak, a dark plum body and two broad wings that flap from the shoulder.
function Vulture() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" focusable="false">
      <g className={d.wingBack}>
        <path d="M66 34 Q90 2 116 10 Q98 22 92 38 Z" fill={C.duskDeep} />
      </g>
      <path d="M44 36 Q60 24 82 34 Q90 46 76 54 Q56 60 44 50 Z" fill={C.dusk} />
      <path d="M78 50 L96 58 L80 58 Z" fill={C.duskDeep} />
      <path d="M40 34 Q46 28 52 36 Q46 42 40 40 Z" fill={C.burst} />
      <path d="M26 22 Q30 12 40 16 Q44 26 40 34 L36 34 Q36 26 30 26 Z" fill={C.elderSkin} />
      <path d="M26 22 L14 26 Q20 30 28 28 Z" fill={C.sunsetOrange} />
      <circle cx="33" cy="19" r="2" fill={C.shadow} />
      <path d="M58 56 L56 68 M66 56 L66 68" stroke={C.sunsetOrange} strokeWidth="3" strokeLinecap="round" />
      <g className={d.wingFront}>
        <path d="M56 34 Q74 -4 104 4 Q86 18 78 40 Z" fill={C.dusk} />
        <path d="M70 20 Q84 10 98 8" fill="none" stroke={C.duskDeep} strokeWidth="2" />
      </g>
    </svg>
  )
}

/** Muay Thai: the record dropped into place from the vulture's talons. */
export function VultureDrop({ children }: { children: ReactNode }) {
  const { ref, triggered, pose, playing, onOwnAnimationEnd } = useBeats()

  return (
    <div ref={ref} className={`relative ${d.stage}`} data-on={triggered || undefined} data-beat={pose}>
      <div className={`relative ${d.dropped}`}>{children}</div>
      {playing && (
        <div className={`pointer-events-none absolute -top-24 left-1/2 z-30 h-20 w-32 ${d.vulture}`} onAnimationEnd={onOwnAnimationEnd} aria-hidden="true">
          <Vulture />
        </div>
      )}
    </div>
  )
}
