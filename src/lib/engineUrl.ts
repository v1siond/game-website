/**
 * Where the engine lives. It is its own deployment now: nebulith (Phoenix) bundles and serves the
 * editor and the games, so this site only frames it.
 *
 * NEXT_PUBLIC_ is required, the frame is rendered in the browser bundle. Unset falls back to
 * nebulith's own default port, so a fresh checkout works with no .env file at all.
 */
export const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL ?? 'http://localhost:6328'
