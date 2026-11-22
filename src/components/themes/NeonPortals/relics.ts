import type { Job } from '@/lib/cv/content'
import type { Relic } from './world'

// A job's run time as a relic tier, the time trial idea: the longer the run, the brighter the relic its
// checkpoint drops. An open job runs to `year`, the year the page is read in.
export function relicOf(job: Pick<Job, 'startDate' | 'endDate'>, year: number): Relic {
  const end = job.endDate ? job.endDate.getUTCFullYear() : year
  const length = end - job.startDate.getUTCFullYear()
  if (length >= 3) return 'platinum'
  if (length >= 1) return 'gold'
  return 'sapphire'
}
