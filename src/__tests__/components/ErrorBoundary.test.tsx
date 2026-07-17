import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/** A child that throws during render, to exercise the boundary's catch path. */
function Boom(): never {
  throw new Error('render blew up')
}

describe('ErrorBoundary', () => {
  // A caught render error is still logged by React + the boundary; silence it so the run stays clean.
  let errorSpy: jest.SpyInstance
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('renders its children unchanged when nothing throws', () => {
    render(
      <ErrorBoundary fallback={<div>fallback shown</div>}>
        <div>the real builder</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('the real builder')).toBeInTheDocument()
    expect(screen.queryByText('fallback shown')).not.toBeInTheDocument()
  })

  it('renders the fallback (not a blank screen) when a child throws while rendering', () => {
    render(
      <ErrorBoundary fallback={<div>fallback shown</div>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('fallback shown')).toBeInTheDocument()
  })

  it('reports the thrown error through onError', () => {
    const onError = jest.fn()
    render(
      <ErrorBoundary fallback={<div>fallback shown</div>} onError={onError}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect((onError.mock.calls[0][0] as Error).message).toBe('render blew up')
  })
})
