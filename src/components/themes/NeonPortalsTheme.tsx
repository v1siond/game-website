'use client'

import { Luckiest_Guy, Nunito } from 'next/font/google'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useProfession } from '@/contexts/ProfessionContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ZoneStageProvider, useZoneStore } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import { usePreview } from '@/themes/PreviewContext'
import { CopyrightLine } from './shared/CopyrightLine'
import { FindProvider } from './shared/finds'
import { BODY } from './NeonPortals/cards'
import { HubHero } from './NeonPortals/hero'
import { PORTAL_VARS, type Era } from './NeonPortals/palette'
import { SECTION_VIEWS, useFindTotals } from './NeonPortals/sections'

// The world's lettering: fat rounded cartoon capitals for his name, the level names and the tally's digits
// (--np-face, also read by the outfit plate's css), a round sans for the reading text (--np-body).
const portalFace = Luckiest_Guy({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--np-face' })
const portalBody = Nunito({ subsets: ['latin'], display: 'swap', variable: '--np-body' })

// Neon Portals: his CV as a run through a time machine's warp rooms, played the way the third game of the
// time travel platformer series is played, read in its 2D art. He arrives on the hub at night (hero.tsx):
// the round platform over a dark sea, his name on the title plate with the clock ring behind it. The
// profession switch is the hub's three pads (pads.tsx); a pick hops him onto that pad and the glass sphere
// over it shows that profession's room. Each section is a level in an era of its own (sections.tsx), and
// in each he does that level's thing to the CV items: About, he pulls the count box's plunger and its
// panel opens on his bio (countBox.tsx); Work Experience, he runs the path past a checkpoint post per job
// (checkpoints.tsx); Tech Stack, he spins and every X braced box breaks open on its category
// (techBoxes.tsx); Services, he head butts the iron box and every service turns solid (ironBox.tsx);
// Projects, he points at the warp sphere the visitor picks (spheres.tsx); Ventures, he runs for the gem on
// each venture (gems.tsx); Bands, he drums a roll on each band's box until its lid springs (bounceBoxes.tsx);
// Muay Thai, the carved mask comes a step per title until it covers his face and he takes the victory
// knee (masks.tsx). The thread is the box counter's hologram, the tally of what he has opened
// (tally.tsx); Contact is the hub's save monitor, where a full tally turns into the gem (saveMonitor.tsx).
// Behind it all the night over the sea dresses itself in the era of the section in view (backdrop.tsx).
//
// The root sets the palette as --np-* variables, the only inline style, and clips sideways overflow with
// overflow-x: clip, not hidden, so it never becomes a scroll container.

export default function NeonPortalsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reduced = useReducedMotion()
  const preview = usePreview()
  const { stage } = useZoneStore<Era>('hub', reduced)
  const totals = useFindTotals()

  return (
    <FindProvider totals={totals} full={reduced || preview}>
      <div
        style={PORTAL_VARS}
        className={`relative min-h-screen overflow-x-clip bg-[color:var(--np-void)] text-[color:var(--np-white)] [--focus-ring:var(--np-gold)] [--focus-halo:var(--np-void)] ${BODY} ${portalFace.variable} ${portalBody.variable}`}
      >
        <a
          href="#portals-main"
          className="sr-only z-50 rounded-full bg-[color:var(--np-gold)] px-4 py-2 font-bold text-[color:var(--np-ink)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          {navigation.skipToContent}
        </a>

        <ZoneStageProvider value={stage}>
          <header className="relative z-10">
            <HubHero />
          </header>

          <main id="portals-main" className="relative z-10 pb-10">
            <div role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
              <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
            </div>
          </main>
        </ZoneStageProvider>

        <footer className="relative z-10 pb-12 text-center">
          <p className="inline-block rounded-full bg-[color:var(--np-board)] px-4 py-1.5 text-sm text-[color:var(--np-muted)]">
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </FindProvider>
  )
}
