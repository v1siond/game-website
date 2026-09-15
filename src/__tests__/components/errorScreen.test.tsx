import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorScreen } from '@/components/ErrorScreen'
import { NotFoundScreen, ServerErrorScreen, CrashScreen } from '@/components/errorScreens'
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY, getThemeById } from '@/themes/themes'

/**
 * The screen reads the chosen world straight from storage (no provider), so drive getItem.
 *
 * It has to be THIS mock: `jest.setup.ts` replaces `window.localStorage` wholesale with an object of
 * `jest.fn()`s, so a `jest.spyOn(Storage.prototype, 'getItem')` intercepts nothing and the assertion
 * silently reads the default world instead of the stored one — a green test proving nothing.
 */
const localStorageGetItem = window.localStorage.getItem as jest.Mock

function storedWorld(id: string | null): void {
  localStorageGetItem.mockImplementation((key: string) => (key === THEME_STORAGE_KEY ? id : null))
}

describe('ErrorScreen', () => {
  afterEach(() => {
    localStorageGetItem.mockReset()
    jest.restoreAllMocks()
  })

  it('shows the status, what happened and what to do about it', () => {
    render(
      <ErrorScreen
        status={404}
        headline="This page is not on the map"
        detail="The address does not match anything on the site."
        actions={[{ label: 'Go to the home page', href: '/' }]}
      />,
    )
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'This page is not on the map' })).toBeInTheDocument()
    expect(screen.getByText('The address does not match anything on the site.')).toBeInTheDocument()
  })

  it('draws no status at all when the failure has none (a client-side crash)', () => {
    const { container } = render(
      <ErrorScreen headline="This page stopped running" detail="It threw." actions={[]} />,
    )
    expect(container.querySelector('.c-error__status')).toBeNull()
  })

  it('renders a navigating action as a link and an acting one as a button', () => {
    const onClick = jest.fn()
    render(
      <ErrorScreen
        status={500}
        headline="The server could not finish this request"
        detail="Loading it again usually clears it."
        actions={[
          { label: 'Reload this page', onClick, primary: true },
          { label: 'Go to the home page', href: '/' },
        ]}
      />,
    )
    const link = screen.getByRole('link', { name: 'Go to the home page' })
    expect(link).toHaveAttribute('href', '/')

    const button = screen.getByRole('button', { name: 'Reload this page' })
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('marks exactly the primary action, so the recommended way out is visible', () => {
    render(
      <ErrorScreen
        status={404}
        headline="Gone"
        detail="Gone."
        actions={[
          { label: 'Go to the home page', href: '/', primary: true },
          { label: 'Open the game engine', href: '/personal-projects/game-engine' },
        ]}
      />,
    )
    expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveClass('c-error__action--primary')
    expect(screen.getByRole('link', { name: 'Open the game engine' })).not.toHaveClass('c-error__action--primary')
  })

  it('keeps the thrown message available but collapsed', () => {
    render(
      <ErrorScreen
        headline="This page stopped running"
        detail="It threw."
        actions={[]}
        technical="TypeError: cannot read property of undefined"
      />,
    )
    const details = screen.getByText('What the code said').closest('details')
    expect(details).not.toBeNull()
    expect(details).not.toHaveAttribute('open')
    expect(screen.getByText('TypeError: cannot read property of undefined')).toBeInTheDocument()
  })

  it('omits the technical block entirely when there is nothing to show', () => {
    render(<ErrorScreen status={404} headline="Gone" detail="Gone." actions={[]} />)
    expect(screen.queryByText('What the code said')).not.toBeInTheDocument()
  })

  it("wears the visitor's chosen world", () => {
    storedWorld('survival-horror')
    const { container } = render(<ErrorScreen status={404} headline="Gone" detail="Gone." actions={[]} />)

    const survivalHorror = getThemeById('survival-horror')
    const main = container.querySelector('.c-error') as HTMLElement
    expect(main.style.getPropertyValue('--err-bg')).toBe(survivalHorror.colors.background)
    expect(main.style.getPropertyValue('--err-accent')).toBe(survivalHorror.colors.accent)
    expect(main.style.getPropertyValue('--err-font')).toBe(survivalHorror.font)
  })

  it('falls back to the default world when nothing is stored', () => {
    storedWorld(null)
    const { container } = render(<ErrorScreen status={404} headline="Gone" detail="Gone." actions={[]} />)

    const fallback = getThemeById(DEFAULT_THEME_ID)
    const main = container.querySelector('.c-error') as HTMLElement
    expect(main.style.getPropertyValue('--err-bg')).toBe(fallback.colors.background)
  })

  it('still renders when storage itself throws (a browser blocking site data)', () => {
    localStorageGetItem.mockImplementation(() => {
      throw new Error('access denied')
    })
    render(<ErrorScreen status={500} headline="The server could not finish this request" detail="Retry." actions={[]} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })
})

describe('the three screens the routes render', () => {
  afterEach(() => {
    localStorageGetItem.mockReset()
    jest.restoreAllMocks()
  })

  it('404 names the miss and offers two pathways on', () => {
    render(<NotFoundScreen />)
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Open the game engine' })).toHaveAttribute(
      'href',
      '/personal-projects/game-engine',
    )
  })

  it('500 leads with the retry, because retrying is the honest advice', () => {
    render(<ServerErrorScreen />)
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload this page' })).toHaveClass('c-error__action--primary')
  })

  it('500 reports the status it was actually given', () => {
    render(<ServerErrorScreen status={502} />)
    expect(screen.getByText('502')).toBeInTheDocument()
  })

  it("a crash retries through React's reset rather than reloading", () => {
    const reset = jest.fn()
    render(<CrashScreen error={new Error('render blew up')} reset={reset} />)

    expect(screen.queryByText('500')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(reset).toHaveBeenCalledTimes(1)
    expect(screen.getByText('render blew up')).toBeInTheDocument()
  })

  it("a crash shows the digest too, so a production error can be traced", () => {
    const error = Object.assign(new Error('render blew up'), { digest: 'a1b2c3' })
    render(<CrashScreen error={error} />)
    expect(screen.getByText(/digest: a1b2c3/)).toBeInTheDocument()
  })
})
