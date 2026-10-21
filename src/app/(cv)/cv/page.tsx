import { getTranslations, getLocale } from 'next-intl/server'
import { getAllCVData } from '@/lib/cv-data'
import type { Locale } from '@/i18n/config'
import { CVContent } from './CVContent'

export default async function CVPage() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('cv')

  const cvData = await getAllCVData(locale)

  const translations = {
    downloadPdf: t('downloadPdf'),
    backToSite: t('backToSite'),
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
