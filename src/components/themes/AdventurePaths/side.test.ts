import { PROFESSION_ORDER } from '@/lib/cv/professions'
import { motionOf, playedPast, hopToward, restSpot, type Course } from './course'
import { FOE, FOE_FRAME_NAMES, HERO, HERO_OUTFITS, HERO_POSES, foeColours, foeRows, heroParts } from './side'

const pixelKeys = (rows: readonly string[]) => rows.flatMap((row) => [...row]).filter((key) => key !== '.')

describe('the side view sprites', () => {
  it.each(PROFESSION_ORDER)('draws every %s pose inside the 16 by 26 grid in colours his outfit names', (profession) => {
    const { headgear, colours } = HERO_OUTFITS[profession]
    HERO_POSES.forEach((pose) => {
      heroParts(pose, headgear).forEach(({ rows, top }) => {
        expect(top + rows.length).toBeLessThanOrEqual(HERO.height)
        rows.forEach((row) => expect(row).toHaveLength(HERO.width))
        pixelKeys(rows).forEach((key) => expect(colours[key]).toBeDefined())
      })
    })
  })

  it.each(FOE_FRAME_NAMES)('draws the %s foe frame on the 12 by 16 grid in its own colours', (frame) => {
    const rows = foeRows(frame)
    expect(rows).toHaveLength(FOE.height)
    rows.forEach((row) => expect(row).toHaveLength(FOE.width))
    pixelKeys(rows).forEach((key) => expect(foeColours(frame)[key]).toBeDefined())
  })
})

const COURSE: Course<'run' | 'jump' | 'bump' | 'stand'> = {
  start: { x: -20, lift: 0 },
  legs: [
    { pose: 'run', frame: 'run', path: 'line', to: { x: 40, lift: 0 }, ms: 500 },
    { pose: 'jump', frame: 'jump', path: 'arc', to: { x: 50, lift: 60 }, ms: 300, peak: 20 },
  ],
  rest: { pose: 'stand', frame: 'stand' },
  moves: [{ pose: 'bump', frame: 'jump', path: 'arc', to: { x: 50, lift: 60 }, ms: 400 }],
}

describe('a level course', () => {
  it('starts each leg where the last one ended', () => {
    expect(motionOf(COURSE, 'run').from).toEqual({ x: -20, lift: 0 })
    expect(motionOf(COURSE, 'jump').from).toEqual({ x: 40, lift: 0 })
  })

  it('plays a move from his rest spot, and stands still in the rest pose', () => {
    expect(restSpot(COURSE)).toEqual({ x: 50, lift: 60 })
    expect(motionOf(COURSE, 'bump').from).toEqual({ x: 50, lift: 60 })
    expect(motionOf(COURSE, 'stand')).toMatchObject({ path: 'still', frame: 'stand', from: { x: 50, lift: 60 }, to: { x: 50, lift: 60 } })
  })

  it('counts a leg as played once a later leg runs or he has arrived', () => {
    expect(playedPast(COURSE, 'run', false, 'run')).toBe(false)
    expect(playedPast(COURSE, 'jump', false, 'run')).toBe(true)
    expect(playedPast(COURSE, 'jump', false, 'jump')).toBe(false)
    expect(playedPast(COURSE, 'stand', true, 'jump')).toBe(true)
  })

  it('hops one platform at a time toward the target, either way, and stays once there', () => {
    expect(hopToward({ from: 0, at: 1 }, 4)).toEqual({ from: 1, at: 2 })
    expect(hopToward({ from: 3, at: 2 }, 0)).toEqual({ from: 2, at: 1 })
    expect(hopToward({ from: 1, at: 2 }, 2)).toEqual({ from: 2, at: 2 })
  })
})
