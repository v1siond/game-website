'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CT_COLORS, PROFESSION_COLORS } from './RetroRPG/palette'
import { CronoPixelArt, EraBadge, FrogPixelArt, TimePortal } from './RetroRPG/art'
import { BattleFrame } from './RetroRPG/panels'
import { COMMAND_BUTTON, CVLink, HeroAction } from './RetroRPG/actions'
import { SECTION_VIEWS } from './RetroRPG/sections'
import { AnimationStyles } from './RetroRPG/animations'

// Retro RPG: the page composition. Its palette, art, art breaks, panels, cards, buttons, sections and
// animation styles live in ./RetroRPG.

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RetroRPGTheme() {
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
      className="min-h-screen relative text-white"
      style={{
        background: `linear-gradient(180deg, ${CT_COLORS.voidDark} 0%, ${CT_COLORS.voidMid} 50%, ${CT_COLORS.voidDark} 100%)`,
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        imageRendering: 'pixelated' as const,
      }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
        style={{ background: CT_COLORS.gold, color: CT_COLORS.voidDark }}
      >
        Skip to main content
      </a>

      {/* CRT Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.05]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Ambient Time Portal Effects */}
      <div className="fixed top-20 left-8 opacity-10 hidden xl:block" aria-hidden="true">
        <TimePortal size={80} animate={!reducedMotion} />
      </div>
      <div className="fixed bottom-20 right-8 opacity-10 hidden xl:block" aria-hidden="true">
        <TimePortal size={80} animate={!reducedMotion} />
      </div>

      {/* Character silhouettes at edges */}
      <div className="fixed top-32 right-4 opacity-15 hidden xl:block" aria-hidden="true">
        <CronoPixelArt size={32} />
      </div>
      <div className="fixed bottom-32 left-4 opacity-15 hidden xl:block" aria-hidden="true">
        <FrogPixelArt size={32} />
      </div>

      {/* ========== HEADER: the recruiter first screen ========== */}
      <header className="relative z-30 px-4 py-5 sm:p-6 border-b-4" style={{ borderColor: CT_COLORS.white }} role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block shrink-0">
                  <TimePortal size={48} animate={!reducedMotion} />
                </div>
                <div>
                  <h1 className="text-lg tracking-[0.2em] uppercase" style={{ color: CT_COLORS.white }}>
                    {name}
                  </h1>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: CT_COLORS.gold }}>
                    {headline}
                  </p>
                  <p className="text-sm leading-relaxed mt-2 italic" style={{ color: CT_COLORS.portalBlueBright }}>
                    <span aria-hidden="true">◇ </span>
                    <span>{tagline}</span>
                  </p>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: CT_COLORS.futureChromeLight }}>
                    {line}
                  </p>
                </div>
              </div>

              <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <Link
                  href="/personal-projects/game-engine"
                  className={COMMAND_BUTTON}
                  style={{ border: `3px solid ${CT_COLORS.portalBlue}`, color: CT_COLORS.portalBlueBright, background: CT_COLORS.voidDark }}
                  aria-label="Play game engine demo"
                >
                  GAME
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Profession Selector (Party Menu) */}
      <div className="relative z-20 px-4 sm:px-6 py-6 border-b-2" style={{ borderColor: CT_COLORS.white + '30' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm mb-4 text-center tracking-widest" style={{ color: CT_COLORS.gold }}>
            ◈ Select your path through time ◈
          </p>
          <ProfessionSwitch
            className="flex flex-wrap justify-center gap-4"
            label="Profession selection"
            renderOption={({ id, label, selected, optionProps }) => {
              const color = PROFESSION_COLORS[id]
              return (
                <button
                  type="button"
                  {...optionProps}
                  className="relative min-h-[44px] px-6 py-3 text-sm tracking-[0.15em] font-bold transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: selected
                      ? `linear-gradient(180deg, ${color} 0%, ${color}AA 100%)`
                      : CT_COLORS.voidDark,
                    border: `3px solid ${color}`,
                    color: CT_COLORS.white,
                    boxShadow: selected ? `0 0 20px ${color}80, inset 0 0 10px ${CT_COLORS.white}40` : 'none',
                  }}
                >
                  {selected && <span style={{ fontSize: '8px' }} aria-hidden="true">▶</span>}
                  {label.toUpperCase()}
                </button>
              )
            }}
          />
        </div>
      </div>

      {/* ========== MAIN CONTENT: the picked profession's sections, and only those ========== */}
      <main id="main-content" className="relative z-20 px-4 sm:px-6 py-8" role="main">
        <div className="max-w-5xl mx-auto" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

          {/* POSTS Section */}
          <BattleFrame title="POSTS" era="end-of-time">
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: CT_COLORS.silver }}>
                Writings and thoughts coming soon...
              </p>
              <div className="flex justify-center mt-6 gap-4 flex-wrap">
                <EraBadge era="present" year="TECH" />
                <EraBadge era="medieval" year="MUSIC" />
                <EraBadge era="prehistoric" year="FIGHTING" />
              </div>
            </div>
          </BattleFrame>
        </div>
      </main>

      {/* ========== CONTACT CTA ========== */}
      <section className="relative z-20 py-16 px-4 sm:px-6" aria-labelledby="rpg-contact-heading">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 id="rpg-contact-heading" className="text-xl tracking-[0.2em] mb-3" style={{ color: CT_COLORS.gold }}>
                  CONTINUE?
                </h2>
                <p className="text-sm tracking-wide leading-relaxed" style={{ color: CT_COLORS.silver }}>
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

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-12 px-6 border-t-4 text-center" style={{ borderColor: CT_COLORS.white }} role="contentinfo">
        <div className="flex items-center justify-center gap-4 mb-4">
          <TimePortal size={32} animate={!reducedMotion} />
          <span className="text-xs tracking-[0.2em]" style={{ color: CT_COLORS.gold }}>
            SAVE YOUR PROGRESS
          </span>
          <TimePortal size={32} animate={!reducedMotion} />
        </div>
        <p className="text-[10px] tracking-widest" style={{ color: CT_COLORS.silver }}>
          ◈ The future is not yet written... ◈
        </p>
        <p className="text-[9px] mt-4" style={{ color: CT_COLORS.portalPurple }}>
          &ldquo;But...the future refused to change.&rdquo;
        </p>
      </footer>

      <AnimationStyles />
    </div>
  )
}
