'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../themes/ThemeContext'
import { Theme } from '../themes/themes'

// Theme categories for organized navigation
const THEME_CATEGORIES: { name: string; icon: string; themeIds: string[] }[] = [
  {
    name: 'Fantasy',
    icon: '⚔️',
    themeIds: ['dark-fantasy', 'medieval-fantasy', 'mythic', 'soul-map'],
  },
  {
    name: 'Retro',
    icon: '🕹️',
    themeIds: ['retro-rpg', 'retro-atomic', 'rubber-hose', 'adventure-paths'],
  },
  {
    name: 'Neon',
    icon: '💫',
    themeIds: ['neon-cyber', 'neon-portals', 'bold-noir'],
  },
  {
    name: 'Action',
    icon: '🎮',
    themeIds: ['fighter-select', 'survival-horror', 'cell-shaded'],
  },
  {
    name: 'Artistic',
    icon: '🎨',
    themeIds: ['silhouette', 'art-deco', 'tropical-platformer'],
  },
]

export default function ThemeSwitcher() {
  const { theme, setThemeById, allThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [dropdownPosition, setDropdownPosition] = useState({ top: 60, right: 16 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Build flat list for keyboard navigation
  const flatThemeList = THEME_CATEGORIES.flatMap(cat =>
    cat.themeIds.map(id => allThemes.find(t => t.id === id)).filter(Boolean) as Theme[]
  )

  // Find which category contains the current theme
  const getCurrentCategory = () => {
    for (const cat of THEME_CATEGORIES) {
      if (cat.themeIds.includes(theme.id)) return cat.name
    }
    return null
  }

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setFocusedIndex(-1)
    // Prevent scroll when returning focus to button
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if dropdown is actually open
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeDropdown])

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
          setFocusedIndex(prev => Math.min(prev + 1, flatThemeList.length - 1))
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
          setFocusedIndex(flatThemeList.length - 1)
          break
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && flatThemeList[focusedIndex]) {
            event.preventDefault()
            setThemeById(flatThemeList[focusedIndex].id)
            closeDropdown()
          }
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, flatThemeList, setThemeById, closeDropdown])

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const buttons = listRef.current?.querySelectorAll('[role="option"]')
      ;(buttons?.[focusedIndex] as HTMLElement)?.focus()
    }
  }, [isOpen, focusedIndex])

  // Auto-expand category containing selected theme and scroll to it
  useEffect(() => {
    if (isOpen) {
      const currentCat = getCurrentCategory()
      if (currentCat) {
        setExpandedCategories(prev => new Set([...prev, currentCat]))
      }
      // Set initial focus to selected item
      const selectedIndex = flatThemeList.findIndex(t => t.id === theme.id)
      setFocusedIndex(selectedIndex)

      // Scroll to selected after a brief delay for rendering
      setTimeout(() => {
        if (selectedRef.current && listRef.current) {
          selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 50)
    }
  }, [isOpen, theme.id])

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setIsOpen(!isOpen)
    if (!isOpen) {
      const selectedIndex = flatThemeList.findIndex(t => t.id === theme.id)
      setFocusedIndex(selectedIndex)
    }
  }

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(catName)) {
        next.delete(catName)
      } else {
        next.add(catName)
      }
      return next
    })
  }

  const getThemesByCategory = (cat: { themeIds: string[] }) => {
    return cat.themeIds
      .map(id => allThemes.find(t => t.id === id))
      .filter(Boolean) as Theme[]
  }

  // Calculate flat index for a theme (for keyboard nav)
  const getFlatIndex = (themeId: string) => {
    return flatThemeList.findIndex(t => t.id === themeId)
  }

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select theme"
        className="text-sm px-3 py-2 transition-colors cursor-pointer min-h-[44px] flex items-center gap-2"
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
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: theme.colors.accent }}
          aria-hidden="true"
        />
        <span aria-hidden="true">THEMES</span>
        <span className="sr-only">Current theme: {theme.name}</span>
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Available themes"
          aria-activedescendant={focusedIndex >= 0 && flatThemeList[focusedIndex] ? `theme-${flatThemeList[focusedIndex].id}` : undefined}
          className="fixed w-80 max-h-[70vh] overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            zIndex: 99999,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.border}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.7)`,
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 px-4 py-3 text-sm tracking-widest z-10 flex items-center justify-between"
            style={{
              color: theme.colors.textMuted,
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
            }}
          >
            <span>SELECT THEME</span>
            <span className="text-xs" style={{ color: theme.colors.accent }}>
              {allThemes.length} themes
            </span>
          </div>

          {/* Categories */}
          {THEME_CATEGORIES.map((cat) => {
            const isExpanded = expandedCategories.has(cat.name)
            const themesInCat = getThemesByCategory(cat)
            const hasSelectedTheme = themesInCat.some(t => t.id === theme.id)

            return (
              <div key={cat.name}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors cursor-pointer"
                  style={{
                    backgroundColor: hasSelectedTheme ? `${theme.colors.accent}15` : 'transparent',
                    borderBottom: `1px solid ${theme.colors.border}30`,
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">{cat.icon}</span>
                    <span
                      className="text-sm font-medium tracking-wide"
                      style={{ color: hasSelectedTheme ? theme.colors.accent : theme.colors.text }}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.colors.textMuted }}
                    >
                      ({themesInCat.length})
                    </span>
                  </div>
                  <span
                    className="text-xs transition-transform"
                    style={{
                      color: theme.colors.textMuted,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {/* Theme List */}
                {isExpanded && (
                  <div
                    className="py-1"
                    style={{ backgroundColor: `${theme.colors.surface}80` }}
                  >
                    {themesInCat.map((t) => {
                      const isSelected = t.id === theme.id
                      const flatIdx = getFlatIndex(t.id)
                      const isFocused = focusedIndex === flatIdx

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
                            // Keep dropdown open to allow browsing themes
                          }}
                          className="w-full text-left px-4 py-2.5 pl-10 transition-all cursor-pointer block min-h-[44px]"
                          style={{
                            backgroundColor: isSelected || isFocused ? theme.colors.surfaceHover : 'transparent',
                            color: isSelected ? theme.colors.accent : theme.colors.text,
                            borderLeft: isSelected ? `3px solid ${theme.colors.accent}` : '3px solid transparent',
                            outline: isFocused ? `2px solid ${theme.colors.accent}` : 'none',
                            outlineOffset: '-2px',
                          }}
                          onMouseEnter={(e) => {
                            setFocusedIndex(flatIdx)
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
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: t.colors.accent }}
                              aria-hidden="true"
                            />
                            <span className="text-sm">{t.name}</span>
                            {isSelected && (
                              <span className="ml-auto text-sm" style={{ color: theme.colors.accent }} aria-hidden="true">
                                ✓
                              </span>
                            )}
                          </div>
                          <div
                            className="text-xs mt-0.5 ml-5 truncate"
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
          })}
        </div>
      )}
    </div>
  )
}
