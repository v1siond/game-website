import { PROFESSION_ORDER } from '@/lib/cv/professions'
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
