'use client'

import { useEffect, useRef, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { NoirBackdrop } from './BoldNoir/backdrop'
import { CallingCardHero } from './BoldNoir/hero'
import { ProfessionMenu } from './BoldNoir/menu'
import { ProfessionSet } from './BoldNoir/sets'
import { SECTION_VIEWS } from './BoldNoir/sections'
import { DeliveredCard } from './BoldNoir/contact'
import { NOIR_VARS } from './BoldNoir/palette'
import world from './BoldNoir/world.module.css'

// Bold Noir, a stylish heist night (black slabs and paper on crooked boxes,
// one loud red, ransom note lettering, star bursts and glass): the page composition. The hero is a
// calling card thrown at the screen, the profession switch is the game's menu with its cut-in over his
// set for that profession (./BoldNoir/sets), a project
// opens through the finisher onto its finish card, contact is the second calling card. The art, the
// cards, his costume and the per profession sections live in ./BoldNoir.
//
// The root carries the palette as --noir-* variables and the pointer as --mx and --my (-1 to 1), the
// only inline styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden:
// hidden would make the root a scroll container.

/**
 * Writes the pointer's place on the element as --mx and --my, -1 to 1 from the viewport centre: one
 * passive listener, at most one write a frame. Off until the element is drawn and under reduced
 * motion, where the layers stay still.
 */
function usePointerVars(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return
    let frame = 0
    let x = 0
    let y = 0

    const write = () => {
      frame = 0
      element.style.setProperty('--mx', x.toFixed(3))
      element.style.setProperty('--my', y.toFixed(3))
    }
    const onMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1
      y = (event.clientY / window.innerHeight) * 2 - 1
      if (!frame) frame = window.requestAnimationFrame(write)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  return ref
}

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`} style={NOIR_VARS}>
      <NoirBackdrop />

      <header className="relative z-30 px-4 py-10 sm:px-6 sm:py-16">
        <CallingCardHero />
      </header>

      <section className="relative z-20 px-4 py-8" aria-label="Profession selection">
        <ProfessionMenu active={active} />
        <div className="mt-10">
          <ProfessionSet key={active} profession={active} />
        </div>
      </section>

      <main className="relative z-20 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <DeliveredCard />

      <footer className="relative z-20 flex items-center justify-center gap-3 py-10" role="contentinfo">
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
        <p className={`text-sm text-[color:var(--noir-fog)] ${world.copy}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
      </footer>
    </div>
  )
}
