import { getAllCVData } from '@/lib/cv-data'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { WorldRenderer } from './WorldRenderer'

// The worlds are written in English only (see the site layout), so the site loads the English CV once
// and every world reads it from the provider.
export default async function Home() {
  const cv = await getAllCVData('en')

  return (
    <CVDataProvider cv={cv}>
      <WorldRenderer />
    </CVDataProvider>
  )
}
