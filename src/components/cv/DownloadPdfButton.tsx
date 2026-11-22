'use client'

import { useState } from 'react'
import { useCVData } from './CVDataProvider'

interface DownloadPdfButtonProps {
  /** The id of the element the PDF is made from, set by the page that renders it. */
  contentId: string
}

// The button stays enabled while the PDF is made (aria-disabled, a press is ignored), so keyboard focus
// stays on it; the busy text is announced through a polite live region beside it.
export function DownloadPdfButton({ contentId }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { fullName, labels } = useCVData()
  const { cvPage } = labels

  const handleDownload = async () => {
    if (isGenerating) return
    setIsGenerating(true)

    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default

      const element = document.getElementById(contentId)

      if (!element) {
        console.error('CV content element not found')
        return
      }

      // Configure PDF options
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${fullName.split(' ').join('_')}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }

      // Generate and download PDF
      await html2pdf().set(options).from(element).save()
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDownload}
        aria-disabled={isGenerating}
        className="inline-flex min-h-11 items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded aria-[disabled=false]:hover:bg-gray-800 aria-disabled:bg-gray-400 aria-disabled:cursor-not-allowed transition-colors print:hidden"
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {cvPage.generating}
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {cvPage.downloadPdf}
          </>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {isGenerating ? cvPage.generating : ''}
      </span>
    </>
  )
}
