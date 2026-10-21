'use client'

import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { COLORS, crtScanlines, screenGlow, screenVignette } from './FighterSelect/palette'
import { ArcadeSectionCard } from './FighterSelect/frames'
import { FightBanner, VSBadge } from './FighterSelect/badges'
import { CharacterPortrait } from './FighterSelect/selector'
import { InsertCoinFooter } from './FighterSelect/footer'
import { ARCADE_BUTTON, CVLink, HeroAction } from './FighterSelect/actions'
import { SECTION_VIEWS } from './FighterSelect/sections'

// Fighter Select: the page composition. Its palette, frames, badges, portraits, cards, separators,
// footer, buttons and per profession sections live in ./FighterSelect.

export default function FighterSelectTheme() {
  const { active, config } = useProfession()
  const view = useWorldView()

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, #1a1a3e 0%, ${COLORS.arcadeBlack} 50%, #050510 100%)`,
        fontFamily: '"Impact", "Arial Black", sans-serif',
      }}
    >
      {/* Global CRT effects */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        aria-hidden="true"
        style={{ background: crtScanlines, opacity: 0.35 }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[99]"
        aria-hidden="true"
        style={{ background: screenVignette }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ background: screenGlow }}
      />

      <div className="relative z-10">
        {/* ================================================================= */}
        {/* HEADER - the recruiter first screen */}
        {/* ================================================================= */}
        <header className="relative py-6 px-4 sm:py-8 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <ArcadeSectionCard color={COLORS.p1Blue}>
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => (
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div>
                      {/* Main title - dramatic arcade styling */}
                      <h1
                        className="text-3xl md:text-5xl tracking-[0.15em] uppercase leading-tight"
                        style={{
                          color: COLORS.electricYellow,
                          textShadow: `
                            0 0 10px ${COLORS.electricYellow},
                            0 0 20px ${COLORS.orange},
                            0 0 40px ${COLORS.p2Red}60,
                            4px 4px 0 ${COLORS.arcadeBlack},
                            -2px -2px 0 ${COLORS.arcadeBlack}
                          `,
                          WebkitTextStroke: `2px ${COLORS.arcadeBlack}`,
                        }}
                      >
                        {name}
                      </h1>

                      <p
                        className="text-base md:text-lg mt-4 tracking-wide max-w-2xl"
                        style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}
                      >
                        {headline}
                      </p>
                      <p className="text-sm md:text-base mt-2 italic tracking-wider" style={{ color: COLORS.specialBlue }}>
                        {tagline}
                      </p>
                      <p className="text-sm mt-2 tracking-wide" style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}>
                        {line}
                      </p>
                    </div>

                    <nav className="flex gap-3 sm:gap-4 items-center flex-wrap shrink-0" aria-label="Contact and CV">
                      {actions.map((action) => (
                        <HeroAction key={action.id} action={action} />
                      ))}
                      <CVLink />
                      <Link
                        href="/personal-projects/game-engine"
                        className={ARCADE_BUTTON}
                        style={{
                          background: `linear-gradient(90deg, ${COLORS.healthGreen}, ${COLORS.healthGreenDark})`,
                          color: '#000',
                          borderRadius: '4px',
                          clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                          boxShadow: `0 0 20px ${COLORS.healthGreen}60`,
                        }}
                        aria-label="Play the game engine demo"
                      >
                        PLAY
                      </Link>
                    </nav>
                  </div>
                )}
              />
            </ArcadeSectionCard>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ================================================================= */}
          {/* CHARACTER SELECT - the shared profession switch, System Engineer in the centre and picked */}
          {/* ================================================================= */}
          <ArcadeSectionCard color={COLORS.specialBlue} title="Select your fighter" titleIcon="►" id="select-heading">
            <ProfessionSwitch
              className="grid grid-cols-3 gap-2 pt-8 mb-8 md:flex md:items-center md:justify-center md:gap-0"
              label="Profession"
              renderOption={(option) => (
                <>
                  {option.id !== 'drummer' && (
                    <div className="mx-2 lg:mx-6 hidden md:block" aria-hidden="true">
                      <VSBadge />
                    </div>
                  )}
                  <CharacterPortrait {...option} />
                </>
              )}
            />

            {/* Ready banner */}
            <FightBanner text={`${config.title.toUpperCase()} - READY!`} ready />
          </ArcadeSectionCard>

          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        {/* ================================================================= */}
        {/* CONTACT CTA */}
        {/* ================================================================= */}
        <section className="relative z-20 py-12 px-4 sm:px-6" aria-label="Contact">
          <RecruiterHero
            render={({ line, actions }) => (
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-6">
                  <h2
                    className="text-xl tracking-[0.3em] uppercase mb-2"
                    style={{
                      fontFamily: '"Impact", "Arial Black", sans-serif',
                      color: COLORS.gold,
                      textShadow: `0 0 20px ${COLORS.gold}40`,
                    }}
                  >
                    CHALLENGER APPROACHING?
                  </h2>
                  <p className="text-sm" style={{ color: COLORS.chrome }}>
                    {line}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                </div>
              </div>
            )}
          />
        </section>

        {/* ================================================================= */}
        {/* FOOTER */}
        {/* ================================================================= */}
        <InsertCoinFooter />
      </div>

      {/* ================================================================= */}
      {/* CSS ANIMATIONS */}
      {/* ================================================================= */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-vs-pulse,
          .animate-ready-pulse,
          .animate-blink {
            animation: none !important;
          }
        }

        @keyframes vs-pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.3);
          }
        }

        @keyframes ready-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        .animate-vs-pulse {
          animation: vs-pulse 1.5s ease-in-out infinite;
        }

        .animate-ready-pulse {
          animation: ready-pulse 2s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
