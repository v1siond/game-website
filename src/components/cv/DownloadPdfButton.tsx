'use client'

import { useState } from 'react'

interface DownloadPdfButtonProps {
  label: string
}

export function DownloadPdfButton({ label }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)

    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default

      // Get the CV content element
      const element = document.getElementById('cv-content')

      if (!element) {
        console.error('CV content element not found')
        return
      }

      // Configure PDF options
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'Alexander_Pulido_CV.pdf',
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
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors print:hidden"
    >
      {isGenerating ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
          Generating...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}
