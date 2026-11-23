import { battlePlace } from '../battle'
import { NOIR } from '../palette'

// Services: a fight in the case room. A foe per service: struck at its weak point, down, the extra turn
// taken; the last falls to the gang's finisher and he holds the victory (battle.tsx).

export const services = battlePlace(NOIR.red)
