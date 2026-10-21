import { PROFESSION_ORDER } from '@/lib/cv/professions'
import { EYES, OUTFITS, SPRITE, headRows, legRows, spriteRuns, torsoRows, type LegFrame, type TorsoFrame } from './sprite'

const TORSO_FRAMES: TorsoFrame[] = ['idle', 'walkA', 'walkB', 'actA', 'actB', 'cheer']
const LEG_FRAMES: LegFrame[] = ['stand', 'walkA', 'walkB']

describe('the map walker sprite', () => {
  it.each(PROFESSION_ORDER)('draws every %s frame on the 20 pixel grid in colours his outfit names', (profession) => {
    const outfit = OUTFITS[profession]
    const parts = [
      { rows: headRows(outfit.headgear), width: 16, height: 13 },
      ...TORSO_FRAMES.map((frame) => ({ rows: torsoRows(profession, frame), width: SPRITE.width, height: 5 })),
      ...LEG_FRAMES.map((frame) => ({ rows: legRows(frame), width: SPRITE.width, height: 5 })),
    ]
    parts.forEach(({ rows, width, height }) => {
      expect(rows).toHaveLength(height)
      rows.forEach((row) => expect(row).toHaveLength(width))
      spriteRuns(rows, 0).forEach((run) => expect(outfit.colours[run.key]).toBeDefined())
    })
  })

  it('merges a row into runs of one colour and skips the transparent pixels', () => {
    expect(spriteRuns(['..KKSS..'], 3)).toEqual([
      { x: 8, y: 3, width: 2, key: 'K' },
      { x: 10, y: 3, width: 2, key: 'S' },
    ])
  })

  it('finds his eyes where the face draws them', () => {
    const face = headRows('cap')
    EYES.forEach(([x, y]) => expect(face[y][x - 2]).toBe('E'))
  })
})
