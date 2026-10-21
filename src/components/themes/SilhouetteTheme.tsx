'use client'

import Link from 'next/link'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { LIMBO } from './Silhouette/palette'
import { LimboAtmosphere } from './Silhouette/backdrop'
import { LimboCard, SectionHeader } from './Silhouette/cards'
import { SilhouetteFigure } from './Silhouette/selector'
import { HeroActions, LIMBO_BUTTON } from './Silhouette/actions'
import { SECTION_VIEWS } from './Silhouette/sections'

// Silhouette: the page composition. Its palette, backdrop and art, cards, profession figures, buttons
// and per profession sections live in ./Silhouette.

// =============================================================================
// MAIN THEME COMPONENT
// Layout: Header -> Profession figures -> the profession's sections with the limbo art between them
// -> Posts -> Contact
// =============================================================================

export default function SilhouetteTheme() {
  const view = useWorldView()

  return (
    <div
      className="min-h-screen relative"
      style={{
        // DARK like actual Limbo - almost pure black with slight gradient
        background: `linear-gradient(180deg, ${LIMBO.darkGrey1} 0%, ${LIMBO.voidBlack} 30%, ${LIMBO.voidBlack} 70%, ${LIMBO.darkGrey1} 100%)`,
        fontFamily: '"Courier New", Consolas, monospace',
        overflowX: 'hidden',
      }}
    >
      {/* Limbo atmospheric effects */}
      <LimboAtmosphere />

      {/* ========== HEADER - the recruiter first screen ========== */}
      <header className="relative z-30 p-6" role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-start gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] font-normal uppercase" style={{ color: LIMBO.fogWhite2 }}>
                  {name}
                </h1>
                <p className="text-sm tracking-[0.2em] mt-2" style={{ color: LIMBO.fogWhite1 }}>{headline}</p>
                <p className="text-sm tracking-wider mt-1 italic text-[#AAAAAA]">{tagline}</p>
                <p className="text-sm tracking-wider mt-2 text-[#CCCCCC]">{line}</p>
              </div>

              <nav className="flex flex-wrap gap-3 items-center" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${LIMBO_BUTTON} border-2 border-[#CCCCCC] text-[#CCCCCC] hover:bg-white hover:text-black`}>
                  resume
                </Link>
                <Link href="/personal-projects/game-engine" className={`${LIMBO_BUTTON} bg-[#CCCCCC] text-black hover:opacity-80`}>
                  enter
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Profession Selection */}
      <section className="relative z-20 py-8" aria-label="Select profession view">
        <ProfessionSwitch
          className="flex justify-center gap-8 sm:gap-14"
          label="Select profession view"
          renderOption={(option) => <SilhouetteFigure key={option.id} option={option} />}
        />
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <main className="relative z-20" role="main">
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

        {/* ========== POSTS ========== */}
        <section className="px-6 py-8" aria-label="Posts">
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="posts" />
            <LimboCard>
              <div className="text-center py-6">
                <p className="text-sm" style={{ color: LIMBO.lightGrey2 }}>
                  Writings and thoughts coming soon...
                </p>
                <p className="text-xs mt-2 italic" style={{ color: LIMBO.lightGrey1 }}>
                  [ emerging from the void ]
                </p>
              </div>
            </LimboCard>
          </div>
        </section>

      </main>

      {/* ========== CONTACT CTA ========== */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-xl tracking-[0.3em] font-normal mb-3" style={{ color: LIMBO.fogWhite2 }}>
                  READY TO WORK TOGETHER?
                </h2>
                <p className="text-sm" style={{ color: LIMBO.lightGrey2 }}>{line}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${LIMBO_BUTTON} border-2 border-[#CCCCCC] text-[#CCCCCC] hover:bg-white hover:text-black`}>
                  Get the CV
                </Link>
              </div>
            </div>
          )}
        />
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-10 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
          <div className="w-6 h-px" style={{ background: `${LIMBO.midGrey1}` }} />
          <p className="text-xs tracking-[0.5em]" style={{ color: LIMBO.lightGrey1 }}>. . .</p>
          <div className="w-6 h-px" style={{ background: `${LIMBO.midGrey1}` }} />
        </div>
        <p className="text-xs" style={{ color: LIMBO.midGrey2 }}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>

      {/* =================================================================
          LIMBO CSS - OPTIMIZED FOR PERFORMANCE
          Only essential animations, using CSS transforms only (GPU accelerated)
          ================================================================= */}
      <style jsx global>{`
        /* ============ FOG DRIFT - Multiple layers ============ */
        @keyframes fog-drift-slow {
          0% { transform: translateX(-15%); }
          100% { transform: translateX(15%); }
        }
        .fog-drift-slow {
          animation: fog-drift-slow 90s ease-in-out infinite alternate;
        }

        @keyframes fog-drift-fast {
          0% { transform: translateX(10%); }
          100% { transform: translateX(-10%); }
        }
        .fog-drift-fast {
          animation: fog-drift-fast 60s ease-in-out infinite alternate;
        }

        @keyframes fog-rise {
          0% { transform: translateY(5%); opacity: 0.25; }
          50% { transform: translateY(-3%); opacity: 0.4; }
          100% { transform: translateY(5%); opacity: 0.25; }
        }
        .fog-rise {
          animation: fog-rise 40s ease-in-out infinite;
        }

        /* ============ FLOATING PARTICLES ============ */
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: ${LIMBO.lightGrey1};
          border-radius: 50%;
          opacity: 0;
        }
        @keyframes particle-float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .particle-1 { animation: particle-float 25s linear infinite; animation-delay: 0s; }
        .particle-2 { animation: particle-float 30s linear infinite; animation-delay: 4s; }
        .particle-3 { animation: particle-float 28s linear infinite; animation-delay: 8s; }
        .particle-4 { animation: particle-float 32s linear infinite; animation-delay: 12s; }
        .particle-5 { animation: particle-float 26s linear infinite; animation-delay: 2s; }
        .particle-6 { animation: particle-float 35s linear infinite; animation-delay: 6s; }
        .particle-7 { animation: particle-float 22s linear infinite; animation-delay: 10s; }
        .particle-8 { animation: particle-float 29s linear infinite; animation-delay: 14s; }

        /* ============ FILM GRAIN ============ */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-0.5%, 0.5%); }
          50% { transform: translate(0.5%, -0.5%); }
          75% { transform: translate(-0.5%, -0.5%); }
        }
        .grain {
          animation: grain 0.4s steps(4) infinite;
        }

        /* ============ SPIDER BREATHING - Subtle ============ */
        @keyframes spider-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .spider-breathe {
          animation: spider-breathe 4s ease-in-out infinite;
        }

        /* ============ GEAR ROTATIONS ============ */
        @keyframes gear-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gear-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .gear-rotate-slow {
          animation: gear-rotate 60s linear infinite;
        }
        .gear-rotate-medium {
          animation: gear-rotate-reverse 40s linear infinite;
        }

        /* ============ FIGURE EYE GLOW - For profession selector ============ */
        @keyframes figure-eye-glow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        .figure-eye {
          animation: figure-eye-glow 2s ease-in-out infinite;
        }

        /* ============ BUTTON EFFECTS ============ */
        .limbo-btn {
          position: relative;
          overflow: visible;
        }
        .limbo-btn::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 100%;
          height: 100%;
          background: ${LIMBO.midGrey1};
          z-index: -1;
          transition: transform 0.15s ease;
          transform: translate(0, 0);
        }
        .limbo-btn:hover::after {
          transform: translate(2px, 2px);
        }
        .limbo-btn:hover {
          transform: translate(-1px, -1px);
        }
        .limbo-btn:active::after {
          transform: translate(-2px, -2px);
        }
        .limbo-btn:active {
          transform: translate(1px, 1px);
        }

        /* ============ ACCESSIBILITY - REDUCED MOTION ============ */
        @media (prefers-reduced-motion: reduce) {
          .fog-drift-slow,
          .fog-drift-fast,
          .fog-rise,
          .grain,
          .spider-breathe,
          .gear-rotate-slow,
          .gear-rotate-medium,
          .figure-eye,
          .particle,
          .particle-1, .particle-2, .particle-3, .particle-4,
          .particle-5, .particle-6, .particle-7, .particle-8 {
            animation: none !important;
          }
          .limbo-btn::after {
            transition: none !important;
          }
          .limbo-btn:hover,
          .limbo-btn:active {
            transform: none !important;
          }
          .limbo-btn:hover::after,
          .limbo-btn:active::after {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
