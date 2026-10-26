'use client'

import type { ReactNode } from 'react'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { getThemeById } from '@/themes/themes'
import { fillLabel } from '@/lib/cv/labels'
import type { PickerMark } from '@/lib/worlds/nudge'
import { useWorldsLabels, type WorldsText } from './WorldsLabels'

interface WorldCardProps {
  id: string
  mark: PickerMark
}

/**
 * A static hero screenshot of the destination world (public/world-previews/<id>.webp, made by
 * scripts/capture-world-previews.sh) instead of the real themed layout, which dragged the page to a crawl.
 * Regenerate the webps after changing a theme's hero. Seen worlds and the current one show it in grey.
 */
function Preview({ id, muted, className = '' }: { id: string; muted: boolean; className?: string }) {
  return (
    <div
      className={`wc-frame relative aspect-[16/10] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/world-previews/${id}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover object-top ${muted ? 'grayscale' : ''}`}
      />
    </div>
  )
}

const STATUS: Record<Exclude<PickerMark, 'next'>, (labels: WorldsText) => ReactNode> = {
  unseen: (labels) => labels.pickerNotSeen,
  seen: (labels) => (
    <>
      <span aria-hidden="true">✓ </span>
      {labels.pickerSeenMark}
    </>
  ),
  here: (labels) => labels.pickerHere,
}

function Plate({ name, mark, labels }: { name: string; mark: Exclude<PickerMark, 'next'>; labels: WorldsText }) {
  return (
    <span className="flex flex-col gap-0.5 px-3.5 pt-2.5 pb-3">
      <span className="c-world-card__name text-base">{name}</span>
      <span className="text-base">{STATUS[mark](labels)}</span>
    </span>
  )
}

/**
 * A world in the picker, by its mark (orderForPicker). The next unseen world is the wide up next card: its
 * picture, name and description, and an "Enter <world>" button, the one control, which takes the focus when
 * the picker opens. An unseen or seen world is one button entering it; the current world is a plain card,
 * "You are here". The destination's picture and name, the picker's own colours (worlds-nudge.css).
 */
export default function WorldCard({ id, mark }: WorldCardProps) {
  const { selectWorld } = useWorldTransition()
  const labels = useWorldsLabels()
  const world = getThemeById(id)
  const enter = () => selectWorld(id)

  if (mark === 'next') {
    return (
      <div data-picker-upnext className="c-world-card c-world-card--next flex flex-col gap-4 rounded-lg p-3 sm:col-span-2 sm:flex-row">
        <Preview id={id} muted={false} className="w-full shrink-0 rounded sm:w-60" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-base">{labels.pickerUpNext}</span>
          <span className="c-world-card__name text-[22px] leading-tight">{world.name}</span>
          <span className="text-base leading-snug">{world.description}</span>
          <button type="button" onClick={enter} className="c-world-card__enter mt-auto min-h-12 rounded-md px-3 text-base">
            {fillLabel(labels.pickerEnter, { world: world.name })}
          </button>
        </div>
      </div>
    )
  }

  if (mark === 'here') {
    return (
      <div aria-current="true" className="c-world-card flex h-full flex-col overflow-hidden rounded-lg">
        <Preview id={id} muted />
        <Plate name={world.name} mark={mark} labels={labels} />
      </div>
    )
  }

  return (
    <button type="button" onClick={enter} className="wc-card c-world-card flex flex-col overflow-hidden rounded-lg text-left">
      <Preview id={id} muted={mark === 'seen'} />
      <Plate name={world.name} mark={mark} labels={labels} />
    </button>
  )
}
