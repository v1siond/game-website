import React, { ReactElement, ReactNode } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ThemeProvider } from '@/themes/ThemeContext'
import { ProfessionProvider } from '@/contexts/ProfessionContext'

interface WrapperProps {
  children: ReactNode
}

/**
 * All-in-one wrapper providing theme and profession context
 */
function AllProviders({ children }: WrapperProps): ReactElement {
  return (
    <ThemeProvider>
      <ProfessionProvider>{children}</ProfessionProvider>
    </ThemeProvider>
  )
}

/**
 * Custom render function that wraps components with all providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Theme-only wrapper for testing theme functionality in isolation
 */
function ThemeOnlyWrapper({ children }: WrapperProps): ReactElement {
  return <ThemeProvider>{children}</ThemeProvider>
}

function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: ThemeOnlyWrapper, ...options })
}

/**
 * Profession-only wrapper for testing profession context in isolation
 */
function ProfessionOnlyWrapper({ children }: WrapperProps): ReactElement {
  return <ProfessionProvider>{children}</ProfessionProvider>
}

function renderWithProfession(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: ProfessionOnlyWrapper, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with our custom version
export { customRender as render, renderWithTheme, renderWithProfession }
