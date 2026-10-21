'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { MARIO_COLORS } from './AdventurePaths/palette'
import { Coin, GreenPipe, GroundPattern, MarioCloud, MarioSilhouette, QuestionBlock, Starman } from './AdventurePaths/icons'
import { UndergroundPanel } from './AdventurePaths/panels'
import { ProfessionPowerUp } from './AdventurePaths/selector'
import { CVLink, HeroAction, MARIO_BUTTON, PRESS_START } from './AdventurePaths/actions'
import { SECTION_VIEWS } from './AdventurePaths/sections'

// Adventure Paths: the page composition. Its palette, sprites, art scenes, panels, cards, actions and
// per profession sections live in ./AdventurePaths.

export default function AdventurePathsTheme() {
  const { active } = useProfession()
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
        background: `linear-gradient(180deg, ${MARIO_COLORS.skyLight} 0%, ${MARIO_COLORS.skyBlue} 100%)`,
        fontFamily: '"Nunito", "Segoe UI", sans-serif',
      }}
    >
      {/* Floating clouds background */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
        <div className="absolute top-[5%] left-[10%] cloud-float-1"><MarioCloud width={120} /></div>
        <div className="absolute top-[15%] right-[15%] cloud-float-2"><MarioCloud width={100} /></div>
        <div className="absolute top-[8%] left-[50%] cloud-float-3"><MarioCloud width={80} /></div>
        <div className="absolute top-[20%] left-[30%] cloud-float-2"><MarioCloud width={90} /></div>
        <div className="absolute top-[12%] right-[40%] cloud-float-1"><MarioCloud width={110} /></div>
      </div>

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 py-5 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block shrink-0" aria-hidden="true">
                  <MarioSilhouette size={70} />
                </div>
                <div>
                  <h1
                    className="text-xl sm:text-2xl tracking-wider font-bold uppercase"
                    style={{
                      color: '#FFF',
                      textShadow: `3px 3px 0 ${MARIO_COLORS.marioRed}, 6px 6px 0 #000`,
                      fontFamily: '"Press Start 2P", "Arial Black", sans-serif',
                    }}
                  >
                    {name}
                  </h1>
                  <p className="text-sm font-semibold tracking-wide mt-3" style={{ color: MARIO_COLORS.groundDarkest }}>
                    {headline}
                  </p>
                  <p className="text-sm tracking-wide mt-1 italic" style={{ color: MARIO_COLORS.groundDarkest }}>
                    {tagline}
                  </p>
                  <p className="text-sm mt-1" style={{ color: MARIO_COLORS.groundDarkest }}>
                    {line}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-3">
                {/* Coin/Star counters */}
                <div className="hidden sm:flex items-center gap-4" aria-hidden="true">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      background: `linear-gradient(180deg, #2A2A2A, #1A1A1A)`,
                      border: `2px solid ${MARIO_COLORS.coinGold}`,
                      borderRadius: '4px',
                    }}
                  >
                    <Coin size={20} />
                    <span className="text-sm font-bold" style={{ color: '#FFF', fontFamily: PRESS_START }}>x99</span>
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      background: `linear-gradient(180deg, #2A2A2A, #1A1A1A)`,
                      border: `2px solid ${MARIO_COLORS.coinGold}`,
                      borderRadius: '4px',
                    }}
                  >
                    <Starman size={20} />
                    <span className="text-sm font-bold" style={{ color: '#FFF', fontFamily: PRESS_START }}>x7</span>
                  </div>
                </div>

                {/* Action buttons */}
                <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <Link
                    href="/personal-projects/game-engine"
                    className={MARIO_BUTTON}
                    style={{
                      background: `linear-gradient(180deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionDark})`,
                      border: `3px solid ${MARIO_COLORS.groundBrown}`,
                      color: MARIO_COLORS.groundDarkest,
                      boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
                    }}
                  >
                    <Starman size={16} />
                    PLAY
                  </Link>
                </nav>
              </div>
            </div>
          )}
        />
      </header>

      {/* Profession Selector - Power-up blocks, System Engineer in the centre */}
      <section className="relative z-20 py-6 sm:py-8 px-4" aria-label="Profession Selection">
        <ProfessionSwitch
          className="max-w-3xl mx-auto flex justify-center items-start gap-4 sm:gap-12"
          label="Profession"
          renderOption={(option) => <ProfessionPowerUp {...option} />}
        />
      </section>

      {/* The picked profession's levels, and only those */}
      <div role="region" aria-label={`${active} profession details`}>
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </div>

      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* === POSTS (placeholder) === */}
          <section className="mb-8">
            <UndergroundPanel title="Posts" icon={<QuestionBlock size={24} />}>
              <div className="text-center py-8">
                <QuestionBlock size={60} hit />
                <p className="mt-4 text-sm" style={{ color: '#C8C8E8' }}>Coming soon... check back for blog posts!</p>
              </div>
            </UndergroundPanel>
          </section>
        </div>
      </div>

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-4 sm:px-6" aria-labelledby="mario-contact-heading">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="flex justify-center gap-2 mb-4" aria-hidden="true">
                  <Coin size={20} />
                  <QuestionBlock size={32} />
                  <Coin size={20} />
                </div>
                <h2
                  id="mario-contact-heading"
                  className="text-lg tracking-[0.15em] mb-3"
                  style={{
                    color: MARIO_COLORS.marioRed,
                    textShadow: `2px 2px 0 ${MARIO_COLORS.groundDarkest}`,
                    fontFamily: '"Press Start 2P", monospace, sans-serif',
                  }}
                >
                  READY TO TEAM UP?
                </h2>
                <p className="text-sm" style={{ color: MARIO_COLORS.groundDarkest }}>
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

      

      {/* Footer with ground */}
      <footer className="relative z-20">
        <div className="text-center py-8">
          <div
            className="inline-flex items-center justify-center gap-4 px-6 py-3"
            style={{
              background: `linear-gradient(180deg, #2A2A2A, #1A1A1A)`,
              border: `3px solid ${MARIO_COLORS.coinGold}`,
              borderRadius: '4px',
              boxShadow: `0 4px 0 #0A0A0A`,
            }}
          >
            <GreenPipe height={40} width={32} />
            <div className="flex items-center gap-2">
              <Starman size={24} />
              <span className="text-[10px] tracking-wider text-white" style={{ fontFamily: '"Press Start 2P", monospace' }}>PLAYER ONE</span>
              <Starman size={24} />
            </div>
            <GreenPipe height={40} width={32} />
          </div>
          <p
            className="text-[8px] mt-3 px-3 py-1 inline-block"
            style={{
              color: MARIO_COLORS.castleGrey,
              background: '#1A1A1A',
              border: `1px solid ${MARIO_COLORS.castleDark}`,
              borderRadius: '2px',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            WORLD 1-1 CLEAR * COINS: 99 * LIVES: 99
          </p>
        </div>
        <GroundPattern />
      </footer>

      {/* CSS Animations */}
      <style jsx global>{`
        /* === COIN SPIN === */
        @keyframes coinSpinAnim {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.2); }
        }
        .coin-spin {
          animation: coinSpinAnim 0.8s ease-in-out infinite;
        }

        /* === QUESTION BLOCK BOUNCE === */
        @keyframes questionBounceAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .question-bounce {
          animation: questionBounceAnim 2s ease-in-out infinite;
        }

        /* === STARMAN FLASH === */
        @keyframes starmanFlashAnim {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          25% { filter: brightness(1.3) hue-rotate(60deg); }
          50% { filter: brightness(1.1) hue-rotate(120deg); }
          75% { filter: brightness(1.3) hue-rotate(180deg); }
        }
        .starman-flash {
          animation: starmanFlashAnim 0.5s linear infinite;
        }

        /* === CLOUD FLOAT === */
        @keyframes cloudFloatAnim {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-5px); }
        }
        .cloud-float {
          animation: cloudFloatAnim 8s ease-in-out infinite;
        }
        .cloud-float-1 {
          animation: cloudFloatAnim 12s ease-in-out infinite;
        }
        .cloud-float-2 {
          animation: cloudFloatAnim 10s ease-in-out infinite;
          animation-delay: -3s;
        }
        .cloud-float-3 {
          animation: cloudFloatAnim 14s ease-in-out infinite;
          animation-delay: -6s;
        }

        /* === MARIO BUTTON === */
        .mario-button {
          position: relative;
          overflow: hidden;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .mario-button:active {
          transform: translateY(4px) scale(0.98) !important;
          box-shadow: none !important;
        }

        /* === REDUCED MOTION SUPPORT === */
        @media (prefers-reduced-motion: reduce) {
          .coin-spin,
          .question-bounce,
          .starman-flash,
          .cloud-float,
          .cloud-float-1,
          .cloud-float-2,
          .cloud-float-3,
          .mario-button {
            animation: none !important;
            transition: none !important;
          }
        }

        /* === GOOGLE FONT FALLBACK === */
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
    </div>
  )
}
