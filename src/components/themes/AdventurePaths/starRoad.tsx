'use client'

import { useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince } from '@/components/cv/sectionText'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import type { Band, Musician } from '@/lib/cv/content'
import { cssVars } from './art'
import { MapBanner, MapFrame, PAPER_CARD, Region } from './region'
import { JOURNAL_SERIF, TRAIL } from './palette'
import { shareOf, type Point } from './trail'
import { TrailWalker } from './walker'
import map from './map.module.css'

// The bands as the star road, the overworld's hidden road through the night sky: one warp star per band
// along an arc of small stars, current band first. He stands on a star. Pointing at a band card, or
// pressing its star, makes him spin and rise out of sight and drop onto that band's star, the way
// stepping onto a star tile spins the hero up and away to the next one. Under reduced motion he moves
// at once.

const SKY = { width: 1000, height: 260 } as const
const WARP_OUT_MS = 380

/** A point on the road's arc across the sky, `share` 0 at the left end to 1 at the right. */
const arcPoint = (share: number): Point => [share * SKY.width, 170 - Math.sin(share * Math.PI) * 90]

/** A band's star: spread evenly along the arc. */
const starPoint = (index: number, count: number): Point => arcPoint(count === 1 ? 0.5 : 0.12 + (0.76 * index) / (count - 1))

const ROAD = Array.from({ length: 24 }, (_, index) => arcPoint(0.02 + (0.96 * index) / 23))

const STAR_PATH = 'M0 -1 L0.29 -0.4 L0.95 -0.31 L0.48 0.15 L0.59 0.81 L0 0.5 L-0.59 0.81 L-0.48 0.15 L-0.95 -0.31 L-0.29 -0.4 Z'

function Star({ x, y, r, fill, className }: { x: number; y: number; r: number; fill: string; className?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className}>
        <path d={STAR_PATH} transform={`scale(${r})`} fill={fill} stroke={TRAIL.INK} strokeWidth={2 / r} strokeLinejoin="round" />
      </g>
    </g>
  )
}

function SkyArt({ count }: { count: number }) {
  return (
    <svg viewBox={`0 0 ${SKY.width} ${SKY.height}`} className="block h-auto w-full" aria-hidden="true" focusable="false">
      <rect width={SKY.width} height={SKY.height} fill="url(#ap-night-sky)" />
      <circle cx={880} cy={56} r={30} fill={TRAIL.LANTERN} opacity={0.9} />
      <circle cx={892} cy={50} r={26} fill={TRAIL.NIGHT} opacity={0.85} />
      {[
        [60, 40],
        [210, 70],
        [380, 30],
        [560, 60],
        [720, 26],
        [960, 140],
      ].map(([x, y], index) => (
        <rect key={x} x={x} y={y} width={3} height={3} fill={TRAIL.PAGE} className={map.twinkle} style={cssVars({ '--i': index })} />
      ))}
      {/* the road: small stars along the arc, then a warp star per band */}
      {ROAD.map(([x, y]) => (
        <Star key={`${x.toFixed(0)}-${y.toFixed(0)}`} x={x} y={y + 22} r={5} fill={TRAIL.EDGE} />
      ))}
      {Array.from({ length: count }, (_, index) => {
        const [x, y] = starPoint(index, count)
        return <Star key={x} x={x} y={y + 22} r={24} fill="url(#ap-gold)" className={map.warpStar} />
      })}
      <path d={`M0 ${SKY.height - 18} Q500 ${SKY.height - 40} ${SKY.width} ${SKY.height - 18} V${SKY.height} H0 Z`} fill={TRAIL.CANOPY} />
    </svg>
  )
}

/** He warps from star to star: out (spin and rise), moved while out of sight, back in. */
function useWarp() {
  const [at, setAt] = useState(0)
  const [out, setOut] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const warpTo = (index: number) => {
    if (index === at && !out) return
    if (prefersReducedMotion()) {
      setAt(index)
      return
    }
    window.clearTimeout(timer.current)
    setOut(true)
    timer.current = window.setTimeout(() => {
      setAt(index)
      setOut(false)
    }, WARP_OUT_MS)
  }

  return { at, out, warpTo }
}

function BandCard({ slot, onPoint }: { slot: BandSlot; onPoint: () => void }) {
  const { band, years, linkProps } = slot
  const { links } = useLabels()
  const body = (
    <article className={`${PAPER_CARD} h-full`}>
      <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{band.name}</h3>
      <p className="mt-1 text-sm text-[color:var(--ap-ink-soft)]">
        {band.role}
        {years && <span> · {years}</span>}
      </p>
      {band.release && (
        <p className="mt-2 text-sm">
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )
  const handlers = { onPointerEnter: onPoint, onFocus: onPoint }

  if (!linkProps) {
    return (
      <div id={`trail-band-${band.id}`} tabIndex={-1} {...handlers}>
        {body}
      </div>
    )
  }
  return (
    <a id={`trail-band-${band.id}`} {...linkProps} {...handlers} className="block transition-transform hover:-translate-y-1 motion-reduce:transition-none">
      {body}
    </a>
  )
}

export function StarRoad({ bands, musician }: { bands: Band[]; musician: Musician }) {
  const { sections, trail, years } = useLabels()
  const warp = useWarp()
  const [x, y] = shareOf(starPoint(warp.at, bands.length), SKY.width, SKY.height)
  const standing = bands[warp.at]

  const show = (band: Band, index: number) => {
    warp.warpTo(index)
    document.getElementById(`trail-band-${band.id}`)?.focus()
  }

  return (
    <Region title={sections.bands} hint={trail.bandHint}>
      <p className={`mb-4 text-lg text-[color:var(--ap-parchment)] ${JOURNAL_SERIF}`}>{drumsSince(musician, years)}</p>
      <MapFrame>
        <MapBanner>{standing ? fillLabel(trail.starOf, { name: standing.name }) : trail.starRoad}</MapBanner>
        <div className="relative">
          <SkyArt count={bands.length} />
          {bands.map((band, index) => {
            const [bx, by] = shareOf(starPoint(index, bands.length), SKY.width, SKY.height)
            return (
              <button
                key={band.id}
                type="button"
                aria-label={fillLabel(trail.starOf, { name: band.name })}
                onClick={() => show(band, index)}
                className={`absolute left-[var(--x)] top-[var(--y)] h-14 w-14 rounded-full ${map.landmark}`}
                style={cssVars({ '--x': `${bx}%`, '--y': `${by + 8}%` })}
              >
                <span className={`pointer-events-none absolute inset-0 rounded-full border-4 border-dashed border-[color:var(--ap-lantern)] ${map.ring}`} aria-hidden="true" />
              </button>
            )
          })}
          <div
            className="pointer-events-none absolute left-[var(--x)] top-[var(--y)] h-[30%] -translate-x-1/2 -translate-y-full"
            style={cssVars({ '--x': `${x}%`, '--y': `${y + 2}%` })}
            aria-hidden="true"
          >
            <div className={`h-full ${map.warp}`} data-out={warp.out}>
              <TrailWalker profession="drummer" className="h-full w-auto" />
            </div>
          </div>
        </div>
      </MapFrame>
      <BandList
        bands={bands}
        className={`mt-8 ${MASONRY_LIST}`}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <BandCard slot={slot} onPoint={() => warp.warpTo(bands.indexOf(slot.band))} />}
      />
      {musician.line && <p className="text-base italic text-[color:var(--ap-gold)]">{musician.line}</p>}
    </Region>
  )
}
