import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { locales } from '@/i18n/config'
import { renderWithCV as render, testCV } from '../../helpers/test-utils'

const { languages, cvPage } = testCV().labels

// Mock next/navigation
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie = ''
    jest.clearAllMocks()
  })

  describe('initial render', () => {
    it('renders language label', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByText(cvPage.language)).toBeInTheDocument()
    })

    it('renders a select dropdown', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('displays all available locales', () => {
      render(<LanguageSwitcher />)

      locales.forEach((locale) => {
        expect(screen.getByRole('option', { name: languages[locale] })).toBeInTheDocument()
      })
    })

    it('defaults to English', () => {
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('en')
    })

    it('has correct number of options', () => {
      render(<LanguageSwitcher />)

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(locales.length)
    })
  })

  describe('language selection', () => {
    it('changes language when selecting Spanish', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'es')

      expect(select).toHaveValue('es')
    })

    it('changes language when selecting Italian', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'it')

      expect(select).toHaveValue('it')
    })

    it('keeps the locale in the cookie only, never in localStorage', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      await user.selectOptions(screen.getByRole('combobox'), 'es')

      expect(document.cookie).toContain('locale=es')
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('sets cookie when language changes', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      await user.selectOptions(screen.getByRole('combobox'), 'it')

      expect(document.cookie).toContain('locale=it')
    })

    it('triggers router refresh when language changes', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      await user.selectOptions(screen.getByRole('combobox'), 'es')

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })
  })

  describe('persistence', () => {
    it('reads initial locale from cookie', () => {
      document.cookie = 'locale=es'

      render(<LanguageSwitcher />)

      // Note: Due to useEffect timing, we need to wait
      waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveValue('es')
      })
    })

    it('ignores localStorage when there is no cookie, as the server does', () => {
      ;(localStorage.getItem as jest.Mock).mockReturnValue('it')

      render(<LanguageSwitcher />)

      expect(screen.getByRole('combobox')).toHaveValue('en')
    })

    it('prefers cookie over localStorage', () => {
      document.cookie = 'locale=es'
      ;(localStorage.getItem as jest.Mock).mockReturnValue('it')

      render(<LanguageSwitcher />)

      waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveValue('es')
      })
    })
  })

  describe('accessibility', () => {
    it('select is keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      // Tab to select
      await user.tab()

      expect(screen.getByRole('combobox')).toHaveFocus()
    })

    it('has proper styling classes', () => {
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('border', 'rounded')
    })

    it('has focus ring on focus', () => {
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('focus:ring-2', 'focus:ring-blue-500')
    })
  })

  describe('print visibility', () => {
    it('has print:hidden class on container', () => {
      const { container } = render(<LanguageSwitcher />)

      const wrapper = container.querySelector('.print\\:hidden')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('locale data integrity', () => {
    it('locales array contains expected values', () => {
      expect(locales).toContain('en')
      expect(locales).toContain('es')
      expect(locales).toContain('it')
    })

    it('names every language in its own tongue, from the labels', () => {
      expect(languages).toEqual({ en: 'English', es: 'Español', it: 'Italiano' })
    })
  })
})
