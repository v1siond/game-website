'use client'

import Link from 'next/link'
import { Poiret_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { PostsGate } from '@/components/cv/PostsGate'
import { usePosts } from '@/components/blog/BlogProvider'
import { BLOG_PATH, postLinks } from '@/lib/blog/links'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ZoneStageProvider, useZoneAttribute, useZoneStore } from '@/hooks/useZoneStage'
import { DECO_COLORS as C, DECO_VARS } from './ArtDeco/palette'
import {
  AbyssVeil,
  DecoPatternBackground,
  DecoSVGDefs,
  DepthZone,
  DrownedSkyline,
  UnderwaterBubbles,
  UnderwaterRays,
  WaterCaustics,
  type DecoZone,
} from './ArtDeco/backdrop'
import { GOLD_OUTLINE } from './ArtDeco/actions'
import { BathysphereHero } from './ArtDeco/descent'
import { VendingMachine } from './ArtDeco/machine'
import { BrassPanel, Chamber } from './ArtDeco/plaque'
import { POSTS_DEPTH, SECTION_VIEWS } from './ArtDeco/sections'
import { VitaChamber } from './ArtDeco/vita'
import look from './ArtDeco/world.module.css'

// The world's own lettering: the root carries its --deco-face variable and the world's css reads it.
const decoFace = Poiret_One({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--deco-face' })

// Art Deco, the 1920s city at the bottom of the sea in brass, gold and lamplight: the page composition.
// The visitor arrives in the bathysphere as it sinks past the lighthouse to the city (the hero), picks a
// profession at the city's vending machine, then goes down through the chambers of the picked profession
// (./ArtDeco/sections) and leaves through the bulkhead hatch (contact). The root carries the palette as
// --deco-* variables, the pointer as --mx and --my for the porthole parallax and the camera viewfinder,
// and the depth zone in view as data-zone, which the fixed backdrop fades to (./ArtDeco/backdrop).
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and break the fixed viewfinder's place.

// The latest posts on the brass panel: each title a cream link with its date in mist, and the gold
// outline button to the whole list.
function DecoPosts() {
  const { blog } = useLabels()
  const links = postLinks(usePosts())
  if (!links) return null

  return (
    <>
      <ul className="divide-y divide-[color:var(--deco-gold)]/30">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex min-h-[44px] flex-col justify-center gap-1 py-3 text-[color:var(--deco-cream)] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="text-lg underline decoration-[color:var(--deco-gold)] underline-offset-4">{link.title}</span>
              <time dateTime={link.date} className="shrink-0 text-sm uppercase tracking-wider text-[color:var(--deco-mist)]">
                {link.shownDate}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <Link href={BLOG_PATH} className={GOLD_OUTLINE}>
          {blog.allPosts}
        </Link>
      </div>
    </>
  )
}

export default function ArtDecoTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, blog } = useLabels()
  const reducedMotion = useReducedMotion()
  const pointer = usePointerVars(!reducedMotion)
  const { zones, stage } = useZoneStore<DecoZone>('surface', reducedMotion)
  useZoneAttribute(zones, pointer)

  return (
    <ZoneStageProvider value={stage}>
      <div ref={pointer} style={DECO_VARS} data-zone={zones.first()} className={`relative min-h-screen overflow-x-clip ${look.root} ${decoFace.variable}`}>
        <DecoSVGDefs />

        <DecoPatternBackground />
        <UnderwaterRays />
        <DrownedSkyline />
        <WaterCaustics />
        <UnderwaterBubbles />
        <AbyssVeil />
        <div className={`pointer-events-none fixed inset-0 z-[7] ${look.vignette}`} aria-hidden="true" />

        {/* the first screen: his name at the surface and the machine where he stands */}
        <div data-worlds-hero="">
          <header className="relative z-30 px-4 pb-6 pt-10 sm:px-6 sm:pt-16">
            <DepthZone zone="surface">
              <BathysphereHero />
            </DepthZone>
          </header>

          <section className="relative z-20 px-4 py-8" aria-label={navigation.professionSelection}>
            <VendingMachine />
          </section>
        </div>

        <main className="relative z-20 px-4 py-16 sm:px-8">
          <ProfessionRegion className="mx-auto max-w-6xl">
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

            <PostsGate>
              <div className="pt-20">
                <FadeInScene>
                  <Chamber title={blog.latestPosts} depth={POSTS_DEPTH[active]}>
                    <BrassPanel>
                      <DecoPosts />
                    </BrassPanel>
                  </Chamber>
                </FadeInScene>
              </div>
            </PostsGate>
          </ProfessionRegion>
        </main>

        <DepthZone zone="abyss">
          <VitaChamber />
        </DepthZone>

        <footer className="relative z-20 flex justify-center py-12" aria-hidden="true">
          <svg width="50" height="80" viewBox="0 0 50 80" opacity="0.25" focusable="false">
            <path d="M18 80 L13 45 L37 45 L32 80" fill={C.gold} />
            <path d="M15 65 L35 65" stroke={C.bronzeDark} strokeWidth="2" />
            <rect x="10" y="25" width="30" height="20" fill={C.gold} />
            <path d="M8 25 L25 10 L42 25" fill={C.gold} />
            <circle cx="25" cy="35" r="8" fill={C.goldBright} opacity="0.8" />
            <path d="M25 27 L25 12 M17 30 L5 25 M33 30 L45 25" stroke={C.goldBright} strokeWidth="1.5" opacity="0.6" />
          </svg>
        </footer>
      </div>
    </ZoneStageProvider>
  )
}
