import { HERO_IDENTITY } from '../components/cv/heroIdentity'
import { pixelRuns } from './pixelRuns'

// The site's mark: his face as a 16 by 16 pixel sprite (short dark hair, oval eyes, full dark beard),
// one grid pixel per screen pixel at favicon size so it stays sharp at 16px. The light outline keeps
// the dark hair and beard apart from the dark tile and from a dark browser tab.

export const MARK_GRID = 16

/** The tile behind the face, also the manifest's theme colour. */
export const MARK_BACKGROUND = '#0a0a0a'

const MARK_COLOURS: Record<string, string> = {
  O: '#f2efe6',
  H: HERO_IDENTITY.hair,
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  E: HERO_IDENTITY.eyes,
  B: HERO_IDENTITY.beard,
}

const MARK_ROWS = [
  '....OOOOOOOO....',
  '...OHHHHHHHHO...',
  '..OHHHHHHHHHHO..',
  '..OHHHHHHHHHHO..',
  '..OHSSSSSSSSHO..',
  '..OSSSSSSSSSSO..',
  '.OsSSESSSSESSsO.',
  '.OsSSESSSSESSsO.',
  '..OSSSSssSSSSO..',
  '..OBSSSSSSSSBO..',
  '..OBBSSSSSSBBO..',
  '..OBBBBBBBBBBO..',
  '..OBBBBssBBBBO..',
  '...OBBBBBBBBO...',
  '....OBBBBBBO....',
  '.....OOOOOO.....',
] as const

/** The mark as a standalone SVG document, drawn on a 16 unit grid and scaled by the viewer. */
export function siteMarkSvg(): string {
  const rects = pixelRuns(MARK_ROWS, 0)
    .map(({ x, y, width, key }) => `<rect x="${x}" y="${y}" width="${width}" height="1" fill="${MARK_COLOURS[key]}"/>`)
    .join('')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_GRID} ${MARK_GRID}" shape-rendering="crispEdges">` +
    `<rect width="${MARK_GRID}" height="${MARK_GRID}" rx="2" fill="${MARK_BACKGROUND}"/>${rects}</svg>`
  )
}
