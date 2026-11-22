'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { WORLD_IDS } from '@/lib/worlds/registry'
import {
  HINT_OFFERED_KEY,
  HINT_MIN_MS,
  SEEN_STORAGE_KEY,
  VISIT_STORAGE_KEY,
  coversNothing,
  hintBelongsOn,
  hintWatch,
  isVisuallyHidden,
  mayOfferHint,
  nextInTour,
  readSeen,
  recordWorld,
} from '@/lib/worlds/nudge'
import { FACE_TURNED_KEY, FACE_TURN_MS, launcherFace, type HeroView } from '@/lib/worlds/lens'
import { readStored, writeStored, type StorageArea } from '@/lib/storage'

// A world counts as seen once it has been on screen this long. The provider renders the default world for
// one commit before a returning visitor's own world, and this wait keeps that commit from counting.
const SEEN_AFTER_MS = 1500

// The longest the waiting card holds a measure for running animations to end, so a long reveal cannot stall it.
const SETTLE_CAP_MS = 1000

// What the hint must not cover when it opens: any text, and any control a visitor could reach.
const CONTROLS = 'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'

/** The worlds this browser has seen, read from storage at the moment it is called. */
export const loadSeenWorlds = (): string[] => readSeen(readStored('local', SEEN_STORAGE_KEY), WORLD_IDS)

const recordIn = (area: StorageArea, key: string, id: string): string[] => {
  const next = recordWorld(readStored(area, key), id, WORLD_IDS)
  writeStored(area, key, JSON.stringify(next))
  return next
}

// Text and controls at opacity 0 still count: a reveal fades them in where they are laid out, so the card
// would end up over them. Only what is not rendered (display none), hidden (visibility hidden) or marked
// as decoration for screen readers (aria-hidden) is skipped.
const isShown = (element: Element): boolean =>
  element.checkVisibility({ visibilityProperty: true }) && !element.closest('[aria-hidden="true"]')

// Text kept for screen readers only (an sr-only counter) is never drawn, so the card may sit over it.
const drawsNothing = (element: Element): boolean => {
  const { width, height } = element.getBoundingClientRect()
  const { overflow, position, clip, clipPath } = window.getComputedStyle(element)
  return isVisuallyHidden({ width, height, overflow, position, clip, clipPath })
}

// The launcher the card hangs under. Its own text and button never count as covered: the card's fixed top
// (worlds-nudge.css) already keeps it under the launcher's tallest face, and a face turning while the card
// is open must not close it.
const LAUNCHER_SELECTOR = '[data-worlds-launcher]'

/** The boxes of every laid out text line and control on the page that meet the card's box, the card's own and the launcher's aside. */
function boxesUnder(card: HTMLElement): DOMRect[] {
  const box = card.getBoundingClientRect()
  const meets = (element: Element): boolean =>
    !card.contains(element) &&
    !element.closest(LAUNCHER_SELECTOR) &&
    !coversNothing(box, [element.getBoundingClientRect()]) &&
    isShown(element)
  const controls = Array.from(document.querySelectorAll(CONTROLS)).filter(meets).map((element) => element.getBoundingClientRect())
  const lines: DOMRect[] = []
  const range = document.createRange()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement
    if (!parent || !node.textContent?.trim() || !meets(parent) || drawsNothing(parent)) continue
    range.selectNodeContents(node)
    lines.push(...Array.from(range.getClientRects()))
  }
  return [...controls, ...lines]
}

const covered = (card: HTMLElement): boolean => !coversNothing(card.getBoundingClientRect(), boxesUnder(card))

// A running animation with an end moves or fades its text into place (a reveal), so a measure waits for it.
// Infinite loops and paused or idle animations are left out: their finished promise never settles.
const endsSoon = (animation: Animation): boolean =>
  animation.playState === 'running' && Number.isFinite(Number(animation.effect?.getComputedTiming().endTime))

