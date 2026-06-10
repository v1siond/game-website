'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '../../themes/ThemeContext'
import { WorldTransitionProvider } from '../../themes/WorldTransitionContext'
import { ProfessionProvider } from '../../contexts/ProfessionContext'
import WorldsLauncher from '../worlds/WorldsLauncher'
import WorldsModal from '../worlds/WorldsModal'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProfessionProvider>
        <WorldTransitionProvider>
          {children}
          {/* worlds picker lives outside the page content flow, available in every world */}
          <WorldsLauncher />
          <WorldsModal />
        </WorldTransitionProvider>
      </ProfessionProvider>
    </ThemeProvider>
  )
}
