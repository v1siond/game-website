'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import { DwellerSprite } from './dweller'
import { BRASS, CHROME, OLIVE, OLIVE_DARK, OLIVE_LIGHT, PHOSPHOR, POSTER_INK } from './palette'
import atomic from './atomic.module.css'
import j from './journey.module.css'

// Tech stack as looting a footlocker, the game's container screen. When the stage turns on he squats,
// grabs the olive locker off the floor and hoists it onto his shoulder in the wide, strained carry stance
// (the dweller's hoist motion), the lid flips open and the locker shakes once per pocket while each
// pocket of the inventory tumbles out of it into the panel below. The carry weight under him ticks up by
// that pocket's item count as it lands, the bar filling with it. The pour timing lives here once and
// reaches the CSS as --pour and --pocket on the wrapper; under reduced motion everything is in place and
// the weight is full from the start.

const POUR_MS = 1500
const POCKET_MS = 320

/** How many pockets have landed: none until the pour starts, then one more every POCKET_MS. */
function useLanded(on: boolean, total: number, instant: boolean) {
  const [landed, setLanded] = useState(0)

  useEffect(() => {
    if (instant || !on || landed >= total) return
    const timer = window.setTimeout(() => setLanded((count) => count + 1), landed === 0 ? POUR_MS + POCKET_MS : POCKET_MS)
    return () => window.clearTimeout(timer)
  }, [on, landed, total, instant])

  return instant ? total : landed
}

/** The olive drab footlocker seen from the front: steel corners, a brass latch, the lid on its side hinge. */
function Footlocker() {
  return (
    <svg viewBox="0 0 80 56" className="h-full w-full overflow-visible" focusable="false">
      <g className={j.lockerLid}>
        <rect x={6} y={10} width={68} height={12} rx={2} fill={OLIVE_LIGHT} stroke={POSTER_INK} strokeWidth={2.5} />
        <path d="M6 16 H74" stroke={OLIVE_DARK} strokeWidth={1.5} />
      </g>
      <rect x={9} y={22} width={62} height={6} fill={PHOSPHOR} className={j.lockerGlow} />
      <rect x={6} y={22} width={68} height={30} rx={2} fill={OLIVE} stroke={POSTER_INK} strokeWidth={2.5} />
      <path d="M6 30 H74 M6 44 H74" stroke={OLIVE_DARK} strokeWidth={2} />
      {[6, 66].map((x) => (
        <rect key={x} x={x} y={22} width={8} height={30} fill={CHROME} stroke={POSTER_INK} strokeWidth={1.5} />
      ))}
      <rect x={34} y={24} width={12} height={10} rx={1.5} fill={BRASS} stroke={POSTER_INK} strokeWidth={1.5} />
      <path d="M24 52 Q24 58 30 58 H50 Q56 58 56 52" fill="none" stroke={POSTER_INK} strokeWidth={2.5} />
    </svg>
  )
}

function CarryWeight({ weight, total }: { weight: number; total: number }) {
  const { hud } = useLabels()

  return (
    <div className={`min-w-0 flex-1 p-3 sm:max-w-sm ${atomic.panel}`}>
      <p className="text-sm font-bold uppercase tracking-widest text-atomic-phosphor">{fillLabel(hud.carryWeight, { count: weight, total })}</p>
      <span className="mt-2 block h-3 w-full overflow-hidden border border-atomic-phosphor" aria-hidden="true">
        <span className={`block h-full w-full origin-left bg-atomic-phosphor ${j.weightFill}`} style={{ '--weight': total ? weight / total : 0 } as CSSProperties} />
      </span>
    </div>
  )
}

export function Loot({ categories, on, children }: { categories: CVData['techStack']; on: boolean; children: ReactNode }) {
  const { reduced } = useZoneStageContext()
  const landed = useLanded(on, categories.length, reduced)
  const weight = categories.slice(0, landed).reduce((sum, category) => sum + category.items.length, 0)
  const total = categories.reduce((sum, category) => sum + category.items.length, 0)
  const timing = { '--pour': `${POUR_MS}ms`, '--pocket': `${POCKET_MS}ms`, '--pockets': categories.length } as CSSProperties

  return (
    <div style={timing}>
      <div className="mb-4 flex items-end gap-4 sm:gap-6">
        <div className="relative ml-8 h-32 w-[5.4rem] shrink-0" aria-hidden="true">
          <span className={`absolute -left-6 -top-9 block h-14 w-20 ${j.locker}`}>
            <span className={`block h-full w-full ${j.lockerShake}`}>
              <Footlocker />
            </span>
          </span>
          <DwellerSprite profession="engineer" motion={on ? 'hoist' : 'still'} className="absolute inset-0 h-full w-full" />
        </div>
        <CarryWeight weight={weight} total={total} />
      </div>
      {children}
    </div>
  )
}
