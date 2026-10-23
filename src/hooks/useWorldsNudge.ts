'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { WORLDS } from '@/themes/worlds'
import { HINT_MIN_MS, HINT_OFFERED_KEY, SEEN_STORAGE_KEY, markSeen, mayOfferHint, pickNextWorld, readSeen } from '@/lib/worlds/nudge'

// A world counts as seen once it has been on screen this long. The provider renders the default world for
// one commit before a returning visitor's own world, and this wait keeps that commit from counting.
const SEEN_AFTER_MS = 1500

const WORLD_IDS = WORLDS.map((world) => world.id)

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

/**
 * The worlds nudge state: the seen worlds (localStorage), the one time hint (sessionStorage, offered after
 * HINT_MIN_MS and one scrolled screen) and "Next world", a random unseen world through the portal.
 * Used once, by WorldsLauncher.
 */
export function useWorldsNudge() {
  const { theme } = useTheme()
  const { isWorldsOpen, isTransitioning, openWorlds, selectWorld } = useWorldTransition()
  const [seen, setSeen] = useState<string[]>([])
  const [hintOpen, setHintOpen] = useState(false)
  const pickerOpened = useRef(false)

  useEffect(() => {
    setSeen(loadSeenWorlds())
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = markSeen(loadSeenWorlds(), theme.id)
      writeStorage(local, SEEN_STORAGE_KEY, JSON.stringify(next))
      setSeen(next)
    }, SEEN_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [theme.id])

  useEffect(() => {
    if (!isWorldsOpen) return
    pickerOpened.current = true
    setHintOpen(false)
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
      setHintOpen(true)
    }
    const timer = window.setTimeout(check, HINT_MIN_MS + 50)
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', check)
    }
  }, [])

  const closeHint = useCallback(() => setHintOpen(false), [])

  const nextWorld = useCallback(() => {
    setHintOpen(false)
    selectWorld(pickNextWorld(WORLD_IDS, theme.id, loadSeenWorlds(), Math.random))
  }, [selectWorld, theme.id])

  const allWorlds = useCallback(() => {
    setHintOpen(false)
    openWorlds()
  }, [openWorlds])

  return {
    total: WORLD_IDS.length,
    seenCount: seen.length,
    hintOpen: hintOpen && !isWorldsOpen && !isTransitioning,
    closeHint,
    nextWorld,
    allWorlds,
  }
}
