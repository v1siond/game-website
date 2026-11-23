import type { Profession } from '@/lib/cv/professions'
import type { StageLayer } from '../../shared/theatre/Stage'
import type { StageWriter } from '../../shared/theatre/useTheatre'

// What every level picture is: its layers on the shared canvas (kit.tsx), from the sky to the foreground,
// and a binder that caches the nodes the scroll moves and returns the per frame writer, which takes the
// scene's progress p (0 when its stage starts to rise, 1 when it has sunk) and f, how many of the
// section's cards have crossed the reading line, fractional. The things a section counts are drawn once
// per card, one stop of the course each (stops.tsx), so the picture holds as many as the section has
// cards, and he makes his move at each one as its card is read.

/** What a level is built from: how many cards its section counts and whose outfit he wears. */
export interface LevelInput {
  count: number
  profession: Profession
}

export interface Level {
  layers: (input: LevelInput) => StageLayer[]
  bind: (stage: ParentNode, input: LevelInput) => StageWriter
}
