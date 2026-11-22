'use client'

import { Marcellus } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { CopyrightLine } from './shared/CopyrightLine'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { CARVED, SOUL_VARS } from './SoulMap/palette'
import { RunProvider } from './SoulMap/run'
import { AshFall } from './SoulMap/ash'
import { ShrineHero } from './SoulMap/shrine'
import { ClassSelect } from './SoulMap/classSelect'
import { SECTION_VIEWS } from './SoulMap/views'
import { LastFire } from './SoulMap/lastFire'
import { RunOverlay } from './SoulMap/hud'
import ashen from './SoulMap/ashen.module.css'

// The carved serif, Marcellus, the closest free face to the banner capitals the world was drawn for: the
// root carries its --soul-carved variable and CARVED reads it.
const soulCarved = Marcellus({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--soul-carved',
})

// Soul Map: the ash and bonfire world of a hard knight action game (named in code only), played the way
// that game is played. The hero is the ruined shrine at dusk where the fire is kindled (./SoulMap/shrine),
// the profession switch is the class pick with its status sheet (classSelect), and each profession's
// sections are that game's own mechanics (views): the lift ride down through the jobs, items to pick up,
// messages on the floor, summon signs, a bout behind a fog wall. Contact is the last fire to kindle
// (lastFire). The run (run.tsx) keeps the souls, health, stamina and the flask that the HUD shows (hud).
//
// The root carries the palette as --soul-* variables and the pointer as --mx and --my (usePointerVars),
// the only inline styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden,
// so the root never becomes a scroll container. The footer leaves room for the fixed HUD.

export default function SoulMapTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const reducedMotion = useReducedMotion()
  const rootRef = usePointerVars(!reducedMotion)

  return (
    <RunProvider>
      <div ref={rootRef} className={`relative min-h-screen overflow-x-clip [--focus-ring:var(--soul-glow)] [--focus-halo:var(--soul-abyss)] ${CARVED} ${ashen.world} ${soulCarved.variable}`} style={SOUL_VARS}>
        <SkipLink />
        <AshFall />

        <header className="relative z-20">
          <ShrineHero />
        </header>

        <div className="relative z-20">
          <ClassSelect />
        </div>

        <main id="main-content" className="relative z-20">
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </main>

        <div className="relative z-20">
          <LastFire profession={active} />
        </div>

        <footer className="relative z-20 pb-20 pt-6 text-center sm:pb-28">
          <p className="text-sm text-[color:var(--soul-text-soft)]">
            <CopyrightLine />
          </p>
        </footer>

        <RunOverlay />
      </div>
    </RunProvider>
  )
}
