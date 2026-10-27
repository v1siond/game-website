'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type RefObject } from 'react'
import Image from 'next/image'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { getThemeById } from '@/themes/themes'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import { WARDROBE_FAN_KEY, WARDROBE_FAN_MS, followingInTour, previousInTour } from '@/lib/worlds/nudge'
import { useWorldsLabels } from './WorldsLabels'

/**
 * A world's colours for its plate, read from that world's palette by the hero that places it: the plate
 * fill, the name and arrow colour (7 to 1 or more on the plate), and the ring round the plate that keeps
 * it 3 to 1 apart from the scene behind.
 */
export interface WardrobeLook {
  plate: string
  text: string
  ring: string
}

interface WardrobeProps {
  look: WardrobeLook
  /** Where the hero places the plate beside his figure (Tailwind classes on the wrapper). */
  className?: string
  /** False while the hero is still covered by its intro (Retro Atomic's door); the fan waits for it. */
  ready?: boolean
}

type Step = 1 | -1

// The plate waits this long once it is ready before his outfits fan out, so the hero is read first.
const FAN_DELAY_MS = 1400
// A swipe is a mostly sideways finger move of at least this many pixels across his figure.
const SWIPE_MIN_PX = 48

const STEP_TO: Record<Step, (id: string) => string> = { 1: followingInTour, [-1]: previousInTour }
const KEY_STEP: Record<string, Step> = { ArrowRight: 1, ArrowLeft: -1 }

// The capture script (scripts/capture-world-previews.mjs) opens a world with ?capture=<id> and crops his
// figure, so the fan never plays over him there.
const isCapture = (): boolean => new URLSearchParams(window.location.search).has('capture')

// Storage throws when the browser blocks site data; the fan then plays on this page view only.
const fanPlayedThisVisit = (): boolean => {
  try {
    return window.sessionStorage.getItem(WARDROBE_FAN_KEY) !== null
  } catch {
    return false
  }
}

const markFanPlayed = (): void => {
  try {
    window.sessionStorage.setItem(WARDROBE_FAN_KEY, '1')
  } catch {
    // nothing to keep, the fan may play again on the next page view
  }
}

function Chevron({ step }: { step: Step }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="c-wardrobe__chevron">
      <path d={step === 1 ? 'M5.5 2.5 11 8l-5.5 5.5' : 'M10.5 2.5 5 8l5.5 5.5'} />
    </svg>
  )
}

/** His other outfits, each his figure in that world, fanned out of the plate once; a missing picture shows no card. */
function Fan({ ids }: { ids: readonly string[] }) {
  const [missing, setMissing] = useState<readonly string[]>([])

  return (
    <div className="c-wardrobe__fan" aria-hidden="true">
      {ids.map((id, slot) => (
        <span key={id} className="c-wardrobe__card" data-slot={slot - 1} hidden={missing.includes(id)}>
          <Image src={`/world-previews/portraits/${id}.webp`} alt="" fill unoptimized sizes="96px" onError={() => setMissing((failed) => [...failed, id])} />
        </span>
      ))}
    </div>
  )
}

/**
 * Starts the fan once per visit: when the plate is ready, on screen and motion is allowed, after
 * FAN_DELAY_MS, for WARDROBE_FAN_MS. Returns whether it is playing now.
 */
