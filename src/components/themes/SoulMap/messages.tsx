'use client'

import { useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { fillLabel } from '@/lib/cv/labels'
import type { CVData } from '@/lib/cv/content'
import { VentureList, type VentureSlot } from '@/components/cv/VentureList'
import { Knight } from './knight'
import { useRunActions } from './run'
import { BUTTON, BUTTON_LIT } from './links'
import { CARD_BODY, TAG } from './menu'
import { CARVED } from './palette'
import souls from './souls.module.css'

// The ventures are the game's messages left on the floor: each one a stone slab with its name written
// in glowing orange script, the way players leave words for each other. The script is written into the
// stone as the visitor reaches the slab, and its light breathes on the stone after. Pointing at a slab (or focusing
// into it) lifts the script off the stone and brightens it, the moment the game shows a message; the
// words under it are the venture's own. Appraise is the game's rating of a message: it marks the slab
// appraised and gives the souls a good rating brings.
//
// Who left it shows too: as the slab is reached, a white blue spirit of him fades in kneeling at the
// stone and writes, the soapstone hand working in short strokes while the script burns in beside him,
// then fades away the way another world's player does, leaving only the words. It goes once per slab and
// is taken off the page when gone; under reduced motion only the message shows.

// His own products (featured) are the wide slabs laid first across the whole floor, a gold banner tag
// over the name; the other ventures pack into the columns under them.

const APPRAISE_SOULS = 100

function Scribe({ writing }: { writing: boolean }) {
  const reduced = useReducedMotion()
  const [gone, setGone] = useState(false)
  if (!writing || reduced || gone) return null
  return (
    <div className={`pointer-events-none absolute -top-[4.75rem] right-3 h-20 w-[3.125rem] ${souls.scribe}`} onAnimationEnd={(event) => event.target === event.currentTarget && setGone(true)} aria-hidden="true">
      <Knight gear="drummer" pose="write" spirit="scribe" facingLeft className="h-full w-full" />
    </div>
  )
}

function Slab({ slot: { venture, linkProps, nameFor } }: { slot: VentureSlot }) {
  const run = useRunActions()
  const { souls: words, links, cards } = useLabels()
  const [appraised, setAppraised] = useState(false)
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })

  const appraise = () => {
    if (appraised) return
    setAppraised(true)
    run.earn(APPRAISE_SOULS)
  }

  return (
    <article ref={ref} className={`relative ${souls.slab} ${souls.message} ${triggered ? souls.messageOn : ''} mt-[4.75rem] p-5`}>
      <Scribe writing={triggered} />
      {/* The badge sits outside the inscription, whose dimmed opacity and fire glow would drop its contrast */}
      {venture.featured && (
        <p className={`mb-2 inline-block bg-[color:var(--soul-glow)] px-2 py-0.5 text-sm uppercase tracking-[0.12em] text-[color:var(--soul-ink)] ${CARVED}`}>
          {cards.ownProduct}
        </p>
      )}
      <div className={souls.inscription}>
        <h3 className={`${CARVED} ${venture.featured ? 'text-xl' : 'text-lg'} tracking-[0.08em] text-[color:var(--soul-message)]`}>
          <span className="grayscale" aria-hidden="true">
            {venture.icon}{' '}
          </span>
          <SlashBreaks text={venture.name} />
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
          aria-disabled={appraised}
          aria-label={appraised ? `${venture.name}: ${words.appraised}` : fillLabel(words.appraiseOf, { name: venture.name })}
          className={appraised ? BUTTON : BUTTON_LIT}
        >
          {appraised ? words.appraised : words.appraise}
        </button>
        {linkProps && (
          <a {...linkProps} aria-label={nameFor(links.website)} className={BUTTON}>
            {links.website}
          </a>
        )}
      </div>
    </article>
  )
}

export function FloorMessages({ companies }: { companies: CVData['companies'] }) {
  return (
    <>
      <VentureList
        companies={companies}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        featuredItemClassName="[column-span:all]"
        renderVenture={(slot) => <Slab slot={slot} />}
      />
    </>
  )
}
