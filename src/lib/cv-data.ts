import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Locale } from '@/i18n/config'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData } from './cv/content'

export type { CVData } from './cv/content'

// Decap edits these files (locally through decap-server, in production as commits), so they are read
// on each render and an edit shows without a code change.
const CONTENT_DIR = join(process.cwd(), 'content', 'cv')

const readContentFile = async (name: string): Promise<[string, unknown]> => [
  name,
  JSON.parse(await readFile(join(CONTENT_DIR, `${name}.json`), 'utf8')),
]

/** The CV of one locale, read from content/cv. Throws when a file is missing or is not valid JSON. */
export async function getAllCVData(locale: Locale): Promise<CVData> {
  const entries = await Promise.all(CV_CONTENT_FILES.map(readContentFile))
  return cvDataFrom(Object.fromEntries(entries) as CVContentFiles, locale)
}
