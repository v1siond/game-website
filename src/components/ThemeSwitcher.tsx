'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../themes/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setThemeById, allThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeDropdown])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          closeDropdown()
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => Math.min(prev + 1, allThemes.length - 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(allThemes.length - 1)
          break
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            event.preventDefault()
            setThemeById(allThemes[focusedIndex].id)
            closeDropdown()
          }
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, allThemes, setThemeById, closeDropdown])

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const buttons = listRef.current?.querySelectorAll('[role="option"]')
      ;(buttons?.[focusedIndex] as HTMLElement)?.focus()
    }
  }, [isOpen, focusedIndex])

  // Auto-scroll to selected theme when opening
  useEffect(() => {
    if (isOpen && selectedRef.current && listRef.current) {
      const list = listRef.current
      const selected = selectedRef.current
      const scrollTop = selected.offsetTop - (list.clientHeight / 2) + (selected.clientHeight / 2)
      list.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })

      // Set initial focus to selected item
      const selectedIndex = allThemes.findIndex(t => t.id === theme.id)
      setFocusedIndex(selectedIndex)
    }
  }, [isOpen, allThemes, theme.id])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      const selectedIndex = allThemes.findIndex(t => t.id === theme.id)
      setFocusedIndex(selectedIndex)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select theme"
        className="text-sm px-3 py-2 transition-colors cursor-pointer min-h-[44px]"
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
        <span aria-hidden="true">THEMES</span>
        <span className="sr-only">Current theme: {theme.name}</span>
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Available themes"
          aria-activedescendant={focusedIndex >= 0 ? `theme-${allThemes[focusedIndex].id}` : undefined}
          className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto z-[100]"
          style={{
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.border}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.7)`,
          }}
        >
          <div
            className="sticky top-0 px-3 py-2 text-sm tracking-widest z-10"
            style={{
              color: theme.colors.textMuted,
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
            }}
            aria-hidden="true"
          >
            [ SELECT THEME ]
          </div>

          {allThemes.map((t, index) => {
            const isSelected = t.id === theme.id
            const isFocused = focusedIndex === index
            return (
              <button
                key={t.id}
                id={`theme-${t.id}`}
                ref={isSelected ? selectedRef : null}
                role="option"
                aria-selected={isSelected}
                tabIndex={isFocused ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setThemeById(t.id)
                  closeDropdown()
                }}
                className="w-full text-left px-3 py-3 transition-all cursor-pointer block min-h-[44px]"
                style={{
                  backgroundColor: isSelected || isFocused ? theme.colors.surfaceHover : 'transparent',
                  color: isSelected ? theme.colors.accent : theme.colors.text,
                  borderLeft: isSelected ? `4px solid ${theme.colors.accent}` : '4px solid transparent',
                  outline: isFocused ? `2px solid ${theme.colors.accent}` : 'none',
                  outlineOffset: '-2px',
                }}
                onMouseEnter={(e) => {
                  setFocusedIndex(index)
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
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">{t.name}</span>
                  {isSelected && (
                    <span className="ml-auto text-sm" aria-hidden="true">✓</span>
                  )}
                </div>
                <div
                  className="text-sm mt-1 ml-5"
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
