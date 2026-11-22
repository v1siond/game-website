'use client'

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { locales, type Locale } from '@/i18n/config'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { LocaleSwitchState } from '@/components/cv/LanguageSwitcher'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { REALM } from './palette'

// The world's buttons: the bevelled metal button, the language dropdown drawn for the shared
// LanguageSwitcher, and the hero's contact actions as buttons.

type RealmButtonVariant = 'default' | 'primary'

// The bevelled frame every button shares, then the plate per variant: iron, or the gold Email me plate
// with void ink. Both are built once, so a button's style keeps its identity across renders.
const BUTTON_FRAME: CSSProperties = {
  boxShadow: `inset 1px 1px 2px ${REALM.metalLight}, inset -1px -1px 2px ${REALM.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
  fontFamily: '"Cinzel", Georgia, serif',
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

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-label={languages[currentLocale]}
        style={{
          background: `linear-gradient(180deg, ${REALM.metalMid} 0%, ${REALM.metalDark} 100%)`,
          border: `2px solid ${REALM.metalDark}`,
          boxShadow: `inset 1px 1px 2px ${REALM.metalLight}, inset -1px -1px 2px ${REALM.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
          color: REALM.textBright,
          fontFamily: '"Cinzel", Georgia, serif',
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
        <span>{currentLocale.toUpperCase()}</span>
        <span aria-hidden="true" style={{ fontSize: '0.875rem', marginLeft: '0.125rem' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
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
              onClick={() => handleLocaleChange(locale)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                minHeight: '44px',
                background: currentLocale === locale ? `${REALM.chaosFelDark}40` : 'transparent',
                border: 'none',
                borderBottom: locale !== locales[locales.length - 1] ? `1px solid ${REALM.metalDark}50` : 'none',
                color: currentLocale === locale ? REALM.chaosFelBright : REALM.textMid,
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.875rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                if (currentLocale !== locale) {
                  e.currentTarget.style.background = `${REALM.metalMid}30`
                  e.currentTarget.style.color = REALM.textBright
                }
              }}
              onMouseLeave={(e) => {
                if (currentLocale !== locale) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = REALM.textMid
                }
              }}
            >
              <span>{languages[locale]}</span>
              {currentLocale === locale && <span style={{ color: REALM.chaosFelBright }}>✓</span>}
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
