import {
  FACE_TURN_MS,
  LENS_WIDTHS,
  launcherFace,
  lensFocus,
  lensStill,
  portraitOf,
  type FaceMoment,
} from '@/lib/worlds/lens'

const scrolledOnHome: FaceMoment = {
  hero: 'out',
  hintOpen: false,
  turnedThisVisit: false,
  turning: false,
}

describe('launcherFace', () => {
  it('turns the face over the first time the hero has scrolled out of view', () => {
    expect(launcherFace(scrolledOnHome)).toBe('turn')
  })

  it('shows the face with no turn once the turn has played this visit', () => {
    expect(launcherFace({ ...scrolledOnHome, turnedThisVisit: true })).toBe('face')
  })

  it('reads the world count while the hero is in view, even mid turn', () => {
    expect(launcherFace({ ...scrolledOnHome, hero: 'in' })).toBe('count')
    expect(launcherFace({ ...scrolledOnHome, hero: 'in', turning: true, turnedThisVisit: true })).toBe('count')
  })

  it('reads the world count until the page has said where its hero is', () => {
    expect(launcherFace({ ...scrolledOnHome, hero: 'unknown' })).toBe('count')
  })

  it('keeps turning while the turn is running, though the flag is already kept', () => {
    expect(launcherFace({ ...scrolledOnHome, turning: true, turnedThisVisit: true })).toBe('turn')
  })

  it('waits for the open hint to close before the first turn', () => {
    expect(launcherFace({ ...scrolledOnHome, hintOpen: true })).toBe('count')
    expect(launcherFace({ ...scrolledOnHome, hintOpen: false })).toBe('turn')
  })

  it('keeps the turn inside the 5 s every moment ends in', () => {
    expect(FACE_TURN_MS).toBe(2600)
    expect(FACE_TURN_MS).toBeLessThan(5000)
  })
})

describe('lensStill and portraitOf', () => {
  it('names the still taken at the width the screen reads closest to', () => {
    expect(lensStill('neon-portals', true)).toBe('/world-previews/neon-portals-1440.webp')
    expect(lensStill('neon-portals', false)).toBe('/world-previews/neon-portals-390.webp')
    expect(LENS_WIDTHS).toEqual([1440, 390])
  })

  it('names his portrait in a world', () => {
    expect(portraitOf('survival-horror')).toBe('/world-previews/portraits/survival-horror.webp')
  })
})

describe('lensFocus', () => {
  it('centres the lens on his figure where the capture found it', () => {
    const focus = { 'neon-portals': { 1440: [760, 300], 390: [195, 330] } }
    expect(lensFocus(focus, 'neon-portals', 1440)).toEqual({ x: 760, y: 300 })
    expect(lensFocus(focus, 'neon-portals', 390)).toEqual({ x: 195, y: 330 })
  })

  it('centres on the middle of the hero when the capture found no figure', () => {
    expect(lensFocus({}, 'neon-portals', 1440)).toEqual({ x: 720, y: 360 })
    expect(lensFocus({ 'neon-portals': { 1440: [760, 300] } }, 'neon-portals', 390)).toEqual({ x: 195, y: 338 })
    expect(lensFocus(null, 'tropical-platformer', 390)).toEqual({ x: 195, y: 338 })
  })

  it('ignores a focus entry that is not a pair of numbers', () => {
    expect(lensFocus({ 'tropical-platformer': { 1440: ['a', 3] } }, 'tropical-platformer', 1440)).toEqual({ x: 720, y: 360 })
  })
})
