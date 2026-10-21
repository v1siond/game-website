'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { DimensionBackdrop, PortalPair } from './NeonPortals/backdrop'
import { PortalSelector } from './NeonPortals/selector'
import { CVLink, DemoLink, HeroActions } from './NeonPortals/actions'
import { SECTION_VIEWS } from './NeonPortals/sections'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ContactScene } from './NeonPortals/scenes'

// Neon Portals: the page composition. Its backdrop, character, cards, profession portals, stages and
// scroll scenes live in ./NeonPortals.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' lanes from sticking to the viewport.

export default function NeonPortalsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#07060f] font-['Inter','Segoe_UI',system-ui,sans-serif] text-[#edebe4]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>

      <DimensionBackdrop />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 pb-4 pt-6 sm:px-6 sm:pt-12">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 md:flex-row">
              <div className="flex min-w-0 items-start gap-4">
                <PortalPair className="hidden h-12 w-14 shrink-0 sm:block" />
                <div className="min-w-0">
                  <h1 className="break-words text-2xl font-light uppercase tracking-wide text-[#edebe4] md:text-3xl">{name}</h1>
                  <p className="mt-1 text-sm text-[#00a2ff]">{headline}</p>
                  <p className="mt-1 text-sm italic text-[#ff9a00]">{tagline}</p>
                  <p className="mt-1 text-sm text-[#a9a6b8]">{line}</p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-2" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <CVLink />
                <DemoLink />
              </nav>
            </div>
          )}
        />
      </header>

      {/* One portal per profession */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <ProfessionSwitch
          className="mx-auto flex max-w-3xl justify-center gap-2 px-4 sm:gap-8 md:gap-16"
          label="Select profession"
          renderOption={(option) => <PortalSelector option={option} />}
        />
      </section>

      {/* The picked profession's sections and stages, and only those */}
      <main id="main-content" className="relative z-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 py-8 text-center">
        <div className="mx-auto mb-6 h-px max-w-md bg-gradient-to-r from-[#ff9a00] to-[#00a2ff]" aria-hidden="true" />
        <div className="flex items-center justify-center gap-3">
          <PortalPair className="h-6 w-7" />
          <p className="text-sm tracking-[0.2em] text-[#a9a6b8]">
            © {new Date().getFullYear()} {view.hero.name}
          </p>
        </div>
      </footer>
    </div>
  )
}
