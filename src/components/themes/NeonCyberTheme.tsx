'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ChromaticBorder, CyberwareIcon, GlitchText, ScannerCorners, TerminalLine } from './NeonCyber/effects'
import { DataStream, NightCitySkyline, RainOverlay } from './NeonCyber/backdrop'
import { CyberPanel, terminalName } from './NeonCyber/cards'
import { CVLink, HeroAction } from './NeonCyber/actions'
import { PROFESSION_CYBERWARE, SECTION_VIEWS } from './NeonCyber/sections'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ContactScene } from './NeonCyber/scenes'
import { NEON_VARS } from './NeonCyber/palette'

// Neon Cyber, the default world: the page composition. Its effects, backdrop, cards, per profession
// panels and scroll scenes live in ./NeonCyber.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' level strips from sticking to the viewport.

export default function NeonCyberTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { sections, professions, navigation, cards } = useLabels()
  const [mounted, setMounted] = useState(false)
  const [screenTear, setScreenTear] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)

    if (reducedMotion) return

    // A rare one line screen tear, a lit bar for 50ms
    const interval = setInterval(() => {
      if (Math.random() <= 0.99) return
      setScreenTear(Math.random() * 80 + 10)
      setTimeout(() => setScreenTear(null), 50)
    }, 100)

    return () => clearInterval(interval)
  }, [reducedMotion])

  if (!mounted) return null

  return (
    <div style={NEON_VARS} className="min-h-screen relative overflow-x-clip bg-gradient-to-b from-[color:var(--neon-void)] via-[color:var(--neon-dusk)] to-[color:var(--neon-void)] font-['Share_Tech_Mono','Courier_New',monospace]">
      {screenTear && !reducedMotion && (
        <div
          className="fixed left-0 right-0 top-[var(--tear)] h-2 z-50 pointer-events-none bg-gradient-to-r from-[color:var(--neon-magenta)] to-[color:var(--neon-cyan)] mix-blend-screen"
          style={{ '--tear': `${screenTear}%` } as CSSProperties}
          aria-hidden="true"
        />
      )}

      <DataStream />
      <RainOverlay />
      <NightCitySkyline />

      {/* Scanlines, chromatic edge and CRT vignette: static layers */}
      <div
        className="fixed inset-0 pointer-events-none z-[5] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.02)_2px,rgba(0,255,255,0.02)_4px)]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-[6] shadow-[inset_0_0_150px_rgba(255,0,255,0.15),inset_0_0_300px_rgba(0,255,255,0.08)]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-[7] bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.8)_100%)]"
        aria-hidden="true"
      />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 pt-6 pb-4 sm:p-6 sm:pt-16">
        <div className="max-w-6xl mx-auto">
          <ChromaticBorder>
            <ScannerCorners>
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => {
                  const [first, ...rest] = name.split(' ')
                  return (
                    <div className="p-4 bg-black/40 flex justify-between items-start flex-wrap gap-4">
                      <div className="min-w-0">
                        <h1 className="text-3xl sm:text-4xl tracking-[0.2em] font-bold uppercase break-words">
                          <GlitchText text={first} className="text-pink-500" intensity="high" />{' '}
                          <span className="text-white" aria-hidden="true">{'/'}</span>{' '}
                          <GlitchText text={rest.join(' ')} className="text-cyan-400" intensity="high" />
                        </h1>
                        <p className="mt-3 text-sm text-white/90">{headline}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`w-2 h-2 shrink-0 rounded-full bg-green-400 shadow-[0_0_10px_var(--neon-led)] ${!reducedMotion ? 'animate-pulse' : ''}`}
                            aria-hidden="true"
                          />
                          <q className="text-sm text-pink-400 tracking-wider italic">{tagline}</q>
                        </div>
                        <p className="mt-2 text-sm text-cyan-300 font-mono">{line}</p>
                      </div>

                      <nav className="flex gap-3 items-center flex-wrap" aria-label={navigation.contactAndCv}>
                        {actions.map((action) => (
                          <HeroAction key={action.id} action={action} />
                        ))}
                        <CVLink />
                      </nav>
                    </div>
                  )
                }}
              />
            </ScannerCorners>
          </ChromaticBorder>
        </div>
      </header>

      <main className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Terminal - the tagline and the profession picked, typed */}
          <div className="mb-8 p-4 bg-black/80 border border-cyan-400/30" role="region" aria-label={navigation.systemTerminal}>
            <div className="flex items-center gap-2 mb-4" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <TerminalLine prefix="> " text={view.hero.tagline} delay={0} />
            <TerminalLine prefix="$ " text={`set PROFESSION=${terminalName(professions[active])}`} delay={1200} />
          </div>

          {/* Profession selector - Cyberware slot selection. The slanted cut would clip the focus ring,
              so a focused slot drops it. */}
          <ProfessionSwitch
            className="grid grid-cols-3 gap-2 sm:gap-4 mb-8"
            label={navigation.professionSelection}
            renderOption={({ id: prof, label, selected, optionProps }) => (
              <button
                type="button"
                {...optionProps}
                className={`p-3 sm:p-4 text-left transition-[opacity,transform] relative overflow-hidden border-2 [clip-path:polygon(15px_0,100%_0,calc(100%-15px)_100%,0_100%)] focus:outline-none focus-visible:[clip-path:none] focus-visible:ring-2 focus-visible:ring-yellow-300 ${
                  selected
                    ? 'scale-105 border-[color:var(--neon-magenta)] bg-gradient-to-br from-[color-mix(in_srgb,var(--neon-magenta)_20%,transparent)] to-[color-mix(in_srgb,var(--neon-cyan)_10%,transparent)]'
                    : 'opacity-70 hover:opacity-100 border-[color-mix(in_srgb,var(--neon-cyan)_40%,transparent)] bg-[color-mix(in_srgb,var(--neon-cyan)_5%,transparent)]'
                }`}
              >
                {selected && !reducedMotion && (
                  <span
                    className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-[color:var(--neon-magenta)] to-transparent animate-scan"
                    aria-hidden="true"
                  />
                )}

                <span className="relative z-10 block">
                  <span className="flex flex-wrap items-center gap-x-2 mb-2">
                    <CyberwareIcon type={PROFESSION_CYBERWARE[prof]} />
                    <span className={`text-sm tracking-wider font-mono ${selected ? 'text-[color:var(--neon-magenta)]' : 'text-[color:var(--neon-cyan)]'}`}>
                      {label.toUpperCase()}
                    </span>
                  </span>
                  {selected && <span className="text-sm text-green-400 block mt-1 font-mono">[{terminalName(navigation.active)}]</span>}
                </span>
              </button>
            )}
          />

          {/* The picked profession's sections and stages, and only those */}
          <div role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>

          <ScrollScene className="mb-8">
            <CyberPanel title={sections.posts} accent="orange">
              <div className="text-center py-8">
                <div className="text-6xl mb-4 text-white/20 font-mono" aria-hidden="true">
                  &#123; &#125;
                </div>
                <p className="text-sm text-white/80 font-mono tracking-wider">{cards.noPosts}</p>
              </div>
            </CyberPanel>
          </ScrollScene>
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 py-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-4" aria-hidden="true">
          <span className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <span className="w-16 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
        </div>
        <p className="text-sm text-white/70 tracking-widest font-mono">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>

      {/* Backdrop loops; reduced motion stops them */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes rain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-rain {
          animation: rain linear infinite;
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fall,
          .animate-rain,
          .animate-scan,
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