/** Settles once every reveal running now has ended, or after SETTLE_CAP_MS, whichever comes first. */
function revealsSettled(): Promise<unknown> {
  const finishing = document.getAnimations().filter(endsSoon).map((animation) => animation.finished)
  const cap = new Promise((resolve) => window.setTimeout(resolve, SETTLE_CAP_MS))
  return Promise.race([Promise.allSettled(finishing), cap])
}

// The hero section each world marks; the launcher's face turns once it leaves the screen.
const HERO_SELECTOR = '[data-worlds-hero]'

// A page with no hero element counts as scrolled, but only after a world loading its chunk has had the time
// to render one, so a returning visitor's world never turns the face on its first paint.
const HERO_WAIT_MS = 1500

/**
 * Where the page's hero stands: in view or out (IntersectionObserver), 'unknown' until the page has said.
 * The hero is looked up again whenever the page's nodes change (a world's chunk arriving, a route change),
 * at most once per frame; with none after HERO_WAIT_MS, the page counts as scrolled.
 */
function useHeroView(pageKey: string): HeroView {
  const [hero, setHero] = useState<HeroView>('unknown')

  useEffect(() => {
    setHero('unknown')
    let observed: Element | null = null
    let waited = false
    let frame = 0
    const view = new IntersectionObserver(([entry]) => setHero(entry.isIntersecting ? 'in' : 'out'))
    const attach = () => {
      frame = 0
      const found = document.querySelector(HERO_SELECTOR)
      if (found === observed) return
      if (observed) view.unobserve(observed)
      observed = found
      if (found) view.observe(found)
      if (!found && waited) setHero('out')
    }
    const onChange = () => {
      if (frame === 0) frame = window.requestAnimationFrame(attach)
    }
    const nodes = new MutationObserver(onChange)
    const timer = window.setTimeout(() => {
      waited = true
      if (!observed) setHero('out')
    }, HERO_WAIT_MS)
    attach()
    nodes.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
      nodes.disconnect()
      view.disconnect()
    }
  }, [pageKey])

  return hero
}

const atPageEnd = (): boolean => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

/**
 * Where the one time hint stands: closed, waiting for a clear place (rendered hidden so its real box can be
 * measured), or open.
 */
export type HintState = 'closed' | 'waiting' | 'open'

/**
 * The worlds nudge state: the seen worlds (localStorage) and the worlds entered this visit (sessionStorage),
 * the one time hint (offered after HINT_MIN_MS and one scrolled screen, never on a CV page, opened only
 * where its card covers no text and no control, else closed that visit), the next world in the tour it names,
 * and the launcher's face (launcherFace: the count at the hero, him in that next world once the hero is gone).
 * Used once, by WorldsLauncher.
 */
