// When the CV content last changed, for the sitemap's lastmod and the pages' dateModified. Plain
// function of what was read, so the reading (git, the file system) stays in src/lib/cv-data.ts.

/** The last commit date of the content (ISO 8601 from `git log --format=%cI`), or the newest file time
 *  when there is no commit date, as in a checkout without history. */
export function lastModifiedFrom(gitDate: string, fileTimes: readonly Date[]): Date {
  const committed = new Date(gitDate.trim())
  if (gitDate.trim() && !Number.isNaN(committed.getTime())) return committed
  return new Date(Math.max(...fileTimes.map((time) => time.getTime())))
}
