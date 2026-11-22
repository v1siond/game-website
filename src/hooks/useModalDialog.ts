'use client'

import { useEffect, useRef, type RefObject } from 'react'

/**
 * A dialog that is always in the page: shown modal while `open` (Tab stays inside, the page under it is inert),
 * closed once `open` turns false or it unmounts, and only then the focus goes back to the opener, since the
 * opener is inert while the dialog is open. Returns the ref for the <dialog>.
 */
export function useModalDialog(open: boolean, opener: RefObject<HTMLElement | null>): RefObject<HTMLDialogElement | null> {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const trigger = opener.current
    dialog?.showModal()
    return () => {
      dialog?.close()
      trigger?.focus()
    }
  }, [open, opener])

  return dialogRef
}
