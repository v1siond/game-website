'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { BORDERLANDS_COLORS } from './CellShaded/palette'
import {
  ClaptrapSilhouette,
  DamageNumber,
  ExplosionBurst,
  GraffitiDrip,
  GunSilhouette,
  HalftoneBackground,
  InkSplatter,
  PsychoMask,
  VaultSymbol,
  WastelandTexture,
} from './CellShaded/backdrop'
import { ComicPanel } from './CellShaded/panels'
import { VaultHunterCard } from './CellShaded/cards'
import { COMIC_BUTTON, HeroActions } from './CellShaded/actions'
import { SECTION_VIEWS } from './CellShaded/sections'

// Cell Shaded: the page composition. Its palette, backdrop, separators, panels, cards, actions and per
// profession sections live in ./CellShaded.

export default function CellShadedTheme() {
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
        background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.sand} 0%, ${BORDERLANDS_COLORS.paper} 40%, ${BORDERLANDS_COLORS.panderanDust} 100%)`,
        fontFamily: '"Bangers", "Impact", sans-serif',
      }}
    >
      {/* SVG Filter for hand-drawn sketch effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="borderlands-sketch">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>
      </svg>

      {/* Background layers */}
      <HalftoneBackground />
      <WastelandTexture />

      {/* Decorative elements - all aria-hidden in their components */}
      <InkSplatter x={5} y={10} size={40} rotation={45} />
      <InkSplatter x={92} y={15} size={25} color={BORDERLANDS_COLORS.legendary} rotation={120} />
      <InkSplatter x={88} y={75} size={35} rotation={200} />
      <InkSplatter x={3} y={60} size={20} color={BORDERLANDS_COLORS.rare} rotation={75} />

      <GunSilhouette x={-2} y={20} rotation={15} />
      <GunSilhouette x={85} y={85} rotation={-25} flip />

      <VaultSymbol x={92} y={40} size={80} />
      <VaultSymbol x={5} y={80} size={60} />

      <ClaptrapSilhouette x={88} y={60} reducedMotion={reducedMotion} />

      {/* Psycho masks in background */}
      <PsychoMask x={2} y={35} size={50} rotation={-10} />
      <PsychoMask x={90} y={75} size={40} rotation={15} />

      {/* Graffiti drips */}
      <GraffitiDrip x={10} y={5} color={BORDERLANDS_COLORS.legendary} height={60} />
      <GraffitiDrip x={85} y={8} color={BORDERLANDS_COLORS.psychoRed} height={45} />
      <GraffitiDrip x={95} y={50} color={BORDERLANDS_COLORS.eridium} height={35} />

      <DamageNumber x={15} y={25} value="9999" color={BORDERLANDS_COLORS.legendary} reducedMotion={reducedMotion} />
      <DamageNumber x={80} y={30} value="CRIT" color={BORDERLANDS_COLORS.psychoRed} reducedMotion={reducedMotion} />
      <DamageNumber x={70} y={70} value="1337" color={BORDERLANDS_COLORS.rare} reducedMotion={reducedMotion} />

      <ExplosionBurst x={8} y={45} text="POW!" />
      <ExplosionBurst x={95} y={20} text="BOOM!" />


      {/* Header - the recruiter first screen */}
      <header className="relative z-30 p-4 sm:p-6" role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-4">
              <div className="min-w-0" style={{ transform: 'rotate(-2deg)' }}>
                <h1
                  className="text-3xl sm:text-5xl tracking-wider uppercase"
                  style={{
                    color: BORDERLANDS_COLORS.ink,
                    textShadow: `4px 4px 0 ${BORDERLANDS_COLORS.legendary}, 8px 8px 0 ${BORDERLANDS_COLORS.ink}`,
                    WebkitTextStroke: `1px ${BORDERLANDS_COLORS.ink}`,
                  }}
                >
                  {name}
                </h1>
                <p className="text-base tracking-wide mt-2 font-bold" style={{ color: BORDERLANDS_COLORS.ink }}>
                  {headline}
                </p>
                <q className="block text-sm tracking-wider mt-1 italic font-bold text-[#1a1a1a]">{tagline}</q>
                <p className="text-sm mt-1 font-bold font-sans text-[#1a1a1a]">{line}</p>
              </div>

              <nav className="flex flex-wrap gap-3 items-center" aria-label="Contact and CV">
                <HeroActions actions={actions} reducedMotion={reducedMotion} />
                <Link
                  href="/cv"
                  className={`${COMIC_BUTTON} bg-white text-[#1a1a1a] ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:-rotate-2'}`}
                >
                  Resume
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className={`${COMIC_BUTTON} bg-gradient-to-br from-[#ff9500] to-[#d4763d] text-white [text-shadow:2px_2px_0_#1a1a1a] ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:rotate-2'}`}
                >
                  PLAY!
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Character selection */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <div className="text-center mb-4">
          <h2
            className="text-lg tracking-widest"
            style={{
              color: BORDERLANDS_COLORS.ink,
              textShadow: `2px 2px 0 ${BORDERLANDS_COLORS.clapTrapYellow}`,
            }}
          >
            SELECT YOUR VAULT HUNTER
          </h2>
        </div>
        <ProfessionSwitch
          className="flex justify-center gap-3 sm:gap-8 px-4"
          label="Profession selector"
          renderOption={(option) => <VaultHunterCard option={option} reducedMotion={reducedMotion} />}
        />
      </section>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} reducedMotion={reducedMotion} />
        </div>
      </main>

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <ComicPanel rotation={0} accentColor={BORDERLANDS_COLORS.legendary} title="GET IN TOUCH" ariaLabel="Contact section">
            <RecruiterHero
              render={({ line, actions }) => (
                <div className="py-4 mt-4">
                  <h2
                    className="text-xl font-black mb-3"
                    style={{
                      color: BORDERLANDS_COLORS.ink,
                      textShadow: `2px 2px 0 ${BORDERLANDS_COLORS.legendary}`,
                    }}
                  >
                    READY TO TEAM UP?
                  </h2>
                  <p className="text-sm mb-6 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>{line}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <HeroActions actions={actions} reducedMotion={reducedMotion} />
                    <Link
                      href="/cv"
                      className={`${COMIC_BUTTON} bg-white text-[#1a1a1a] ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:-rotate-2'}`}
                    >
                      GET THE CV
                    </Link>
                  </div>
                </div>
              )}
            />
          </ComicPanel>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div
          className="inline-block px-8 py-3 relative"
          style={{
            background: BORDERLANDS_COLORS.ink,
            border: `4px solid ${BORDERLANDS_COLORS.clapTrapYellow}`,
            boxShadow: `4px 4px 0 ${BORDERLANDS_COLORS.legendary}`,
          }}
        >
          {/* Cel-shading top edge */}
          <div
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
            aria-hidden="true"
            style={{ background: `linear-gradient(90deg, ${BORDERLANDS_COLORS.clapTrapYellow}40 0%, transparent 50%)` }}
          />

          <p
            className="text-sm tracking-widest font-black"
            style={{ color: BORDERLANDS_COLORS.clapTrapYellow }}
          >
            CATCH-A-RIIIIDE!
          </p>
          <p className="text-xs mt-1" style={{ color: BORDERLANDS_COLORS.paper }}>
            PANDORA | 2026
          </p>
        </div>
      </footer>

      {/* Animations - respects prefers-reduced-motion via the reducedMotion variable */}
      <style jsx global>{`
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          25% { opacity: 0.9; transform: translateY(-8px) scale(1.1); }
          50% { opacity: 0.7; transform: translateY(-15px) scale(1); }
          75% { opacity: 0.4; transform: translateY(-20px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-25px) scale(0.8); }
        }
        .animate-damage-float {
          animation: damage-float 4s ease-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-damage-float {
            animation: none;
          }
          .animate-pulse {
            animation: none;
          }
        }

        /* Borderlands-style focus indicator */
        *:focus-visible {
          outline: 4px solid ${BORDERLANDS_COLORS.clapTrapYellow};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
