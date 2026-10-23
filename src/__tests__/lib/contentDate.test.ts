import { lastModifiedFrom } from '@/lib/contentDate'

describe('lastModifiedFrom', () => {
  const mtimes = [new Date('2026-01-02T00:00:00Z'), new Date('2026-03-04T00:00:00Z')]

  it('takes the last commit date of the content when git has one', () => {
    expect(lastModifiedFrom('2026-02-01T10:00:00+01:00', mtimes)).toEqual(new Date('2026-02-01T09:00:00Z'))
  })

  it('falls back to the newest file time when git has no date', () => {
    expect(lastModifiedFrom('', mtimes)).toEqual(new Date('2026-03-04T00:00:00Z'))
    expect(lastModifiedFrom('not a date', mtimes)).toEqual(new Date('2026-03-04T00:00:00Z'))
  })
})
