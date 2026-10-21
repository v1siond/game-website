import React, { ReactElement, ReactNode } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ThemeProvider } from '@/themes/ThemeContext'
import { ProfessionProvider } from '@/contexts/ProfessionContext'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData } from '@/lib/cv/content'
import type { Locale } from '@/i18n/config'

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

/** The CV of one locale from the real content/cv files, the way the pages load it. */
function testCV(locale: Locale = 'en'): CVData {
  const files = Object.fromEntries(
    CV_CONTENT_FILES.map((name) => [
      name,
      JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8')),
    ]),
  ) as CVContentFiles
  return cvDataFrom(files, locale)
}

/** Renders inside the theme, profession and CV providers, so a component can read the CV and its labels. */
function renderWithCV(
  ui: ReactElement,
  { cv = testCV(), ...options }: Omit<RenderOptions, 'wrapper'> & { cv?: CVData } = {}
): RenderResult {
  const Wrapper = ({ children }: WrapperProps) => (
    <AllProviders>
      <CVDataProvider cv={cv}>{children}</CVDataProvider>
    </AllProviders>
  )
  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with our custom version
export { customRender as render, renderWithTheme, renderWithProfession, renderWithCV, testCV }
