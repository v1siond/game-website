'use client'

import { useEffect, useState } from 'react'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { DwellerSprite, type RadioMotion } from './dweller'

// Bands as his radio dance, the first cell of the receiver panel (radio.tsx). He holds the bakelite radio
// level against his chest in his left hand. When a station is tuned his right hand goes to the knob and
// turns it while the dial needle glides (the knob, the dial window's needle and his forearm all read the
// receiver's --needle, so they move with the scale's needle); TUNE_MS later, once the needle has settled,
// he lets go and dances that station's own step, picked by its place in the list. Retuning puts his hand
// back on the knob first. Before the section is on, and under reduced motion, he stands holding it with
// his hand on the knob. He wears the jumpsuit: the musician's snare and sticks belong to the other poses.

const TUNE_MS = 700

const STEPS: RadioMotion[] = ['sway', 'twist', 'shuffle', 'bop']

export function RadioDancer({ tuned, on }: { tuned: number; on: boolean }) {
  const { reduced } = useZoneStageContext()
  const [dancing, setDancing] = useState<number | null>(null)

  useEffect(() => {
    if (reduced || !on) return
    const timer = window.setTimeout(() => setDancing(tuned), TUNE_MS)
    return () => window.clearTimeout(timer)
  }, [tuned, on, reduced])

  const motion: RadioMotion = on && !reduced && dancing === tuned ? STEPS[tuned % STEPS.length] : 'tune'

  return (
    <div className="row-span-2 h-32 w-[5.5rem] self-end md:row-span-1 md:h-40 md:w-28" aria-hidden="true">
      <DwellerSprite profession="engineer" motion={motion} className="h-full w-full" />
    </div>
  )
}
