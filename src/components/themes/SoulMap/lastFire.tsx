'use client'

import { useRef, useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/lib/cv/sectionText'
import { InView } from '@/components/themes/shared/held'
import type { Profession } from '@/lib/cv/professions'
import { Bonfire } from './bonfire'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { useRunActions } from './run'
import { ContactLink } from '@/components/cv/SiteLinks'
import { BUTTON_LIT, ContactButtons } from './links'
import { AreaTitle } from './menu'
import { CARVED } from './palette'
import souls from './souls.module.css'

// Contact is the last fire at the end of the road, still unlit, with his email and LinkedIn written on
// the floor beside it as the game's orange messages. Kindle lights it: the flame climbs the sword, the
// gold banner shows, and he sits down by it in the gear of the profession on show. The messages are the
// links themselves. Kindle leaves with the fire lit, so it hands keyboard focus on to the first message.

const KINDLE_SOULS = 500
// Two heavy strides to the fire (knight.module.css), the length of the slide that carries him there
// (.atFire), then he lowers himself down beside it.
const WALK_MS = 2400

export function LastFire({ profession }: { profession: Profession }) {
  const run = useRunActions()
  const { sections, souls: words } = useLabels()
  const [lit, setLit] = useState(false)
  const script = usePoseScript('idle')
  const id = headingId('soul', sections.contact)
  const messages = useRef<HTMLUListElement>(null)

  const kindle = () => {
    if (lit) return
    messages.current?.querySelector<HTMLElement>('a')?.focus()
    setLit(true)
    run.announce('kindled', words.kindled)
    run.earn(KINDLE_SOULS)
    run.rest()
    script.play([{ pose: 'walk', ms: WALK_MS }], 'sit')
  }

  return (
    <section className="relative px-4 pb-16 pt-12 sm:px-6" aria-labelledby={id}>
      <div className="mx-auto max-w-4xl">
        <AreaTitle id={id} title={sections.contact} />
        {/* The fire's last ember pulses once as the scene comes into view, not on the page's first draw. */}
        <InView threshold={0.3} className="relative mx-auto mt-8 h-64 max-w-xl sm:h-72">
          <div className={`absolute inset-x-0 bottom-0 h-24 rounded-[50%] ${souls.lastGround}`} aria-hidden="true" />
          <div className="absolute bottom-6 left-1/2 h-44 w-40 -ml-20">
            <Bonfire state={lit ? 'lit' : 'out'} className="h-full w-full" />
          </div>
          <div className={`absolute bottom-7 left-[18%] aspect-[60/96] h-40 sm:left-[22%] ${lit ? souls.atFire : ''}`}>
            <Knight key={script.key} gear={profession} pose={script.pose} className="h-full w-full" />
          </div>
        </InView>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          {!lit && (
            <button type="button" onClick={kindle} className={BUTTON_LIT}>
              {words.kindle}
            </button>
          )}
        </div>

        <RecruiterHero
          render={({ line, actions }) => (
            <div className="mt-8 text-center">
              <ul ref={messages} className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
                {actions.map((action) => (
                  <li key={action.id} className={`${souls.slab} p-4`}>
                    <ContactLink slot={action} className={`${souls.inscription} ${CARVED} block min-h-[44px] text-lg [overflow-wrap:anywhere] text-[color:var(--soul-message)]`}>
                      {(label) => (
                        <>
                          <span className="block text-sm uppercase tracking-[0.24em] text-[color:var(--soul-text-soft)]">{label}</span>
                          {action.value}
                        </>
                      )}
                    </ContactLink>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[color:var(--soul-text-soft)]">{line}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ContactButtons />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
