'use client'

import { Fragment, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import {
  type Profession,
  PROFESSION_LABELS,
  PROFESSION_ORDER,
  stepProfession,
} from '@/lib/cv/professions'

// Headless profession selector: it owns the order, the selection and the keyboard, and each world
// draws its own option through `renderOption`. ARIA radiogroup, so one Tab enters the group, arrows
// move the pick (roving tabindex) and the picked option is the only tab stop.

export interface ProfessionOptionProps {
  role: 'radio'
  'aria-checked': boolean
  'aria-label': string
  tabIndex: 0 | -1
  'data-profession': Profession
  onClick: () => void
}

export interface ProfessionOption {
  id: Profession
  label: string
  selected: boolean
  optionProps: ProfessionOptionProps
}

interface ProfessionSwitchProps {
  renderOption: (option: ProfessionOption) => ReactNode
  className?: string
  label?: string
}

const ARROW_STEPS: Readonly<Record<string, -1 | 1>> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
}

export function ProfessionSwitch({ renderOption, className, label = 'Profession' }: ProfessionSwitchProps) {
  const { active, setActive } = useProfession()
  const groupRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const next = stepProfession(active, step)
    setActive(next)
    groupRef.current?.querySelector<HTMLElement>(`[data-profession="${next}"]`)?.focus()
  }

  return (
    <div ref={groupRef} role="radiogroup" aria-label={label} className={className} onKeyDown={handleKeyDown}>
      {PROFESSION_ORDER.map((id) => {
        const selected = id === active
        const option = renderOption({
          id,
          label: PROFESSION_LABELS[id],
          selected,
          optionProps: {
            role: 'radio',
            'aria-checked': selected,
            'aria-label': PROFESSION_LABELS[id],
            tabIndex: selected ? 0 : -1,
            'data-profession': id,
            onClick: () => setActive(id),
          },
        })
        return <Fragment key={id}>{option}</Fragment>
      })}
    </div>
  )
}
