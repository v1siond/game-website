'use client'

import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import { ContactActions } from './actions'
import { MercSprite } from './merc'
import { panelHeadingId } from './hud'
import type { Scene } from './scenes'
import { HudTitle } from './sections'
import { NeonStage } from './stage'
import world from './world.module.css'

// Contact as an incoming call on the optics: his portrait on the call feed, his name and the two ways to
// answer, email and LinkedIn; pointing at one kicks it out a step. Behind it he sits on his car's rear deck
// at the kerb, and as the page ends he gets in and drives off into the Badlands (scenes.tsx), so the
// section runs a screen past the call.

export function HoloCall({ scene, profession, number, still }: { scene: Scene; profession: Profession; number: number; still: boolean }) {
  const { cyber, sections } = useLabels()

  return (
    <section data-scene="contact" className="relative px-4 pb-[110svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]" aria-labelledby={panelHeadingId(sections.contact)}>
      {still && <NeonStage scene={scene} settled />}
      <header className="flex min-h-[80svh] items-end pb-10 motion-reduce:min-h-[70svh]">
        <HudTitle number={number} total={number} title={sections.contact} />
      </header>
      <RecruiterHero
        render={({ name, line, actions }) => (
          <div className={`${world.panel} max-w-2xl p-5 sm:p-8`}>
            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[color:var(--neon-hud)]">
              <span className="block h-3 w-3 rounded-full bg-[color:var(--neon-hack)]" aria-hidden="true" />
              {cyber.incomingCall}
            </p>

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0" aria-hidden="true">
                <span className="absolute -inset-3 rounded-full border-2 border-[color:var(--neon-hack)] opacity-60" />
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-[color:var(--neon-data)] bg-[color:var(--neon-ink)]">
                  <MercSprite profession={profession} motion="still" className="absolute left-1/2 top-2 h-auto w-28 -translate-x-1/2" />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,color-mix(in_srgb,var(--neon-data)_14%,transparent)_2px_3px)]" />
                </div>
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <p className="text-[clamp(1.25rem,7vw,1.5rem)] uppercase tracking-[0.12em] text-[color:var(--neon-ice)]">
                  <NameWords name={name} />
                </p>
                <p className="mt-2 text-sm text-[color:var(--neon-ash)]">{line}</p>
                <nav className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start" aria-label={cyber.incomingCall}>
                  <ContactActions actions={actions} actionClassName={world.answer} />
                </nav>
              </div>
            </div>
          </div>
        )}
      />
    </section>
  )
}
