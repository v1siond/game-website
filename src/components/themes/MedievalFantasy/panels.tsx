import type { ReactNode } from 'react'
import { REALM } from './palette'

// The heavy metal frame with gold bevels and the inner card the sections sit in, tinted per zone.

export function WC3Frame({ children, title, zone = 'roc' }: { children: ReactNode; title?: string; zone?: 'roc' | 'ft' }) {
  const accentColor = zone === 'ft' ? REALM.frostIceMid : REALM.chaosFelMid

  return (
    <div style={{ position: 'relative' }}>
      {/* Corner ornaments */}
      {['tl', 'tr', 'bl', 'br'].map((pos) => (
        <svg
          key={pos}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            zIndex: 10,
            ...(pos.includes('t') ? { top: '-2px' } : { bottom: '-2px' }),
            ...(pos.includes('l') ? { left: '-2px' } : { right: '-2px' }),
            transform: `rotate(${pos === 'tl' ? 0 : pos === 'tr' ? 90 : pos === 'bl' ? 270 : 180}deg)`,
          }}
        >
          <path d="M0 0 L24 0 L24 6 L6 6 L6 24 L0 24 Z" fill={REALM.metalMid} />
          <path d="M2 2 L20 2 L20 4 L4 4 L4 20 L2 20 Z" fill={REALM.metalLight} />
          <circle cx="4" cy="4" r="2" fill={REALM.metalHighlight} />
        </svg>
      ))}

      <div style={{
        background: `linear-gradient(135deg, ${REALM.metalLight} 0%, ${REALM.metalMid} 30%, ${REALM.metalDark} 100%)`,
        padding: '5px',
        boxShadow: `inset 1px 1px 3px rgba(100,100,100,0.3), inset -1px -1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.6)`,
      }}>
        <div style={{ background: `linear-gradient(180deg, ${REALM.goldDark} 0%, ${REALM.goldDeep} 100%)`, padding: '2px' }}>
          <div style={{ background: REALM.metalDark, padding: '2px' }}>
            <div style={{
              background: `radial-gradient(ellipse at 50% 0%, ${REALM.bgDeep} 0%, ${REALM.bgVoid} 100%)`,
              padding: '1.5rem 1.75rem',
              boxShadow: `inset 0 2px 12px rgba(0,0,0,0.8)`,
            }}>
              {title && (
                <div style={{
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: `1px solid ${REALM.metalDark}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{ width: '8px', height: '8px', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                  <h2 style={{
                    color: REALM.goldBright,
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    textShadow: `1px 1px 3px ${REALM.bgVoid}`,
                    margin: 0
                  }}>
                    {title}
                  </h2>
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InnerCard({ children, highlight, zone = 'roc' }: { children: ReactNode; highlight?: boolean; zone?: 'roc' | 'ft' }) {
  const accentColor = zone === 'ft' ? REALM.frostIceDark : REALM.chaosFelDark

  return (
    <div style={{
      background: `linear-gradient(180deg, ${REALM.bgDeep} 0%, ${REALM.bgVoid} 100%)`,
      border: `1px solid ${highlight ? REALM.goldDark : REALM.metalDark}`,
      borderLeft: highlight ? `3px solid ${accentColor}` : `1px solid ${REALM.metalDark}`,
      padding: '1rem',
      boxShadow: `inset 0 1px 6px rgba(0,0,0,0.5)`,
    }}>
      {children}
    </div>
  )
}
