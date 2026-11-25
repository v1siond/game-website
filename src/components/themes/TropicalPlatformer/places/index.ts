import type { SceneDef } from '../place'
import type { SceneId } from '../scenes'
import { about } from './about'
import { bands } from './bands'
import { contact } from './contact'
import { hero } from './hero'
import { muayThai } from './muayThai'
import { projects } from './projects'
import { services } from './services'
import { tech } from './tech'
import { ventures } from './ventures'
import { work } from './work'

// The run in the game's order, one place per part of the page: the theft and the treehouse, the partner
// freed, the cannon canyon, the mine cart, the boar, the frozen lake, the dark cave, the factory, the ship and
// home to the save barrel.
export const PLACES: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }
