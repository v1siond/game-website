'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { CUPHEAD_COLORS } from './RubberHose/palette'
import { BouncingBall, FilmEffects, FilmReelBorder, FloatingMusicNotes, PieEyeFace, RubberHoseArm, VintageOrnaments } from './RubberHose/backdrop'
import { CartoonTitle } from './RubberHose/art'
import { CartoonCharacter } from './RubberHose/selector'
import { CARTOON_BUTTON, CVLink, HERO_ACTION_LOOK, HeroAction } from './RubberHose/actions'
import { SECTION_VIEWS } from './RubberHose/sections'
import { RubberHoseStyles } from './RubberHose/styles'

// Rubber Hose: the page composition. Its palette, backdrop, art, cards, selector, actions, sections and
// animation styles live in ./RubberHose.

// ============================================================================
// MAIN COMPONENT: RubberHoseTheme (Cuphead Gameplay Style)
// ============================================================================
export default function RubberHoseTheme() {
  const { active } = useProfession()
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
        // Cuphead-style warm paper gradient background
        background: `linear-gradient(to bottom, ${CUPHEAD_COLORS.paperCream}, ${CUPHEAD_COLORS.paperSepia})`,
        fontFamily: '"Courier New", monospace',
      }}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
        style={{ background: CUPHEAD_COLORS.inkBlack, color: CUPHEAD_COLORS.paperCream }}
      >
        Skip to main content
      </a>

      {/* Film reel borders */}
      <FilmReelBorder />

      {/* Profession-specific ornaments */}
      <VintageOrnaments profession={active} />

      {/* Film effects (grain, scratches, vignette) */}
      <FilmEffects />

      {/* Floating music notes - jazz age atmosphere */}
      <FloatingMusicNotes />

      {/* Pie-eye face decorations */}
      <PieEyeFace position={{ x: 5, y: 20 }} size={50} />
      <PieEyeFace position={{ x: 90, y: 70 }} size={40} />

      {/* Bouncing balls - classic cartoon element */}
      <BouncingBall initialX={15} delay={0} />
      <BouncingBall initialX={45} delay={0.5} />
      <BouncingBall initialX={75} delay={1} />

      {/* Rubber hose arms waving */}
      <RubberHoseArm side="left" y={40} />
      <RubberHoseArm side="right" y={60} />

      {/* Decorative border frame - art deco style */}
      <div
        className="fixed inset-4 left-16 right-16 pointer-events-none z-[5]"
        style={{ border: `8px double ${CUPHEAD_COLORS.inkBlack}` }}
        aria-hidden="true"
      />

      {/* Main content area with padding for film strips */}
      <div className="ml-14 mr-14">
        {/* Header - the recruiter first screen */}
        <header className="relative z-30 px-2 py-6 sm:p-6">
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                <div className="text-center">
                  <CartoonTitle text={name.toUpperCase()} subtitle={headline} />
                  <p
                    className="text-sm tracking-widest mt-2 italic"
                    style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
                  >
                    {tagline}
                  </p>
                  <p className="text-sm mt-2" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
                    {line}
                  </p>
                </div>

                <nav className="flex gap-3 items-center justify-center flex-wrap" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <Link
                    href="/personal-projects/game-engine"
                    className={`${CARTOON_BUTTON} hover:-rotate-1`}
                    style={HERO_ACTION_LOOK.email}
                  >
                    PLAY GAME
                  </Link>
                </nav>
              </div>
            )}
          />
        </header>

        {/* Character/Profession selection, System Engineer in the centre */}
        <section className="relative z-20 py-8" aria-label="Profession selection">
          <p className="text-center mb-6 text-sm tracking-widest" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }} aria-hidden="true">
            ~ SELECT YOUR ADVENTURE ~
          </p>
          <ProfessionSwitch
            className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-8 md:gap-12"
            label="Profession"
            renderOption={(option) => <CartoonCharacter {...option} />}
          />
        </section>

        {/* Main content */}
        <main id="main-content" className="relative z-20 px-2 md:px-8 py-8">
          <div className="max-w-4xl mx-auto" role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        {/* Contact CTA */}
        <section className="relative z-20 py-12" aria-label="Contact">
          <RecruiterHero
            render={({ line, actions }) => (
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <h2
                    className="text-xl tracking-[0.15em] mb-3"
                    style={{
                      color: CUPHEAD_COLORS.inkBlack,
                      fontFamily: '"Abril Fatface", serif',
                      textShadow: `2px 2px 0 ${CUPHEAD_COLORS.shadowBrown}`,
                    }}
                  >
                    Ready to Work Together?
                  </h2>
                  <p className="text-sm" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
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

        

        {/* Footer */}
        <footer className="relative z-20 py-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-0.5" style={{ background: CUPHEAD_COLORS.inkBlack }} aria-hidden="true" />
            <p
              className="text-sm tracking-widest"
              style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}
            >
              ✦ A PRESENTATION IN GLORIOUS SEPIA ✦ MCMXXVI
            </p>
            <div className="w-16 h-0.5" style={{ background: CUPHEAD_COLORS.inkBlack }} aria-hidden="true" />
          </div>
        </footer>
      </div>

      <RubberHoseStyles />
    </div>
  )
}
