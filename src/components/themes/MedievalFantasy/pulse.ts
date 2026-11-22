import { cssVars } from '@/lib/cssVars'
import frost from './frostZone.module.css'

// A glow that pulses its opacity from `from` to `to` and back over `seconds`, linear and looping, as a CSS
// animation the reduced motion rule can stop. Spread on the svg shape that glows.
export const pulse = (from: number, to: number, seconds: number) => ({
  className: frost.pulse,
  style: cssVars({ '--pulse-from': from, '--pulse-to': to, '--pulse-dur': `${seconds}s` }),
})
