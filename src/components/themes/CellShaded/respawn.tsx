'use client'

import { useEffect, useState } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { Digistruct } from './digistruct'
import { ContactActions, InkButton } from './buttons'
import { HATCH } from './ink'
import { CEL } from './palette'
import { SectionTitle, celHeadingId, useStage } from './stage'
import cel from './cel.module.css'

// Contact as the respawn station at night: the station's rings pulse on the pad and, when the section
// first comes into view, it rebuilds him slice by slice the way the wasteland brings a hunter back.
// Beside it the station's panel holds the contact line and the four ways to reach him; Respawn builds
// him again.

export function RespawnStation({ profession }: { profession: Profession }) {
  const { contact } = useCVData()
  const { sections, hud, navigation } = useLabels()
  const { ref, on, reduced } = useStage('night')
  const [build, setBuild] = useState(0)
  const title = sections.contact

  useEffect(() => {
    if (on && !reduced) setBuild((count) => (count === 0 ? 1 : count))
  }, [on, reduced])

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={celHeadingId(title)} className={`relative z-20 px-4 pb-16 pt-8 sm:px-6 ${cel.stage}`}>
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={title} />
        <div className={`grid items-center gap-8 p-5 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] ${cel.darkPaper}`}>
          <div className="relative mx-auto h-72 w-56" aria-hidden="true">
            <svg viewBox="0 0 224 288" className={`absolute inset-0 h-full w-full ${cel.inked}`}>
              <path d="M24 40 L52 16 L172 16 L200 40 L200 260 L24 260 Z" fill={CEL.steelDark} />
              <path d="M160 16 L172 16 L200 40 L200 260 L160 260 Z" fill={HATCH} opacity={0.5} data-bare />
              <path d="M44 48 L180 48 L180 236 L44 236 Z" fill={CEL.night} />
              <path d="M80 26 L144 26 L144 36 L80 36 Z" fill={CEL.holo} />
            </svg>
            <svg viewBox="0 0 224 40" className={`absolute inset-x-0 bottom-6 h-10 w-full ${cel.ring}`}>
              <ellipse cx={112} cy={20} rx={84} ry={13} fill="none" stroke={CEL.holo} strokeWidth={5} />
            </svg>
            <svg viewBox="0 0 224 40" className={`absolute inset-x-0 bottom-16 h-10 w-full ${cel.ringLate}`}>
              <ellipse cx={112} cy={20} rx={68} ry={10} fill="none" stroke={CEL.holo} strokeWidth={4} />
            </svg>
            <Digistruct profession={profession} build={build} className="absolute bottom-10 left-1/2 h-52 w-32 -translate-x-1/2" />
          </div>

          <div className="min-w-0">
            <p className={`text-2xl text-[var(--cel-sun)] sm:text-3xl ${cel.display}`}>{contact.line}</p>
            <RecruiterHero
              render={({ actions }) => (
                <nav className="mt-6 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
                  <ContactActions actions={actions} />
                </nav>
              )}
            />
            <InkButton tone="holo" className="mt-6" onClick={() => setBuild((count) => count + 1)}>
              {hud.respawn}
            </InkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
