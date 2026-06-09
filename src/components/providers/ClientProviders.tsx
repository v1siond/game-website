'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '../../themes/ThemeContext'
import { WorldTransitionProvider } from '../../themes/WorldTransitionContext'
import { ProfessionProvider } from '../../contexts/ProfessionContext'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProfessionProvider>
        <WorldTransitionProvider>{children}</WorldTransitionProvider>
      </ProfessionProvider>
    </ThemeProvider>
  )
}
