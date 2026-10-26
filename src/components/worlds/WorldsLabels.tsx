'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'

// The worlds launcher, hint and picker render in ClientProviders, above the CV data each page loads, so
// they cannot read useLabels. RootShell reads their group of content/cv/labels.json (getLabels) and hands
// it down through this context.

export type WorldsText = Labels['worlds']

const WorldsLabelsContext = createContext<WorldsText | null>(null)

export function WorldsLabelsProvider({ labels, children }: { labels: WorldsText; children: ReactNode }) {
  return <WorldsLabelsContext.Provider value={labels}>{children}</WorldsLabelsContext.Provider>
}

/** The text of the worlds launcher, hint and picker in the page's locale. */
export function useWorldsLabels(): WorldsText {
  const labels = useContext(WorldsLabelsContext)
  if (!labels) throw new Error('useWorldsLabels must be used within a WorldsLabelsProvider (ClientProviders sets it from RootShell)')
  return labels
}
