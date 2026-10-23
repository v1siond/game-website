// WCAG relative luminance and contrast ratio of two #rrggbb colours.

const channel = (value: number): number => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)

const luminance = (hex: string): number => {
  const [r, g, b] = (hex.replace('#', '').match(/.{2}/g) ?? ['00', '00', '00']).map((pair) => channel(parseInt(pair, 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(first: string, second: string): number {
  const [darker, lighter] = [luminance(first), luminance(second)].sort((a, b) => a - b)
  return (lighter + 0.05) / (darker + 0.05)
}
