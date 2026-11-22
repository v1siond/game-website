import type { Run } from '@/lib/pixelRuns'

// A pixel sprite's runs (lib/pixelRuns.ts) drawn as one 1 px tall rect each, painted by the colour its key
// names; a one colour sprite passes a one key map. Each world builds its own runs and wraps the rects in
// its own svg or group.

interface PixelRunsProps {
  runs: readonly Run[]
  colours: Readonly<Record<string, string>>
}

export function PixelRuns({ runs, colours }: PixelRunsProps) {
  return (
    <>
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={colours[run.key]} />
      ))}
    </>
  )
}
