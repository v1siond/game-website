import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithCV as render, testCV } from '../../helpers/test-utils'
import { DownloadPdfButton } from '@/components/cv/DownloadPdfButton'

// Mock html2pdf.js
const mockSave = jest.fn().mockResolvedValue(undefined)
const mockFrom = jest.fn().mockReturnThis()
const mockSet = jest.fn().mockReturnThis()

jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    set: mockSet,
    from: mockFrom,
    save: mockSave,
  })),
}))

const { cvPage } = testCV().labels

// The mocked save resolves at once, so the generating state is gone before a test can look at it; a test
// about that state keeps save pending.
const holdSaveOpen = () => mockSave.mockReturnValueOnce(new Promise<void>(() => {}))

describe('DownloadPdfButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Create a mock element for the PDF content
    const mockElement = document.createElement('div')
    mockElement.id = 'cv-content'
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    const element = document.getElementById('cv-content')
    if (element) {
      document.body.removeChild(element)
    }
  })

  describe('initial render', () => {
    it('renders the download label of the page language', () => {
      render(<DownloadPdfButton contentId="cv-content" />)

      expect(screen.getByRole('button')).toHaveTextContent(cvPage.downloadPdf)
    })

    it('renders download icon', () => {
      render(<DownloadPdfButton contentId="cv-content" />)

      // Check for SVG icon (download icon path)
      const button = screen.getByRole('button')
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('button is enabled by default', () => {
      render(<DownloadPdfButton contentId="cv-content" />)

      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false')
    })
  })

  describe('click behavior', () => {
    it('shows generating state when clicked', async () => {
      const user = userEvent.setup()
      holdSaveOpen()
      render(<DownloadPdfButton contentId="cv-content" />)

      const button = screen.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(button).toHaveTextContent(cvPage.generating)
      })
    })

    it('marks the button disabled while generating, keeping focus on it', async () => {
      const user = userEvent.setup()
      holdSaveOpen()
      render(<DownloadPdfButton contentId="cv-content" />)

      const button = screen.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-disabled', 'true')
      })
      expect(button).toHaveFocus()
    })

    it('shows spinner animation while generating', async () => {
      const user = userEvent.setup()
      holdSaveOpen()
      render(<DownloadPdfButton contentId="cv-content" />)

      const button = screen.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        const spinner = button.querySelector('.animate-spin')
        expect(spinner).toBeInTheDocument()
      })
    })

    it('calls html2pdf with correct options', async () => {
      const user = userEvent.setup()
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const html2pdf = require('html2pdf.js').default

      render(<DownloadPdfButton contentId="cv-content" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(html2pdf).toHaveBeenCalled()
        expect(mockSet).toHaveBeenCalled()
        expect(mockFrom).toHaveBeenCalled()
        expect(mockSave).toHaveBeenCalled()
      })
    })

    it('re-enables button after generation completes', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton contentId="cv-content" />)

      const button = screen.getByRole('button')
      await user.click(button)

      // Wait for generation to complete
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-disabled', 'false')
      })

      expect(button).toHaveTextContent(cvPage.downloadPdf)
    })
  })

  describe('error handling', () => {
    it('handles missing cv-content element gracefully', async () => {
      const user = userEvent.setup()

      // Remove the cv-content element
      const element = document.getElementById('cv-content')
      if (element) {
        document.body.removeChild(element)
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(<DownloadPdfButton contentId="cv-content" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('CV content element not found')
      })

      consoleSpy.mockRestore()
    })

    it('handles html2pdf error gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Make save throw an error
      mockSave.mockRejectedValueOnce(new Error('PDF generation failed'))

      render(<DownloadPdfButton contentId="cv-content" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error))
      })

      // Button should be re-enabled after error
      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false')
      })

      consoleSpy.mockRestore()
    })
  })

  describe('accessibility', () => {
    it('button is keyboard accessible', async () => {
      const user = userEvent.setup()
      holdSaveOpen()
      render(<DownloadPdfButton contentId="cv-content" />)

      // Tab to button and press Enter
      await user.tab()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveTextContent(cvPage.generating)
      })
    })
  })
})
