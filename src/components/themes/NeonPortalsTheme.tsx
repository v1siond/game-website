'use client'

import { Luckiest_Guy, Nunito } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { Arrival } from './NeonPortals/arrival'
import { SaveMonitor } from './NeonPortals/monitor'
import { PORTAL_VARS } from './NeonPortals/palette'
import { SECTION_VIEWS } from './NeonPortals/views'
import { WorldCanvas } from './NeonPortals/world'
import css from './NeonPortals/portals.module.css'

// The world's lettering: fat rounded cartoon capitals for the name and the level names (--np-face, also read
// by the outfit plate's css), a round sans for the text (--np-body).
const portalFace = Luckiest_Guy({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--np-face' })
const portalBody = Nunito({ subsets: ['latin'], display: 'swap', variable: '--np-body' })

// Neon Portals: the time machine platformer of 1998 (Warped, named in code only) with him as its hero. The
// page is the warp room and the levels it opens, in real low poly 3D (three.js): the first screen is the room,
// its three pads the profession switch (arrival.tsx); each section is a level in one of the game's eras that
// he runs through as the page scrolls, the camera trailing him into the screen (views.tsx, level.ts); the
// contact is the hub's save monitor (monitor.tsx). Every window draws through one shared WebGL canvas behind
// the page (world.tsx, engine.ts), and every CV string is DOM on panels, never on the 3D.
//
// The page and every CV string render on the first render; three.js starts in effects afterwards, into
// windows that already hold their size. Still mode (reduced motion or a World Select preview) stops every
// loop and animation and draws stills.
// The root clips sideways overflow with overflow-x: clip, not hidden, so it never becomes a scroll container.

export default function NeonPortalsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation } = useLabels()
  const reduced = useReducedMotion()
  const preview = usePreview()
  const still = reduced || preview

  return (
    <div
      style={PORTAL_VARS}
      data-still={still || undefined}
      className={`relative min-h-screen overflow-x-clip [--focus-ring:var(--np-gold)] [--focus-halo:var(--np-void)] ${css.root} ${portalFace.variable} ${portalBody.variable}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[color:var(--np-white)] focus:px-4 focus:py-2 focus:text-[color:var(--np-void)]"
      >
        {navigation.skipToContent}
      </a>

      <WorldCanvas still={still}>
        <header className="relative z-10">
          <Arrival profession={active} still={still} />
        </header>

        <main id="main-content" className="relative z-10 px-4 pt-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <SaveMonitor profession={active} />
      </WorldCanvas>

      <footer className="relative z-10 py-8 text-center">
        <p className="text-sm text-[color:var(--np-muted)]">
          &copy; {new Date().getFullYear()} <NameWords name={view.hero.name} />
        </p>
      </footer>
    </div>
  )
}