export function useWorldsNudge() {
  const { theme } = useTheme()
  const { isWorldsOpen, isTransitioning, openWorlds, selectWorld } = useWorldTransition()
  const [seen, setSeen] = useState<string[]>([])
  const [hint, setHint] = useState<HintState>('closed')
  const hintRef = useRef<HTMLDivElement>(null)
  const pickerOpened = useRef(false)
  // usePathname is null only outside the app router, which this site does not use.
  const pathname = usePathname() ?? ''
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
    if (!hintBelongsOn(pathname)) setHint('closed')
  }, [pathname])

  useEffect(() => {
    setSeen(loadSeenWorlds())
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSeen(recordIn('local', SEEN_STORAGE_KEY, theme.id))
      recordIn('session', VISIT_STORAGE_KEY, theme.id)
    }, SEEN_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [theme.id])

  useEffect(() => {
    if (!isWorldsOpen) return
    pickerOpened.current = true
    setHint('closed')
  }, [isWorldsOpen])

  // Checked on scroll and once when the minimum read time has passed; stops listening once offered.
  useEffect(() => {
    const startedAt = performance.now()
    let deepest = window.scrollY
    let done = false
    const check = () => {
      deepest = Math.max(deepest, window.scrollY)
      if (done) return
      const offer = mayOfferHint({
        pathname: pathnameRef.current,
        elapsedMs: performance.now() - startedAt,
        scrolledPx: deepest,
        viewportPx: window.innerHeight,
        pageHeightPx: document.documentElement.scrollHeight,
        offeredThisVisit: readStored('session', HINT_OFFERED_KEY) !== null,
        pickerOpened: pickerOpened.current,
        seenCount: loadSeenWorlds().length,
      })
      if (!offer) return
      done = true
      writeStored('session', HINT_OFFERED_KEY, '1')
      setHint('waiting')
    }
    const timer = window.setTimeout(check, HINT_MIN_MS + 50)
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', check)
    }
  }, [])

  // While waiting, the hidden card is measured against the page once per scrolled frame, each measure after
  // the reveals running then have ended: it opens at the first place where it covers nothing, and stays
  // closed this visit when the page ends first. One wait at a time; scrolls during it are taken by the
  // measure that ends it, which reads the page where it is then.
  useEffect(() => {
    if (hint !== 'waiting') return
    let frame = 0
    let settling = false
    let stopped = false
    const measure = () => {
      settling = false
      const card = hintRef.current
      if (stopped || !card) return
      if (!covered(card)) {
        setHint('open')
        return
      }
      if (atPageEnd()) setHint('closed')
    }
    const place = () => {
      frame = 0
      if (settling) return
      settling = true
      revealsSettled().then(measure)
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(place)
    }
    place()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      stopped = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [hint])

  // Once open, the card is measured every frame for HINT_WATCH_MS and closes this visit if a reveal that
  // began after the opening measure brings text or a control under it.
  useEffect(() => {
    if (hint !== 'open') return
    const openedAtMs = performance.now()
    let frame = 0
    const watch = () => {
      const card = hintRef.current
      if (!card) return
      const verdict = hintWatch({ openedAtMs, nowMs: performance.now(), covered: covered(card) })
      if (verdict === 'close') setHint('closed')
      if (verdict === 'watch') frame = window.requestAnimationFrame(watch)
    }
    frame = window.requestAnimationFrame(watch)
    return () => window.cancelAnimationFrame(frame)
  }, [hint])

  const nextId = nextInTour(theme.id, seen)

  // The launcher's face: the count at the hero, him in the next world once the hero has left the screen,
  // turned over once per visit (sessionStorage) and only while the hint card is not open over the page.
  const hero = useHeroView(`${theme.id} ${pathname}`)
  const [turnedThisVisit, setTurnedThisVisit] = useState(false)
  const [turning, setTurning] = useState(false)

  useEffect(() => {
    setTurnedThisVisit(readStored('session', FACE_TURNED_KEY) !== null)
  }, [])

  const face = launcherFace({ pathname, hero, hintOpen: hint === 'open', turnedThisVisit, turning })

  useEffect(() => {
    if (face !== 'turn' || turning) return
    writeStored('session', FACE_TURNED_KEY, '1')
    setTurnedThisVisit(true)
    setTurning(true)
  }, [face, turning])

  useEffect(() => {
    if (!turning) return
    const timer = window.setTimeout(() => setTurning(false), FACE_TURN_MS)
    return () => window.clearTimeout(timer)
  }, [turning])

  const closeHint = useCallback(() => setHint('closed'), [])

  const nextWorld = useCallback(() => {
    setHint('closed')
    selectWorld(nextId)
  }, [selectWorld, nextId])

  const allWorlds = useCallback(
    (opener: HTMLElement) => {
      setHint('closed')
      openWorlds(opener)
    },
    [openWorlds],
  )

  return {
    total: WORLD_IDS.length,
    seenCount: seen.length,
    nextId,
    face,
    /** The lens and the face belong on this page (never on a CV page). */
    lensAllowed: hintBelongsOn(pathname),
    hint: isWorldsOpen || isTransitioning ? 'closed' : hint,
    hintRef,
    closeHint,
    nextWorld,
    allWorlds,
  }
}
