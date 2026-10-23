import {
  HINT_MIN_MS,
  launcherColors,
  markSeen,
  mayOfferHint,
  pickNextWorld,
  readSeen,
} from '@/lib/worlds/nudge'
import { contrastRatio } from '@/lib/contrast'
import { themes } from '@/themes/themes'

const IDS = ['a', 'b', 'c', 'd']

describe('readSeen', () => {
  it('keeps only known world ids, once each, in stored order', () => {
    expect(readSeen('["c","x","a","c"]', IDS)).toEqual(['c', 'a'])
  })

  it.each([[null], [''], ['not json'], ['{"a":1}'], ['[1,2]']])('reads %p as nothing seen', (raw) => {
    expect(readSeen(raw, IDS)).toEqual([])
  })
})

describe('markSeen', () => {
  it('adds a new world at the end', () => {
    expect(markSeen(['a'], 'b')).toEqual(['a', 'b'])
  })

  it('returns the same list when the world was already seen', () => {
    const seen = ['a', 'b']
    expect(markSeen(seen, 'a')).toBe(seen)
  })
})

describe('mayOfferHint', () => {
  const ready = { elapsedMs: HINT_MIN_MS, scrolledPx: 900, viewportPx: 800, offeredThisVisit: false, pickerOpened: false, seenCount: 1 }

  it('offers the hint once the visitor has read a while and scrolled a screen', () => {
    expect(mayOfferHint(ready)).toBe(true)
  })

  it('never offers it in the first 5 seconds, however far they scrolled', () => {
    expect(HINT_MIN_MS).toBeGreaterThan(5000)
    expect(mayOfferHint({ ...ready, elapsedMs: 5000, scrolledPx: 99999 })).toBe(false)
  })

  it('waits until the visitor has scrolled one screen', () => {
    expect(mayOfferHint({ ...ready, scrolledPx: 799 })).toBe(false)
  })

  it('offers it at most once per visit', () => {
    expect(mayOfferHint({ ...ready, offeredThisVisit: true })).toBe(false)
  })

  it('stays away from a visitor who already opened the worlds', () => {
    expect(mayOfferHint({ ...ready, pickerOpened: true })).toBe(false)
  })

  it('stays away from a visitor who has already tried another world', () => {
    expect(mayOfferHint({ ...ready, seenCount: 2 })).toBe(false)
  })
})

describe('pickNextWorld', () => {
  it('picks among the worlds not seen yet, never the current one', () => {
    expect(pickNextWorld(IDS, 'a', ['a', 'b'], () => 0)).toBe('c')
    expect(pickNextWorld(IDS, 'a', ['a', 'b'], () => 0.99)).toBe('d')
  })

  it('picks any other world once every world was seen', () => {
    expect(pickNextWorld(IDS, 'a', IDS, () => 0)).toBe('b')
    expect(pickNextWorld(IDS, 'a', IDS, () => 0.99)).toBe('d')
  })
})

describe('launcherColors', () => {
  it.each(themes.map((t) => [t.id, t.colors] as const))('gives %s a label of 7 to 1 or more on its fill', (_id, colors) => {
    const { text, body, fill } = launcherColors(colors)
    expect(fill).toBe(colors.background)
    expect(contrastRatio(text, fill)).toBeGreaterThanOrEqual(7)
    expect(contrastRatio(body, fill)).toBeGreaterThanOrEqual(7)
  })

  it('prefers the accent when it already reads at 7 to 1', () => {
    const colors = { ...themes[0].colors, background: '#000000', accent: '#ffffff', text: '#eeeeee' }
    expect(launcherColors(colors).text).toBe('#ffffff')
  })

  it('writes running text in the label colour when the text token is too faint', () => {
    const colors = { ...themes[0].colors, background: '#000000', accent: '#ffffff', text: '#222222' }
    expect(launcherColors(colors).body).toBe('#ffffff')
  })

  it('falls back to the text colour when the accent is too faint', () => {
    const colors = { ...themes[0].colors, background: '#000000', accent: '#333333', highlight: '#444444', text: '#eeeeee' }
    expect(launcherColors(colors).text).toBe('#eeeeee')
  })
})

describe('launcher edge', () => {
  const greys = Array.from({ length: 256 }, (_, v) => `#${v.toString(16).padStart(2, '0').repeat(3)}`)

  it.each(themes.map((t) => [t.id, t.colors] as const))('keeps the %s launcher 3 to 1 apart from any grey page behind it', (_id, colors) => {
    const { text, fill, edge } = launcherColors(colors)
    const weakest = Math.min(...greys.map((grey) => Math.max(...[text, fill, edge].map((ring) => contrastRatio(ring, grey)))))
    expect(weakest).toBeGreaterThanOrEqual(3)
  })
})

describe('contrastRatio', () => {
  it('reads black on white as 21 to 1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
  })
})
