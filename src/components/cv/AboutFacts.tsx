import { useMemo } from 'react'
import { aboutBlock, aboutFacts, type AboutFact } from '@/lib/cv/cvView'
import { useCVData, useLabels } from './CVDataProvider'

// The About block every world's About frame reads: the bio, the summary highlights and the labelled facts
// (education, languages), derived once here so no world picks its fields, labels or order itself.

export interface AboutView {
  bio: string
  highlights: string[]
  facts: AboutFact[]
}

export function useAboutBlock(): AboutView {
  const { professionalSummary } = useCVData()
  const { about } = useLabels()
  return useMemo(() => {
    const block = aboutBlock(professionalSummary)
    return { bio: block.bio, highlights: block.highlights, facts: aboutFacts(block, about) }
  }, [professionalSummary, about])
}

export interface AboutFactsLook {
  list: string
  fact: string
  term: string
  value: string
  /** What follows the label: ': ' for a world that runs the value on after it, nothing for one that sets
   *  the value apart (a gap, a line of its own). */
  termEnd?: string
}

/** The facts as one description list in the world's classes; nothing when Decap stores none. */
export function AboutFacts({ look }: { look: AboutFactsLook }) {
  const { facts } = useAboutBlock()
  if (facts.length === 0) return null
  return (
    <dl className={look.list}>
      {facts.map((fact) => (
        <div key={fact.label} className={look.fact}>
          <dt className={look.term}>
            {fact.label}
            {look.termEnd}
          </dt>
          <dd className={look.value}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
