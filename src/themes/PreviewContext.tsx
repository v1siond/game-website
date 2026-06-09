'use client'

import { createContext, useContext } from 'react'

/**
 * PREVIEW CONTEXT
 * ===============
 * A tiny boolean context, decoupled from ThemeContext on purpose.
 *
 * When a world's full themed layout is rendered as a *mini-preview* on the World
 * Select screen, we wrap it so this reads `true`. Shared hooks/components react to it:
 *  - useSectionTrigger / useMultiSectionTrigger -> report "always triggered" so
 *    scroll-gated heroes show immediately instead of staying blank inside a clipped card
 *  - ThemeSwitcher -> renders null (we don't want 17 nested switchers)
 *
 * Default is `false` and `usePreview()` does NOT throw outside a provider, so any
 * component (or test) can call it safely whether or not it's inside a preview.
 */
const PreviewContext = createContext<boolean>(false)

export function usePreview(): boolean {
  return useContext(PreviewContext)
}

export const PreviewProvider = PreviewContext.Provider

export default PreviewContext
