import { useLabels } from './CVDataProvider'

/** The "Impact: " a screen reader hears before a project's impact line, in a world whose card shows the
 *  impact with no visible label (a quote, an arrow, a coloured rule). */
export function ImpactLabel() {
  const { cards } = useLabels()
  return <span className="sr-only">{cards.impact}: </span>
}
