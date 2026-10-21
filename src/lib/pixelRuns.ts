// A pixel sprite drawn as data: each row is a string of colour keys, '.' is transparent. Rows become
// horizontal runs of one key, so a sprite renders as a few <rect>s per row instead of one per pixel.

export interface Run {
  x: number
  y: number
  width: number
  key: string
}

/** The rows as runs of one colour key placed from `top` and `left`; transparent pixels ('.') make no run. */
export function pixelRuns(rows: readonly string[], top: number, left = 0): Run[] {
  return rows.flatMap((row, index) => {
    const runs: Run[] = []
    let start = 0
    for (let x = 1; x <= row.length; x += 1) {
      if (row[x] === row[start]) continue
      if (row[start] !== '.') runs.push({ x: left + start, y: top + index, width: x - start, key: row[start] })
      start = x
    }
    return runs
  })
}
