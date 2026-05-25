import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
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
    it('renders button with provided label', () => {
      render(<DownloadPdfButton label="Download PDF" />)

      expect(screen.getByRole('button')).toHaveTextContent('Download PDF')
    })

    it('renders download icon', () => {
      render(<DownloadPdfButton label="Download CV" />)

      // Check for SVG icon (download icon path)
      const button = screen.getByRole('button')
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('button is enabled by default', () => {
      render(<DownloadPdfButton label="Download" />)

      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('has correct styling classes', () => {
      render(<DownloadPdfButton label="Download" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex', 'items-center', 'gap-2')
    })
  })

  describe('click behavior', () => {
    it('shows generating state when clicked', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      const button = screen.getByRole('button')
      await user.click(button)

      // Should show "Generating..." text
      await waitFor(() => {
        expect(screen.getByText(/Generating/i)).toBeInTheDocument()
      })
    })

    it('disables button while generating', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      const button = screen.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(button).toBeDisabled()
      })
    })

    it('shows spinner animation while generating', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

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

      render(<DownloadPdfButton label="Download PDF" />)

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
      render(<DownloadPdfButton label="Download PDF" />)

      const button = screen.getByRole('button')
      await user.click(button)

      // Wait for generation to complete
      await waitFor(() => {
        expect(button).not.toBeDisabled()
      })

      // Should show original label again
      expect(screen.getByText('Download PDF')).toBeInTheDocument()
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

      render(<DownloadPdfButton label="Download PDF" />)

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

      render(<DownloadPdfButton label="Download PDF" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error))
      })

      // Button should be re-enabled after error
      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('accessibility', () => {
    it('button is keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      // Tab to button and press Enter
      await user.tab()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/Generating/i)).toBeInTheDocument()
      })
    })

    it('has visible focus state', () => {
      render(<DownloadPdfButton label="Download PDF" />)

      const button = screen.getByRole('button')
      // Has transition for focus styles
      expect(button).toHaveClass('transition-colors')
    })

    it('disabled state has proper styling', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveClass('disabled:bg-gray-400', 'disabled:cursor-not-allowed')
      })
    })
  })

  describe('print hiding', () => {
    it('has print:hidden class to hide in print', () => {
      render(<DownloadPdfButton label="Download PDF" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('print:hidden')
    })
  })
})
