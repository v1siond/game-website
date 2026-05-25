'use client'

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
 * FOCUS INDICATORS:
 * - 2px outline minimum
 * - 2px offset for visibility
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

// Global CSS for accessibility - add to each theme
export const accessibilityGlobalStyles = `
  /* =================================================================== */
  /* WCAG AA ACCESSIBILITY OVERRIDES                                     */
  /* =================================================================== */

  /* Ensure minimum font sizes */
  .text-xs,
  .text-\\[10px\\],
  .text-\\[11px\\],
  .text-\\[9px\\],
  .text-\\[8px\\] {
    font-size: 0.875rem !important; /* 14px minimum */
    line-height: 1.4 !important;
  }

  /* Focus indicators - visible on all interactive elements */
  a:focus-visible,
  button:focus-visible,
  [role="button"]:focus-visible,
  [tabindex="0"]:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid currentColor !important;
    outline-offset: 2px !important;
  }

  /* High contrast focus for dark themes */
  .theme-dark a:focus-visible,
  .theme-dark button:focus-visible,
  .theme-dark [role="button"]:focus-visible,
  .theme-dark [tabindex="0"]:focus-visible {
    outline-color: #ffffff !important;
  }

  /* High contrast focus for light themes */
  .theme-light a:focus-visible,
  .theme-light button:focus-visible,
  .theme-light [role="button"]:focus-visible,
  .theme-light [tabindex="0"]:focus-visible {
    outline-color: #000000 !important;
  }

  /* Skip link for keyboard users */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .skip-link:focus {
    position: fixed;
    top: 1rem;
    left: 1rem;
    width: auto;
    height: auto;
    padding: 1rem 1.5rem;
    background: #000;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    z-index: 9999;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  /* Ensure sufficient color contrast for muted text */
  .text-muted,
  [style*="color: #666"],
  [style*="color: #555"],
  [style*="color: #777"],
  [style*="color: #888"],
  [style*="color: #999"],
  [style*="color: #aaa"] {
    filter: brightness(1.3) !important;
  }

  /* Motion preference support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

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

// Skip link component
export function SkipLink({ href = '#main-content' }: { href?: string }) {
  return (
    <a href={href} className="skip-link">
      Skip to main content
    </a>
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

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0]
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Check if a color pair meets WCAG AA requirements
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

export default {
  ACCESSIBLE_COLORS,
  ACCESSIBLE_FONT_SIZES,
  accessibilityGlobalStyles,
  THEME_FOCUS_COLORS,
  SkipLink,
  getAccessibleTextColor,
  getContrastRatio,
  meetsWCAGAA,
}
