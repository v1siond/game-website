'use client'

import { useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { locales, type Locale } from '@/i18n/config'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { LocaleSwitchState } from '@/components/cv/LanguageSwitcher'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { REALM, REALM_FACE } from './palette'
import menu from './actions.module.css'

// The world's buttons: the bevelled metal button, the language dropdown drawn for the shared
// LanguageSwitcher, and the hero's contact actions as buttons.

type RealmButtonVariant = 'default' | 'primary'

// The bevelled frame every button shares, then the plate per variant: iron, or the gold Email me plate
// with void ink. Both are built once, so a button's style keeps its identity across renders.
const BUTTON_FRAME: CSSProperties = {
  boxShadow: `inset 1px 1px 2px ${REALM.metalLight}, inset -1px -1px 2px ${REALM.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
  fontFamily: REALM_FACE,
  fontSize: '1.125rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: '0.5rem 1rem',
  minHeight: '44px',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
}

const BUTTON_STYLE: Record<RealmButtonVariant, CSSProperties> = {
  default: {
    ...BUTTON_FRAME,
    background: `linear-gradient(180deg, ${REALM.metalMid} 0%, ${REALM.metalDark} 100%)`,
    border: `2px solid ${REALM.metalDark}`,
    color: REALM.textBright,
  },
  primary: {
    ...BUTTON_FRAME,
    background: `linear-gradient(180deg, ${REALM.goldPlate} 0%, ${REALM.goldPlateDark} 50%, ${REALM.goldPlateDeep} 100%)`,
    border: `2px solid ${REALM.goldBright}`,
    color: REALM.bgVoid,
  },
}

// A button leads somewhere: inside the site through next/link, or out through an anchor's own props.
type RealmButtonTarget = { href: string } | { linkProps: AnchorHTMLAttributes<HTMLAnchorElement> }

export function RealmButton({
  children,
  variant = 'default',
  ...target
}: {
  children: ReactNode
  variant?: RealmButtonVariant
} & RealmButtonTarget) {
  const style = BUTTON_STYLE[variant]
  if ('linkProps' in target) return <a {...target.linkProps} style={style}>{children}</a>
  return <Link href={target.href} style={style}>{children}</Link>
}

export function RealmLanguageMenu({ currentLocale, isPending, changeLocale }: LocaleSwitchState) {
  const { languages } = useLabels()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const code = currentLocale.toUpperCase()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false)
    changeLocale(newLocale)
  }

  // Escape closes the open menu and hands focus back to its button.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !isOpen) return
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  // Focus moving past the menu closes it. A blur with no next target (a click on a button that takes no focus,
  // as in Safari) is left to the outside click handler, so the click on a language still lands.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget
    if (!next || event.currentTarget.contains(next)) return
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }} onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-label={`${code}, ${languages[currentLocale]}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        style={{
          background: `linear-gradient(180deg, ${REALM.metalMid} 0%, ${REALM.metalDark} 100%)`,
          border: `2px solid ${REALM.metalDark}`,
          boxShadow: `inset 1px 1px 2px ${REALM.metalLight}, inset -1px -1px 2px ${REALM.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
          color: REALM.textBright,
          fontFamily: REALM_FACE,
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0.5rem 0.75rem',
          minHeight: '44px',
          cursor: isPending ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '0.875rem' }}>🌐</span>
        <span>{code}</span>
        <span aria-hidden="true" style={{ fontSize: '0.875rem', marginLeft: '0.125rem' }}>▼</span>
      </button>

      {isOpen && (
        <div id={listId} style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          background: `linear-gradient(180deg, ${REALM.bgDeep} 0%, ${REALM.bgVoid} 100%)`,
          border: `2px solid ${REALM.metalDark}`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 ${REALM.metalLight}`,
          minWidth: '120px',
          zIndex: 1000,
        }}>
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              className={menu.item}
              aria-current={currentLocale === locale ? 'true' : undefined}
              onClick={() => handleLocaleChange(locale)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                minHeight: '44px',
                border: 'none',
                borderBottom: locale !== locales[locales.length - 1] ? `1px solid ${REALM.metalDark}50` : 'none',
                fontFamily: REALM_FACE,
                fontSize: '0.875rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{languages[locale]}</span>
              {currentLocale === locale && <span style={{ color: REALM.chaosBlightBright }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map(({ id, label, linkProps }) => (
        <RealmButton key={id} linkProps={linkProps} variant={id === 'email' ? 'primary' : 'default'}>
          {label}
        </RealmButton>
      ))}
    </>
  )
}
