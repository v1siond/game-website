'use client'

import { createContext, useContext, useSyncExternalStore } from 'react'
import { yearOf } from '@/lib/cv/cvView'

// The year a page prints (a footer's copyright) and the five year cut counts back from. The page is built
// once per deploy, so the server render carries the build year; hydration reads that same year, and the
// client switches to its own clock right after, so a visitor on 1 January sees the new year with no
// hydration mismatch.

const ServerYearContext = createContext<number | null>(null)

/** The year the server rendered with, handed down by CVDataProvider from the page. */
export const ServerYearProvider = ServerYearContext.Provider

// The clock has no change event to follow; the year is read once per render.
const subscribe = () => () => {}
const clientYear = (): number => yearOf(new Date())

/** The current year in UTC: the server's during the server render and hydration, the visitor's after. */
export function useYearNow(): number {
  const serverYear = useContext(ServerYearContext)
  if (serverYear === null) throw new Error('useYearNow must be used within a ServerYearProvider (CVDataProvider renders it)')
  return useSyncExternalStore(subscribe, clientYear, () => serverYear)
}
