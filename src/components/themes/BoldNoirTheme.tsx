'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { BreakingChains, CardSuits, DiagonalLines, FloatingMasks, HalftoneOverlay, PaintStroke, StylishOrnaments } from './BoldNoir/backdrop'
import { SkewedPanel, TakeYourTime, skew } from './BoldNoir/panels'
import { CharacterCard } from './BoldNoir/cards'
import { CVLink, HERO_ACTION_LOOK, HeroAction, SKEW_BUTTON } from './BoldNoir/actions'
import { SECTION_VIEWS } from './BoldNoir/sections'

// Bold Noir: the page composition. Its backdrop, art breaks, panels, cards, actions and the per
// profession sections live in ./BoldNoir.

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: '"Bebas Neue", "Impact", sans-serif',
      }}
    >
      {/* Background layers - disabled when user prefers reduced motion */}
      {!prefersReducedMotion && (
        <>
          <DiagonalLines />
          <FloatingMasks />
          <StylishOrnaments profession={active} />
        </>
      )}
      <CardSuits />
      <HalftoneOverlay />
      <PaintStroke position="top" />
      <PaintStroke position="right" />
      {!prefersReducedMotion && <BreakingChains />}

      {/* Red corner accent */}
      <div
        className="fixed top-0 right-0 w-96 h-96 pointer-events-none z-[6]"
        style={{
          background: 'linear-gradient(225deg, rgba(255, 0, 51, 0.3), transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 py-6 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-6">
              <div style={{ transform: skew(prefersReducedMotion, -3) }}>
                {/* Persona 5 style name with paint splatter accent */}
                <div className="relative inline-block">
                  <h1
                    className="text-3xl md:text-5xl font-black tracking-wider uppercase relative z-10"
                    style={{
                      color: '#ff0033',
                      textShadow: '3px 3px 0 #000, 6px 6px 0 #330011',
                    }}
                  >
                    {name}
                  </h1>
                  {/* Paint splatter decoration behind name */}
                  <div
                    className="absolute -inset-4 -z-10 opacity-20"
                    style={{
                      background: `radial-gradient(ellipse at 20% 50%, #ff0033 0%, transparent 50%),
                                   radial-gradient(ellipse at 80% 30%, #ff0033 0%, transparent 40%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-base tracking-wider mt-2 font-medium" style={{ color: '#ccc' }}>
                  {headline}
                </p>
                <p className="text-sm md:text-base tracking-wider mt-1 italic" style={{ color: '#ff3355' }}>
                  {tagline}
                </p>
                <p className="text-sm tracking-wider mt-1" style={{ color: '#e0e0e0' }}>
                  {line}
                </p>
              </div>

              <nav
                className="flex gap-3 items-center flex-wrap"
                aria-label="Contact and CV"
              >
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} prefersReducedMotion={prefersReducedMotion} />
                ))}
                <CVLink prefersReducedMotion={prefersReducedMotion} />
                <Link
                  href="/personal-projects/game-engine"
                  className={SKEW_BUTTON}
                  style={{ ...HERO_ACTION_LOOK.email, transform: skew(prefersReducedMotion, -5) }}
                  aria-label="Play the game engine demo"
                >
                  <span style={{ display: 'inline-block', transform: skew(prefersReducedMotion, 5) }}>PLAY</span>
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Main content */}
      <main className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Take Your Time message - iconic Persona 5 loading screen */}
          <TakeYourTime prefersReducedMotion={prefersReducedMotion} />

          {/* Character selection - Persona 5 party member selection, System Engineer in the centre */}
          <section className="mb-12 mt-8" aria-label="Profession selection">
            <ProfessionSwitch
              className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-6"
              label="Profession"
              renderOption={(option) => <CharacterCard {...option} prefersReducedMotion={prefersReducedMotion} />}
            />
          </section>

          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} prefersReducedMotion={prefersReducedMotion} />
          </div>
        </div>
      </main>

      {/* Contact CTA - Persona 5 style */}
      <section className="relative z-20 py-16 px-4 sm:px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <SkewedPanel color="#ff0033" direction="right" delay={0}>
                <div className="py-4">
                  <h2
                    className="text-xl font-black mb-3"
                    style={{ color: '#ff0033', transform: skew(prefersReducedMotion, -3) }}
                  >
                    READY TO WORK TOGETHER?
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#ccc' }}>
                    {line}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions.map((action) => (
                      <HeroAction key={action.id} action={action} prefersReducedMotion={prefersReducedMotion} />
                    ))}
                    <CVLink prefersReducedMotion={prefersReducedMotion} />
                  </div>
                </div>
              </SkewedPanel>
            </div>
          )}
        />
      </section>

      

      {/* Footer - Persona 5 style */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-4">
          <span style={{ color: '#ff0033' }} aria-hidden="true">♠</span>
          <p
            className="text-xs tracking-widest"
            style={{
              color: '#666',
              transform: prefersReducedMotion ? 'none' : 'skewX(-3deg)',
            }}
          >
            THE PHANTOM THIEVES OF CODE
            <span aria-hidden="true"> • </span>
            <time dateTime="2026">2026</time>
          </p>
          <span style={{ color: '#ff0033' }} aria-hidden="true">♥</span>
        </div>

        {/* Phantom mask silhouette accent */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, #ff0033 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      </footer>

      {/* Animations - Persona 5 gameplay style effects */}
      <style jsx global>{`
        /* Diagonal sliding lines for background */
        @keyframes slide-diagonal {
          0% { transform: rotate(45deg) translateY(-100%); }
          100% { transform: rotate(45deg) translateY(100%); }
        }
        .animate-slide-diagonal {
          animation: slide-diagonal 3s linear infinite;
        }

        /* Floating mask animation */
        @keyframes float-mask {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) scale(var(--scale, 1)) translateY(0); }
          50% { transform: rotate(var(--rotation, 0deg)) scale(var(--scale, 1)) translateY(-10px); }
        }

        /* Speed lines - manga action effect */
        @keyframes speed-line {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-speed-line {
          animation: speed-line 2s ease-in-out infinite;
        }

        /* Floating text/ornament animation */
        @keyframes stylishFloat {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(0) translateX(0); }
          25% { transform: rotate(var(--rotation, 0deg)) translateY(-12px) translateX(8px); }
          75% { transform: rotate(var(--rotation, 0deg)) translateY(-6px) translateX(-6px); }
        }

        /* ALL OUT ATTACK flash effect */
        @keyframes attack-flash {
          0% { opacity: 0; transform: scale(0.5) skewX(-30deg); }
          30% { opacity: 1; transform: scale(1.1) skewX(-5deg); }
          70% { opacity: 1; transform: scale(1) skewX(0deg); }
          100% { opacity: 0; transform: scale(1.2) skewX(10deg); }
        }
        .animate-attack-flash { animation: attack-flash 0.8s ease-out forwards; }

        /* Paint splatter pulse */
        @keyframes splatter-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }

        /* Cut-in slide animation */
        @keyframes cut-in-slide {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { transform: translateX(5%) skewX(-5deg); opacity: 1; }
          100% { transform: translateX(0) skewX(0deg); opacity: 1; }
        }

        /* Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Respect user's reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-diagonal,
          .animate-speed-line,
          .animate-attack-flash,
          .animate-pulse {
            animation: none !important;
          }

          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid #ff0033;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
