import { render, screen, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/themes/ThemeContext'
import { WorldTransitionProvider, useWorldTransition } from '@/themes/WorldTransitionContext'
import { DEFAULT_THEME_ID } from '@/themes/themes'
import { WorldsLabelsProvider } from '@/components/worlds/WorldsLabels'
import { testCV } from '../helpers/test-utils'

function Probe() {
  const { theme } = useTheme()
  const { selectWorld, isTransitioning } = useWorldTransition()
  return (
    <div>
      <span data-testid="current">{theme.id}</span>
      <span data-testid="transitioning">{String(isTransitioning)}</span>
      <button onClick={() => selectWorld('mythic')}>go-mythic</button>
      <button onClick={() => selectWorld(DEFAULT_THEME_ID)}>go-current</button>
    </div>
  )
}

const setup = () =>
  render(
    <ThemeProvider>
      <WorldsLabelsProvider labels={testCV().labels.worlds}>
        <WorldTransitionProvider>
          <Probe />
        </WorldTransitionProvider>
      </WorldsLabelsProvider>
    </ThemeProvider>
  )

describe('WorldTransition (portal)', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    window.scrollTo = jest.fn()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('starts in the default world and not transitioning', () => {
    setup()
    expect(screen.getByTestId('current')).toHaveTextContent(DEFAULT_THEME_ID)
    expect(screen.getByTestId('transitioning')).toHaveTextContent('false')
  })

  it('plays the portal, then swaps the world at the cover peak and persists', () => {
    setup()

    act(() => {
      screen.getByText('go-mythic').click()
    })
    // Cover phase has begun, but the world hasn't swapped yet.
    expect(screen.getByTestId('transitioning')).toHaveTextContent('true')
    expect(screen.getByTestId('current')).toHaveTextContent(DEFAULT_THEME_ID)

    // Cover peak -> world swaps, scrolls to top, persists.
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('current')).toHaveTextContent('mythic')
    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'mythic')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)

    // Reveal finishes -> overlay clears.
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByTestId('transitioning')).toHaveTextContent('false')
  })

  it('is a no-op when selecting the world you are already in', () => {
    setup()
    act(() => {
      screen.getByText('go-current').click()
    })
    expect(screen.getByTestId('transitioning')).toHaveTextContent('false')
    expect(screen.getByTestId('current')).toHaveTextContent(DEFAULT_THEME_ID)
  })
})
