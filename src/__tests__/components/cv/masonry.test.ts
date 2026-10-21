import { MASONRY_ITEM, MASONRY_LIST, MASONRY_TILES } from '@/components/cv/masonry'

const classesOf = (list: string) => list.split(' ')

describe('masonry', () => {
  it('flows the list into one column on a phone, two from 768 and three from 1280', () => {
    expect(classesOf(MASONRY_LIST)).toEqual(expect.arrayContaining(['columns-1', 'md:columns-2', 'xl:columns-3']))
  })

  it('keeps each card whole inside its column', () => {
    expect(classesOf(MASONRY_ITEM)).toContain('break-inside-avoid')
  })

  it('sizes the tool tiles by the card width, never a fixed count that could overflow a narrow column', () => {
    expect(MASONRY_TILES).toMatch(/grid-cols-\[repeat\(auto-fill,minmax\(\d+rem,1fr\)\)\]/)
    expect(MASONRY_TILES).not.toMatch(/(^|\s)(\w+:)?grid-cols-\d/)
  })
})
