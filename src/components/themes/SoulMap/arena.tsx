'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useOnChange } from '@/hooks/useOnChange'
import { useLabels } from '@/components/cv/CVDataProvider'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { InView } from '@/components/themes/shared/held'
import type { MartialArts } from '@/lib/cv/content'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { useRunActions, useRunState } from './run'
import { BUTTON, BUTTON_LIT } from './links'
import { Panel } from './menu'
import { CARVED, SOUL } from './palette'
import souls from './souls.module.css'

// The Muay Thai record is fought behind the game's fog wall. The visitor walks him through the fog
// (Traverse: he takes two strides in as the wall thins, the way crossing the white light takes a
// moment and commits him) and a sparring partner, a red phantom, drops into the ring from above the way
// a boss falls on the player, lands in a crouch in a ring of dust and rises, and its name and long bar
// slide in along the bottom the way the game shows a boss. Then it is a bout:
// - Strike throws his roundhouse, if he has the stamina for it; it lands as his shin comes round.
// - Guard raises his guard for a second.
// - The partner pulls its rear hand back, holds the tell a beat and throws the cross 3.4 s after the
//   visitor's move (Traverse, Strike, Guard, another round), one cross per move at most and only while the
//   ring is on screen, so a ring left alone goes still; a guard blocks it for stamina, an open guard takes the hit off
//   his health (the HUD's bar, the flask heals it). A hit jolts whoever is not mid move; a committed
//   move is never cut off by a flinch.
// - At no health he is knocked down: the red banner, then he gets up off his back and the partner's bar
//   is full again.
// - The partner's bar at nothing is the gold banner, a round won, and souls; another round and the
//   partner gets up.
// The record itself (his dojo, rank, years, achievements) stands beside the ring the whole time. The fog
// wall swirls once as the ring comes into view (its own InView).

type Bout = 'fog' | 'parting' | 'fight' | 'down' | 'won'

const PARTNER_HP = 100
const STRIKE_COST = 25
const GUARD_COST = 15
const STRIKE_DAMAGE = [18, 14, 20, 16]
const PARTNER_DAMAGE = 34
const PARTNER_EVERY = 3400
// Step lengths and the moments a blow lands, from the animations in knight.module.css: the roundhouse
// lands at 50 % of its 1 s, the cross at 57 % of its 1.2 s.
const STRIKE_MS = 1000
const STRIKE_LANDS = 500
const SWING_MS = 1200
const SWING_LANDS = 684
const GUARD_MS = 1000
const HIT_MS = 500
const GET_UP_MS = 1600
const WALK_MS = 2400
const DOWN_MS = 2600
const WON_SOULS = 2000
const NOTICE_MS = 1500

function Ring() {
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="ring-light" cx="0.5" cy="0.2" r="0.8">
          <stop offset="0" stopColor={SOUL.skyLow} stopOpacity={0.35} />
          <stop offset="1" stopColor={SOUL.ink} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={640} height={360} fill={SOUL.abyss} />
      <rect width={640} height={360} fill="url(#ring-light)" />
      {[60, 220, 380, 540].map((x) => (
        <path key={x} d={`M${x} 250 V90 Q${x + 20} 60 ${x + 40} 90 V250 Z`} fill={SOUL.rock} />
      ))}
      <rect y={250} width={640} height={110} fill={SOUL.cavern} />
      <path d="M40 300 L600 300 L640 360 H0 Z" fill={SOUL.slab} />
      <path d="M0 250 H640" stroke={SOUL.ridge} strokeWidth={2} />
      <rect x={70} y={170} width={10} height={140} fill={SOUL.leatherDark} />
      <rect x={560} y={170} width={10} height={140} fill={SOUL.leatherDark} />
      <path d="M75 186 H565 M75 214 H565 M75 242 H565" stroke={SOUL.wraps} strokeWidth={3} opacity={0.85} />
    </svg>
  )
}

function FogWall({ parting, onTraverse }: { parting: boolean; onTraverse: () => void }) {
  const { souls: words } = useLabels()
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 p-4 text-center ${parting ? souls.fogParting : ''}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className={`${souls.fogLayer} absolute inset-0`} />
        <span className={`${souls.fogLayer} ${souls.fogLayerBack} absolute inset-0`} />
      </div>
      <button type="button" onClick={onTraverse} aria-disabled={parting} className={`relative ${BUTTON_LIT}`}>
        {words.traverse}
      </button>
    </div>
  )
}

