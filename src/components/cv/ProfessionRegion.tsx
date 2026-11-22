'use client'

import type { ReactNode } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { fillLabel } from '@/lib/cv/labels'
import { useLabels } from './CVDataProvider'

// The shown profession's sections as one labelled region ("System Engineer details"), so a screen reader's
// landmark list reads the same in every world. The world passes its own class and children.
export function ProfessionRegion({ className, children }: { className?: string; children: ReactNode }) {
  const { active } = useProfession()
  const { navigation, professions } = useLabels()
  return (
    <div className={className} role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
      {children}
    </div>
  )
}
