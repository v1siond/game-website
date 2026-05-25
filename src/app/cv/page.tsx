import { getTranslations, getLocale } from 'next-intl/server'
import { getAllCVData } from '@/lib/cv-data'
import { getStaticCVData } from '@/lib/cv-data-static'
import type { Locale } from '@/i18n/config'
import { CVContent } from './CVContent'

export default async function CVPage() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('cv')

  // Try database first, fall back to static data
  let cvData
  try {
    cvData = await getAllCVData(locale)
    // Check if we got empty data (no records in database)
    if (!cvData.professionalSummary || cvData.workExperience.length === 0) {
      cvData = await getStaticCVData(locale)
    }
  } catch {
    // Database not available, use static data
    cvData = await getStaticCVData(locale)
  }

  const translations = {
    downloadPdf: t('downloadPdf'),
    professionalSummary: t('professionalSummary'),
    coreCompetencies: t('coreCompetencies'),
    currentPositions: t('currentPositions'),
    keyProjects: t('keyProjects'),
    technicalSkills: t('technicalSkills'),
    professionalExperience: t('professionalExperience'),
    education: t('education'),
    educationText: t('educationText'),
    present: t('present'),
    impact: t('impact'),
    tech: t('tech'),
  }

  return <CVContent cvData={cvData} translations={translations} locale={locale} />
}
