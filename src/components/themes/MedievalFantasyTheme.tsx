'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ComponentType } from 'react'
import { Cinzel } from 'next/font/google'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useSiteLinks } from '@/components/cv/SiteLinks'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { NameWords } from '@/components/cv/NameWords'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { REALM, REALM_FACE, REALM_VARS } from './MedievalFantasy/palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { Theatre } from '@/components/themes/shared/theatre/Stage'
import { useTheatre } from '@/components/themes/shared/theatre/useTheatre'
import { RealmFrame } from './MedievalFantasy/panels'
import { HeroActions, RealmButton, RealmLanguageMenu } from './MedievalFantasy/actions'
import { FrostArtDivider } from './MedievalFantasy/ornaments'
import { BlightPaths, ProfessionNode } from './MedievalFantasy/professions'
import { ArtDivider, CARDS, REALM_OF, type SectionLayout } from './MedievalFantasy/sections'
import { REALM_MOTION, RealmStage, scenesOf, type RealmScene } from './MedievalFantasy/scenes'
import look from './MedievalFantasy/world.module.css'

// Medieval Fantasy: the page composition. Its palette, lands, frames, buttons, cards, ornaments and per
// profession sections live in ./MedievalFantasy. The hero stands on the chaos battlefield with the golem
// whole. Then each section is a full screen stage of its realm that rises from the dark, holds while its
// frame scrolls over it and sinks as the next rises (the shared theatre on the scroll stage engine), and on
// it the realm acts once per card (./MedievalFantasy/scenes.tsx): the golem rises on the chaos field, the
// frost king's spires grow on the ice. The contact stands before the ice throne. Under reduced motion every
// section carries its own stage, still at its settled frame.

// The realm's carved capitals, Cinzel (an inscriptional Roman face): the root carries its --realm-face
// variable and every text style reads it through REALM_FACE.
const realmFace = Cinzel({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--realm-face',
})

// His outfit plate: a dark iron plaque with lifted gold lettering and a gold rim, like the realm's frames.
const OUTFIT_LOOK: WardrobeLook = { plate: REALM.bgVoid, text: REALM.goldText, ring: REALM.goldMid }

// A window 800 px tall or more spaces the sections and art dividers 4rem apart and draws the dividers
// larger; a shorter window keeps them 3rem apart with smaller dividers. Both are built once, so the sections
// fed a layout keep it across renders.
const LARGE_SCREEN_HEIGHT = 800

const LAYOUT: Record<'large' | 'small', SectionLayout> = {
  large: { sectionSpacing: '4rem', artDividerMargin: '4rem', artDividerScale: 1.3 },
  small: { sectionSpacing: '3rem', artDividerMargin: '3rem', artDividerScale: 1.1 },
}

// The world renders only in the browser (the server sends the default world), so its first render can read
// the window and lay the page out for its height at once, with no shift after mount.
const isLargeWindow = (): boolean => window.innerHeight >= LARGE_SCREEN_HEIGHT

// The root's palette variables and base look, built once instead of on every render.
const ROOT_STYLE: CSSProperties = { ...REALM_VARS, minHeight: '100vh', overflowX: 'clip', background: REALM.bgVoid, fontFamily: REALM_FACE, color: REALM.textBright }

// The column a frame reads in: beside the stage from lg, on the left of a chaos stage (the golem on its right)
// and on the right of a frost stage (the frost king on its left), there held 9.5rem in from the side so the
// worlds launcher fixed in the top right corner never sits over its text; below lg the whole width, the stage
// showing in the screens of picture alone above and below it.
const COLUMN = { chaos: 'mx-auto max-w-[900px] lg:mx-0 lg:w-[min(42rem,46vw)]', frost: 'mx-auto max-w-[900px] lg:mr-[9.5rem] lg:w-[min(42rem,46vw)]' }
const SIDE = 'px-[clamp(1rem,4vw,2rem)] lg:px-[clamp(1.5rem,4vw,4rem)]'

interface SectionProps {
  scene: RealmScene & { slot: SectionSlot }
  layout: SectionLayout
  isLargeScreen: boolean
  still: boolean
}

type FrameView = ComponentType<{ slot: SectionSlot; layout: SectionLayout; isLargeScreen: boolean }>

/** One section: a screen of its stage alone, then its frame over the held stage, then the stage again. */
function RealmSection({ scene, layout, isLargeScreen, still }: SectionProps) {
  const Frame = CARDS[scene.slot.id] as FrameView
  return (
    <div data-scene={scene.id} className={`relative pb-[70svh] ${SIDE}`}>
      {still && <RealmStage scene={scene} settled />}
      <div className="min-h-[100svh]" />
      <div className={COLUMN[REALM_OF[scene.slot.id]]}>
        <Frame slot={scene.slot} layout={layout} isLargeScreen={isLargeScreen} />
      </div>
    </div>
  )
}

