'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'
import { GOW } from './Mythic/palette'
import { BloodBanner, BloodSplash, DivineLightRays, EmberParticles, FloatingAsh, ParallaxLayers, StormyClouds, Volcano } from './Mythic/backdrop'
import { FadeInSection } from './Mythic/panels'
import { WaystationNode } from './Mythic/selector'
import { HeroActions, MY_BUTTON } from './Mythic/actions'
import { SECTION_VIEWS } from './Mythic/sections'

// Mythic: the page composition. Its palette, backdrop, art breaks, frames, cards, selector, buttons and
// per profession sections live in ./Mythic.

export default function MythicTheme() {
  const view = useWorldView()
  const active = view.profession
  const [mounted, setMounted] = useState(false)

  const contactTrigger = useSectionTrigger()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: GOW.void }}
        role="status"
        aria-label="Loading theme"
      >
        <div className="animate-pulse text-center" style={{ color: GOW.bone }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${GOW.void} 0%, ${GOW.voidDeep} 20%, ${GOW.ash}40 60%, ${GOW.ashLight}50 100%)`,
      }}
    >
      <SkipLink href="#main-content" />

      {/* GOW3 Stormy clouds with lightning */}
      <StormyClouds />

      {/* Atmospheric background - with warm glow on left for volcano */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, ${GOW.stormGrey}25 0%, transparent 50%),
            radial-gradient(ellipse at 5% 85%, ${GOW.fire}30 0%, ${GOW.fire}15 25%, transparent 50%),
            radial-gradient(ellipse at 20% 70%, ${GOW.bloodDark}20 0%, transparent 40%),
            radial-gradient(ellipse at 80% 30%, ${GOW.fire}10 0%, transparent 35%),
            linear-gradient(180deg, ${GOW.void} 0%, ${GOW.voidDeep} 25%, ${GOW.ash}30 70%, ${GOW.ashLight}40 100%)
          `,
        }}
      />
      <FloatingAsh />
      <DivineLightRays />
      <Volcano />
      <EmberParticles />

      {/* GOW3 Blood banner at top */}
      <BloodBanner />

      {/* Blood splash accent on right (volcano on left) */}
      <BloodSplash side="right" />

      {/* Parallax background ornaments per profession */}
      <ParallaxLayers profession={active} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 30%, rgba(10,10,12,0.5) 60%, rgba(10,10,12,0.9) 100%),
            linear-gradient(180deg, transparent 60%, ${GOW.void}90 100%)
          `,
        }}
      />

      {/* Fixed Navigation Bar - Below blood banner */}
      <nav
        className="fixed top-16 md:top-14 left-0 right-0 z-[46] px-4 py-2 md:px-6 md:py-3"
        style={{
          background: `linear-gradient(180deg, ${GOW.void}f0 0%, ${GOW.void}cc 100%)`,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${GOW.gold}15`,
        }}
        aria-label="Primary navigation"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            {/* Small Omega symbol */}
            <svg className="w-5 h-5 md:w-6 md:h-6 hidden sm:block" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12,4 C8,4 5,8 5,14 L8,14 C8,10 9.5,7 12,7 C14.5,7 16,10 16,14 L19,14 C19,8 16,4 12,4"
                fill={GOW.gold}
                opacity="0.8"
              />
            </svg>
            <span
              className="text-sm md:text-lg tracking-[0.2em] md:tracking-[0.25em] font-semibold uppercase whitespace-nowrap"
              style={{
                color: GOW.goldBright,
                textShadow: `0 0 30px ${GOW.gold}40, 0 2px 4px rgba(0,0,0,0.5)`,
              }}
            >
              {view.hero.name}
            </span>
          </Link>

          <div className="flex gap-2 md:gap-3 items-center">
            <Link
              href="/cv"
              className="px-2 md:px-3 py-1.5 md:py-2 min-h-[44px] text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c040] border border-[#c9a227]/40 text-[#c9a227] bg-black/90"
            >
              CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-2 md:px-3 py-1.5 md:py-2 min-h-[44px] text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c040]"
              style={{
                border: `1px solid ${GOW.blood}`,
                color: GOW.bone,
                background: `linear-gradient(180deg, ${GOW.blood}cc, ${GOW.bloodDark})`,
                boxShadow: `0 0 15px ${GOW.blood}40`,
              }}
            >
              <span className="hidden sm:inline">Nebulith</span>
              <span className="sm:hidden">Game</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Below nav and blood banner, the recruiter first screen */}
      <header className="relative z-20 pt-32 md:pt-36 pb-6 px-4 md:px-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-2xl md:text-4xl tracking-[0.2em] font-semibold uppercase mb-3"
                style={{ color: GOW.goldBright, textShadow: `0 0 30px ${GOW.gold}40, 0 2px 4px rgba(0,0,0,0.6)` }}
              >
                {name}
              </h1>
              <p
                className="text-base md:text-xl tracking-wider mb-2 font-medium"
                style={{ color: GOW.bone, textShadow: `0 2px 4px rgba(0,0,0,0.8)` }}
              >
                {headline}
              </p>
              <p
                className="text-sm md:text-base tracking-wider italic"
                style={{ color: GOW.goldBright, textShadow: `0 0 20px ${GOW.gold}50, 0 2px 4px rgba(0,0,0,0.6)` }}
              >
                {tagline}
              </p>
              <p className="text-sm mt-2" style={{ color: GOW.bone }}>{line}</p>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                <HeroActions actions={actions} />
              </div>
            </div>
          )}
        />
      </header>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="outline-none">

        {/* Profession Selector */}
        <FadeInSection>
          <section className="relative z-20 py-6 md:py-8" aria-labelledby="profession-heading">
            <h2 id="profession-heading" className="sr-only">Select Your Profession</h2>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div
                className="relative h-40 md:h-56 overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, transparent, ${GOW.voidWarm}30)`,
                  border: `1px solid ${GOW.gold}20`,
                  borderRadius: '4px',
                }}
              >
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={GOW.gold} stopOpacity="0" />
                      <stop offset="50%" stopColor={GOW.gold} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={GOW.gold} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="25%" y1="55%" x2="50%" y2="35%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="50%" y1="35%" x2="75%" y2="55%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                </svg>

                <ProfessionSwitch
                  className="absolute inset-0"
                  label="Profession selector"
                  renderOption={(option) => <WaystationNode option={option} />}
                />
              </div>
            </div>
          </section>
        </FadeInSection>

        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

      </main>

      {/* Contact CTA */}
      <section
        ref={contactTrigger.ref}
        className={`relative z-20 py-16 px-6 transition-[opacity,transform] duration-[600ms] ease-out ${
          contactTrigger.triggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
        }`}
        aria-label="Contact"
      >
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-xl tracking-[0.15em] mb-3" style={{ color: GOW.gold }}>
                  Get In Touch
                </h2>
                <p className="text-sm" style={{ color: GOW.silver }}>{line}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${MY_BUTTON} bg-transparent border-2 border-[#c9a227] text-[#c9a227]`}>
                  Download CV
                </Link>
              </div>
            </div>
          )}
        />
      </section>

      {/* Bottom obscure overlay */}
      <div
        className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-[7]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${GOW.void}40 30%, ${GOW.void}90 70%, ${GOW.void} 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center" role="contentinfo">
        <div className="inline-flex items-center gap-4" style={{ color: GOW.silver }}>
          <div className="w-12 h-px" style={{ background: GOW.gold }} aria-hidden="true" />
          <span className="text-sm tracking-[0.2em]">
            <span className="sr-only">Copyright </span>© {new Date().getFullYear()} {view.hero.name}
          </span>
          <div className="w-12 h-px" style={{ background: GOW.gold }} aria-hidden="true" />
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes ashFloat {
          0% {
            transform: translateY(0) translateX(0) translateZ(0);
            opacity: 0;
          }
          10% { opacity: var(--ash-opacity, 0.3); }
          90% { opacity: var(--ash-opacity, 0.3); }
          100% {
            transform: translateY(-100vh) translateX(var(--drift, 0px)) translateZ(0);
            opacity: 0;
          }
        }

        @keyframes emberRise {
          0% { transform: translateY(0) translateZ(0); opacity: 0.8; }
          100% { transform: translateY(-100vh) translateX(20px) translateZ(0); opacity: 0; }
        }

        @keyframes bloodDrip {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.1); }
        }

        @keyframes chainSwing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes fireFlicker {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          25% { opacity: 0.5; transform: scaleY(1.1); }
          50% { opacity: 0.4; transform: scaleY(0.95); }
          75% { opacity: 0.6; transform: scaleY(1.05); }
        }

        @keyframes omegaPulse {
          0%, 100% { filter: drop-shadow(0 0 5px ${GOW.gold}40); }
          50% { filter: drop-shadow(0 0 15px ${GOW.gold}80); }
        }

        /* Scrollbar styling for GOW theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${GOW.voidDeep};
        }
        ::-webkit-scrollbar-thumb {
          background: ${GOW.bloodDark};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${GOW.blood};
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
