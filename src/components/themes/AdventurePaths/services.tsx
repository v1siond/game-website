'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { Service } from '@/lib/cv/content'
import { JOURNAL_SERIF } from './palette'
import { PAPER_CARD, Region } from './region'

// The services as a plain stretch between levels: the HUD title and the message window's paper cards,
// a title and its line each, under the shared fade (no playfield, he does nothing here).

export function ServicesLevel({ services }: { services: Service[] }) {
  const { sections } = useLabels()

  return (
    <Region title={sections.services}>
      <FadeInScene>
        <ul className={MASONRY_LIST}>
          {services.map((service) => (
            <li key={service.id} className={MASONRY_ITEM}>
              <article className={`${PAPER_CARD} border-t-8 border-t-[color:var(--ap-route)]`}>
                <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{service.title}</h3>
                <p className="mt-2 text-base text-[color:var(--ap-ink-soft)]">{service.line}</p>
              </article>
            </li>
          ))}
        </ul>
      </FadeInScene>
    </Region>
  )
}
