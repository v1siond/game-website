import { execFile } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import { lastModifiedFrom } from './contentDate'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData } from './cv/content'
import { labelsFor, type Labels, type LabelsFile } from './cv/labels'
import { errorPagesFrom, type ErrorPages } from './cv/errorPages'

export type { CVData } from './cv/content'

// Decap edits these files (locally through decap-server, in production as commits), so they are read
// on each render and an edit shows without a code change. Each loader is cached per request (react
// cache), so a page's metadata, its body and the document shell read a locale's files once between them.
const CONTENT_DIR = join(process.cwd(), 'content', 'cv')

const contentFilePath = (name: string): string => join(CONTENT_DIR, `${name}.json`)

const readContentFile = async (name: string): Promise<[string, unknown]> => [
  name,
  JSON.parse(await readFile(contentFilePath(name), 'utf8')),
]

/** The CV of one locale, read from content/cv. Throws when a file is missing or is not valid JSON. */
export const getAllCVData = cache(async (locale: Locale): Promise<CVData> => {
  const entries = await Promise.all(CV_CONTENT_FILES.map(readContentFile))
  return cvDataFrom(Object.fromEntries(entries) as CVContentFiles, locale)
})

/** The interface text of one locale, read from content/cv/labels.json alone, for the document shell that
 *  renders around every page (the worlds launcher, hint and picker). */
export const getLabels = cache(async (locale: Locale): Promise<Labels> => {
  const [, file] = await readContentFile('labels')
  return labelsFor(file as LabelsFile, locale)
})

/** The error pages' words in every locale and his name, from labels.json and summary.json alone: a 404
 *  renders before it knows the address's language, so its screen picks one (NotFoundAtPath). */
export const getErrorPages = cache(async (): Promise<ErrorPages> => {
  const entries = await Promise.all(['labels', 'summary'].map(readContentFile))
  return errorPagesFrom(Object.fromEntries(entries) as Pick<CVContentFiles, 'labels' | 'summary'>)
})

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
