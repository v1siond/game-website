'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { WORLDS } from '@/themes/worlds'
import {
  HINT_OFFERED_KEY,
  HINT_MIN_MS,
  SEEN_STORAGE_KEY,
  VISIT_STORAGE_KEY,
  coversNothing,
  hintBelongsOn,
  mayOfferHint,
  nextInTour,
  readSeen,
  recordWorld,
} from '@/lib/worlds/nudge'

// A world counts as seen once it has been on screen this long. The provider renders the default world for
// one commit before a returning visitor's own world, and this wait keeps that commit from counting.
const SEEN_AFTER_MS = 1500

const WORLD_IDS = WORLDS.map((world) => world.id)

// What the hint must not cover when it opens: any text, and any control a visitor could reach.
const CONTROLS = 'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'

// Storage throws when the browser blocks site data; the nudge then works for this page view only.
const readStorage = (storage: () => Storage, key: string): string | null => {
  try {
    return storage().getItem(key)
  } catch {
    return null
  }
}

const writeStorage = (storage: () => Storage, key: string, value: string): void => {
  try {
    storage().setItem(key, value)
  } catch {
    // nothing to keep, the page goes on without it
  }
}

const local = () => window.localStorage
const session = () => window.sessionStorage

/** The worlds this browser has seen, read from storage at the moment it is called. */
export const loadSeenWorlds = (): string[] => readSeen(readStorage(local, SEEN_STORAGE_KEY), WORLD_IDS)

const recordIn = (storage: () => Storage, key: string, id: string): string[] => {
  const next = recordWorld(readStorage(storage, key), id, WORLD_IDS)
  writeStorage(storage, key, JSON.stringify(next))
  return next
}

// Text and controls at opacity 0 still count: a reveal fades them in where they are laid out, so the card
// would end up over them. Only what is not rendered (display none), hidden (visibility hidden) or marked
// as decoration for screen readers (aria-hidden) is skipped.
const isShown = (element: Element): boolean =>
  element.checkVisibility({ visibilityProperty: true }) && !element.closest('[aria-hidden="true"]')

/** The boxes of every laid out text line and control on the page that meet the card's box, the card's own aside. */
function boxesUnder(card: HTMLElement): DOMRect[] {
  const box = card.getBoundingClientRect()
  const meets = (element: Element): boolean =>
    !card.contains(element) && !coversNothing(box, [element.getBoundingClientRect()]) && isShown(element)
  const controls = Array.from(document.querySelectorAll(CONTROLS)).filter(meets).map((element) => element.getBoundingClientRect())
  const lines: DOMRect[] = []
  const range = document.createRange()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement
    if (!parent || !node.textContent?.trim() || !meets(parent)) continue
    range.selectNodeContents(node)
    lines.push(...Array.from(range.getClientRects()))
  }
  return [...controls, ...lines]
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
 * where its card covers no text and no control, else closed that visit) and the next world in the tour it names.
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
      setSeen(recordIn(local, SEEN_STORAGE_KEY, theme.id))
      recordIn(session, VISIT_STORAGE_KEY, theme.id)
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
        offeredThisVisit: readStorage(session, HINT_OFFERED_KEY) !== null,
        pickerOpened: pickerOpened.current,
        seenCount: loadSeenWorlds().length,
      })
      if (!offer) return
      done = true
      writeStorage(session, HINT_OFFERED_KEY, '1')
      setHint('waiting')
    }
    const timer = window.setTimeout(check, HINT_MIN_MS + 50)
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', check)
    }
  }, [])

  // While waiting, the hidden card is measured against the page once per scrolled frame: it opens at the
  // first place where it covers nothing, and stays closed this visit when the page ends first.
  useEffect(() => {
    if (hint !== 'waiting') return
    let frame = 0
    const place = () => {
      frame = 0
      const card = hintRef.current
      if (!card) return
      if (coversNothing(card.getBoundingClientRect(), boxesUnder(card))) {
        setHint('open')
        return
      }
      if (atPageEnd()) setHint('closed')
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(place)
    }
    place()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [hint])

  const nextId = nextInTour(theme.id, seen)

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
    hint: isWorldsOpen || isTransitioning ? 'closed' : hint,
    hintRef,
    closeHint,
    nextWorld,
    allWorlds,
  }
}
