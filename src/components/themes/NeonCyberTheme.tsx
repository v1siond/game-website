'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useReducedMotion } from './NeonCyber/motion'
import { ChromaticBorder, CyberwareIcon, GlitchText, HolographicShimmer, NeonSign, ScannerCorners, TerminalLine } from './NeonCyber/effects'
import { CyberArtSection, DataStream, NightCitySkyline, RainOverlay } from './NeonCyber/backdrop'
import { CyberPanel } from './NeonCyber/cards'
import { CVLink, HeroAction, PROFESSION_CYBERWARE, ProfessionPanels, terminalName } from './NeonCyber/sections'

// Neon Cyber, the default world: the page composition. Its effects, backdrop, cards and per profession
// panels live in ./NeonCyber.

export default function NeonCyberTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const [glitchScreen, setGlitchScreen] = useState(false)
  const [screenTear, setScreenTear] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)

    if (reducedMotion) return

    // Random screen glitch and tear effects
    const interval = setInterval(() => {
      const rand = Math.random()
      if (rand > 0.98) {
        setGlitchScreen(true)
        setTimeout(() => setGlitchScreen(false), 100 + Math.random() * 100)
      }
      if (rand > 0.97 && rand <= 0.98) {
        setScreenTear(Math.random() * 80 + 10)
        setTimeout(() => setScreenTear(null), 50)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [reducedMotion])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0512 0%, #150a20 50%, #0a0512 100%)',
        fontFamily: '"Share Tech Mono", "Courier New", monospace',
        transform: glitchScreen && !reducedMotion ? `translateX(${Math.random() * 8 - 4}px)` : 'none',
      }}
      role="main"
      aria-label={`${view.hero.name} - Cyberpunk themed portfolio`}
    >
      {/* Screen tear effect */}
      {screenTear && !reducedMotion && (
        <div
          className="fixed left-0 right-0 h-2 z-50 pointer-events-none"
          style={{
            top: `${screenTear}%`,
            background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}

      {/* Data stream background */}
      <DataStream />

      {/* Rain effect - Night City atmosphere */}
      <RainOverlay />

      {/* Night City skyline */}
      <NightCitySkyline />

      {/* Scanlines - CRT monitor effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.02) 2px, rgba(0,255,255,0.02) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Chromatic aberration on edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[6]"
        style={{
          boxShadow: 'inset 0 0 150px rgba(255,0,255,0.15), inset 0 0 300px rgba(0,255,255,0.08)',
        }}
        aria-hidden="true"
      />

      {/* CRT vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top HUD elements - Kiroshi optics overlay style */}
      <div
        className="hidden sm:block fixed top-4 left-4 z-40 pointer-events-none text-sm text-cyan-400/50 font-mono space-y-1"
        role="presentation"
        aria-hidden="true"
      >
        <div>SYS_STATUS: ONLINE</div>
        <div>NET_LINK: STABLE</div>
        <div>ICE_BYPASS: ACTIVE</div>
        <div className="mt-2 text-pink-500/50">THREAT_LVL: MINIMAL</div>
      </div>
      <div
        className="hidden sm:block fixed top-4 right-20 z-40 pointer-events-none text-sm text-pink-500/50 font-mono text-right space-y-1"
        role="presentation"
        aria-hidden="true"
      >
        <div>LOC: NIGHT_CITY</div>
        <div>SECTOR: WATSON</div>
        <div>TIME: {new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
        <div className="mt-2 text-cyan-400/50">EDDIES: ∞</div>
      </div>

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
                      <div>
                        <h1 className="text-3xl sm:text-4xl tracking-[0.2em] font-bold uppercase">
                          <GlitchText text={first} className="text-pink-500" intensity="high" />{' '}
                          <span className="text-white" aria-hidden="true">{'/'}</span>{' '}
                          <GlitchText text={rest.join(' ')} className="text-cyan-400" intensity="high" />
                        </h1>
                        <p className="mt-3 text-sm text-white/90">{headline}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`w-2 h-2 shrink-0 rounded-full bg-green-400 ${!reducedMotion ? 'animate-pulse' : ''}`}
                            style={{ boxShadow: '0 0 10px #00ff00' }}
                            aria-hidden="true"
                          />
                          <q className="text-sm text-pink-400 tracking-wider italic">{tagline}</q>
                        </div>
                        <p className="mt-2 text-sm text-cyan-300 font-mono">{line}</p>
                      </div>

                      <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
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

      {/* Neon signs - Night City advertising */}
      <div className="relative z-20 py-4" aria-hidden="true">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center gap-8 flex-wrap">
            <NeonSign text="NETRUNNER" subtext="CODE_MASTER" color="#00ffff" />
            <NeonSign text="CHROME" subtext="FULL_STACK" color="#ff00ff" />
            <NeonSign text="PREEM" subtext="ENGINEER" color="#ffff00" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Terminal header - V's access point */}
          <HolographicShimmer intensity="low">
            <div className="mb-8 p-4 bg-black/80 border border-cyan-400/30" role="region" aria-label="System terminal">
              <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 5px #ff0000' }} />
                <div className="w-3 h-3 rounded-full bg-yellow-500" style={{ boxShadow: '0 0 5px #ffff00' }} />
                <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 5px #00ff00' }} />
                <span className="ml-4 text-sm text-white/70 font-mono">v-term@night-city:~</span>
              </div>
              <TerminalLine prefix="$ " text="cat /netrunner/alex/profile.db" delay={0} />
              <TerminalLine prefix="> " text={view.hero.tagline} delay={800} />
              <TerminalLine prefix="$ " text={`set PROFESSION=${terminalName(active)}`} delay={2500} />
            </div>
          </HolographicShimmer>

          {/* Profession selector - Cyberware slot selection */}
          <ProfessionSwitch
            className="grid grid-cols-3 gap-4 mb-8"
            label="Select profession view"
            renderOption={({ id: prof, label, selected, optionProps }) => (
              <button
                type="button"
                {...optionProps}
                className={`p-4 text-left transition-all relative overflow-hidden ${
                  selected ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: selected
                    ? 'linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,255,0.1))'
                    : 'rgba(0,255,255,0.05)',
                  border: `2px solid ${selected ? '#ff00ff' : '#00ffff40'}`,
                  clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
                }}
              >
                {/* Animated scan line */}
                {selected && !reducedMotion && (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #ff00ff, transparent)',
                      animation: 'scan 2s linear infinite',
                    }}
                    aria-hidden="true"
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <CyberwareIcon type={PROFESSION_CYBERWARE[prof]} />
                    <span
                      className="text-sm tracking-wider font-mono"
                      style={{ color: selected ? '#ff00ff' : '#00ffff' }}
                    >
                      {label.toUpperCase()}
                    </span>
                  </div>
                  {selected && (
                    <span className="text-sm text-green-400 block mt-1 font-mono">[ACTIVE]</span>
                  )}
                </div>
              </button>
            )}
          />

          {/* The picked profession's sections, and only those */}
          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionPanels sections={view.sections} />
          </div>

          {/* ART SECTION 3 - Night City skyline break */}
          <CyberArtSection variant="skyline" />

          {/* Posts section - placeholder for future blog/posts content */}
          <div className="mb-8">
            <CyberPanel title="Posts" accentColor="#ff6600" holographic>
              <div className="text-center py-8">
                <div className="text-6xl mb-4 text-white/20 font-mono">&#123; &#125;</div>
                <p className="text-sm text-white/50 font-mono tracking-wider">
                  {'// DATA_FEED_PENDING'}
                </p>
                <p className="text-xs text-cyan-400/50 mt-2 font-mono">
                  Neural link required for content sync
                </p>
              </div>
            </CyberPanel>
          </div>
        </div>
      </main>

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-6" aria-labelledby="neon-contact-heading">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 id="neon-contact-heading" className="text-xl tracking-wider mb-3 font-mono text-cyan-400">
                  READY_TO_JACK_IN?
                </h2>
                <p className="text-sm font-mono text-pink-400">{line}</p>
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

      {/* Footer - System status */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" aria-hidden="true" />
          <span className="text-xs text-cyan-400/50 tracking-[0.3em] font-mono">NIGHT_CITY // {new Date().getFullYear()}</span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" aria-hidden="true" />
        </div>
        <p className="text-sm text-white/30 tracking-widest font-mono">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>

      {/* Animations - includes prefers-reduced-motion support */}
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
        @keyframes holo-shimmer {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-rain {
          animation: rain linear infinite;
        }
        .animate-holo-shimmer {
          animation: holo-shimmer 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff00ff, #00ffff);
          border-radius: 2px;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fall,
          .animate-rain,
          .animate-pulse,
          .animate-holo-shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
