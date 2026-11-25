import type { SceneId } from '../plan'
import { about } from './about'
import { bands } from './bands'
import { contact } from './contact'
import { hero } from './hero'
import type { SetPiece } from './kit'
import { muayThai } from './muayThai'
import { projects } from './projects'
import { services } from './services'
import { tech } from './tech'
import { ventures } from './ventures'
import { work } from './work'

// Every scene's set piece by its id, in the run's order.
export const SETS: Record<SceneId, SetPiece> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }
