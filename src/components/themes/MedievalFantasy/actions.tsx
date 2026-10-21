'use client'

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { locales, localeNames, type Locale } from '@/i18n/config'
import type { LocaleSwitchState } from '@/components/cv/LanguageSwitcher'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { REALM } from './palette'

// The world's buttons: the bevelled metal button, the language dropdown drawn for the shared
// LanguageSwitcher, and the hero's contact actions as buttons.

export function WC3Button({
  children,
  onClick,
  active,
  href,
  linkProps,
  variant = 'default',
  zone = 'roc'
}: {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  href?: string
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>
  variant?: 'default' | 'primary'
  zone?: 'roc' | 'ft'
}) {
  const accentColor = zone === 'ft' ? REALM.frostIceMid : REALM.chaosFelMid
  const accentBright = zone === 'ft' ? REALM.frostIceBright : REALM.chaosFelBright

  const style: CSSProperties = {
    background: variant === 'primary'
      ? `linear-gradient(180deg, ${REALM.goldMid} 0%, ${REALM.goldDark} 50%, ${REALM.goldDeep} 100%)`
      : active
        ? `linear-gradient(180deg, ${REALM.metalLight} 0%, ${REALM.metalMid} 100%)`
        : `linear-gradient(180deg, ${REALM.metalMid} 0%, ${REALM.metalDark} 100%)`,
    border: `2px solid ${active ? accentColor : variant === 'primary' ? REALM.goldBright : REALM.metalDark}`,
    boxShadow: active
      ? `0 0 10px ${accentColor}, inset 1px 1px 0 ${REALM.metalHighlight}`
      : `inset 1px 1px 2px ${REALM.metalLight}, inset -1px -1px 2px ${REALM.metalDark}, 0 2px 4px rgba(0,0,0,0.4)`,
    color: variant === 'primary' ? REALM.bgVoid : active ? accentBright : REALM.textBright,
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: '1.125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  }

  if (linkProps) return <a {...linkProps} style={style}>{children}</a>
  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button onClick={onClick} style={style}>{children}</button>
}

export function WC3LanguageMenu({ currentLocale, isPending, changeLocale }: LocaleSwitchState) {
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
          cursor: isPending ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <span style={{ fontSize: '0.75rem' }}>🌐</span>
        <span>{currentLocale.toUpperCase()}</span>
        <span style={{ fontSize: '0.625rem', marginLeft: '0.125rem' }}>▼</span>
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
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && <span style={{ color: REALM.chaosFelBright }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function HeroActions({ actions, zone }: { actions: HeroActionSlot[]; zone: 'roc' | 'ft' }) {
  return (
    <>
      {actions.map((action) => (
        <WC3Button key={action.id} linkProps={action.linkProps} variant={action.id === 'email' ? 'primary' : 'default'} zone={zone}>
          {action.label}
        </WC3Button>
      ))}
    </>
  )
}
