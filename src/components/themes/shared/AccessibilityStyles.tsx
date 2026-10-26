'use client'

import { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { contrastRatio } from '@/lib/contrast'

/**
 * WCAG AA Accessibility Styles for Game Website Themes
 *
 * CONTRAST REQUIREMENTS:
 * - Normal text (< 18pt / 14pt bold): 4.5:1 minimum
 * - Large text (>= 18pt / 14pt bold): 3:1 minimum
 * - UI components and graphics: 3:1 minimum
 *
 * FONT SIZE REQUIREMENTS:
 * - Body text: 16px minimum (1rem)
 * - Small text: 14px minimum (0.875rem) - never below
 * - Labels/captions: 14px minimum
 *
 * TOUCH TARGET REQUIREMENTS:
 * - Minimum 44x44px touch targets
 *
 * FOCUS INDICATORS:
 * - 3px outline minimum for visibility
 * - 2px offset for separation from element
 * - High contrast color against background
 */

// Accessible color pairs for common theme backgrounds
export const ACCESSIBLE_COLORS = {
  // For dark backgrounds (< 50% luminance)
  darkBg: {
    primary: '#ffffff',      // 21:1 on pure black
    secondary: '#e0e0e0',    // ~15:1 on pure black
    muted: '#b8b8b8',        // ~10:1 on pure black - minimum for readable text
    accent: '#ffcc00',       // Good contrast on dark
    link: '#6db3f2',         // ~7:1 on pure black
    error: '#ff6b6b',        // ~5:1 on pure black
  },
  // For light backgrounds (> 50% luminance)
  lightBg: {
    primary: '#1a1a1a',      // 16:1+ on white
    secondary: '#333333',    // ~12:1 on white
    muted: '#555555',        // ~7:1 on white - minimum for readable text
    accent: '#0066cc',       // Good contrast on light
    link: '#0066cc',
    error: '#cc0000',
  },
}

// Minimum accessible font sizes as CSS values
export const ACCESSIBLE_FONT_SIZES = {
  body: '1rem',              // 16px - standard body
  small: '0.875rem',         // 14px - absolute minimum
  label: '0.875rem',         // 14px - minimum for labels
  button: '0.875rem',        // 14px - minimum for buttons
  heading: '1.25rem',        // 20px - minimum for h4+
}

// Theme-specific focus colors - high contrast for each theme
export const THEME_FOCUS_COLORS: Record<string, string> = {
  // Dark fantasy / horror themes
  darkFantasy: '#ffcc00',
  survivalHorror: '#ff6b6b',
  soulMap: '#ff8c42',
  silhouette: '#ffffff',

  // Vibrant neon themes
  neonCyber: '#00ffff',
  neonPortals: '#00ffff',
  retroAtomic: '#14ff00',

  // Warm/earth themes
  adventurePaths: '#40e8ff',
  artDeco: '#d4af37',
  medievalFantasy: '#c9a227',
  mythic: '#d4af37',

  // Colorful themes
  cellShaded: '#ffff00',
  fighterSelect: '#00ffff',
  boldNoir: '#ff0033',
  rubberHose: '#c9a227',
  retroRPG: '#ffff00',
  tropicalPlatformer: '#00ccff',
}

// Skip link component - ensures keyboard users can bypass navigation
export function SkipLink({ href = '#main-content' }: { href?: string }) {
  const { navigation } = useLabels()
  return (
    <a
      href={href}
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: 9999,
      }}
      onFocus={(e) => {
        const el = e.currentTarget
        el.style.position = 'fixed'
        el.style.top = '1rem'
        el.style.left = '1rem'
        el.style.width = 'auto'
        el.style.height = 'auto'
        el.style.padding = '1rem 1.5rem'
        el.style.background = '#000'
        el.style.color = '#fff'
        el.style.fontSize = '1rem'
        el.style.fontWeight = 'bold'
        el.style.outline = '3px solid #fff'
        el.style.outlineOffset = '2px'
        el.style.borderRadius = '4px'
        el.style.textDecoration = 'none'
      }}
      onBlur={(e) => {
        const el = e.currentTarget
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        el.style.top = 'auto'
        el.style.width = '1px'
        el.style.height = '1px'
        el.style.overflow = 'hidden'
      }}
    >
      {navigation.skipToContent}
    </a>
  )
}

// Accessible main content wrapper with proper landmark
export function MainContent({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <main id="main-content" tabIndex={-1} className={`outline-none ${className}`}>
      {children}
    </main>
  )
}

// Hook to get accessible text color based on background luminance
export function getAccessibleTextColor(backgroundColor: string): string {
  // Simple luminance calculation
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#1a1a1a' : '#ffffff'
}

// Contrast ratio between two colors, from the one WCAG formula in src/lib/contrast.ts
export const getContrastRatio = contrastRatio

// Check if a color pair meets WCAG AA requirements
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

export default {
  ACCESSIBLE_COLORS,
  ACCESSIBLE_FONT_SIZES,
  THEME_FOCUS_COLORS,
  SkipLink,
  getAccessibleTextColor,
  getContrastRatio,
  meetsWCAGAA,
}
