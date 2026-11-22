'use client'

import { useWorldView } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import { useYearNow } from '@/hooks/useYearNow'

// The copyright line of every world's footer: the sign, the year and his name. The year comes from
// useYearNow, so the server render and hydration print the same year. Only the line is shared: each world
// keeps its own footer and the paragraph that styles the line, since no two footers look alike. A world
// that names the sign for screen readers passes `srPrefix`.

export function CopyrightLine({ srPrefix }: { srPrefix?: string }) {
  const year = useYearNow()
  const { hero } = useWorldView()

  return (
    <>
      {srPrefix && <span className="sr-only">{srPrefix} </span>}© {year} <NameWords name={hero.name} />
    </>
  )
}
