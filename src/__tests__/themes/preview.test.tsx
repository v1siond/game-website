import { renderHook } from '@testing-library/react'
import { WorldPreviewProvider, useTheme } from '@/themes/ThemeContext'
import { usePreview } from '@/themes/PreviewContext'
import { getThemeById } from '@/themes/themes'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'

const mythic = getThemeById('mythic')

const previewWrapper = ({ children }: { children: React.ReactNode }) => (
  <WorldPreviewProvider theme={mythic}>{children}</WorldPreviewProvider>
)

describe('WorldPreviewProvider', () => {
  it('forces the given theme into the subtree', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: previewWrapper })
    expect(result.current.theme.id).toBe('mythic')
  })

  it('marks the subtree as a preview', () => {
    const { result } = renderHook(() => usePreview(), { wrapper: previewWrapper })
    expect(result.current).toBe(true)
  })

  it('reports false for usePreview outside any preview (no throw)', () => {
    const { result } = renderHook(() => usePreview())
    expect(result.current).toBe(false)
  })
})

describe('preview-aware section triggers', () => {
  it('useSectionTrigger reports triggered immediately inside a preview', () => {
    const { result } = renderHook(() => useSectionTrigger(), { wrapper: previewWrapper })
    expect(result.current.triggered).toBe(true)
    expect(result.current.inView).toBe(true)
  })

  it('useSectionTrigger starts untriggered outside a preview', () => {
    const { result } = renderHook(() => useSectionTrigger())
    expect(result.current.triggered).toBe(false)
  })
})
