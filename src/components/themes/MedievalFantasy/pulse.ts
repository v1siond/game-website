import { cssVars } from '@/lib/cssVars'
import frost from './frostZone.module.css'
import { cyclesIn } from './play'

// A glow that pulses its opacity from `from` to `to` and back over `seconds`, linear, as many times as fit in
// the 5 s it plays once it shows (play.ts), resting on `from`, as a CSS animation the reduced motion rule can
// stop. Spread on the svg shape that glows.
export const pulse = (from: number, to: number, seconds: number) => ({
  className: frost.pulse,
  style: cssVars({ '--pulse-from': from, '--pulse-to': to, '--pulse-dur': `${seconds}s`, '--pulse-n': cyclesIn(seconds) }),
})

// A wisp of smoke or breath that swells and drifts by `moves` (--drift-x, --drift-y, --drift-sx, --drift-sy)
// and back over `seconds`, as many times as fit in the same 5 s, resting where it started.
export const drift = (seconds: number, moves: Record<string, string | number>) => ({
  className: frost.drift,
  style: cssVars({ ...moves, '--drift-dur': `${seconds}s`, '--drift-n': cyclesIn(seconds) }),
})
