import { useLabels } from '@/components/cv/CVDataProvider'
import look from './world.module.css'
import horror from './horror.module.css'

// The genre's condition screen: an ECG trace running across a black monitor, its colour and its word saying
// how he is (Fine, Caution, Danger), the word always printed so the colour is never the only signal. The trace
// is drawn twice side by side and slides one width per beat cycle, faster the worse he is. Animated: the trace.

export type Condition = 'fine' | 'caution' | 'danger'

// One beat cycle, 100 units wide: flat, the small P wave, the spike, the T wave, flat again; drawn twice so
// the strip can slide one cycle and loop without a seam.
const BEAT: ReadonlyArray<readonly [number, number]> = [
  [14, 20], [18, 16], [22, 20], [30, 20], [33, 24], [37, 2], [41, 30], [45, 20], [54, 20], [60, 13], [66, 20], [100, 20],
]
const TRACE = `M0 20 ${[0, 100].flatMap((shift) => BEAT.map(([x, y]) => `L${x + shift} ${y}`)).join(' ')}`

const CONDITION_LOOK: Record<Condition, { text: string; stroke: string; speed: string }> = {
  fine: { text: 'text-[color:var(--sh-fine)]', stroke: 'var(--sh-fine)', speed: horror.ecgFine },
  caution: { text: 'text-[color:var(--sh-caution)]', stroke: 'var(--sh-caution)', speed: horror.ecgCaution },
  danger: { text: 'text-[color:var(--sh-danger)]', stroke: 'var(--sh-danger)', speed: horror.ecgDanger },
}

export function ConditionMonitor({ condition, className = '' }: { condition: Condition; className?: string }) {
  const { horror: words } = useLabels()
  const state = CONDITION_LOOK[condition]

  return (
    <div className={`border border-[color:var(--sh-sepia)] bg-[color:var(--sh-monitor)] p-3 ${className}`} role="status">
      <p className={`flex items-baseline justify-between gap-3 text-sm uppercase ${look.typed}`}>
        <span className="text-[color:var(--sh-fog)]">{words.condition}</span>
        <span className={`${state.text} ${condition === 'fine' ? '' : horror.conditionFlash}`}>{words[condition]}</span>
      </p>
      <div className="mt-2 h-10 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 200 32" preserveAspectRatio="none" className={`h-full w-[200%] ${horror.ecgTrace} ${state.speed}`} focusable="false">
          <path d={TRACE} fill="none" stroke={state.stroke} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  )
}
