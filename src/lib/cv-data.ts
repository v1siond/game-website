import type { Locale } from '@/i18n/config'
import { getStaticCVData } from './cv-data-static'
import { NEBULITH_API } from './nebulithApi'

// CV/portfolio data now comes from the nebulith ELIXIR backend (GET /api/cv?locale=…)
// The endpoint does the queries + i18n field selection server-side and returns the SAME shape the page
// consumes (professionalSummary, currentRoles, companies, featuredProjects, techStack, workExperience).
// `src/app/cv/page.tsx` already falls back to `getStaticCVData` when this throws / returns empty.
// Base URL from the shared, env-configurable NEBULITH_API (see src/lib/nebulithApi.ts).

/** The CV payload shape — reuse the static mirror's type so the page stays fully typed. */
export type CVData = Awaited<ReturnType<typeof getStaticCVData>>

/** Fetch the whole CV payload for a locale from the Elixir backend. Throws on a non-OK response so the
 *  page's try/catch can fall back to the static data. */
export async function getAllCVData(locale: Locale): Promise<CVData> {
  const res = await fetch(`${NEBULITH_API}/cv?locale=${locale}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`CV fetch failed: ${res.status} ${res.statusText}`)
  return (await res.json()) as CVData
}
