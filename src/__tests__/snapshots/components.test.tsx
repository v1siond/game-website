import { render } from '@testing-library/react'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { DownloadPdfButton } from '@/components/cv/DownloadPdfButton'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { ThemeProvider } from '@/themes/ThemeContext'
import { ProfessionProvider } from '@/contexts/ProfessionContext'

// Provider wrapper
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ProfessionProvider>{children}</ProfessionProvider>
  </ThemeProvider>
)

describe('Component Snapshots', () => {
  describe('ThemeSwitcher', () => {
    it('matches closed state snapshot', () => {
      const { container } = render(<ThemeSwitcher />, { wrapper: AllProviders })

      expect(container).toMatchSnapshot()
    })
  })

  describe('DownloadPdfButton', () => {
    beforeEach(() => {
      // Create mock element for PDF content
      const mockElement = document.createElement('div')
      mockElement.id = 'cv-content'
      document.body.appendChild(mockElement)
    })

    afterEach(() => {
      const element = document.getElementById('cv-content')
      if (element) document.body.removeChild(element)
    })

    it('matches default state snapshot', () => {
      const { container } = render(<DownloadPdfButton label="Download PDF" />)

      expect(container).toMatchSnapshot()
    })

    it('matches different label snapshot', () => {
      const { container } = render(<DownloadPdfButton label="Download CV" />)

      expect(container).toMatchSnapshot()
    })
  })

  describe('LanguageSwitcher', () => {
    it('matches default snapshot', () => {
      const { container } = render(<LanguageSwitcher />)

      expect(container).toMatchSnapshot()
    })
  })
})

describe('Theme Data Snapshots', () => {
  // These snapshot tests capture the structure of theme data
  // to detect unintended changes to theme configuration
  it('default theme configuration matches snapshot', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { themes, DEFAULT_THEME_ID } = require('@/themes/themes')
    const defaultTheme = themes.find((t: { id: string }) => t.id === DEFAULT_THEME_ID)

    expect({
      id: defaultTheme.id,
      name: defaultTheme.name,
      colorKeys: Object.keys(defaultTheme.colors),
      effectKeys: Object.keys(defaultTheme.effects),
    }).toMatchSnapshot()
  })

  it('theme count matches snapshot', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { themes } = require('@/themes/themes')

    expect({
      totalThemes: themes.length,
      themeIds: themes.map((t: { id: string }) => t.id).sort(),
    }).toMatchSnapshot()
  })
})

describe('Profession Data Snapshots', () => {
  it('profession configs structure matches snapshot', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PROFESSION_CONFIGS } = require('@/contexts/ProfessionContext')

    expect({
      professionIds: Object.keys(PROFESSION_CONFIGS),
      configKeys: Object.keys(PROFESSION_CONFIGS.engineer),
    }).toMatchSnapshot()
  })
})
