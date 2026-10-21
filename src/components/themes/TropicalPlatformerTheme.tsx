'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './TropicalPlatformer/palette'
import { AkuAkuMask, Crystal, GemIcon, NitroCrate, TNTCrate, TikiTotem, WoodenCrate, WumpaFruit } from './TropicalPlatformer/icons'
import { JungleFloaters, JungleVine, OceanWaves } from './TropicalPlatformer/backdrop'
import { CratePanel } from './TropicalPlatformer/panels'
import { LifeCounter, WarpZone } from './TropicalPlatformer/cards'
import { CRATE_BUTTON, CVLink, HeroAction } from './TropicalPlatformer/actions'
import { SECTION_VIEWS } from './TropicalPlatformer/sections'

// Tropical Platformer: the page composition. Its palette, icons, backdrop, art scenes, panels, cards,
// actions and per profession sections live in ./TropicalPlatformer.

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================
export default function TropicalPlatformerTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg,
          ${COLORS.tropicalCyan} 0%,
          ${COLORS.jungleGreen} 15%,
          ${COLORS.jungleDark} 40%,
          ${COLORS.beachBrown} 70%,
          ${COLORS.oceanRoyal} 100%
        )`,
      }}
    >
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes jungleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-3deg); }
          75% { transform: translateY(-20px) rotate(8deg); }
        }

        @keyframes aku-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes aku-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        @keyframes aku-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes tnt-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes nitro-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes wave-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-360px); }
        }

        @keyframes wave-medium {
          0% { transform: translateX(0); }
          100% { transform: translateX(-360px); }
        }

        @keyframes wave-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-360px); }
        }

        @keyframes wumpa-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes gem-sparkle {
          0%, 100% { opacity: 0.9; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.4); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes warp-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes warp-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes portal-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        .animate-aku-glow { animation: aku-glow 2s ease-in-out infinite; }
        .animate-aku-bounce { animation: aku-bounce 1s ease-in-out infinite; }
        .animate-aku-float { animation: aku-float 3s ease-in-out infinite; }
        .animate-tnt-pulse { animation: tnt-pulse 1s ease-in-out infinite; }
        .animate-nitro-glow { animation: nitro-glow 1.5s ease-in-out infinite; }
        .animate-wave-slow { animation: wave-slow 12s linear infinite; }
        .animate-wave-medium { animation: wave-medium 8s linear infinite; }
        .animate-wave-fast { animation: wave-fast 6s linear infinite; }
        .animate-wumpa-bob { animation: wumpa-bob 2s ease-in-out infinite; }
        .animate-wumpa-bob-delayed { animation: wumpa-bob 2s ease-in-out infinite; animation-delay: 0.7s; }
        .animate-gem-sparkle { animation: gem-sparkle 2.5s ease-in-out infinite; }
        .animate-gem-sparkle-delayed { animation: gem-sparkle 2.5s ease-in-out infinite; animation-delay: 1s; }
        .animate-bounce-slow { animation: bounce-slow 1.5s ease-in-out infinite; }
        .animate-warp-spin { animation: warp-spin 8s linear infinite; transform-origin: center; }
        .animate-warp-spin-reverse { animation: warp-spin-reverse 6s linear infinite; transform-origin: center; }
        .animate-portal-pulse { animation: portal-pulse 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-aku-glow,
          .animate-aku-bounce,
          .animate-aku-float,
          .animate-tnt-pulse,
          .animate-nitro-glow,
          .animate-wave-slow,
          .animate-wave-medium,
          .animate-wave-fast,
          .animate-wumpa-bob,
          .animate-wumpa-bob-delayed,
          .animate-gem-sparkle,
          .animate-gem-sparkle-delayed,
          .animate-bounce-slow,
          .animate-warp-spin,
          .animate-warp-spin-reverse,
          .animate-portal-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* Jungle canopy at top */}
      <div
        className="fixed top-0 left-0 right-0 h-36 z-[2] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${COLORS.jungleDark}ee 0%, ${COLORS.jungleGreen}90 50%, transparent 100%)`,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 opacity-70">
          <path d="M0 25 Q8 8 16 25 Q24 12 32 25 Q40 5 48 25 Q56 15 64 25 Q72 8 80 25 Q88 12 96 25 L100 25" fill={COLORS.jungleDark} />
        </svg>
      </div>

      {/* Side jungle vines */}
      <JungleVine side="left" />
      <JungleVine side="right" />

      {/* Floating decorations */}
      <JungleFloaters profession={active} reducedMotion={reducedMotion} />

      {/* Ocean waves at bottom */}
      <OceanWaves />

      {/* ================================================================ */}
      {/* HEADER - the recruiter first screen */}
      {/* ================================================================ */}
      <header className="relative z-30 pt-8 pb-4 px-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                  <LifeCounter lives={99} className="mb-3" />

                  <h1
                    className="text-4xl md:text-6xl font-black tracking-wider uppercase"
                    style={{
                      color: COLORS.crashOrange,
                      fontFamily: 'Impact, Arial Black, sans-serif',
                      textShadow: `
                        4px 4px 0 ${COLORS.jungleDark},
                        -2px -2px 0 #000,
                        2px -2px 0 #000,
                        -2px 2px 0 #000,
                        0 0 40px ${COLORS.crashOrange}70
                      `,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {name}
                  </h1>

                  <p
                    className="text-xl md:text-2xl font-bold mt-3"
                    style={{
                      color: '#fff',
                      textShadow: '3px 3px 0 rgba(0,0,0,0.8)',
                      fontFamily: 'Impact, Arial Black, sans-serif',
                    }}
                  >
                    {headline}
                  </p>

                  <p
                    className="text-base md:text-lg mt-2 italic"
                    style={{ color: COLORS.tropicalCyan, textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}
                  >
                    {tagline}
                  </p>

                  <p className="text-base mt-2" style={{ color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}>
                    {line}
                  </p>
                </div>

                <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />

                  {/* Nebulith Button - Crystal style */}
                  <Link
                    href="/personal-projects/game-engine"
                    className={CRATE_BUTTON}
                    style={{
                      background: `linear-gradient(180deg, #0a1f5c, ${COLORS.crateWood})`,
                      border: `4px solid ${COLORS.gemBlue}`,
                      color: COLORS.gemBlue,
                      boxShadow: '0 5px 0 #001a33, inset 0 2px 0 rgba(255,255,255,0.15)',
                      fontFamily: 'Impact, sans-serif',
                      borderRadius: '6px',
                    }}
                    aria-label="View Nebulith game engine project"
                  >
                    <GemIcon size={22} color="blue" />
                    NEBULITH
                  </Link>
                </nav>
              </div>
            </div>
          )}
        />
      </header>

      {/* Warp Zone Profession Selector, System Engineer in the centre */}
      <section className="relative z-20 py-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="flex justify-center gap-4 sm:gap-8 py-10"
          label="Profession"
          renderOption={(option) => <WarpZone {...option} reducedMotion={reducedMotion} />}
        />
      </section>

      <main className="relative z-20">
        <div role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} reducedMotion={reducedMotion} />
        </div>
      </main>

      {/* ================================================================ */}
      {/* CONTACT CTA */}
      {/* ================================================================ */}
      <div className="relative z-20 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Ready to Work Together?" titleIcon={<WumpaFruit size={28} />} variant="checkpoint">
            <RecruiterHero
              render={({ line, actions }) => (
                <div className="text-center">
                  <p className="text-lg mb-6" style={{ color: '#fff' }}>
                    {line}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions.map((action) => (
                      <HeroAction key={action.id} action={action} />
                    ))}
                    <CVLink />
                  </div>
                </div>
              )}
            />
          </CratePanel>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}
      <footer className="relative z-20 py-20 text-center">
        <div className="flex justify-center gap-6 mb-6">
          <WumpaFruit size={48} />
          <Crystal size={44} />
          <TNTCrate size={44} />
          <GemIcon size={40} color="blue" />
        </div>

        <AkuAkuMask size={60} className="mx-auto mb-6" animated={!reducedMotion} />

        <p
          className="text-lg font-bold"
          style={{
            color: COLORS.beachSand,
            fontFamily: 'Impact, sans-serif',
            textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
          }}
        >
          N. Sanity Beach, Wumpa Islands
        </p>

        <div className="flex justify-center gap-8 mt-8">
          <WoodenCrate size={36} />
          <NitroCrate size={36} />
          <WoodenCrate size={36} variant="bouncy" />
          <WoodenCrate size={36} variant="checkpoint" />
        </div>

        {/* Tiki totems at bottom */}
        <div className="flex justify-center gap-16 mt-8 opacity-60">
          <TikiTotem size={30} />
          <TikiTotem size={35} />
          <TikiTotem size={30} />
        </div>
      </footer>
    </div>
  )
}
