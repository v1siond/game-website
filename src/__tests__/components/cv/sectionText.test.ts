import { jobYears } from '@/components/cv/sectionText'

describe('jobYears', () => {
  it('reads both years in UTC, so a January 1 date keeps its own year', () => {
    const job = { startDate: new Date('2019-01-01'), endDate: new Date('2023-01-01') }
    expect(jobYears(job, 'Present')).toEqual({ start: 2019, end: 2023 })
  })

  it('ends a running job in the world word for now', () => {
    expect(jobYears({ startDate: new Date('2021-06-01'), endDate: null }, 'NOW')).toEqual({ start: 2021, end: 'NOW' })
  })
})
