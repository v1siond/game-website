import type { ReactNode } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { useLabels } from './CVDataProvider'
import { muayThaiFacts } from './sectionText'

// The Muay Thai record (R6) without a look: the facts as a description list and the achievements as a
// list, every word from the content. The world draws the heading (`martialArts.primary.title`) and
// passes its own classes; `renderAchievement` lets it add its own marker.

interface MuayThaiRecordClassNames {
  facts?: string
  fact?: string
  term?: string
  value?: string
  achievements?: string
  achievement?: string
}

interface MuayThaiRecordProps {
  martialArts: MartialArts
  classNames?: MuayThaiRecordClassNames
  renderAchievement?: (achievement: string) => ReactNode
}

export function MuayThaiRecord({ martialArts, classNames = {}, renderAchievement = (text) => text }: MuayThaiRecordProps) {
  const labels = useLabels()
  return (
    <>
      <dl className={classNames.facts}>
        {muayThaiFacts(martialArts, labels).map(({ label, value }) => (
          <div key={`${label}-${value}`} className={classNames.fact}>
            <dt className={classNames.term}>{label}</dt>
            <dd className={classNames.value}>{value}</dd>
          </div>
        ))}
      </dl>
      <ul className={classNames.achievements} aria-label={labels.record.achievements}>
        {martialArts.primary.achievements.map((achievement) => (
          <li key={achievement} className={classNames.achievement}>
            {renderAchievement(achievement)}
          </li>
        ))}
      </ul>
    </>
  )
}
