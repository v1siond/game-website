import { headingId } from '@/lib/cv/sectionText'
import look from './world.module.css'

// The paper panel's heading, typed in brass, names its section; the corner marks frame an inventory slot.

export const sectionHeadingId = (title: string) => headingId('survival-horror', title)

export const PANEL_HEADING = `mb-4 text-sm uppercase tracking-[0.3em] text-[color:var(--sh-brass-text)] ${look.typed}`

// The four corner marks of an inventory slot, as position and border classes.
export const CORNER_MARKS = ['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2']
