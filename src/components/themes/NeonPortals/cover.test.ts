import { BOX, boxOf, coverAt, heroSpan, playAt, readAt, roomSpan } from './cover'
import type { RoomMarks } from './world'

// When each era's set piece covers the passage, how far its script is asked to play, and where its box sits
// on the screen: a function of the scroll alone, so scrolling up plays the same covers backwards.

const VH = 900
const page = { reading: 500, vh: VH, maxScroll: 20000 }
const marks: RoomMarks = { top: 2000, transitEnd: 2850, gateTop: 2850, gateBottom: 3400, items: [3800, 4300], bottom: 4900 }
// The gate plate on the reading line.
const gateRead = marks.gateTop - page.reading

describe('roomSpan and coverAt', () => {
  const span = roomSpan(marks, page, { phone: false, last: false })

  it('leaves the passage in view until the gate plate comes up, then zooms the place in whole', () => {
    expect(coverAt(span, gateRead - 0.4 * VH).opacity).toBe(0)
    const rising = coverAt(span, gateRead - 0.1 * VH)
    expect(rising.opacity).toBeGreaterThan(0)
    expect(rising.zoom).toBeLessThan(1)
    expect(rising.reveal).toBeLessThan(1)
    expect(coverAt(span, gateRead + 0.1 * VH)).toEqual({ opacity: 1, zoom: 1, reveal: 1 })
  })

  it('zooms the place out past the camera as the section ends, back to the passage', () => {
    const leaving = coverAt(span, marks.bottom - page.reading - 0.2 * VH)
    expect(leaving.opacity).toBeLessThan(1)
    expect(leaving.zoom).toBeGreaterThan(1)
    expect(coverAt(span, marks.bottom - page.reading + 1).opacity).toBe(0)
  })

  it('holds the last room to the end of the page', () => {
    const last = roomSpan(marks, page, { phone: false, last: true })
    expect(coverAt(last, page.maxScroll)).toEqual({ opacity: 1, zoom: 1, reveal: 1 })
  })

  it('asks for the whole script once the place is in and before it leaves, over a shorter scroll on a phone', () => {
    expect(playAt(span, gateRead - 1)).toBe(0)
    const [, end] = span.play
    expect(end).toBeLessThan(marks.bottom - page.reading - 0.4 * VH)
    expect(playAt(span, end)).toBe(1)
    const phone = roomSpan(marks, page, { phone: true, last: false })
    expect(phone.play[1] - phone.play[0]).toBeLessThan(end - span.play[0])
  })
})

describe('heroSpan', () => {
  const span = heroSpan(VH, VH, false)

  it('shows the fall whole from the top of the page and hands it to the passage before the first room', () => {
    expect(coverAt(span, 0)).toEqual({ opacity: 1, zoom: 1, reveal: 1 })
    expect(coverAt(span, VH).opacity).toBe(0)
    expect(playAt(span, 0)).toBe(0)
    expect(playAt(span, VH * 0.6)).toBe(1)
  })
})

describe('readAt', () => {
  const spans = [heroSpan(VH, VH, false), roomSpan(marks, page, { phone: false, last: false })]

  it('names the scene being read under reduced motion: the hero, then the room once its gate comes up', () => {
    expect(readAt(spans, 0)).toBe(0)
    expect(readAt(spans, gateRead)).toBe(1)
  })
})

describe('boxOf', () => {
  it('puts a room right of the text column on a desktop', () => {
    const box = boxOf(1440, 900, null)
    expect(box.x).toBeGreaterThan(700)
    expect(box.x + BOX.w * box.k).toBeLessThanOrEqual(1440)
  })

  it('scales a room to the phone width, larger than a desktop share, its ground clear of the bottom half of the screen', () => {
    const box = boxOf(390, 844, null)
    expect(BOX.w * box.k).toBeGreaterThan(390)
    expect(box.y + BOX.ground * box.k).toBeLessThan(844 * 0.7)
  })

  it('stands the hero on his mark: where he starts is the foot point given', () => {
    const box = boxOf(1440, 900, { x: 922, y: 742 })
    expect(box.x + BOX.heroStart * box.k).toBeCloseTo(922)
    expect(box.y + BOX.ground * box.k).toBeCloseTo(742)
  })
})
