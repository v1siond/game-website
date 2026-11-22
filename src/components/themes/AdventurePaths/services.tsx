'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Service } from '@/lib/cv/content'
import { Actor, useCourse } from './actor'
import type { Course } from './course'
import { JOURNAL_SERIF } from './palette'
import { PAPER_CARD, Region, StompFoe } from './region'
import thud from './servicesStomp.module.css'

// The services as a stretch between levels: the HUD title and the message window's paper cards, a title
// and its line each. A mushroom walks the cards' top edge and he stomps it, the source game's first
// move. Pattern: the shared section trigger starts it once; his course (course.ts) runs three legs,
// each ended by the track's own animation through the shared pose sequence:
//   run    0 to 480 ms     he runs in from the left along the top edge
//   stomp  480 to 880 ms   one jump arc onto the mushroom; it goes flat with its score popping up, and
//                          the card row takes his weight at 880 ms: down 8 px and back in steps (280 ms)
//   off    880 to 1280 ms  he jumps off to the right
// Then he and the mushroom unmount and the cards rest exactly as they did without him. The cards are
// shown the whole time. Reduced motion shows the cards with no figure.
// Transforms and opacity only (servicesStomp.module.css, the foe's own classes in side.module.css).

const FOE_X = 46
const LAND = 18

const STOMP_COURSE: Course = {
  start: { x: -10, lift: 0 },
  legs: [
    { pose: 'run', frame: 'run', path: 'line', to: { x: 24, lift: 0 }, ms: 480 },
    { pose: 'stomp', frame: 'stomp', path: 'arc', to: { x: FOE_X, lift: LAND }, ms: 400, peak: 56 },
    { pose: 'off', frame: 'jump', path: 'arc', to: { x: 92, lift: 0 }, ms: 400, peak: 36 },
  ],
  rest: { pose: 'gone', frame: 'stand' },
}

function StompScene() {
  const course = useCourse(STOMP_COURSE)
  if (course.arrived) return null

  return (
    <div className={`pointer-events-none absolute inset-x-0 z-20 ${thud.lane}`} aria-hidden="true">
      <StompFoe x={FOE_X} scored={course.past('stomp')} score={100} />
      <Actor motion={course.motion} profession="engineer" onAnimationEnd={course.onOwnAnimationEnd} />
    </div>
  )
}

export function ServicesLevel({ services }: { services: Service[] }) {
  const { sections } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const reduced = useReducedMotion()
  const playing = triggered && !reduced

  return (
    <Region title={sections.services}>
      <div ref={ref} className="relative">
        <ul className={`${MASONRY_LIST} ${playing ? thud.thud : ''}`}>
          {services.map((service) => (
            <li key={service.id} className={MASONRY_ITEM}>
              <article className={`${PAPER_CARD} border-t-8 border-t-[color:var(--ap-route)]`}>
                <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{service.title}</h3>
                <p className="mt-2 text-base text-[color:var(--ap-ink-soft)]">{service.line}</p>
              </article>
            </li>
          ))}
        </ul>
        {playing && <StompScene />}
      </div>
    </Region>
  )
}
