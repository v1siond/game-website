'use client'

import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { WC3 } from './MedievalFantasy/palette'
import { DualZoneAtmosphere } from './MedievalFantasy/backdrop'
import { WC3Frame } from './MedievalFantasy/panels'
import { HeroActions, WC3Button, WC3LanguageMenu } from './MedievalFantasy/actions'
import { FTArtDivider } from './MedievalFantasy/ornaments'
import { ProfessionNode } from './MedievalFantasy/professions'
import { ArtDivider, SECTION_VIEWS, type SectionLayout } from './MedievalFantasy/sections'

// Medieval Fantasy: the page composition. Its palette, backdrop, frames, buttons, cards, ornaments and
// per profession sections live in ./MedievalFantasy.

export default function MedievalFantasyTheme() {
  const view = useWorldView()
  const active = view.profession
  const [mounted, setMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(800)

  // Track viewport height for content visibility and animation spacing
  useEffect(() => {
    setMounted(true)
    setViewportHeight(window.innerHeight)

    const handleResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate available space - EXACT match to Dark Fantasy spacing
  // Dark Fantasy uses: py-6 md:py-8 (1.5rem/2rem padding) for sections, py-16 (4rem) for art dividers
  // Section gap in DF = bottom padding + top padding of next = 3rem (small) / 4rem (md+)
  // Art divider total padding = 8rem (4rem top + 4rem bottom), but we use margin so just 4rem each side
  const isLargeScreen = viewportHeight >= 800
  const layout: SectionLayout = {
    sectionSpacing: isLargeScreen ? '4rem' : '3rem',
    artDividerMargin: isLargeScreen ? '4rem' : '3rem',
    artDividerScale: isLargeScreen ? 1.3 : 1.1,
  }
  const { sectionSpacing } = layout

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: WC3.bgVoid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: WC3.textDim, fontFamily: '"Cinzel", Georgia, serif', letterSpacing: '0.2em' }}>LOADING...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: WC3.bgVoid, fontFamily: '"Cinzel", Georgia, serif', color: WC3.textBright }}>
      <DualZoneAtmosphere />

      {/* ============ MAIN CONTENT - Starts at top like Dark Fantasy ============ */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* ============ REIGN OF CHAOS ZONE ============ */}

        {/* Header - wrapped in high z-index container so it sits above the scene */}
        <div style={{ position: 'relative', zIndex: 100 }}>
        <ScrollScene>
          <header style={{ marginBottom: sectionSpacing }}>
            <WC3Frame zone="roc">
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <h1 style={{
                        color: WC3.goldBright,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        textShadow: `2px 2px 4px ${WC3.bgVoid}`,
                        marginBottom: '0.375rem'
                      }}>
                        {name}
                      </h1>
                      <p style={{ color: WC3.textBright, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{headline}</p>
                      <p style={{ color: WC3.textMid, fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '0.25rem' }}>{tagline}</p>
                      <p style={{ color: WC3.textBright, fontSize: '0.875rem' }}>{line}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <HeroActions actions={actions} zone="roc" />
                      <WC3Button href="/cv" zone="roc">CV</WC3Button>
                      <WC3Button href="/personal-projects/game-engine" zone="roc">Nebulith</WC3Button>
                      <LanguageSwitcher render={(state) => <WC3LanguageMenu {...state} />} />
                    </div>
                  </div>
                )}
              />
            </WC3Frame>
          </header>
        </ScrollScene>
        </div>

        {/* Profession Selector - WC3 Style Command Card */}
        <ScrollScene>
          <section aria-label="Select profession" style={{
            marginBottom: sectionSpacing,
            position: 'relative',
            height: isLargeScreen ? '12rem' : '9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${WC3.roc.felDark}15 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Connecting paths SVG */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="felPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={WC3.roc.felDark} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={WC3.roc.felMid} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={WC3.roc.felDark} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Left to center path */}
              <path
                d={isLargeScreen ? "M 20% 70% Q 35% 40%, 50% 50%" : "M 15% 75% Q 32% 45%, 50% 55%"}
                stroke="url(#felPathGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={active === 'drummer' ? "none" : "4 4"}
                style={{
                  filter: active === 'drummer' ? `drop-shadow(0 0 4px ${WC3.roc.felMid})` : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              {/* Center to right path */}
              <path
                d={isLargeScreen ? "M 50% 50% Q 65% 40%, 80% 70%" : "M 50% 55% Q 68% 45%, 85% 75%"}
                stroke="url(#felPathGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={active === 'fighter' ? "none" : "4 4"}
                style={{
                  filter: active === 'fighter' ? `drop-shadow(0 0 4px ${WC3.roc.felMid})` : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </svg>

            {/* Profession nodes */}
            <ProfessionSwitch
              label="Profession selector"
              className={`relative flex justify-between items-stretch w-full px-4 h-full py-2 ${isLargeScreen ? 'max-w-[700px]' : 'max-w-[500px]'}`}
              renderOption={(option) => <ProfessionNode option={option} isLargeScreen={isLargeScreen} />}
            />
          </section>
        </ScrollScene>

        <main>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} layout={layout} isLargeScreen={isLargeScreen} />
        </main>

        {/* === FT Art Divider: Ice Throne === */}
        <ArtDivider layout={layout}>
          <FTArtDivider variant="throne" scale={layout.artDividerScale} />
        </ArtDivider>

        {/* Contact - no card, floating text like Dark Fantasy */}
        <ScrollScene>
          <section aria-label="Contact" style={{ marginBottom: sectionSpacing, textAlign: 'center', padding: '2rem 0', marginTop: '-10vh' }}>
            <RecruiterHero
              render={({ line, actions }) => (
                <>
                  <h2 style={{
                    color: WC3.ft.iceBright,
                    fontSize: '1.125rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    textShadow: `0 0 20px ${WC3.ft.iceMid}40`,
                  }}>
                    Get In Touch
                  </h2>
                  <p style={{ color: WC3.textMid, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{line}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <HeroActions actions={actions} zone="ft" />
                    <WC3Button href="/cv" zone="ft">Download CV</WC3Button>
                  </div>
                </>
              )}
            />
          </section>
        </ScrollScene>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: '0.75rem' }}>
          <p style={{ color: WC3.textDim, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} {view.hero.name}
          </p>
        </footer>
      </div>
    </div>
  )
}
