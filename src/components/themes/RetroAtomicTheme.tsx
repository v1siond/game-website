'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import {
  FADED_TEXT,
  PIPBOY_GREEN,
  PIPBOY_GREEN_DIM,
  PIPBOY_GREEN_GLOW,
  TERMINAL_AMBER,
  TERMINAL_BG,
  TERMINAL_TEXT,
  VAULT_YELLOW,
  crtScanlinesBg,
} from './RetroAtomic/palette'
import { AtomSymbol, BottleCap, RadiationSymbol } from './RetroAtomic/icons'
import { PipBoyTab } from './RetroAtomic/cards'
import { CVLink, HeroAction, TERMINAL_BUTTON } from './RetroAtomic/actions'
import { SECTION_VIEWS } from './RetroAtomic/sections'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Retro Atomic: the page composition. Its palette, icons, panels, art separators, cards and per
// profession sections live in ./RetroAtomic.

export default function RetroAtomicTheme() {
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
      className="min-h-screen relative"
      style={{
        background: TERMINAL_BG,
        fontFamily: 'monospace',
      }}
    >
      {/* CRT Scanlines overlay */}
      {!reducedMotion && (
        <div
          className="fixed inset-0 pointer-events-none z-[100]"
          style={{
            background: crtScanlinesBg,
            opacity: 0.3,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle radiation symbols in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 25}%`,
              opacity: 0.04,
            }}
          >
            <RadiationSymbol size={60 + i * 10} color={PIPBOY_GREEN} />
          </div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* HEADER - the recruiter first screen */}
      {/* ================================================================ */}
      <header className="relative z-30 p-4 md:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  {/* Vault-Tec header */}
                  <div className="flex items-center gap-4 pb-3 mb-3" style={{ borderBottom: `2px solid ${VAULT_YELLOW}` }}>
                    <RadiationSymbol size={36} color={VAULT_YELLOW} />
                    <div>
                      <h1
                        className="text-xl md:text-3xl font-bold tracking-wider uppercase"
                        style={{
                          color: PIPBOY_GREEN,
                          textShadow: `0 0 20px ${PIPBOY_GREEN_GLOW}, 0 0 40px ${PIPBOY_GREEN}30`,
                        }}
                      >
                        {name}
                      </h1>
                      <p className="text-sm tracking-widest" style={{ color: VAULT_YELLOW }} aria-hidden="true">
                        VAULT-TEC PERSONNEL FILE
                      </p>
                    </div>
                  </div>
                  <p className="text-base max-w-xl" style={{ color: TERMINAL_TEXT }}>
                    {headline}
                  </p>
                  <p className="text-sm mt-1 italic" style={{ color: TERMINAL_AMBER }}>
                    {tagline}
                  </p>
                  <p className="text-sm mt-1" style={{ color: TERMINAL_TEXT }}>
                    {line}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                  <BottleCap size={24} />
                  <nav className="flex gap-2 flex-wrap md:justify-end" aria-label="Contact and CV">
                    {actions.map((action) => (
                      <HeroAction key={action.id} action={action} />
                    ))}
                    <CVLink />
                    <Link
                      href="/personal-projects/game-engine"
                      className={TERMINAL_BUTTON}
                      style={{ background: TERMINAL_BG, border: `2px solid ${PIPBOY_GREEN}`, color: PIPBOY_GREEN }}
                    >
                      [N] NEBULITH
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        />
      </header>

      {/* ================================================================ */}
      {/* PROFESSION SELECTOR - Pip-Boy tabs, System Engineer in the centre */}
      {/* ================================================================ */}
      <section className="relative z-20 py-4 px-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="grid grid-cols-3 gap-2 max-w-xl mx-auto md:flex md:justify-center md:gap-6 md:max-w-none"
          label="Profession"
          renderOption={(option) => <PipBoyTab {...option} />}
        />
      </section>

      <div role="region" aria-label={`${active} profession details`}>
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </div>

      {/* ================================================================ */}
      {/* CONTACT CTA */}
      {/* ================================================================ */}
      <section className="relative z-20 py-12 px-4 md:px-6" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-6">
                <h2 className="text-lg font-bold tracking-widest uppercase font-mono mb-2" style={{ color: VAULT_YELLOW }}>
                  [ INITIATE CONTACT PROTOCOL ]
                </h2>
                <p className="text-sm font-mono" style={{ color: TERMINAL_TEXT }}>
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

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}
      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <div className="flex justify-center gap-4 mb-4">
          <AtomSymbol size={40} color={PIPBOY_GREEN_DIM} />
        </div>
        <p className="text-sm font-mono" style={{ color: FADED_TEXT }}>
          © {new Date().getFullYear()} Alexander Pulido
        </p>
      </footer>
    </div>
  )
}
