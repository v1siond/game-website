'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { PORTAL } from './NeonPortals/palette'
import { ApertureLogo, CautionStripe, TestChamberBackground } from './NeonPortals/art'
import { PortalSelector } from './NeonPortals/selector'
import { HeroActions, PORTAL_BUTTON } from './NeonPortals/actions'
import { ProfessionChambers } from './NeonPortals/sections'

// Neon Portals: the page composition. Its art, cards, profession selector and per profession
// chambers live in ./NeonPortals.

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================

export default function NeonPortalsTheme() {
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: PORTAL.VOID,
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:outline-2 focus:outline-offset-2"
      >
        Skip to main content
      </a>

      {/* Background */}
      <TestChamberBackground />

      {/* ================================================================== */}
      {/* HEADER - the recruiter first screen */}
      {/* ================================================================== */}
      <header className="relative z-30 p-5" role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-5 min-w-0">
                <div className="hidden sm:block shrink-0">
                  <ApertureLogo size={50} color={PORTAL.PANEL_WHITE} spinning />
                </div>
                <div className="min-w-0">
                  <h1
                    className="text-xl md:text-2xl tracking-wide font-light uppercase"
                    style={{
                      color: PORTAL.PANEL_WHITE,
                      textShadow: `0 0 20px ${PORTAL.BLUE}30`,
                    }}
                  >
                    {name}
                  </h1>
                  <p className="text-sm mt-1" style={{ color: PORTAL.BLUE }}>{headline}</p>
                  <p className="text-sm mt-1 italic" style={{ color: PORTAL.ORANGE }}>{tagline}</p>
                  <p className="text-sm mt-1" style={{ color: PORTAL.PANEL_WHITE }}>{line}</p>
                </div>
              </div>

              <nav className="flex flex-wrap gap-2 items-center" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${PORTAL_BUTTON} border-[1.5px] border-[#00A2FF] text-[#00A2FF]`}>
                  VIEW CV
                </Link>
                <Link href="/personal-projects/game-engine" className={`${PORTAL_BUTTON} bg-[#FF9A00] text-[#1A1A1A]`}>
                  PLAY DEMO
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Portal Profession Selection */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <div className="max-w-3xl mx-auto px-5">
          {/* Selection label */}
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-3 py-1"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${PORTAL.CAUTION_YELLOW}20,
                  ${PORTAL.CAUTION_YELLOW}20 6px,
                  transparent 6px,
                  transparent 12px
                )`,
                border: `1px solid ${PORTAL.CAUTION_YELLOW}40`,
              }}
            >
              <span className="text-sm font-bold tracking-wider" style={{ color: PORTAL.CAUTION_YELLOW }}>
                SELECT TESTING PROTOCOL
              </span>
            </div>
          </div>

          {/* Portals */}
          <ProfessionSwitch
            className="flex justify-center gap-4 sm:gap-8 md:gap-16"
            label="Select profession"
            renderOption={(option) => <PortalSelector option={option} />}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT - the picked profession's chambers with the art between them */}
      {/* ================================================================== */}
      <main id="main-content" className="relative z-20">
        <div className="max-w-4xl mx-auto px-5 space-y-0">
          <ProfessionChambers sections={view.sections} />
        </div>
      </main>

      {/* ================================================================== */}
      {/* CONTACT CTA */}
      {/* ================================================================== */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-lg tracking-[0.2em] mb-3" style={{ color: PORTAL.METAL_LIGHT }}>
                  READY FOR TESTING?
                </h2>
                <p className="text-sm" style={{ color: PORTAL.METAL_LIGHT }}>{line}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${PORTAL_BUTTON} border-2 border-[#00A2FF] text-[#00A2FF]`}>
                  Get the CV
                </Link>
              </div>
            </div>
          )}
        />
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="relative z-20 py-8 text-center mt-6" role="contentinfo">
        <CautionStripe height={3} />
        <div className="flex items-center justify-center gap-4 mt-6">
          <ApertureLogo size={24} color={PORTAL.METAL_MID} />
          <div>
            <p
              className="text-[9px] tracking-[0.25em]"
              style={{ color: PORTAL.METAL_MID }}
            >
              © {new Date().getFullYear()} {view.hero.name}
            </p>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* CSS - Performance-optimized animations */}
      {/* ================================================================== */}
      <style jsx global>{`
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Aperture logo spin - uses transform only */
        @keyframes aperture-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .aperture-spin {
          animation: aperture-spin 20s linear infinite;
        }

        /* Portal glow pulse - uses opacity and filter only */
        @keyframes portal-glow {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 0.9; filter: brightness(1.2); }
        }

        .portal-glow-orange,
        .portal-glow-blue {
          animation: portal-glow 2.5s ease-in-out infinite;
        }

        /* Portal rim pulse */
        @keyframes portal-rim-pulse {
          0%, 100% { stroke-opacity: 0.8; }
          50% { stroke-opacity: 1; }
        }

        .portal-rim-pulse {
          animation: portal-rim-pulse 2s ease-in-out infinite;
        }

        /* Portal selector pulse - uses transform only */
        @keyframes portal-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .portal-pulse {
          animation: portal-pulse 2.5s ease-in-out infinite;
        }

        /* Turret eye pulse */
        @keyframes turret-eye {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .turret-eye-active {
          animation: turret-eye 0.3s ease-in-out infinite;
        }

        /* Laser flicker */
        @keyframes laser-flicker {
          0%, 100% { opacity: 0.6; }
          25% { opacity: 0.4; }
          50% { opacity: 0.8; }
          75% { opacity: 0.3; }
        }

        .laser-beam {
          animation: laser-flicker 0.1s linear infinite;
        }

        /* Companion cube subtle glow */
        @keyframes cube-glow {
          0%, 100% { filter: drop-shadow(0 0 6px ${PORTAL.CUBE_PINK}50); }
          50% { filter: drop-shadow(0 0 12px ${PORTAL.CUBE_PINK}70); }
        }

        .companion-cube {
          animation: cube-glow 3s ease-in-out infinite;
        }

        /* Screen reader utility */
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

        .sr-only:focus,
        .sr-only:active {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        /* Focus indicators for accessibility */
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid ${PORTAL.BLUE};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
