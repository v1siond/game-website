// The preview screenshot script (scripts/capture-world-previews.mjs) opens a world with `?capture=<id>`.
// ThemeProvider opens that world, and the Wardrobe keeps its fan from playing over his cropped figure.
// worldPending.ts parses the same parameter in its inline script, which cannot import this module.

const CAPTURE_PARAM = 'capture'

/** The world id `?capture=` asks for, or null when the page was not opened by the capture script. */
export const captureWorld = (search: string): string | null => new URLSearchParams(search).get(CAPTURE_PARAM)

/** The page was opened by the capture script, with or without a world id. */
export const isCapture = (search: string): boolean => captureWorld(search) !== null
