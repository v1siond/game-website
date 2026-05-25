'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../themes/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setThemeById, allThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Auto-scroll to selected theme when opening
  useEffect(() => {
    if (isOpen && selectedRef.current && listRef.current) {
      const list = listRef.current
      const selected = selectedRef.current

      // Scroll to center the selected item
      const scrollTop = selected.offsetTop - (list.clientHeight / 2) + (selected.clientHeight / 2)
      list.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs px-3 py-1 transition-colors cursor-pointer"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.textMuted,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.colors.borderHover
          e.currentTarget.style.color = theme.colors.accent
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border
          e.currentTarget.style.color = theme.colors.textMuted
        }}
      >
        THEMES
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto z-[100]"
          style={{
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.border}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.7)`,
          }}
        >
          <div
            className="sticky top-0 px-3 py-2 text-xs tracking-widest z-10"
            style={{
              color: theme.colors.textMuted,
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
            }}
          >
            [ SELECT THEME ]
          </div>

          {allThemes.map((t) => {
            const isSelected = t.id === theme.id
            return (
              <button
                key={t.id}
                ref={isSelected ? selectedRef : null}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setThemeById(t.id)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-3 transition-all cursor-pointer block"
                style={{
                  backgroundColor: isSelected ? theme.colors.surfaceHover : 'transparent',
                  color: isSelected ? theme.colors.accent : theme.colors.text,
                  borderLeft: isSelected ? `4px solid ${theme.colors.accent}` : '4px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover
                  e.currentTarget.style.color = theme.colors.accent
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? theme.colors.surfaceHover : 'transparent'
                  e.currentTarget.style.color = isSelected ? theme.colors.accent : theme.colors.text
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.colors.accent }}
                  />
                  <span className="text-sm font-medium">{t.name}</span>
                  {isSelected && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </div>
                <div
                  className="text-[10px] mt-1 ml-5"
                  style={{ color: theme.colors.textMuted }}
                >
                  {t.description}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
