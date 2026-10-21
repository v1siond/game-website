'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { RE } from './SurvivalHorror/palette'
import {
  BiohazardSymbol,
  BloodDrip,
  BloodSplatter,
  CrackedGlassOverlay,
  CreepingShadows,
  DangerTape,
  FogAtmosphere,
  MansionDoorFrame,
  SepiaVignette,
  VictorianWallpaper,
  WallSconce,
  WarmLightSource,
  WarningSign,
  ZombieSilhouettes,
} from './SurvivalHorror/backdrop'
import { HerbIcon, InkRibbon, TypewriterSavePoint, TypewriterText } from './SurvivalHorror/art'
import { InventorySlot } from './SurvivalHorror/selector'
import { HeroActions, SH_BUTTON } from './SurvivalHorror/actions'
import { SECTION_VIEWS } from './SurvivalHorror/sections'

// Survival Horror: the page composition. Its palette, backdrop layers, art, inventory slots, cards,
// panels and sections live in ./SurvivalHorror.

export default function SurvivalHorrorTheme() {
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${RE.void} 0%, ${RE.darkSepia} 20%, ${RE.sepia} 50%, ${RE.darkSepia} 80%, ${RE.void} 100%)`,
        fontFamily: '"Times New Roman", "Georgia", serif',
      }}
    >
      {/* Victorian wallpaper pattern overlay */}
      <VictorianWallpaper />

      {/* Fog/mist atmosphere */}
      <FogAtmosphere />

      {/* Mansion door frame molding */}
      <MansionDoorFrame />

      {/* Blood splatters on corners */}
      <BloodSplatter position="top-left" size={120} rotation={0} />
      <BloodSplatter position="top-right" size={100} rotation={90} />
      <BloodSplatter position="bottom-left" size={90} rotation={-45} />
      <BloodSplatter position="bottom-right" size={110} rotation={180} />

      {/* Zombie silhouettes in background */}
      <ZombieSilhouettes />

      {/* Dripping blood effects */}
      <BloodDrip side="left" delay={0} />
      <BloodDrip side="right" delay={2} />

      {/* Biohazard symbols - Umbrella Corp feel */}
      <BiohazardSymbol className="fixed top-40 right-8" />
      <BiohazardSymbol className="fixed bottom-48 left-12" />

      {/* Danger tape strips */}
      <DangerTape position="top" />
      <DangerTape position="bottom" />

      {/* Warning sign */}
      <WarningSign />

      {/* Cracked glass overlay */}
      <CrackedGlassOverlay />

      {/* Creeping shadows at edges */}
      <CreepingShadows />

      {/* Sepia vignette with subtle pulse */}
      <SepiaVignette />

      {/* Dark vignette - heavy shadows like RE fixed camera */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, transparent 10%, ${RE.shadow}80 60%, ${RE.void}f0 100%),
            linear-gradient(180deg, ${RE.void}40 0%, transparent 20%, transparent 80%, ${RE.void}60 100%)
          `,
        }}
      />

      {/* Sepia film grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[10] opacity-[0.05] animate-grain mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23${RE.sepia.slice(1)}'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm isolated light sources - fireplace/candle feel */}
      <WarmLightSource />

      {/* Wall sconces */}
      <WallSconce side="left" />
      <WallSconce side="right" />

      {/* Herb decorations */}
      <div className="fixed top-20 left-4 z-[11] opacity-50">
        <HerbIcon color="green" />
      </div>
      <div className="fixed top-32 left-8 z-[11] opacity-40">
        <HerbIcon color="red" />
      </div>
      <div className="fixed bottom-20 right-4 z-[11] opacity-40">
        <HerbIcon color="blue" />
      </div>
      <div className="fixed bottom-32 right-8 z-[11] opacity-30">
        <HerbIcon color="green" />
      </div>

      {/* Ink ribbon decorations */}
      <div className="fixed top-44 right-6 z-[11] opacity-40">
        <InkRibbon />
      </div>
      <div className="fixed bottom-44 left-6 z-[11] opacity-30">
        <InkRibbon />
      </div>

      {/* Header - sepia mansion style, the recruiter first screen */}
      <header className="relative z-30 p-6 pt-10">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-4">
              <div className="min-w-0">
                <h1
                  className="text-2xl tracking-[0.15em] uppercase"
                  style={{ color: RE.cream, textShadow: `2px 2px 4px ${RE.void}` }}
                >
                  {name}
                </h1>
                <p className="text-sm tracking-wider mt-2" style={{ color: RE.fog }}>
                  {headline}
                </p>
                <p className="text-sm tracking-wider mt-1 italic" style={{ color: RE.warmGlow }}>
                  <TypewriterText text={tagline} speed={80} />
                </p>
                <p className="text-sm mt-1" style={{ color: RE.cream }}>{line}</p>
              </div>

              <nav className="flex flex-wrap gap-3 items-center" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${SH_BUTTON} bg-[#2a2018] border border-[#5c4a38] text-[#d8c8a8]`}>
                  [FILE]
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className={`${SH_BUTTON} bg-[#6b4030]/40 border border-[#6b4030] text-[#c49050]`}
                >
                  [NEBULITH]
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Main inventory area */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 1. Inventory grid - item box style, the profession switch */}
          <section
            aria-label="Select profession"
            className="p-6 mb-8"
            style={{
              background: `linear-gradient(180deg, ${RE.sepia}f0, ${RE.darkSepia}e0)`,
              border: `2px solid ${RE.midBrown}`,
              boxShadow: `inset 0 0 50px ${RE.void}80`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm tracking-[0.3em] uppercase" style={{ color: RE.warmGlow }}>
                Inventory
              </h2>
              <span className="text-sm" style={{ color: RE.candlelight }} aria-hidden="true">
                3/8 SLOTS
              </span>
            </div>

            <ProfessionSwitch
              className="grid grid-cols-3 gap-3"
              label="Profession selector"
              renderOption={(option) => <InventorySlot option={option} />}
            />
            {/* Empty slots */}
            <div className="grid grid-cols-5 gap-3 mt-3" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square"
                  style={{
                    background: `linear-gradient(135deg, ${RE.sepia}40, ${RE.darkSepia}40)`,
                    border: `1px dashed ${RE.midBrown}40`,
                  }}
                />
              ))}
            </div>
          </section>

          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      {/* Contact CTA */}
      <section className="relative z-20 py-12 px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-sm tracking-[0.3em] mb-3 uppercase" style={{ color: RE.warmGlow }}>
                  Get In Touch
                </h2>
                <p className="text-sm" style={{ color: RE.fog }}>{line}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeroActions actions={actions} />
                <Link href="/cv" className={`${SH_BUTTON} bg-[#2a2018] border-2 border-[#5c4a38] text-[#d8c8a8]`}>
                  [FILE] Download CV
                </Link>
              </div>
            </div>
          )}
        />
      </section>

      {/* Footer - save room style */}
      <footer className="relative z-20 py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <TypewriterSavePoint />
          <div className="flex items-center gap-4">
            <InkRibbon />
            <p className="text-sm tracking-widest uppercase" style={{ color: RE.warmGlow }}>
              Typewriter Save Point | 2026 | Spencer Mansion Archives
            </p>
            <InkRibbon />
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0%); }
          60% { transform: translate(1%, 0%); }
          70% { transform: translate(0%, -1%); }
          80% { transform: translate(0%, 1%); }
          90% { transform: translate(-1%, -1%); }
        }
        .animate-grain {
          animation: grain 0.5s steps(10) infinite;
        }
        @keyframes fog-drift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fog-drift-slow {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-fog-drift {
          animation: fog-drift 30s linear infinite;
        }
        .animate-fog-drift-slow {
          animation: fog-drift-slow 45s linear infinite;
        }
        @keyframes zombie-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(5px) rotate(1deg); }
          50% { transform: translateX(-3px) rotate(-1deg); }
          75% { transform: translateX(4px) rotate(0.5deg); }
        }
        .animate-zombie-sway {
          animation: zombie-sway 8s ease-in-out infinite;
        }
        .animate-zombie-sway-delayed {
          animation: zombie-sway 10s ease-in-out infinite;
          animation-delay: -3s;
        }
        @keyframes shadow-creep-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(10px); opacity: 0.8; }
        }
        @keyframes shadow-creep-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-10px); opacity: 0.8; }
        }
        .animate-shadow-creep-left {
          animation: shadow-creep-left 15s ease-in-out infinite;
        }
        .animate-shadow-creep-right {
          animation: shadow-creep-right 15s ease-in-out infinite;
          animation-delay: -7s;
        }
        /* Zombie chase animations - using transform for GPU compositing */
        @keyframes survivor-run-left {
          0% { transform: translateX(-80px) translateY(-50%); }
          100% { transform: translateX(calc(100vw + 80px)) translateY(-50%); }
        }
        @keyframes survivor-run-right {
          0% { transform: translateX(calc(100vw + 80px)) translateY(-50%); }
          100% { transform: translateX(-80px) translateY(-50%); }
        }
        @keyframes zombie-chase-left {
          0% { transform: translateX(-150px) translateY(-50%); }
          100% { transform: translateX(calc(100vw + 30px)) translateY(-50%); }
        }
        @keyframes zombie-chase-right {
          0% { transform: translateX(calc(100vw + 30px)) translateY(-50%); }
          100% { transform: translateX(-150px) translateY(-50%); }
        }
        @keyframes zombie-reach {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-zombie-reach {
          animation: zombie-reach 0.4s ease-in-out infinite;
        }
        .animate-zombie-reach-delayed {
          animation: zombie-reach 0.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        /* Blood drip animation */
        @keyframes blood-drip {
          0% { opacity: 0.8; transform: translateY(-20px); }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; transform: translateY(10px); }
        }
        .animate-blood-drip {
          animation: blood-drip 8s ease-in-out infinite;
        }
        /* Accessibility: Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-grain,
          .animate-fog-drift,
          .animate-fog-drift-slow,
          .animate-zombie-sway,
          .animate-zombie-sway-delayed,
          .animate-shadow-creep-left,
          .animate-shadow-creep-right,
          .animate-blood-drip,
          .animate-zombie-reach,
          .animate-zombie-reach-delayed {
            animation: none !important;
          }
        }
        /* Focus indicators for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid ${RE.candlelight};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