function BossBar({ hp }: { hp: number }) {
  const { souls: words } = useLabels()
  const level = { '--fill': hp / PARTNER_HP } as CSSProperties
  return (
    <div className={`absolute inset-x-4 bottom-3 sm:inset-x-10 ${souls.bossIn}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <p className={`${CARVED} text-sm uppercase tracking-[0.2em] text-[color:var(--soul-text)]`}>{words.partner}</p>
        <p className="text-sm tabular-nums text-[color:var(--soul-text)]">
          {hp}/{PARTNER_HP}
        </p>
      </div>
      <div className={`relative mt-1 h-2.5 ${souls.barTrack}`} style={level} aria-hidden="true">
        <div className={`absolute inset-y-0 left-0 w-full ${souls.barTrail}`} />
        <div className={`absolute inset-y-0 left-0 w-full ${souls.barFill} ${souls.hpFill}`} />
      </div>
    </div>
  )
}

function useBout() {
  const { hp: health } = useRunState()
  const { announce, hurt, spend, rest, earn } = useRunActions()
  const { souls: words } = useLabels()
  const me = usePoseScript('idle')
  const partner = usePoseScript('idle')
  const [bout, setBout] = useState<Bout>('fog')
  const [partnerHp, setPartnerHp] = useState(PARTNER_HP)
  const partnerLeft = useRef(PARTNER_HP)
  const [notice, setNotice] = useState('')
  const hp = useRef(health)
  const guarding = useRef(false)
  const strikes = useRef(0)
  // The timers still pending; each leaves the set as it fires, so a long bout never piles up ids.
  const [timers] = useState(() => new Set<number>())

  useEffect(() => {
    hp.current = health
  }, [health])

  useEffect(() => () => timers.forEach((timer) => window.clearTimeout(timer)), [timers])

  const later = useCallback((ms: number, effect: () => void) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer)
      effect()
    }, ms)
    timers.add(timer)
  }, [timers])

  const say = useCallback(
    (text: string) => {
      setNotice(text)
      later(NOTICE_MS, () => setNotice(''))
    },
    [later],
  )

  const { hold: holdMe, play: playMe } = me
  const { hold: holdPartner, play: playPartner } = partner

  const knockDown = useCallback(() => {
    setBout('down')
    holdMe('down')
    announce('died', words.knockedDown)
    later(DOWN_MS, () => {
      rest()
      partnerLeft.current = PARTNER_HP
      setPartnerHp(PARTNER_HP)
      playMe([{ pose: 'getUp', ms: GET_UP_MS }])
      setBout('fight')
    })
  }, [announce, holdMe, later, playMe, rest, words.knockedDown])

  const partnerSwing = useCallback(() => {
    if (!playPartner([{ pose: 'swing', ms: SWING_MS }])) return
    later(SWING_LANDS, () => {
      if (partnerLeft.current === 0) return
      if (guarding.current && spend(GUARD_COST)) return
      const left = hp.current - PARTNER_DAMAGE
      hurt(PARTNER_DAMAGE)
      if (left <= 0) {
        knockDown()
        return
      }
      playMe([{ pose: 'hit', ms: HIT_MS }])
    })
  }, [hurt, knockDown, later, playMe, playPartner, spend])

  const strike = () => {
    if (bout !== 'fight' || me.busy()) return
    if (!spend(STRIKE_COST)) {
      say(words.winded)
      return
    }
    playMe([{ pose: 'strike', ms: STRIKE_MS }])
    later(STRIKE_LANDS, () => {
      const damage = STRIKE_DAMAGE[strikes.current % STRIKE_DAMAGE.length]
      strikes.current += 1
      const left = Math.max(0, partnerLeft.current - damage)
      partnerLeft.current = left
      setPartnerHp(left)
      if (left === 0) {
        setBout('won')
        holdPartner('down')
        announce('victory', words.roundWon)
        earn(WON_SOULS)
        return
      }
      playPartner([{ pose: 'hit', ms: HIT_MS }])
    })
  }

  const guard = () => {
    if (bout !== 'fight' || me.busy()) return
    guarding.current = true
    playMe([{ pose: 'guard', ms: GUARD_MS }])
    later(GUARD_MS, () => {
      guarding.current = false
    })
  }

  const again = () => {
    partnerLeft.current = PARTNER_HP
    setPartnerHp(PARTNER_HP)
    playPartner([{ pose: 'getUp', ms: GET_UP_MS }])
    setBout('fight')
  }

  // Through the fog: he walks in while it parts; with no motion the ring is simply open.
  const traverse = () => {
    if (bout !== 'fog') return
    if (prefersReducedMotion()) {
      setBout('fight')
      return
    }
    setBout('parting')
    playMe([{ pose: 'walk', ms: WALK_MS }])
    later(WALK_MS, () => setBout('fight'))
  }

  return { bout, partnerHp, notice, me, partner, partnerSwing, strike, guard, again, traverse }
}

function SparRing() {
  const { souls: words } = useLabels()
  const { ref, inView } = useSectionTrigger({ threshold: 0.4, triggerOnce: false })
  const { bout, partnerHp, notice, me, partner, partnerSwing, strike, guard, again, traverse } = useBout()
  // Whether the visitor has moved since the partner's last cross: the partner answers a move, never runs on alone.
  const [owed, setOwed] = useState(false)

  // The partner's cross, PARTNER_EVERY after the move it answers, while the bout is on and the ring is on screen.
  useEffect(() => {
    if (bout !== 'fight' || !inView || !owed) return
    const timer = window.setTimeout(() => {
      setOwed(false)
      partnerSwing()
    }, PARTNER_EVERY)
    return () => window.clearTimeout(timer)
  }, [bout, inView, owed, partnerSwing])

  const answered = (move: () => void) => () => {
    move()
    setOwed(true)
  }

  const fighting = bout === 'fight'
  const won = bout === 'won'
  const inRing = bout !== 'fog' && bout !== 'parting'

  // The fog wall's button leaves as the ring opens, so a Traverse that held keyboard focus hands it to
  // Strike before the frame paints. Strike and Again are one button, so focus stays through a round won.
  const lead = useRef<HTMLButtonElement>(null)
  const handoff = useRef(false)
  const enter = () => {
    handoff.current = true
    traverse()
    setOwed(true)
  }
  useOnChange(
    inRing,
    () => {
      if (!handoff.current) return
      handoff.current = false
      if (document.activeElement !== document.body) return
      lead.current?.focus()
    },
    { timing: 'layout' },
  )

  return (
    <div ref={ref}>
      <InView threshold={0.4} className="relative aspect-[4/3] overflow-hidden border border-[color:var(--soul-ridge)] sm:aspect-[16/9]">
        <Ring />
        <div className={`absolute bottom-[18%] left-[18%] aspect-[60/96] h-[56%] ${bout === 'fog' ? '' : souls.advance}`}>
          <Knight key={me.key} gear="fighter" pose={me.pose} className="h-full w-full" />
        </div>
        {bout !== 'fog' && (
          <>
            <span className={`absolute bottom-[14%] right-[10%] h-[14%] w-[30%] ${souls.dropDust}`} aria-hidden="true" />
            <div className={`absolute bottom-[18%] right-[18%] aspect-[60/96] h-[60%] ${souls.partnerIn}`}>
              <Knight key={partner.key} gear="fighter" pose={partner.pose} spirit="invader" facingLeft className="h-full w-full" />
            </div>
          </>
        )}
        {inRing ? <BossBar hp={partnerHp} /> : <FogWall parting={bout === 'parting'} onTraverse={enter} />}
        {notice && (
          <p className="absolute inset-x-0 top-4 text-center text-sm uppercase tracking-[0.2em] text-[color:var(--soul-text)]" role="status">
            {notice}
          </p>
        )}
      </InView>
      {inRing && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button ref={lead} type="button" onClick={answered(won ? again : strike)} aria-disabled={!fighting && !won} className={BUTTON_LIT}>
            {won ? words.again : words.strike}
          </button>
          {!won && (
            <button type="button" onClick={answered(guard)} aria-disabled={!fighting} className={BUTTON}>
              {words.guard}
            </button>
          )}
          <p className="w-full text-center text-sm italic text-[color:var(--soul-text-soft)]">{words.sparHint}</p>
        </div>
      )}
    </div>
  )
}

export function FogArena({ martialArts }: { martialArts: MartialArts }) {
  const { primary } = martialArts
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <SparRing />
      <Panel>
        <h3 className={`${CARVED} border-b border-[color:var(--soul-ridge)] pb-2 text-base uppercase tracking-[0.2em] text-[color:var(--soul-glow)]`}>
          {primary.title}
        </h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mt-3 space-y-2',
            fact: 'border-b border-[color:var(--soul-rock)] pb-1.5',
            term: 'text-sm uppercase tracking-wider text-[color:var(--soul-text-soft)]',
            value: 'text-sm leading-relaxed text-[color:var(--soul-text)]',
            achievements: 'mt-4 space-y-2',
            achievement: 'flex gap-2 text-sm leading-relaxed text-[color:var(--soul-text)]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--soul-glow)]" aria-hidden="true" />
              {achievement}
            </>
          )}
        />
      </Panel>
    </div>
  )
}
