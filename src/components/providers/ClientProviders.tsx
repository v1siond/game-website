'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '../../themes/ThemeContext'
import { WorldTransitionProvider } from '../../themes/WorldTransitionContext'
import { ProfessionProvider } from '../../contexts/ProfessionContext'
import WorldsLauncher from '../worlds/WorldsLauncher'
import WorldsModal from '../worlds/WorldsModal'
import GlobalProfessionStage from '../themes/shared/professionStage'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProfessionProvider>
        <WorldTransitionProvider>
          {/* profession boss-stage ornaments, recoloured per world (dark-fantasy renders its own) */}
          <GlobalProfessionStage />
          {children}
          {/* worlds picker lives outside the page content flow, available in every world */}
          <WorldsLauncher />
          <WorldsModal />
        </WorldTransitionProvider>
      </ProfessionProvider>
    </ThemeProvider>
  )
}
