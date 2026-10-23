import { execFile } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import type { Locale } from '@/i18n/config'
import { lastModifiedFrom } from './contentDate'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData } from './cv/content'

export type { CVData } from './cv/content'

// Decap edits these files (locally through decap-server, in production as commits), so they are read
// on each render and an edit shows without a code change.
const CONTENT_DIR = join(process.cwd(), 'content', 'cv')

const contentFilePath = (name: string): string => join(CONTENT_DIR, `${name}.json`)

const readContentFile = async (name: string): Promise<[string, unknown]> => [
  name,
  JSON.parse(await readFile(contentFilePath(name), 'utf8')),
]

/** The CV of one locale, read from content/cv. Throws when a file is missing or is not valid JSON. */
export async function getAllCVData(locale: Locale): Promise<CVData> {
  const entries = await Promise.all(CV_CONTENT_FILES.map(readContentFile))
  return cvDataFrom(Object.fromEntries(entries) as CVContentFiles, locale)
}


// The committer date of the last commit touching the content, or '' where git or the history is missing.
const lastCommitDate = async (): Promise<string> => {
  try {
    const { stdout } = await promisify(execFile)('git', ['log', '-1', '--format=%cI', '--', CONTENT_DIR])
    return stdout
  } catch {
    return ''
  }
}

/** When the CV content last changed: its last commit, else the newest file time. */
export async function contentLastModified(): Promise<Date> {
  const [gitDate, stats] = await Promise.all([lastCommitDate(), Promise.all(CV_CONTENT_FILES.map((name) => stat(contentFilePath(name))))])
  return lastModifiedFrom(gitDate, stats.map((fileStat) => fileStat.mtime))
}
