'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { usePreview } from '@/themes/PreviewContext'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import { MAX_FLASKS, MAX_HP, MAX_STAMINA, useRun, type BannerKind } from './run'
import { CARVED } from './palette'
import souls from './souls.module.css'

// What the run puts on screen (./run), the way the hard knight action game frames its few words:
// - the wide banner on its black band across the middle of the screen, gold for a fire kindled, a round
//   won or a phantom summoned, red for a knock down;
// - the item box low in the middle, naming what was picked up and what it gave;
// - the HUD in the corners, out of the content: health and stamina bars with their numbers and the
//   flask with its charges bottom left (the flask is a button: drink to heal), the souls counter bottom
//   right, which rolls up to its new total with the gain shown above it.
// A World Select preview draws none of it: fixed layers would escape the preview card.

const BANNER_TEXT: Record<BannerKind, string> = {
  kindled: 'text-[color:var(--soul-glow)]',
  victory: 'text-[color:var(--soul-glow)]',
  summoned: 'text-[color:var(--soul-phantom)]',
  died: 'text-[color:var(--soul-blood-bright)]',
}

const ROLL_MS = 700

// The counter climbs to its new total over a short roll, one state write a frame for that roll only.
function useRolling(target: number): number {
  const [shown, setShown] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    const start = from.current
    if (start === target) return
    if (prefersReducedMotion()) {
      from.current = target
      setShown(target)
      return
    }
    const began = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / ROLL_MS)
      const value = Math.round(start + (target - start) * (1 - (1 - t) ** 3))
      from.current = value
      setShown(value)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return shown
}

function BannerBand() {
  const { banner } = useRun()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/2 z-50 -translate-y-1/2" role="status" aria-live="polite">
      {banner && (
        <div key={banner.key} className={`${souls.banner} py-8 sm:py-10`}>
          <p
            className={`${souls.bannerText} ${CARVED} px-4 text-center text-3xl uppercase tracking-[0.18em] sm:text-5xl lg:text-6xl ${BANNER_TEXT[banner.kind]}`}
          >
            {banner.text}
          </p>
        </div>
      )}
    </div>
  )
}

function ItemBoxPopup() {
  const { item } = useRun()
  const { souls: words } = useLabels()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-36 z-50 flex justify-center px-4 sm:bottom-10" role="status" aria-live="polite">
      {item && (
        <div key={item.key} className={`${souls.itemBox} ${CARVED} w-full max-w-md px-5 py-3`}>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--soul-text-soft)]">{words.found}</p>
          <p className="mt-1 text-lg text-[color:var(--soul-glow)]">{item.title}</p>
          {item.detail && <p className="mt-1 text-sm leading-relaxed text-[color:var(--soul-text)]">{item.detail}</p>}
        </div>
      )}
    </div>
  )
}

// A bar always shows its number: colour never carries the value alone.
function Bar({ label, value, max, fill, wide }: { label: string; value: number; max: number; fill: string; wide: string }) {
  const level = { '--fill': value / max } as CSSProperties
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-sm uppercase tracking-wider text-[color:var(--soul-text-soft)]">{label}</span>
      <div className={`relative h-3 ${wide} ${souls.barTrack}`} style={level} aria-hidden="true">
        <div className={`absolute inset-y-0 left-0 w-full ${souls.barTrail}`} />
        <div className={`absolute inset-y-0 left-0 w-full ${souls.barFill} ${fill}`} />
      </div>
      <span className="w-8 text-right text-sm tabular-nums text-[color:var(--soul-text)]">{Math.round(value)}</span>
    </div>
  )
}

function FlaskIcon({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 20 28" className="h-7 w-5" aria-hidden="true" focusable="false">
      <path d="M7 1 H13 V6 L18 13 Q19 26 10 27 Q1 26 2 13 L7 6 Z" fill="var(--soul-panel)" stroke="var(--soul-stone-light)" strokeWidth={1.2} />
      {full && <path d="M3.6 15 H16.4 Q16.8 25 10 25.4 Q3.2 25 3.6 15 Z" fill="var(--soul-estus)" />}
      {full && <path d="M5 16.4 Q7 15.6 8.6 16.4" stroke="var(--soul-flame-core)" strokeWidth={1} fill="none" />}
      <rect x={6.4} y={0} width={7.2} height={2.6} rx={0.8} fill="var(--soul-leather)" />
    </svg>
  )
}

function FlaskButton() {
  const { flasks, hp, drink } = useRun()
  const { souls: words } = useLabels()
  const reason = flasks === 0 ? words.flaskEmpty : hp >= MAX_HP ? words.healthFull : ''
  const name = fillLabel(words.drink, { count: flasks })

  return (
    <button
      type="button"
      onClick={drink}
      disabled={Boolean(reason)}
      aria-label={reason ? `${name}. ${reason}` : name}
      title={reason || name}
      className={`${souls.flask} flex min-h-[44px] items-center gap-2 px-2 text-[color:var(--soul-text)] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--soul-glow)]`}
    >
      <FlaskIcon full={flasks > 0} />
      <span className="text-sm uppercase tracking-wider">
        {words.flask} <span className="tabular-nums">{flasks}</span>/{MAX_FLASKS}
      </span>
    </button>
  )
}

function SoulsCounter() {
  const { souls: total } = useRun()
  const { souls: words } = useLabels()
  const shown = useRolling(total)
  const [gain, setGain] = useState<{ count: number; key: number } | null>(null)
  const last = useRef(total)

  useEffect(() => {
    const count = total - last.current
    last.current = total
    if (count <= 0) return
    setGain((previous) => ({ count, key: (previous?.key ?? 0) + 1 }))
  }, [total])

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-1">
      {gain && (
        <span key={gain.key} className={`${souls.gain} text-sm tabular-nums text-[color:var(--soul-glow)]`}>
          {fillLabel(words.gained, { count: `+${gain.count}` })}
        </span>
      )}
      <div className={`${souls.counter} flex items-center gap-3 px-3 py-1.5`}>
        <span className="text-sm uppercase tracking-[0.2em] text-[color:var(--soul-text-soft)]">{words.souls}</span>
        <span className="min-w-[4ch] text-right text-lg tabular-nums text-[color:var(--soul-text)]">{shown}</span>
      </div>
    </div>
  )
}

function Gauges() {
  const { hp, stamina } = useRun()
  const { hud, souls: words } = useLabels()
  return (
    <section aria-label={words.runStatus} className={`fixed bottom-4 left-4 z-40 ${souls.gauges} px-3 py-2`}>
      <Bar label={hud.hp} value={hp} max={MAX_HP} fill={souls.hpFill} wide="w-28 sm:w-44" />
      <div className="mt-1">
        <Bar label={words.stamina} value={stamina} max={MAX_STAMINA} fill={souls.staminaFill} wide="w-20 sm:w-36" />
      </div>
      <div className="mt-1">
        <FlaskButton />
      </div>
    </section>
  )
}

export function RunOverlay() {
  const preview = usePreview()
  if (preview) return null
  return (
    <div className={CARVED}>
      <Gauges />
      <SoulsCounter />
      <ItemBoxPopup />
      <BannerBand />
    </div>
  )
}
