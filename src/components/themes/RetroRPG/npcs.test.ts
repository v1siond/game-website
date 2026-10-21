import { pixelRuns } from '@/lib/pixelRuns'
import { CAST } from './npcs'

describe('the overworld cast', () => {
  it.each(CAST.map((sprite, index) => [index, sprite] as const))('sprite %i has even rows in colours its key names', (_, { rows, colours }) => {
    rows.forEach((row) => expect(row).toHaveLength(rows[0].length))
    pixelRuns(rows, 0).forEach((run) => expect(colours[run.key]).toBeDefined())
  })
})