function useFanOnce(anchor: RefObject<HTMLElement | null>, ready: boolean): boolean {
  const reducedMotion = useReducedMotion()
  const [fanning, setFanning] = useState(false)

  useEffect(() => {
    const element = anchor.current
    if (!ready || reducedMotion || !element || isCapture() || fanPlayedThisVisit()) return
    const timers: number[] = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      timers.push(
        window.setTimeout(() => {
          markFanPlayed()
          setFanning(true)
          timers.push(window.setTimeout(() => setFanning(false), WARDROBE_FAN_MS))
        }, FAN_DELAY_MS),
      )
    }, { threshold: 0.6 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [anchor, ready, reducedMotion])

  return fanning
}

const stopHere = (event: MouseEvent): void => event.stopPropagation()

const insideBox = (touch: Touch, figure: Element): boolean => {
  const { left, right, top, bottom } = figure.getBoundingClientRect()
  return touch.clientX >= left && touch.clientX <= right && touch.clientY >= top && touch.clientY <= bottom
}

// True when a touch point lies inside the box of his figure. Read from the box, not the event target,
// since several worlds draw him in a backdrop layer that takes no pointer events. Dark Fantasy marks two
// knights (the phone one and the one from lg), one of them not displayed, so every mark is tried.
const onFigure = (touch: Touch): boolean =>
  Array.from(document.querySelectorAll('[data-worlds-figure]')).some((figure) => insideBox(touch, figure))

/** A sideways swipe that starts on his figure (the hero's [data-worlds-figure]) steps the outfit. */
function useSwipeAcrossFigure(onStep: (step: Step) => void) {
  const latest = useRef(onStep)

  useEffect(() => {
    latest.current = onStep
  }, [onStep])

  useEffect(() => {
    let start: Touch | null = null
    const down = (event: TouchEvent) => {
      const touch = event.touches[0]
      start = touch && event.touches.length === 1 && onFigure(touch) ? touch : null
    }
    const up = (event: TouchEvent) => {
      const end = event.changedTouches[0]
      const from = start
      start = null
      if (!from || !end) return
      const dx = end.clientX - from.clientX
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(end.clientY - from.clientY) > Math.abs(dx)) return
      latest.current(dx < 0 ? 1 : -1)
    }
    document.addEventListener('touchstart', down, { passive: true })
    document.addEventListener('touchend', up, { passive: true })
    return () => {
      document.removeEventListener('touchstart', down)
      document.removeEventListener('touchend', up)
    }
  }, [])
}

/**
 * The wardrobe, one per hero: a plate beside his figure naming the outfit he wears (the world), with a
 * previous and a next arrow. Next, a swipe across him to the left or ArrowRight inside the plate go to the
 * next world of TOUR_ORDER through the portal (selectWorld, as the picker does); previous, a swipe to the
 * right or ArrowLeft to the one before, in a circle. On the first visit his previous, current and next
 * outfits fan out of the plate for WARDROBE_FAN_MS (never under reduced motion). The look per world is
 * wardrobe.css (.c-wardrobe--<world id>) over the colours the hero passes from its palette. A click or a key
 * inside the plate stops there, so a hero that skips its intro on any click or key (Mythic, Cell Shaded)
 * never sees the plate's own presses.
 */
export default function Wardrobe({ look, className = '', ready = true }: WardrobeProps) {
  const { theme } = useTheme()
  const { selectWorld } = useWorldTransition()
  const labels = useWorldsLabels()
  const anchor = useRef<HTMLDivElement>(null)
  const fanning = useFanOnce(anchor, ready)

  const go = (step: Step) => selectWorld(STEP_TO[step](theme.id))
  useSwipeAcrossFigure(go)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation()
    const step = KEY_STEP[event.key]
    if (!step) return
    event.preventDefault()
    go(step)
  }

  const previous = previousInTour(theme.id)
  const next = followingInTour(theme.id)
  const vars = { '--wd-plate': look.plate, '--wd-text': look.text, '--wd-ring': look.ring, '--wd-fan-ms': `${WARDROBE_FAN_MS}ms` } as CSSProperties

  return (
    <div ref={anchor} style={vars} className={`c-wardrobe c-wardrobe--${theme.id} ${className}`}>
      {fanning && <Fan ids={[previous, theme.id, next]} />}
      <div role="group" aria-label={theme.name} onKeyDown={onKeyDown} onClick={stopHere} className="c-wardrobe__plate">
        <button type="button" onClick={() => go(-1)} aria-label={fillLabel(labels.wardrobePrev, { name: getThemeById(previous).name })} className="c-wardrobe__key">
          <Chevron step={-1} />
        </button>
        <span className="c-wardrobe__name">{theme.name}</span>
        <button type="button" onClick={() => go(1)} aria-label={fillLabel(labels.wardrobeNext, { name: getThemeById(next).name })} className="c-wardrobe__key">
          <Chevron step={1} />
        </button>
      </div>
    </div>
  )
}
