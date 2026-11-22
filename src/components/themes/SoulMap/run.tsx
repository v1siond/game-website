'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'

// The visitor's run through the world, the state a hard knight action game keeps on its HUD: souls
// earned by every action (they are money and experience in that game), health and stamina, the healing
// flask's charges, and the two kinds of message it puts on screen, the wide banner on its black band
// (the fire kindled, a round won, a knock down, a phantom summoned) and the item box at the bottom (an
// item picked up). Every scene changes it through useRunActions(); hud.tsx and the arena read it through
// useRunState().
//
// One reducer owns the numbers; the provider owns the timers that clear a banner or a box, and the
// stamina regeneration (one interval, only while stamina is below full).

export type BannerKind = 'kindled' | 'victory' | 'died' | 'summoned'

export interface Banner {
  kind: BannerKind
  text: string
  key: number
}

export interface ItemBox {
  title: string
  detail: string
  key: number
}

export const MAX_HP = 100
export const MAX_STAMINA = 100
export const MAX_FLASKS = 5
const FLASK_HEAL = 45
const STAMINA_REGEN = 6
const REGEN_MS = 160
// The banner's whole fade in, slow growth and fade out (souls.module.css .banner).
const BANNER_MS = 4600
const ITEM_MS = 2800

// What the HUD and the arena read; it changes on every stamina tick.
export interface RunState {
  souls: number
  hp: number
  stamina: number
  flasks: number
  banner: Banner | null
  item: ItemBox | null
  shown: number
}

type RunAction =
  | { type: 'earn'; souls: number }
  | { type: 'hurt'; damage: number }
  | { type: 'spend'; stamina: number }
  | { type: 'regen' }
  | { type: 'drink' }
  | { type: 'rest' }
  | { type: 'banner'; kind: BannerKind; text: string }
  | { type: 'item'; title: string; detail: string }
  | { type: 'clearBanner'; key: number }
  | { type: 'clearItem'; key: number }

const INITIAL: RunState = { souls: 0, hp: MAX_HP, stamina: MAX_STAMINA, flasks: MAX_FLASKS, banner: null, item: null, shown: 0 }

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value))

const canDrink = (state: RunState) => state.flasks > 0 && state.hp < MAX_HP

const REDUCERS: { [Type in RunAction['type']]: (state: RunState, action: Extract<RunAction, { type: Type }>) => RunState } = {
  earn: (state, { souls }) => ({ ...state, souls: state.souls + souls }),
  hurt: (state, { damage }) => ({ ...state, hp: clamp(state.hp - damage, MAX_HP) }),
  spend: (state, { stamina }) => ({ ...state, stamina: clamp(state.stamina - stamina, MAX_STAMINA) }),
  regen: (state) => ({ ...state, stamina: clamp(state.stamina + STAMINA_REGEN, MAX_STAMINA) }),
  drink: (state) => (canDrink(state) ? { ...state, flasks: state.flasks - 1, hp: clamp(state.hp + FLASK_HEAL, MAX_HP) } : state),
  rest: (state) => ({ ...state, hp: MAX_HP, stamina: MAX_STAMINA, flasks: MAX_FLASKS }),
  banner: (state, { kind, text }) => ({ ...state, shown: state.shown + 1, banner: { kind, text, key: state.shown + 1 } }),
  item: (state, { title, detail }) => ({ ...state, shown: state.shown + 1, item: { title, detail, key: state.shown + 1 } }),
  clearBanner: (state, { key }) => (state.banner?.key === key ? { ...state, banner: null } : state),
  clearItem: (state, { key }) => (state.item?.key === key ? { ...state, item: null } : state),
}

function reduce(state: RunState, action: RunAction): RunState {
  const reducer = REDUCERS[action.type] as (state: RunState, action: RunAction) => RunState
  return reducer(state, action)
}

// What every scene calls; built once, so a scene that only earns souls never re-renders on a tick.
export interface RunActions {
  earn: (souls: number) => void
  hurt: (damage: number) => void
  // Spends stamina for a move; false (and nothing spent) when he has too little for it.
  spend: (stamina: number) => boolean
  drink: () => boolean
  rest: () => void
  announce: (kind: BannerKind, text: string) => void
  found: (title: string, detail: string) => void
}

const RunStateContext = createContext<RunState | null>(null)
const RunActionsContext = createContext<RunActions | null>(null)

export function useRunState(): RunState {
  const state = useContext(RunStateContext)
  if (!state) throw new Error('useRunState is read inside the soul-map world (RunProvider)')
  return state
}

export function useRunActions(): RunActions {
  const actions = useContext(RunActionsContext)
  if (!actions) throw new Error('useRunActions is read inside the soul-map world (RunProvider)')
  return actions
}

export function RunProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, INITIAL)
  // spend and drink decide on the newest numbers without being rebuilt on every change.
  const latest = useRef(state)
  useEffect(() => {
    latest.current = state
  }, [state])

  // A banner or an item box clears itself; a newer one replaces it and its timer finds nothing to clear.
  useEffect(() => {
    if (!state.banner) return
    const { key } = state.banner
    const timer = window.setTimeout(() => dispatch({ type: 'clearBanner', key }), BANNER_MS)
    return () => window.clearTimeout(timer)
  }, [state.banner])

  useEffect(() => {
    if (!state.item) return
    const { key } = state.item
    const timer = window.setTimeout(() => dispatch({ type: 'clearItem', key }), ITEM_MS)
    return () => window.clearTimeout(timer)
  }, [state.item])

  const winded = state.stamina < MAX_STAMINA
  useEffect(() => {
    if (!winded) return
    const timer = window.setInterval(() => dispatch({ type: 'regen' }), REGEN_MS)
    return () => window.clearInterval(timer)
  }, [winded])

  const actions = useMemo<RunActions>(
    () => ({
      earn: (souls) => dispatch({ type: 'earn', souls }),
      hurt: (damage) => dispatch({ type: 'hurt', damage }),
      spend: (stamina) => {
        if (latest.current.stamina < stamina) return false
        dispatch({ type: 'spend', stamina })
        return true
      },
      drink: () => {
        if (!canDrink(latest.current)) return false
        dispatch({ type: 'drink' })
        return true
      },
      rest: () => dispatch({ type: 'rest' }),
      announce: (kind, text) => dispatch({ type: 'banner', kind, text }),
      found: (title, detail) => dispatch({ type: 'item', title, detail }),
    }),
    [],
  )

  return (
    <RunActionsContext.Provider value={actions}>
      <RunStateContext.Provider value={state}>{children}</RunStateContext.Provider>
    </RunActionsContext.Provider>
  )
}
