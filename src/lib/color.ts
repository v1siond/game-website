// Colour arithmetic on hex strings, for art drawn in a palette's shades.

const channels = (hex: string): [number, number, number] => {
  const digits = hex.replace('#', '')
  const full = digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits
  return [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16) || 0) as [number, number, number]
}

const byte = (value: number): string => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')

/** `from` moved toward `to` by t (0 keeps from, 1 reaches to), each channel rounded on its own, as #rrggbb. */
export function mix(from: string, to: string, t: number): string {
  const start = channels(from)
  const end = channels(to)
  return `#${start.map((value, i) => byte(value + (end[i] - value) * t)).join('')}`
}
