// Base URL for the nebulith Elixir backend, as the CV SITE reaches it (GET /api/cv).
// The site owns this constant outright: the engine moved to its own deployment and carries its
// own copy, so neither side imports the other to learn where the backend is.
//
// ALWAYS configured through the environment. The NEXT_PUBLIC_ prefix is required for the value to
// reach the browser bundle.
//
//   .env.local:  NEXT_PUBLIC_NEBULITH_API=http://localhost:6328/api
//   backend:     PORT=6328 mix phx.server   (6328 is the nebulith default; see nebulith/config/runtime.exs)
//
// The literal below is the last-resort default for a checkout with no .env.local; it must stay in
// step with nebulith's own default port.
export const CV_API = process.env.NEXT_PUBLIC_NEBULITH_API ?? 'http://localhost:6328/api'
