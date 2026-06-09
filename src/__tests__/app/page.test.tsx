import { screen, waitFor } from '@testing-library/react'
import Home from '@/app/page'
import { render } from '../test-utils'

// Mock the heavy themed layouts: we only care that the right *world* renders.
jest.mock('@/components/themes/DarkFantasyTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-dark-fantasy" /> }))
jest.mock('@/components/themes/SurvivalHorrorTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-survival-horror" /> }))
jest.mock('@/components/themes/NeonPortalsTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-neon-portals" /> }))
jest.mock('@/components/themes/SoulMapTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-soul-map" /> }))
jest.mock('@/components/themes/AdventurePathsTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-adventure-paths" /> }))
jest.mock('@/components/themes/RubberHoseTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-rubber-hose" /> }))
jest.mock('@/components/themes/RetroRPGTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-retro-rpg" /> }))
jest.mock('@/components/themes/BoldNoirTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-bold-noir" /> }))
jest.mock('@/components/themes/FighterSelectTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-fighter-select" /> }))
jest.mock('@/components/themes/ArtDecoTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-art-deco" /> }))
jest.mock('@/components/themes/RetroAtomicTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-retro-atomic" /> }))
jest.mock('@/components/themes/NeonCyberTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-neon-cyber" /> }))
jest.mock('@/components/themes/CellShadedTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-cell-shaded" /> }))
jest.mock('@/components/themes/SilhouetteTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-silhouette" /> }))
jest.mock('@/components/themes/MythicTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-mythic" /> }))
jest.mock('@/components/themes/TropicalPlatformerTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-tropical-platformer" /> }))
jest.mock('@/components/themes/MedievalFantasyTheme', () => ({ __esModule: true, default: () => <div data-testid="theme-medieval-fantasy" /> }))

describe('Home page (boot into a world)', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('boots into the default world (neon-cyber) when nothing is stored', () => {
    render(<Home />)
    expect(screen.getByTestId('theme-neon-cyber')).toBeInTheDocument()
  })

  it('boots into the stored world from localStorage', async () => {
    ;(localStorage.getItem as jest.Mock).mockReturnValue('retro-rpg')
    render(<Home />)
    await waitFor(() => expect(screen.getByTestId('theme-retro-rpg')).toBeInTheDocument())
  })

  it('renders only the active world, not the others', () => {
    render(<Home />)
    expect(screen.queryByTestId('theme-mythic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('theme-dark-fantasy')).not.toBeInTheDocument()
  })
})
