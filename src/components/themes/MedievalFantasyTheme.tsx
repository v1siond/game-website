'use client'

import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { NameWords } from '@/components/cv/NameWords'
import { REALM, REALM_VARS } from './MedievalFantasy/palette'
import { DualZoneAtmosphere } from './MedievalFantasy/backdrop'
import { RealmFrame } from './MedievalFantasy/panels'
import { HeroActions, RealmButton, RealmLanguageMenu } from './MedievalFantasy/actions'
import { FTArtDivider } from './MedievalFantasy/ornaments'
import { FelPaths, ProfessionNode } from './MedievalFantasy/professions'
import { ArtDivider, SECTION_VIEWS, type SectionLayout } from './MedievalFantasy/sections'
import { ENGINE_LINK } from '@/lib/engineLink'

// Medieval Fantasy: the page composition. Its palette, backdrop, frames, buttons, cards, ornaments and
// per profession sections live in ./MedievalFantasy.

export default function MedievalFantasyTheme() {
  const view = useWorldView()
  const { navigation, actions: actionLabels, sections } = useLabels()
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
      <div style={{ minHeight: '100vh', background: REALM.bgVoid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: REALM.textDim, fontFamily: '"Cinzel", Georgia, serif', letterSpacing: '0.2em' }}>{navigation.loading.toUpperCase()}</p>
      </div>
    )
  }

  return (
    <div style={{ ...REALM_VARS, minHeight: '100vh', overflowX: 'clip', background: REALM.bgVoid, fontFamily: '"Cinzel", Georgia, serif', color: REALM.textBright }}>
      <DualZoneAtmosphere />

      {/* ============ MAIN CONTENT - Starts at top like Dark Fantasy ============ */}
      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(1rem, 4vw, 2rem)', maxWidth: '900px', margin: '0 auto' }}>

        {/* ============ REIGN OF CHAOS ZONE ============ */}

        {/* Header - wrapped in high z-index container so it sits above the scene */}
        <div style={{ position: 'relative', zIndex: 100 }}>
        <ScrollScene>
          <header style={{ marginBottom: sectionSpacing }}>
            <RealmFrame zone="roc">
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <h1 style={{
                        color: REALM.goldBright,
                        fontSize: 'clamp(1.25rem, 6.5vw, 1.5rem)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        textShadow: `2px 2px 4px ${REALM.bgVoid}`,
                        marginBottom: '0.375rem'
                      }}>
                        <NameWords name={name} />
                      </h1>
                      <p style={{ color: REALM.textBright, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{headline}</p>
                      <p style={{ color: REALM.textMid, fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '0.25rem' }}>{tagline}</p>
                      <p style={{ color: REALM.textBright, fontSize: '0.875rem' }}>{line}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <HeroActions actions={actions} zone="roc" />
                      <RealmButton href="/cv" zone="roc">{actionLabels.cv}</RealmButton>
                      <RealmButton linkProps={ENGINE_LINK} zone="roc">{actionLabels.engine}</RealmButton>
                      <LanguageSwitcher render={(state) => <RealmLanguageMenu {...state} />} />
                    </div>
                  </div>
                )}
              />
            </RealmFrame>
          </header>
        </ScrollScene>
        </div>

        {/* Profession Selector - REALM Style Command Card */}
        <ScrollScene>
          <section aria-label={navigation.professionSelection} style={{
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
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${REALM.chaosFelDark}15 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Profession nodes over the fel paths that join them */}
            <div className={`relative w-full h-full ${isLargeScreen ? 'max-w-[700px]' : 'max-w-[500px]'}`}>
              <FelPaths active={active} isLargeScreen={isLargeScreen} />
              <ProfessionSwitch
                label={navigation.professionSelection}
                className="relative flex justify-between items-stretch w-full px-0 sm:px-4 h-full py-2"
                renderOption={(option) => <ProfessionNode option={option} isLargeScreen={isLargeScreen} />}
              />
            </div>
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
          <section aria-label={sections.contact} style={{ marginBottom: sectionSpacing, textAlign: 'center', padding: '2rem 0', marginTop: '-10vh' }}>
            <RecruiterHero
              render={({ line, actions }) => (
                <>
                  <h2 style={{
                    color: REALM.frostIceBright,
                    fontSize: '1.125rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    textShadow: `0 0 20px ${REALM.frostIceMid}40`,
                  }}>
                    {actionLabels.getInTouch}
                  </h2>
                  <p style={{ color: REALM.textMid, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{line}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <HeroActions actions={actions} zone="ft" />
                    <RealmButton href="/cv" zone="ft">{actionLabels.downloadCv}</RealmButton>
                  </div>
                </>
              )}
            />
          </section>
        </ScrollScene>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: '0.75rem' }}>
          <p style={{ color: REALM.textDim, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} <NameWords name={view.hero.name} />
          </p>
        </footer>
      </div>
    </div>
  )
}
