'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { DECO_COLORS as C } from './ArtDeco/palette'
import { DecoPatternBackground, LighthouseBeacon, DecoSVGDefs, UnderwaterBubbles, UnderwaterRays, WaterCaustics } from './ArtDeco/backdrop'
import { GoldFrame, NeonSign } from './ArtDeco/frames'
import { TonicBottle } from './ArtDeco/bottles'
import { CVLink, HeroAction, PortfolioLink } from './ArtDeco/actions'
import { SECTION_VIEWS } from './ArtDeco/sections'
import { ContactScene } from './ArtDeco/scenes'
import look from './ArtDeco/world.module.css'

// Art Deco, a drowned 1920s city under the sea in brass, gold and lamplight: the page composition. Its palette,
// backdrop, frames, cards, bottle switch, per profession sections, his costume and the scroll scenes
// live in ./ArtDeco.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' level strips from sticking to the viewport.

const SUNBURST_RAYS = Array.from({ length: 12 }, (_, i) => i * 30)

// The header's gold sunburst medallion.
function SunburstMedallion() {
  return (
    <svg viewBox="0 0 80 80" className="pointer-events-none hidden h-20 w-20 flex-shrink-0 sm:block" aria-hidden="true" focusable="false">
      {SUNBURST_RAYS.map((angle, i) => (
        <line
          key={angle}
          x1={40}
          y1={40}
          x2={40 + Math.sin((angle * Math.PI) / 180) * 40}
          y2={40 - Math.cos((angle * Math.PI) / 180) * 40}
          stroke={C.gold}
          strokeWidth={1.5}
          opacity={i % 2 ? 0.3 : 0.5}
        />
      ))}
      <circle cx={40} cy={40} r={20} fill="url(#porthole-glow)" stroke={C.gold} strokeWidth={2} />
    </svg>
  )
}

export default function ArtDecoTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative min-h-screen overflow-x-clip ${look.root}`}>
      <DecoSVGDefs />

      <DecoPatternBackground />
      <UnderwaterRays />
      <WaterCaustics />
      <UnderwaterBubbles />
      <LighthouseBeacon />
      <div className={`pointer-events-none fixed inset-0 z-[7] ${look.vignette}`} aria-hidden="true" />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 py-6 sm:p-6 sm:pb-10 sm:pt-20">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
              <div className="flex items-center gap-5">
                <SunburstMedallion />
                <div className="min-w-0">
                  <h1 className="break-words text-2xl uppercase tracking-[0.2em] sm:text-4xl">
                    <NeonSign text={name} flicker />
                  </h1>
                  <p className="mt-2 text-base tracking-wider text-[#e8e0d0]">{headline}</p>
                  <p className="mt-1 text-sm italic tracking-wider text-[#D4AF37]">{tagline}</p>
                  <p className="mt-1 text-sm tracking-wider text-[#d0c8b8]">{line}</p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-3 sm:gap-4" aria-label="Contact and CV">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PortfolioLink />
              </nav>
            </div>
          )}
        />
      </header>

      {/* The profession switch: a row of tonic bottles, System Engineer in the centre */}
      <section className="relative z-20 px-4 py-8" aria-label="Profession selection">
        <ProfessionSwitch
          className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-8"
          label="Profession"
          renderOption={(option) => <TonicBottle {...option} />}
        />
      </section>

      {/* The picked profession's sections and stages, and only those */}
      <main className="relative z-20 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

          <div className="pt-8">
            <FadeInScene>
              <GoldFrame title="Posts">
                <p className="py-8 text-center text-base italic text-[#d0c8b8]">No posts yet</p>
              </GoldFrame>
            </FadeInScene>
          </div>
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 flex justify-center py-12" aria-hidden="true">
        <svg width="50" height="80" viewBox="0 0 50 80" opacity="0.25" focusable="false">
          <path d="M18 80 L13 45 L37 45 L32 80" fill={C.gold} />
          <path d="M15 65 L35 65" stroke={C.bronzeDark} strokeWidth="2" />
          <rect x="10" y="25" width="30" height="20" fill={C.gold} />
          <path d="M8 25 L25 10 L42 25" fill={C.gold} />
          <circle cx="25" cy="35" r="8" fill={C.goldBright} opacity="0.8" />
          <path d="M25 27 L25 12 M17 30 L5 25 M33 30 L45 25" stroke={C.goldBright} strokeWidth="1.5" opacity="0.6" />
        </svg>
      </footer>
    </div>
  )
}
