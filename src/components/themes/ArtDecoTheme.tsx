'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { RAPTURE_COLORS } from './ArtDeco/palette'
import { useReducedMotion } from './ArtDeco/motion'
import {
  BigDaddySilhouette,
  DecoPatternBackground,
  LighthouseBeacon,
  LittleSisterSilhouette,
  RaptureSVGDefs,
  SplicerMasks,
  UnderwaterBubbles,
  UnderwaterRays,
  WaterCaustics,
} from './ArtDeco/backdrop'
import { GoldFrame, NeonSign } from './ArtDeco/frames'
import { PlasmidButton } from './ArtDeco/plasmids'
import { CVLink, DECO_BUTTON, HERO_ACTION_LOOK, HeroAction } from './ArtDeco/actions'
import { ProfessionDetails } from './ArtDeco/sections'

// Art Deco, BioShock's Rapture: the page composition. Its palette, backdrop, frames, cards, plasmid
// switch and per profession sections live in ./ArtDeco.

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ArtDecoTheme() {
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
        background: `linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}, ${RAPTURE_COLORS.deepSea}, ${RAPTURE_COLORS.abyss})`,
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      {/* SVG Definitions */}
      <RaptureSVGDefs />

      {/* Background Effects */}
      <DecoPatternBackground />
      <UnderwaterRays reducedMotion={reducedMotion} />
      <WaterCaustics reducedMotion={reducedMotion} />
      <UnderwaterBubbles reducedMotion={reducedMotion} />
      <SplicerMasks reducedMotion={reducedMotion} />
      <LighthouseBeacon reducedMotion={reducedMotion} />
      <BigDaddySilhouette reducedMotion={reducedMotion} />
      <LittleSisterSilhouette reducedMotion={reducedMotion} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: `radial-gradient(circle at 50% 25%, transparent 25%, ${RAPTURE_COLORS.abyss}90 100%)`,
        }}
        aria-hidden="true"
      />

      {/* ================================================================== */}
      {/* HEADER - the recruiter first screen */}
      {/* ================================================================== */}
      <header className="relative z-30 px-4 py-6 sm:p-6 sm:pt-20 sm:pb-10">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-6">
              <div className="flex items-center gap-5">
                {/* Art Deco Sunburst Logo */}
                <div className="relative w-20 h-20 pointer-events-none flex-shrink-0 hidden sm:block" aria-hidden="true">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-0.5"
                      style={{
                        height: '45px',
                        background: `linear-gradient(to top, ${RAPTURE_COLORS.gold}, transparent)`,
                        transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                        transformOrigin: 'bottom center',
                        opacity: i % 2 === 0 ? 0.5 : 0.3,
                      }}
                    />
                  ))}
                  <div
                    className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: `radial-gradient(circle, ${RAPTURE_COLORS.goldBright}60, ${RAPTURE_COLORS.gold}30)`,
                      border: `2px solid ${RAPTURE_COLORS.gold}`,
                    }}
                  />
                </div>
                <div>
                  <h1
                    className="text-2xl sm:text-4xl tracking-[0.2em] uppercase"
                    style={{ textShadow: `0 0 50px ${RAPTURE_COLORS.gold}70` }}
                  >
                    <NeonSign text={name} reducedMotion={reducedMotion} />
                  </h1>
                  <p className="text-base tracking-wider mt-2" style={{ color: RAPTURE_COLORS.parchment }}>
                    {headline}
                  </p>
                  <p className="text-sm tracking-wider mt-1 italic" style={{ color: RAPTURE_COLORS.gold }}>
                    {tagline}
                  </p>
                  <p className="text-sm tracking-wider mt-1" style={{ color: RAPTURE_COLORS.warmWhite }}>
                    {line}
                  </p>
                </div>
              </div>

              <nav className="flex gap-3 sm:gap-4 items-center flex-wrap" aria-label="Contact and CV">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} reducedMotion={reducedMotion} />
                ))}
                <CVLink reducedMotion={reducedMotion} />
                <Link
                  href="/personal-projects/game-engine"
                  className={`${DECO_BUTTON} ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
                  style={HERO_ACTION_LOOK.linkedin}
                >
                  PORTFOLIO
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* ================================================================== */}
      {/* PLASMID SELECTION - Profession Switcher, System Engineer in the centre */}
      {/* ================================================================== */}
      <section className="relative z-20 py-8 px-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-8"
          label="Profession"
          renderOption={(option) => <PlasmidButton {...option} reducedMotion={reducedMotion} />}
        />
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT - the picked profession's sections, and only those */}
      {/* ================================================================== */}
      <main className="relative z-20 px-4 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-0" role="region" aria-label={`${active} profession details`}>
          <ProfessionDetails sections={view.sections} reducedMotion={reducedMotion} />

          <div className="pt-8">
            <GoldFrame title="POSTS" reducedMotion={reducedMotion}>
              <div className="text-center py-8">
                <p className="text-base italic" style={{ color: RAPTURE_COLORS.warmWhite }}>
                  Coming soon... transmissions from the deep.
                </p>
              </div>
            </GoldFrame>
          </div>
        </div>
      </main>

      {/* ================================================================== */}
      {/* CONTACT CTA */}
      {/* ================================================================== */}
      <section className="relative z-20 py-16 px-4 sm:px-8" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <GoldFrame reducedMotion={reducedMotion}>
                <h2 className="mb-6">
                  <NeonSign
                    text="READY TO WORK TOGETHER?"
                    className="text-lg tracking-[0.25em]"
                    reducedMotion={reducedMotion}
                  />
                </h2>
                <p className="text-sm mb-8" style={{ color: RAPTURE_COLORS.parchment }}>
                  {line}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} reducedMotion={reducedMotion} />
                  ))}
                  <CVLink reducedMotion={reducedMotion} />
                </div>
              </GoldFrame>
            </div>
          )}
        />
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="relative z-20 py-12 text-center">
        <div
          className="inline-block px-10 py-3"
          style={{ border: `1px solid ${RAPTURE_COLORS.gold}50` }}
        >
          <p className="text-sm tracking-[0.4em]" style={{ color: RAPTURE_COLORS.gold }}>
            NO GODS OR KINGS - ONLY MAN - MCMXXVI
          </p>
        </div>
        {/* Lighthouse icon */}
        <div className="mt-6 flex justify-center" aria-hidden="true">
          <svg width="50" height="80" viewBox="0 0 50 80" opacity="0.25">
            <path d="M18 80 L13 45 L37 45 L32 80" fill={RAPTURE_COLORS.gold} />
            <path d="M15 65 L35 65" stroke={RAPTURE_COLORS.bronzeDark} strokeWidth="2" />
            <rect x="10" y="25" width="30" height="20" fill={RAPTURE_COLORS.gold} />
            <path d="M8 25 L25 10 L42 25" fill={RAPTURE_COLORS.gold} />
            <circle cx="25" cy="35" r="8" fill={RAPTURE_COLORS.goldBright} opacity="0.8" />
            <path d="M25 27 L25 12 M17 30 L5 25 M33 30 L45 25" stroke={RAPTURE_COLORS.goldBright} strokeWidth="1.5" opacity="0.6" />
          </svg>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* ANIMATIONS */}
      {/* ================================================================== */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        @keyframes light-ray {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.12; }
        }
        .animate-light-ray {
          animation: light-ray ease-in-out infinite;
        }

        @keyframes bubble-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-110vh) translateX(var(--wobble, 25px));
            opacity: 0;
          }
        }
        .animate-bubble-rise {
          animation: bubble-rise linear infinite;
        }

        @keyframes caustics-1 {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.15;
          }
          33% {
            transform: scale(1.08) translate(4%, -2%);
            opacity: 0.22;
          }
          66% {
            transform: scale(0.96) translate(-2%, 3%);
            opacity: 0.12;
          }
        }
        .animate-caustics-1 {
          animation: caustics-1 18s ease-in-out infinite;
        }

        @keyframes caustics-2 {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.12;
          }
          50% {
            transform: scale(1.12) translate(-4%, 4%);
            opacity: 0.2;
          }
        }
        .animate-caustics-2 {
          animation: caustics-2 14s ease-in-out infinite;
          animation-delay: -7s;
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg));
          }
        }
        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        @keyframes card-caustics {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translate(3%, -2%) scale(1.03);
            opacity: 0.15;
          }
          50% {
            transform: translate(-2%, 2%) scale(0.97);
            opacity: 0.07;
          }
          75% {
            transform: translate(1%, 1%) scale(1.02);
            opacity: 0.12;
          }
        }
        .animate-card-caustics {
          animation: card-caustics 15s ease-in-out infinite;
        }

        @keyframes bubble-gentle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          33% {
            transform: translateY(-4px) translateX(2px);
            opacity: 0.6;
          }
          66% {
            transform: translateY(-2px) translateX(-1px);
            opacity: 0.4;
          }
        }
        .animate-bubble-gentle {
          animation: bubble-gentle 8s ease-in-out infinite;
        }

        @keyframes beacon-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-beacon-pulse {
          animation: beacon-pulse 2s ease-in-out infinite;
        }

        @keyframes beacon-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-beacon-rotate {
          animation: beacon-rotate 10s linear infinite;
        }

        @keyframes drill-idle {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(2px) rotate(1deg);
          }
        }
        .animate-drill-idle {
          animation: drill-idle 3s ease-in-out infinite;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  )
}
