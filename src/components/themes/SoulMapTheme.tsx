'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './SoulMap/palette'
import { Bonfire, Darksign, EstusFlask, PraiseTheSun } from './SoulMap/art'
import { Bloodstain, EmberOrnaments, HollowKnight, MapFog, SoulsCounter, StoneTexture } from './SoulMap/backdrop'
import { FogGate } from './SoulMap/breaks'
import { MiniMap, ZoneNode } from './SoulMap/selector'
import { HeroActions, SM_BUTTON } from './SoulMap/actions'
import { SECTION_VIEWS } from './SoulMap/sections'

// Soul Map: the page composition. Its palette, art, backdrop, panels, cards, selector, actions and the
// per profession sections live in ./SoulMap.

export default function SoulMapTheme() {
  const view = useWorldView()
  const active = view.profession
  const [mounted, setMounted] = useState(false)
  const [explored, setExplored] = useState<ReadonlySet<Profession>>(new Set([active]))
  const [souls, setSouls] = useState(125890)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    // Increment souls slowly for effect
    const interval = setInterval(() => {
      setSouls(s => s + Math.floor(Math.random() * 10))
    }, 3000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  // A zone counts as explored once its profession has been picked.
  useEffect(() => {
    setExplored((seen) => (seen.has(active) ? seen : new Set([...seen, active])))
  }, [active])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0a0808, #050505)`,
        fontFamily: '"Cinzel", "Times New Roman", serif',
      }}
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
        style={{ background: COLORS.bonfire, color: '#000' }}
      >
        Skip to main content
      </a>

      {/* Stone texture overlay */}
      <StoneTexture />

      {/* Map effects */}
      <MapFog />

      {/* Profession ornaments */}
      <EmberOrnaments profession={active} />

      {/* Souls counter */}
      <SoulsCounter count={souls} />

      {/* Scattered bloodstains */}
      <Bloodstain className="fixed top-32 left-[10%] z-[1]" />
      <Bloodstain className="fixed top-[60%] right-[15%] z-[1] rotate-45" />
      <Bloodstain className="fixed bottom-40 left-[30%] z-[1] -rotate-12" />

      {/* Hollow knight silhouettes */}
      <HollowKnight variant="standing" className="fixed top-[20%] left-[5%] z-[1]" />
      <HollowKnight variant="kneeling" className="fixed bottom-[30%] right-[8%] z-[1]" />
      <HollowKnight variant="combat" className="fixed top-[45%] right-[3%] z-[1]" />

      {/* Header with Darksign, the recruiter first screen */}
      <header className="relative z-30 p-6" role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Darksign size={50} />
                <div className="min-w-0">
                  <h1
                    className="text-2xl sm:text-3xl tracking-[0.3em] uppercase"
                    style={{ color: '#c0a060', textShadow: `0 0 30px ${COLORS.bonfire}30` }}
                  >
                    {name}
                  </h1>
                  <p className="text-sm mt-1 tracking-wider" style={{ color: '#b0a080' }}>
                    {headline}
                  </p>
                  <p className="text-sm mt-1 italic tracking-wide" style={{ color: COLORS.ember }}>
                    {tagline}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#c0b0a0' }}>{line}</p>
                </div>
              </div>

              <nav className="flex flex-wrap gap-3 items-center" aria-label="Contact and CV">
                <EstusFlask charges={5} maxCharges={5} />
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${SM_BUTTON} bg-[#252321] border border-[#ff6a00]/40 text-[#ff8c42] hover:bg-[#1a1815]`}>
                  Resume
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className={`${SM_BUTTON} bg-gradient-to-b from-[#ff6a00] to-[#cc6600] text-[#0a0808]`}
                >
                  Explore
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Fog Gate divider */}
      <FogGate />

      {/* Map navigation with bonfire */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <div className="flex justify-center mb-12">
          <Bonfire size="normal" label="Central bonfire, hub area" />
        </div>
        <ProfessionSwitch
          className="flex flex-wrap justify-center items-center gap-12 px-4"
          label="Profession selector"
          renderOption={(option) => <ZoneNode option={option} isExplored={explored.has(option.id)} />}
        />

        {/* Praise the Sun decoration */}
        <div className="flex justify-center mt-12">
          <PraiseTheSun size={60} />
        </div>
      </section>

      {/* Fog Gate divider */}
      <FogGate />

      {/* Zone info */}
      <main id="main-content" className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      {/* Mini-map */}
      <MiniMap active={active} />

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-sm tracking-[0.4em] mb-3 uppercase" style={{ color: COLORS.bonfire }}>
                  Get In Touch
                </h2>
                <p className="text-sm tracking-wide" style={{ color: '#b0a090' }}>{line}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${SM_BUTTON} bg-[#252321] border border-[#ff6a00]/40 text-[#ff8c42] hover:bg-[#1a1815]`}>
                  Download CV
                </Link>
              </div>
            </div>
          )}
        />
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.ash})` }} aria-hidden="true" />
          <Bonfire size="small" label="Footer bonfire" />
          <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${COLORS.ash}, transparent)` }} aria-hidden="true" />
        </div>
        <p className="text-sm tracking-[0.4em] mt-4" style={{ color: '#888070' }}>
          EXPLORATION: {Math.round((explored.size / 3) * 100)}% • MMXXVI
        </p>
      </footer>

      {/* Dark Souls animations - with prefers-reduced-motion support */}
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes flame {
            0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
            50% { transform: scaleY(1.3) scaleX(0.85); opacity: 0.85; }
          }
          @keyframes ember {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            100% { transform: translateY(-50px) translateX(15px); opacity: 0; }
          }
          @keyframes soul-float {
            0% { transform: translate(-50%, -50%) translateY(0); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translateY(-35px) rotate(360deg); opacity: 0; }
          }
          @keyframes fog-drift {
            0%, 100% { transform: translateX(-15%); opacity: 0.4; }
            50% { transform: translateX(15%); opacity: 0.7; }
          }
          @keyframes fog-particle {
            0%, 100% { transform: translateX(0) scale(1); opacity: 0.25; }
            50% { transform: translateX(25px) scale(1.3); opacity: 0.45; }
          }
          @keyframes ash-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes darksign-pulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.08); filter: brightness(1.25); }
          }
          @keyframes liquid-glow {
            0%, 100% { box-shadow: 0 0 12px ${COLORS.bonfire}, inset 0 0 12px ${COLORS.gold}80; }
            50% { box-shadow: 0 0 25px ${COLORS.ember}, inset 0 0 18px ${COLORS.gold}; }
          }
          @keyframes you-died {
            0% { opacity: 0; transform: scale(1.6); }
            20% { opacity: 1; transform: scale(1); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.85); }
          }
          @keyframes emberFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
            25% { transform: translateY(-10px) rotate(6deg); opacity: 0.5; }
            50% { transform: translateY(-4px) rotate(-4deg); opacity: 0.35; }
            75% { transform: translateY(-12px) rotate(4deg); opacity: 0.45; }
          }
          @keyframes sun-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes section-ember {
            0% { transform: translateY(0) translateX(0); opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-60px) translateX(10px); opacity: 0; }
          }
          @keyframes bonfire-ember {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-80px) translateX(20px) scale(0.5); opacity: 0; }
          }
          @keyframes fog-gate-drift {
            0%, 100% { transform: translateX(-10%) scale(1); opacity: 0.5; }
            50% { transform: translateX(10%) scale(1.05); opacity: 0.8; }
          }
          @keyframes ethereal-particle {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
            25% { transform: translateY(-10px) translateX(5px) scale(1.2); opacity: 0.6; }
            50% { transform: translateY(-5px) translateX(-5px) scale(0.9); opacity: 0.4; }
            75% { transform: translateY(-15px) translateX(3px) scale(1.1); opacity: 0.5; }
          }
          @keyframes sun-glow {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
            50% { transform: translateX(-50%) scale(1.15); opacity: 1; }
          }
          .animate-flame { animation: flame 0.25s ease-in-out infinite; }
          .animate-bonfire-ember { animation: bonfire-ember 2.5s ease-out infinite; }
          .animate-fog-gate-drift { animation: fog-gate-drift 10s ease-in-out infinite; }
          .animate-ethereal-particle { animation: ethereal-particle 6s ease-in-out infinite; }
          .animate-sun-glow { animation: sun-glow 4s ease-in-out infinite; }
          .animate-ember-float { animation: emberFloat 12s ease-in-out infinite; }
          .animate-ember { animation: ember 2.5s ease-out infinite; }
          .animate-soul-float { animation: soul-float 2.5s ease-out infinite; }
          .animate-fog-drift { animation: fog-drift 12s ease-in-out infinite; }
          .animate-fog-particle { animation: fog-particle 10s ease-in-out infinite; }
          .animate-ash-fall { animation: ash-fall 18s linear infinite; }
          .animate-darksign-pulse { animation: darksign-pulse 3.5s ease-in-out infinite; }
          .animate-liquid-glow { animation: liquid-glow 2.5s ease-in-out infinite; }
          .animate-you-died { animation: you-died 4.5s ease-in-out forwards; }
          .animate-sun-pulse { animation: sun-pulse 4s ease-in-out infinite; }
          .animate-section-ember { animation: section-ember 3s ease-out infinite; }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-flame,
          .animate-ember-float,
          .animate-ember,
          .animate-soul-float,
          .animate-fog-drift,
          .animate-fog-particle,
          .animate-ash-fall,
          .animate-darksign-pulse,
          .animate-liquid-glow,
          .animate-you-died,
          .animate-sun-pulse,
          .animate-section-ember,
          .animate-bonfire-ember,
          .animate-fog-gate-drift,
          .animate-ethereal-particle,
          .animate-sun-glow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
