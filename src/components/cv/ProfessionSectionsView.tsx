import type { ComponentType } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { ProfessionSections, SectionsOf } from '@/lib/cv/cvView'

// The profession dispatch every world shares: a world names its section component per profession in a
// map, and this picks the one for the shown profession and hands it the narrowed sections plus the
// world's own extra props.

export type ProfessionSectionViews<Extra extends object = object> = {
  [Id in Profession]: ComponentType<{ sections: SectionsOf<Id> } & Extra>
}

type ProfessionSectionsViewProps<Extra extends object> = {
  sections: ProfessionSections
  views: ProfessionSectionViews<Extra>
} & Extra

export function ProfessionSectionsView<Extra extends object = object>({
  sections,
  views,
  ...extra
}: ProfessionSectionsViewProps<Extra>) {
  // The map is keyed by the same profession that narrows `sections`, so this view takes these sections.
  const View = views[sections.profession] as ComponentType<{ sections: ProfessionSections } & Extra>
  return <View sections={sections} {...(extra as Extra)} />
}
