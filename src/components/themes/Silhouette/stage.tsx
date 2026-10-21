import type { CSSProperties, ReactNode } from 'react'
import type { Band } from '@/lib/cv/content'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'
import shade from './shade.module.css'

// The bands on an electrified floor, the floor a silhouette puzzle platformer powers from a switch panel
// so the boy must cross it by the chain above: each band is a steel plate on a cable, and the current
// runs the cable plate to plate in a steady four count, each plate's edge lighting on its beat the way
// a drum machine steps through a bar. The plates stand in one row on a wide screen, two by two on a
// tablet and in one column down the cable on a phone. The current stops under reduced motion, every
// plate edge lit.
//
// Animated: one current per band.

const LINK_FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)]'

// The four bolts holding a plate down, one per corner.
const BOLTS = ['left-1.5 top-1.5', 'right-1.5 top-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5']

function Plate({ index, link, children }: { index: number; link: BandSlot['linkProps']; children: ReactNode }) {
  const plate = (
    <div className={`relative h-full border-2 border-[color:var(--sh-black)] p-4 ${world.plate}`}>
      <div
        className={`pointer-events-none absolute -inset-px border-2 border-[color:var(--sh-rim)] ${shade.current}`}
        style={{ '--i': index } as CSSProperties}
        aria-hidden="true"
      />
      {BOLTS.map((corner) => (
        <span key={corner} className={`absolute h-1.5 w-1.5 rounded-full bg-[color:var(--sh-fog)] ${corner}`} aria-hidden="true" />
      ))}
      <div className="relative">{children}</div>
    </div>
  )
  if (!link) return plate
  return (
    <a {...link} className={`group block h-full ${LINK_FOCUS}`}>
      {plate}
    </a>
  )
}

export function ShockStage({ bands }: { bands: Band[] }) {
  const { links } = useLabels()

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute bottom-0 left-4 top-0 w-1 bg-[color:var(--sh-black)] lg:inset-x-0 lg:bottom-auto lg:top-1/2 lg:h-1 lg:w-auto"
        aria-hidden="true"
      />
      <BandList
        bands={bands}
        className="relative grid gap-6 pl-8 sm:grid-cols-2 lg:grid-cols-4 lg:pl-0"
        renderBand={({ band, years, linkProps }) => (
          <Plate index={bands.indexOf(band)} link={linkProps}>
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-[color:var(--sh-heading)] group-hover:underline">{band.name}</h3>
            <p className="mt-1 text-sm tracking-wider text-[color:var(--sh-muted)]">
              {band.role}
              {years && <span aria-hidden="true"> | </span>}
              {years}
            </p>
            {band.release && (
              <p className="mt-2 text-sm text-[color:var(--sh-text)]">
                {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
              </p>
            )}
          </Plate>
        )}
      />
    </div>
  )
}