export default function MedievalFantasyTheme() {
  const view = useWorldView()
  const labels = useLabels()
  const { navigation, actions: actionLabels, sections } = labels
  const active = view.profession
  const { cv, engine } = useSiteLinks()
  const { professionalSummary } = useCVData()
  const { highlights } = useAboutBlock()
  const reduced = useReducedMotion()
  const [isLargeScreen, setIsLargeScreen] = useState(isLargeWindow)

  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), labels, highlights),
    [view.sections, professionalSummary.bio, labels, highlights],
  )
  const { theatreRef, textRef } = useTheatre(scenes, REALM_MOTION, reduced)
  const realms = scenes.filter((scene): scene is RealmScene & { slot: SectionSlot } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  // The spacing follows the window height; a resize re-renders the page only when it crosses 800 px.
  useEffect(() => {
    const measure = () => setIsLargeScreen(isLargeWindow())
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])

  const layout = LAYOUT[isLargeScreen ? 'large' : 'small']
  const { sectionSpacing } = layout

  return (
    <div className={`relative [--focus-ring:var(--realm-gold-bright)] [--focus-halo:var(--realm-bg-void)] ${look.root} ${realmFace.variable}`} style={ROOT_STYLE}>
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <RealmStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}

      <div ref={textRef} className="relative z-10">
        {reduced && <RealmStage scene={scenes[0]} settled />}
        <div style={{ position: 'relative', padding: 'clamp(1rem, 4vw, 2rem)', maxWidth: '900px', margin: '0 auto' }}>

          {/* Header - wrapped in high z-index container so it sits above the scene */}
          <div style={{ position: 'relative', zIndex: 100 }}>
            <header data-worlds-hero="" className="relative" style={{ marginBottom: sectionSpacing }}>
              <RealmFrame zone="chaos">
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
                        <HeroActions actions={actions} />
                        <RealmButton href={cv.linkProps.href}>{cv.label}</RealmButton>
                        <RealmButton linkProps={engine.linkProps}>{engine.label}</RealmButton>
                        <LanguageSwitcher render={(state) => <RealmLanguageMenu {...state} />} />
                      </div>
                    </div>
                  )}
                />
              </RealmFrame>
              {/* out of the page flow so the realm keeps its places: in the frame's top right corner beside his name
                  from lg, under the frame in the header's bottom margin below it */}
              <Wardrobe look={OUTFIT_LOOK} className="c-wardrobe--fan-down-below-lg max-sm:[--wd-fan-gap:-74px] sm:max-lg:[--wd-fan-gap:180px] c-wardrobe--fan-down-from-lg lg:[--wd-fan-gap:208px] absolute inset-x-0 top-[calc(100%_+_4px)] z-10 lg:inset-x-auto lg:right-[39px] lg:top-[18px]" />
            </header>
          </div>

          {/* Profession Selector - REALM Style Command Card */}
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
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${REALM.chaosBlightDark}15 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Profession nodes over the blight paths that join them */}
            <div className={`relative w-full h-full ${isLargeScreen ? 'max-w-[700px]' : 'max-w-[500px]'}`}>
              <BlightPaths active={active} isLargeScreen={isLargeScreen} />
              <ProfessionSwitch
                label={navigation.professionSelection}
                className="relative flex justify-between items-stretch w-full px-0 sm:px-4 h-full py-2"
                renderOption={(option) => <ProfessionNode option={option} isLargeScreen={isLargeScreen} />}
              />
            </div>
          </section>
        </div>

        <main id="main-content">
          <ProfessionRegion>
            {realms.map((scene) => (
              <RealmSection key={scene.id} scene={scene} layout={layout} isLargeScreen={isLargeScreen} still={reduced} />
            ))}
          </ProfessionRegion>

          {/* Contact: no card, the call and his line on a plate before the ice throne. */}
          <div data-scene="contact" className={`relative pb-[30svh] pt-[60svh] ${SIDE}`}>
            {reduced && <RealmStage scene={contact} settled />}
            <div className="relative mx-auto max-w-[900px]">
              {/* === Frost Art Divider: Ice Throne === */}
              <ArtDivider layout={layout}>
                <FrostArtDivider variant="throne" scale={layout.artDividerScale} />
              </ArtDivider>
              <section aria-label={sections.contact} className={look.plate} style={{ marginBottom: sectionSpacing, textAlign: 'center', padding: '2rem 1rem' }}>
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
                        {actionLabels.emailMe}
                      </h2>
                      <p style={{ color: REALM.textMid, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{line}</p>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <HeroActions actions={actions} />
                        <RealmButton href={cv.linkProps.href}>{cv.label}</RealmButton>
                      </div>
                    </>
                  )}
                />
              </section>
            </div>
          </div>
        </main>

        <footer className={look.plate} style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>
          <p style={{ color: REALM.textDim, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </div>
  )
}
