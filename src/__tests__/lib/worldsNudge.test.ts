import {
  HINT_MIN_MS,
  SEEN_STORAGE_KEY,
  TOUR_ORDER,
  VISIT_STORAGE_KEY,
  coversNothing,
  launcherColors,
  markSeen,
  mayOfferHint,
  nextInTour,
  orderForPicker,
  readSeen,
  recordWorld,
} from '@/lib/worlds/nudge'
import { contrastRatio } from '@/lib/contrast'
import { DEFAULT_THEME_ID, themes } from '@/themes/themes'

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

describe('TOUR_ORDER', () => {
  it('holds every world once', () => {
    expect([...TOUR_ORDER].sort()).toEqual(themes.map((theme) => theme.id).sort())
  })

  it('opens with the worlds that read most unlike each other', () => {
    expect(TOUR_ORDER.slice(0, 4)).toEqual(['medieval-fantasy', 'neon-portals', 'survival-horror', 'art-deco'])
  })
})

describe('nextInTour', () => {
  it('offers a first visitor in Retro Atomic the first world of the tour', () => {
    expect(nextInTour('retro-atomic', ['retro-atomic'])).toBe('medieval-fantasy')
  })

  it('offers a first visitor in the default world a world other than it', () => {
    const next = nextInTour(DEFAULT_THEME_ID, [DEFAULT_THEME_ID])
    expect(next).toBe(TOUR_ORDER.find((id) => id !== DEFAULT_THEME_ID))
    expect(next).not.toBe(DEFAULT_THEME_ID)
  })

  it('walks the tour one unseen world at a time', () => {
    expect(nextInTour('medieval-fantasy', ['medieval-fantasy'])).toBe('neon-portals')
    expect(nextInTour('neon-portals', ['medieval-fantasy', 'neon-portals'])).toBe('survival-horror')
    expect(nextInTour('survival-horror', ['medieval-fantasy', 'neon-portals', 'survival-horror'])).toBe('art-deco')
  })

  it('skips the worlds already seen, wherever the visitor is now', () => {
    expect(nextInTour('retro-atomic', ['medieval-fantasy', 'neon-portals', 'retro-atomic'])).toBe('survival-horror')
  })

  it('never offers the world the visitor is in, seen or not', () => {
    expect(nextInTour('medieval-fantasy', [])).toBe('neon-portals')
  })

  it('offers the world after the current one once every world was seen, wrapping at the end', () => {
    expect(nextInTour('neon-portals', TOUR_ORDER)).toBe('survival-horror')
    expect(nextInTour('dark-fantasy', TOUR_ORDER)).toBe('medieval-fantasy')
  })
})

describe('orderForPicker', () => {
  it('puts the next unseen world first, the other unseen ones in tour order, and the current world last', () => {
    const order = orderForPicker('medieval-fantasy', ['medieval-fantasy'])
    expect(order).toHaveLength(TOUR_ORDER.length)
    expect(order[0]).toEqual({ id: 'neon-portals', mark: 'next' })
    expect(order.slice(1, 3)).toEqual([
      { id: 'survival-horror', mark: 'unseen' },
      { id: 'art-deco', mark: 'unseen' },
    ])
    expect(order[order.length - 1]).toEqual({ id: 'medieval-fantasy', mark: 'here' })
    expect(order.filter((entry) => entry.mark === 'next')).toHaveLength(1)
  })

  it('lists the seen worlds after every unseen one, before the current world', () => {
    const order = orderForPicker('survival-horror', ['medieval-fantasy', 'neon-portals', 'survival-horror'])
    expect(order[0]).toEqual({ id: 'art-deco', mark: 'next' })
    expect(order.slice(-3)).toEqual([
      { id: 'medieval-fantasy', mark: 'seen' },
      { id: 'neon-portals', mark: 'seen' },
      { id: 'survival-horror', mark: 'here' },
    ])
    expect(order.slice(1, -3).every((entry) => entry.mark === 'unseen')).toBe(true)
    expect(new Set(order.map((entry) => entry.id)).size).toBe(TOUR_ORDER.length)
  })

  it('offers no up next card once every world was seen', () => {
    const order = orderForPicker('art-deco', TOUR_ORDER)
    expect(order.some((entry) => entry.mark === 'next' || entry.mark === 'unseen')).toBe(false)
    expect(order.filter((entry) => entry.mark === 'seen')).toHaveLength(TOUR_ORDER.length - 1)
    expect(order[order.length - 1]).toEqual({ id: 'art-deco', mark: 'here' })
  })
})

describe('the visit list', () => {
  it('is kept under its own session key', () => {
    expect(VISIT_STORAGE_KEY).toBe('portfolio-worlds-visit')
    expect(VISIT_STORAGE_KEY).not.toBe(SEEN_STORAGE_KEY)
  })

  it('starts with the first world entered', () => {
    expect(recordWorld(null, 'a', IDS)).toEqual(['a'])
  })

  it('adds each world entered once, in the order entered', () => {
    expect(recordWorld('["c","a"]', 'b', IDS)).toEqual(['c', 'a', 'b'])
    expect(recordWorld('["c","a"]', 'c', IDS)).toEqual(['c', 'a'])
  })

  it('starts over from an unreadable list and drops unknown worlds', () => {
    expect(recordWorld('not json', 'b', IDS)).toEqual(['b'])
    expect(recordWorld('["x","a"]', 'b', IDS)).toEqual(['a', 'b'])
  })
})

describe('coversNothing', () => {
  const box = { left: 100, top: 60, right: 420, bottom: 200 }

  it('is clear with nothing under the box', () => {
    expect(coversNothing(box, [])).toBe(true)
  })

  it('is not clear when a text or control box overlaps it', () => {
    expect(coversNothing(box, [{ left: 400, top: 190, right: 500, bottom: 260 }])).toBe(false)
    expect(coversNothing(box, [{ left: 0, top: 0, right: 2000, bottom: 2000 }])).toBe(false)
  })

  it('is clear when a box only touches its edge or sits beside it', () => {
    expect(coversNothing(box, [{ left: 420, top: 60, right: 500, bottom: 200 }])).toBe(true)
    expect(coversNothing(box, [{ left: 100, top: 200, right: 420, bottom: 300 }])).toBe(true)
  })

  it('ignores a box with no area', () => {
    expect(coversNothing(box, [{ left: 200, top: 100, right: 200, bottom: 150 }])).toBe(true)
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
