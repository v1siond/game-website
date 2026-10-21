import { PROFESSION_ORDER } from '@/lib/cv/professions'
import { COLOURS, EYES, HEART, PART_TOP, SPRITE, actionPose, pixelRuns, walkPose, type Facing, type Pose, type Step } from './sprite'

const FACINGS: Facing[] = ['down', 'up', 'right', 'left']
const STEPS: Step[] = ['stand', 'stepA', 'stepB']

const posesOf = (profession: (typeof PROFESSION_ORDER)[number]): Pose[] => [
  ...FACINGS.flatMap((facing) => STEPS.map((step) => walkPose(profession, facing, step))),
  actionPose(profession, 'actA'),
  actionPose(profession, 'actB'),
]

describe('the room walker sprite', () => {
  it.each(PROFESSION_ORDER)('draws every %s frame on the 20 by 30 grid in colours his outfit names', (profession) => {
    posesOf(profession).forEach(({ head, torso, legs }) => {
      expect(head).toHaveLength(PART_TOP.torso - PART_TOP.head)
      expect(torso).toHaveLength(PART_TOP.legs - PART_TOP.torso)
      expect(legs).toHaveLength(SPRITE.height - PART_TOP.legs)
      ;[...head, ...torso, ...legs].forEach((row) => expect(row).toHaveLength(SPRITE.width))
      pixelRuns([...head, ...torso, ...legs], 0).forEach((run) => expect(COLOURS[profession][run.key]).toBeDefined())
    })
  })

  it('mirrors the right facing into the left one', () => {
    const right = walkPose('engineer', 'right', 'stepA')
    const left = walkPose('engineer', 'left', 'stepA')
    expect(left.head[7]).toBe([...right.head[7]].reverse().join(''))
    expect(left.legs[3]).toBe([...right.legs[3]].reverse().join(''))
  })

  it('merges a row into runs of one colour and skips the transparent pixels', () => {
    expect(pixelRuns(['..KKSS..'], 3)).toEqual([
      { x: 2, y: 3, width: 2, key: 'K' },
      { x: 4, y: 3, width: 2, key: 'S' },
    ])
  })

  it('finds his dot eyes where the face draws them', () => {
    const face = walkPose('drummer', 'down', 'stand').head
    EYES.forEach(([x, y]) => expect(face[y][x]).toBe('E'))
  })

  it('keeps the heart inside his chest', () => {
    HEART.rows.forEach((row) => expect(HEART.x + row.length).toBeLessThanOrEqual(SPRITE.width))
    expect(HEART.y).toBeGreaterThanOrEqual(PART_TOP.torso)
  })
})
