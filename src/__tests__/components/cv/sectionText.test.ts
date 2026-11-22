import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { drumsSince, jobSpanCompact, jobYears, newTabHint, newTabName, projectLinks, shownUrl, yearSpan } from '@/lib/cv/sectionText'
import { labelsFor, type LabelsFile } from '@/lib/cv/labels'

const file: LabelsFile = JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', 'labels.json'), 'utf8'))
const english = labelsFor(file, 'en')
const spanish = labelsFor(file, 'es')

describe('jobYears', () => {
  it('reads both years in UTC, so a January 1 date keeps its own year', () => {
    const job = { startDate: new Date('2019-01-01'), endDate: new Date('2023-01-01') }
    expect(jobYears(job, english.years.present)).toEqual({ start: 2019, end: 2023 })
  })

  it('ends a running job in the label for now', () => {
    expect(jobYears({ startDate: new Date('2021-06-01'), endDate: null }, english.years.present)).toEqual({
      start: 2021,
      end: english.years.present,
    })
  })
})

describe('jobSpanCompact', () => {
  it('prints a job stamp as both years around a dash, a running job ending in the label for now', () => {
    expect(jobSpanCompact({ startDate: new Date('2019-01-01'), endDate: new Date('2023-01-01') }, english.years)).toBe('2019 - 2023')
    expect(jobSpanCompact({ startDate: new Date('2021-06-01'), endDate: null }, spanish.years)).toBe('2021 - Presente')
  })
})

describe('the phrases read the labels', () => {
  it('spans years in the locale', () => {
    const span = { startYear: 2016, endYear: 2018, current: false }
    expect(yearSpan(span, english.years)).toBe('2016 to 2018')
    expect(yearSpan(span, spanish.years)).toBe('2016 a 2018')
    expect(yearSpan({ startYear: 2018, endYear: null, current: true }, english.years)).toBe('Since 2018')
    expect(yearSpan({ startYear: null, endYear: null, current: false, years: 1 }, english.years)).toBe('1 year')
  })

  it('writes the drums line', () => {
    expect(drumsSince({ since: 2005 }, english.years)).toBe('Drumming since 2005')
  })

  it('names the project links and the new tab', () => {
    const links = projectLinks({ links: { site: 'https://a.example', app: '', store: '', story: 'https://b.example' } }, english.links)
    expect(links.map(({ label }) => label)).toEqual(['Website', 'Story'])
    expect(newTabName(english.links, 'Lumi')).toBe('Lumi (opens in a new tab)')
  })

  it('gives the new tab note alone, for a link named by its own visible text', () => {
    expect(newTabHint(english.links)).toBe('(opens in a new tab)')
    expect(newTabHint(spanish.links)).toBe('(se abre en una pestaña nueva)')
  })
})

describe('shownUrl', () => {
  it('drops the scheme and the trailing slash a link prints', () => {
    expect(shownUrl('https://dbadbadba.com/')).toBe('dbadbadba.com')
    expect(shownUrl('http://www.linkedin.com/in/x/')).toBe('www.linkedin.com/in/x')
  })

  it('keeps an address with neither as it is', () => {
    expect(shownUrl('getpmx.com/shop')).toBe('getpmx.com/shop')
  })
})
