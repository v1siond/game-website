'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider, useTheme } from '../../themes/ThemeContext'
import { WorldTransitionProvider } from '../../themes/WorldTransitionContext'
import { ProfessionProvider } from '../../contexts/ProfessionContext'
import WorldsLauncher from '../worlds/WorldsLauncher'
import WorldsModal from '../worlds/WorldsModal'
import { WorldsLabelsProvider, type WorldsText } from '../worlds/WorldsLabels'
import { SHARED_STAGE_WORLD_ID } from '@/lib/worlds/registry'

// Its own chunk, so /cv, /blog and every world that draws its own stage never download it.
const GlobalProfessionStage = dynamic(() => import('@/components/themes/shared/professionStage'))

/** The profession boss-stage ornaments, recoloured per world, in the one world that uses the shared set. */
function SharedProfessionStage() {
  const { theme } = useTheme()
  if (theme.id !== SHARED_STAGE_WORLD_ID) return null
  return <GlobalProfessionStage />
}

interface ClientProvidersProps {
  children: ReactNode
  worldsLabels: WorldsText
  /** The worlds launcher and its picker; the CV leaves them out, so the CV is just the CV. */
  worldsPicker: boolean
}

export default function ClientProviders({ children, worldsLabels, worldsPicker }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <ProfessionProvider>
        {/* outside the transition provider, so the portal it mounts reads its line in the page's locale */}
        <WorldsLabelsProvider labels={worldsLabels}>
          <WorldTransitionProvider>
            <SharedProfessionStage />
            {children}
            {/* worlds picker lives outside the page content flow, available in every world */}
            {worldsPicker && (
              <>
                <WorldsLauncher />
                <WorldsModal />
              </>
            )}
          </WorldTransitionProvider>
        </WorldsLabelsProvider>
      </ProfessionProvider>
    </ThemeProvider>
  )
}
