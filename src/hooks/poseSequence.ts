// The plain rules behind usePoseSequence: a figure plays its entrance poses in order, then rests;
// a one shot move plays over the rest and ends back in it. No React here, so the rules are tested alone.

/** Where the figure is: how many entrance poses have played, and the one shot move over the rest. */
export interface PoseState<P extends string> {
  step: number
  move: P | null
  /** Bumped on every accepted move, so a caller can key the sprite to replay the same move. */
  take: number
}

/** When a move is taken: only at rest with nothing playing, once the entrance is over, or any time. */
export type MovePolicy = 'rest' | 'arrived' | 'always'

export const START: PoseState<never> = { step: 0, move: null, take: 0 }

export function hasArrived(state: PoseState<string>, entranceLength: number): boolean {
  return state.step >= entranceLength
}

const ACCEPTS: Record<MovePolicy, (state: PoseState<string>, entranceLength: number) => boolean> = {
  rest: (state, length) => hasArrived(state, length) && state.move === null,
  arrived: (state, length) => hasArrived(state, length),
  always: () => true,
}

/** The pose on screen: the move if one plays, else the entrance pose, else the rest pose. */
export function poseOf<P extends string>(state: PoseState<P>, entrance: readonly P[], rest: P): P {
  if (state.move !== null) return state.move
  return entrance[state.step] ?? rest
}

export function playMove<P extends string>(state: PoseState<P>, move: P, policy: MovePolicy, entranceLength: number): PoseState<P> {
  if (!ACCEPTS[policy](state, entranceLength)) return state
  return { ...state, move, take: state.take + 1 }
}

/** The move playing has ended; the entrance is untouched. */
export function settleMove<P extends string>(state: PoseState<P>): PoseState<P> {
  if (state.move === null) return state
  return { ...state, move: null }
}

/** The entrance pose has played out; a move playing over it keeps playing. Stops at rest. */
export function stepEntrance<P extends string>(state: PoseState<P>, entranceLength: number): PoseState<P> {
  if (hasArrived(state, entranceLength)) return state
  return { ...state, step: state.step + 1 }
}

/** What was showing has played out: a move ends, otherwise the entrance steps on (and stops at rest). */
export function advancePose<P extends string>(state: PoseState<P>, entranceLength: number): PoseState<P> {
  if (state.move !== null) return settleMove(state)
  return stepEntrance(state, entranceLength)
}
