'use client'

import { useState, type CSSProperties } from 'react'
import type { Band } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import { PHOSPHOR, PHOSPHOR_DEEP } from './palette'
import atomic from './atomic.module.css'

// Bands as the terminal's radio: each band a station. Above the stations the receiver: the tuning scale
// with its needle and the waveform panel. Pointing at or focusing a station tunes it in: the needle
// slides to that station's place on the scale (transform, an eased glide), the wave's height and speed
// change to that station's (the --amp and --wave variables the CSS reads), a short burst of static
// flickers over the panel (keyed per station, so it plays on each retune), the station's lamp lights
// and the caption names it for screen readers (aria-live). The wave is one long sine path sliding
// sideways forever, the panel's only loop, frozen under reduced motion.

const WAVE_CYCLES = 8
const WAVE_POINTS = WAVE_CYCLES * 8

// Two copies of the sine side by side across a 400 by 60 box, so sliding it by half loops seamlessly.
const SINE = Array.from({ length: WAVE_POINTS * 2 + 1 }, (_, point) => {
  const x = (point / WAVE_POINTS) * 200
  const y = 30 - Math.sin((point / 8) * Math.PI * 2) * 22
  return `${point === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
}).join(' ')

// Each station's height and speed, picked by its place in the list.
const AMPLITUDES = [0.9, 0.55, 0.75, 0.4]
const SPEEDS = ['1.6s', '2.4s', '1.1s', '3s']

function Receiver({ bands, tuned }: { bands: Band[]; tuned: number }) {
  const { hud } = useLabels()
  const band = bands[tuned]
  const place = bands.length > 1 ? tuned / (bands.length - 1) : 0.5
  const look = {
    '--needle': place,
    '--amp': AMPLITUDES[tuned % AMPLITUDES.length],
    '--wave': SPEEDS[tuned % SPEEDS.length],
  } as CSSProperties

  return (
    <div className={`mb-8 grid gap-4 p-4 sm:p-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] ${atomic.panel}`} style={look}>
      <div>
        <div className={`relative h-16 ${atomic.dialScale}`} aria-hidden="true">
          <span className={`absolute bottom-0 top-0 w-1 bg-atomic-red ${atomic.needle}`} />
        </div>
        <p className="mt-3 text-base font-bold uppercase tracking-widest text-atomic-phosphor" aria-live="polite">
          {band ? fillLabel(hud.tunedTo, { name: band.name }) : ''}
        </p>
      </div>
      <div className={`relative h-24 overflow-hidden border border-atomic-phosphor/50 ${atomic.wavePanel}`} aria-hidden="true">
        <div className={`absolute inset-y-0 left-0 w-[200%] ${atomic.waveSlide} ${atomic.ambient}`}>
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={`h-full w-full ${atomic.waveHeight}`} focusable="false">
            <path d={SINE} fill="none" stroke={PHOSPHOR} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0 30 H400" stroke={PHOSPHOR_DEEP} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <span key={tuned} className={`absolute inset-0 ${atomic.static}`} />
      </div>
    </div>
  )
}

function Station({ slot, tuned, onTune }: { slot: BandSlot; tuned: boolean; onTune: () => void }) {
  const { links } = useLabels()
  const { band, years, linkProps } = slot

  const body = (
    <>
      <span className={`absolute right-4 top-4 h-3 w-3 rounded-full ${atomic.lamp}`} data-on={tuned || undefined} aria-hidden="true" />
      <span className={`mb-4 block h-10 ${atomic.speaker}`} aria-hidden="true" />
      <h3 className="text-lg font-bold uppercase tracking-wide text-atomic-phosphor">{band.name}</h3>
      <p className="mt-1 text-base text-atomic-yellow">{band.role}</p>
      {years && <p className="mt-1 text-sm text-atomic-phosphor-dim">{years}</p>}
      {band.release && (
        <p className="mt-3 text-sm text-atomic-ash">
          {links.released} <cite>{band.release}</cite>
        </p>
      )}
    </>
  )
  const frame = `relative block p-5 ${atomic.panel} ${atomic.station} ${atomic.focusRing}`
  const tune = { onPointerEnter: onTune, onFocus: onTune, 'data-on': tuned || undefined }

  if (!linkProps) {
    return (
      <article className={frame} tabIndex={0} {...tune}>
        {body}
      </article>
    )
  }
  return (
    <a {...linkProps} className={frame} {...tune}>
      {body}
    </a>
  )
}

export function Radio({ bands }: { bands: Band[] }) {
  const { hud } = useLabels()
  const [tuned, setTuned] = useState(0)

  return (
    <>
      <p className="mb-3 text-sm text-atomic-phosphor-dim">{hud.tuneHint}</p>
      <Receiver bands={bands} tuned={tuned} />
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => {
          const index = bands.indexOf(slot.band)
          return <Station slot={slot} tuned={index === tuned} onTune={() => setTuned(index)} />
        }}
      />
    </>
  )
}
