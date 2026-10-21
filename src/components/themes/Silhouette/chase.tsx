'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter, type SpritePose } from './character'
import { GiantSpider, type SpiderPose } from './spider'
import { pinePath } from './depth'
import { BRUSH, Sky } from './places'
import { SHADE, SKY } from './palette'
import shade from './shade.module.css'
import world from './world.module.css'

// About him, read while the giant spider hunts him through the thicket: the bio is set as a silent film
// intertitle, and under it a strip of forest whose left edge is a black wall of brush. When the strip
// comes into view the spider's legs feel their way out of that dark, its foreleg rears and stabs the
// ground where he stood, he leaps clear and runs, it stabs again at his heels, he leaps again, and it
// draws back into the brush while he stands at the far end, out of reach. The visitor can run it again.
// Reduced motion shows the last beat: him safe at the end, the spider lurking at the dark edge.
//
// Animated: the spider's legs and body (spider.module.css), its walk and his run (two moved groups), his
// parts, one beat timer.

type Beat = 'dark' | 'emerge' | 'strike' | 'chase' | 'strikeAgain' | 'retreat' | 'outrun'

interface Stage {
  ms: number
  spider: { x: number; pose: SpiderPose }
  hero: { x: number; pose: SpritePose }
}

// Each beat: how long it lasts, where the spider's box and his box stand (x in the strip's 600 units)
// and what each is doing. The foreleg tip lands about 208 right of the spider's box, so each stab
// lands on the spot he has just leapt from.
const STAGE: Record<Beat, Stage> = {
  dark: { ms: 600, spider: { x: -240, pose: 'lurk' }, hero: { x: 250, pose: 'idle' } },
  emerge: { ms: 1100, spider: { x: 0, pose: 'stalk' }, hero: { x: 250, pose: 'idle' } },
  strike: { ms: 650, spider: { x: 50, pose: 'stab' }, hero: { x: 330, pose: 'jump' } },
  chase: { ms: 800, spider: { x: 130, pose: 'stalk' }, hero: { x: 400, pose: 'run' } },
  strikeAgain: { ms: 650, spider: { x: 200, pose: 'stab' }, hero: { x: 490, pose: 'jump' } },
  retreat: { ms: 1200, spider: { x: -60, pose: 'stalk' }, hero: { x: 540, pose: 'run' } },
  outrun: { ms: 0, spider: { x: -60, pose: 'lurk' }, hero: { x: 540, pose: 'idle' } },
}

const ENTRANCE: readonly Beat[] = ['dark', 'emerge', 'strike', 'chase', 'strikeAgain', 'retreat']

const GROUND_Y = 190
const THICKET = [180, 236, 470, 530]

function ChaseStrip({ onDone }: { onDone: () => void }) {
  const { pose: beat, arrived, advance } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'outrun', still: 'outrun' })
  const stage = STAGE[beat]

  useEffect(() => {
    if (arrived) onDone()
  }, [arrived, onDone])

  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" focusable="false">
      {THICKET.map((x) => (
        <path key={x} d={pinePath(x, 150, 192)} fill={SKY.dawn.far} />
      ))}
      <path d={`M-10 ${GROUND_Y} Q200 184 320 189 T610 187 V210 H-10 Z`} fill={SHADE.black} />
      <g className={shade.walker} style={{ '--x': stage.spider.x, '--ms': `${stage.ms}ms` } as CSSProperties}>
        <GiantSpider pose={stage.spider.pose} place={{ x: 0, y: GROUND_Y + 2, height: 150 }} />
      </g>
      <g className={shade.walker} style={{ '--x': stage.hero.x, '--ms': `${stage.ms}ms` } as CSSProperties}>
        <HeroCharacter profession="engineer" pose={stage.hero.pose} place={{ x: 0, y: GROUND_Y, height: 48 }} />
      </g>
      <path d={BRUSH} fill={SHADE.black} />
      {!arrived && <rect key={beat} width={0} height={0} className={shade.beat} style={{ '--ms': `${stage.ms}ms` } as CSSProperties} onAnimationEnd={advance} />}
    </svg>
  )
}

export function ChaseAbout({ bio }: { bio: string }) {
  const { shade: words } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.5 })
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(false)

  const again = () => {
    setDone(false)
    setRun((count) => count + 1)
  }

  return (
    <div ref={ref}>
      <p className="mx-auto max-w-2xl border-y border-[color:var(--sh-fog)] py-5 text-center text-sm leading-loose tracking-wide text-[color:var(--sh-text)] sm:text-base">{bio}</p>
      <div className="relative mt-6 aspect-[3/1] overflow-hidden border-y-2 border-[color:var(--sh-black)]" aria-hidden="true">
        <Sky light={SKY.dawn} />
        {triggered && <ChaseStrip key={run} onDone={() => setDone(true)} />}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={again}
          disabled={!done}
          className={`${world.button} inline-flex min-h-[44px] items-center border-2 border-dashed border-[color:var(--sh-muted)] bg-[color:var(--sh-void)] px-4 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-muted)] hover:text-[color:var(--sh-text)] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)]`}
        >
          {words.chaseAgain}
        </button>
      </div>
    </div>
  )
}
