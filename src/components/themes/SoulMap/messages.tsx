'use client'

import { useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { newTabName } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { CVData } from '@/lib/cv/content'
import { useRun } from './run'
import { BUTTON, BUTTON_LIT } from './links'
import { CARD_BODY, Hint, TAG } from './menu'
import { CARVED } from './palette'
import souls from './souls.module.css'

// The ventures are the game's messages left on the floor: each one a stone slab with its name written
// in glowing orange script, the way players leave words for each other. Pointing at a slab (or focusing
// into it) lifts the script off the stone and brightens it, the moment the game shows a message; the
// words under it are the venture's own. Appraise is the game's rating of a message: it marks the slab
// appraised and gives the souls a good rating brings.

type Venture = CVData['companies'][number]

const APPRAISE_SOULS = 100

function Slab({ venture }: { venture: Venture }) {
  const run = useRun()
  const { souls: words, links } = useLabels()
  const [appraised, setAppraised] = useState(false)

  const appraise = () => {
    if (appraised) return
    setAppraised(true)
    run.earn(APPRAISE_SOULS)
  }

  return (
    <article className={`${souls.slab} p-5`}>
      <div className={souls.inscription}>
        <h3 className={`${CARVED} text-lg tracking-[0.08em] text-[color:var(--soul-message)]`}>
          <span className="grayscale" aria-hidden="true">
            {venture.icon}{' '}
          </span>
          {venture.name}
        </h3>
        <p className="mt-1 text-sm italic text-[color:var(--soul-message)]">{venture.tagline}</p>
      </div>
      {venture.description && <p className={`mt-3 ${CARD_BODY}`}>{venture.description}</p>}
      {venture.services.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {venture.services.map((service) => (
            <li key={service} className={TAG}>
              {service}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={appraise}
          disabled={appraised}
          aria-label={appraised ? `${venture.name}: ${words.appraised}` : fillLabel(words.appraiseOf, { name: venture.name })}
          className={appraised ? BUTTON : BUTTON_LIT}
        >
          {appraised ? words.appraised : words.appraise}
        </button>
        {venture.url && (
          <a href={venture.url} target="_blank" rel="noopener noreferrer" aria-label={newTabName(links, fillLabel(links.linkOf, { link: links.website, project: venture.name }))} className={BUTTON}>
            {links.website}
          </a>
        )}
      </div>
    </article>
  )
}

export function FloorMessages({ companies }: { companies: CVData['companies'] }) {
  const { souls: words } = useLabels()
  return (
    <>
      <Hint>{words.messageHint}</Hint>
      <ul className={MASONRY_LIST}>
        {companies.map((venture) => (
          <li key={venture.id} className={MASONRY_ITEM}>
            <Slab venture={venture} />
          </li>
        ))}
      </ul>
    </>
  )
}
