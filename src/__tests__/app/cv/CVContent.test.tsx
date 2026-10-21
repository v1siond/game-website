import { screen, within } from '@testing-library/react'
import { CVContent } from '@/app/(cv)/cv/CVContent'
import { jobYears } from '@/components/cv/sectionText'
import { locales } from '@/i18n/config'
import type { CVData } from '@/lib/cv/content'
import { renderWithCV, testCV } from '../../helpers/test-utils'

// /cv renders the real Decap content and its labels; the assertions read both from the same files.
const cv = testCV('en')
const { cvPage } = cv.labels

const renderCV = (data: CVData = cv) => renderWithCV(<CVContent />, { cv: data })

// The same title can sit in two sections (a current role is also a job), so queries scope to one section.
const sectionTitled = (title: string) => {
  const section = screen.getByRole('heading', { name: title }).closest('section')
  if (!section) throw new Error(`no section holds the heading ${title}`)
  return within(section)
}

describe('CVContent', () => {
  describe('header', () => {
    it('shows his name, headline, email and LinkedIn from the content files', () => {
      renderCV()

      expect(screen.getByRole('heading', { level: 1, name: cv.fullName })).toBeInTheDocument()
      expect(screen.getByText(cv.professionalSummary!.headline)).toBeInTheDocument()
      expect(screen.getByText(cv.contact.email)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /linkedin\.com/i })).toHaveAttribute('href', cv.contact.linkedin)
    })

    it('links only his email and LinkedIn, no GitHub or employer site', () => {
      renderCV()

      const header = screen.getByRole('heading', { level: 1 }).closest('header')
      if (!header) throw new Error('the name sits outside the header')
      expect(within(header).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([cv.contact.linkedin])
    })
  })

  describe('sections', () => {
    it('titles every section with its label', () => {
      renderCV()

      ;[
        cvPage.professionalSummary,
        cvPage.coreCompetencies,
        cvPage.technicalSkills,
        cvPage.professionalExperience,
        cvPage.education,
      ].forEach((title) => expect(screen.getByRole('heading', { name: title })).toBeInTheDocument())
    })

    it('lists every highlight of the summary', () => {
      renderCV()

      const section = sectionTitled(cvPage.coreCompetencies)
      cv.professionalSummary!.highlights.forEach((highlight) => expect(section.getByText(highlight)).toBeInTheDocument())
    })

    it('lists every job with its year range, a running job ending in the present label', () => {
      renderCV()

      const section = sectionTitled(cvPage.professionalExperience)
      cv.workExperience.forEach((job) => {
        const { start, end } = jobYears(job, cv.labels.years.present)
        expect(section.getAllByText(job.title).length).toBeGreaterThan(0)
        expect(section.getAllByText(`${start} - ${end}`).length).toBeGreaterThan(0)
      })
    })

    it('shows his degree and the languages he speaks from the summary file', () => {
      renderCV()

      const section = sectionTitled(cvPage.education)
      expect(section.getByText(cv.professionalSummary!.education)).toBeInTheDocument()
      expect(section.getByText(cv.professionalSummary!.languages)).toBeInTheDocument()
    })
  })

  describe('empty data', () => {
    it('drops a section whose list is empty', () => {
      renderCV({ ...cv, featuredProjects: [], workExperience: [], techStack: [], currentRoles: [] })

      ;[cvPage.keyProjects, cvPage.technicalSkills, cvPage.currentPositions, cvPage.professionalExperience].forEach(
        (title) => expect(screen.queryByRole('heading', { name: title })).not.toBeInTheDocument(),
      )
    })

    it('drops the summary, competencies and education when there is no summary', () => {
      renderCV({ ...cv, professionalSummary: null })

      expect(screen.queryByRole('heading', { name: cvPage.professionalSummary })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: cvPage.education })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: cvPage.coreCompetencies })).not.toBeInTheDocument()
    })
  })

  describe('toolbar', () => {
    it('has the way back, the language switcher and the download button', () => {
      renderCV()

      expect(screen.getByRole('link', { name: new RegExp(cvPage.backToSite) })).toHaveAttribute('href', '/')
      expect(screen.getByText(cvPage.language)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: new RegExp(cvPage.downloadPdf) })).toBeInTheDocument()
    })

    it('is hidden in print, and the PDF reads #cv-content', () => {
      const { container } = renderCV()

      expect(container.querySelector('.print\\:hidden')).toBeInTheDocument()
      expect(document.getElementById('cv-content')).toBeInTheDocument()
    })
  })

  describe('locales', () => {
    it.each(locales)('renders the %s labels', (locale) => {
      const localeCV = testCV(locale)
      renderCV(localeCV)

      expect(screen.getByRole('heading', { name: localeCV.labels.cvPage.professionalExperience })).toBeInTheDocument()
    })
  })
})
