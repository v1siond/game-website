import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { CVContent } from '@/app/cv/CVContent'
import type { Locale } from '@/i18n/config'

// Sample test data that mirrors the real data structure
const mockCVData = {
  professionalSummary: {
    headline: 'Senior Staff Engineer - CTO - Full-Stack Architect',
    tagline: 'Building systems that scale',
    bio: 'Test bio content with 10+ years of experience.',
    highlights: ['Elixir/Phoenix', 'Full-stack', 'Kubernetes', 'Cloud Architecture'],
  },
  currentRoles: [
    {
      id: '1',
      slug: 'dba',
      title: 'Senior Staff Engineer',
      company: 'DBA',
      type: 'Full-time',
      description: 'Leading technical architecture and development.',
    },
    {
      id: '2',
      slug: 'startup',
      title: 'CTO',
      company: 'Startup Inc',
      type: 'Part-time',
      description: 'Building the platform from ground up.',
    },
  ],
  companies: [
    {
      id: '1',
      slug: 'dba',
      name: 'DBA Company',
      tagline: 'Digital solutions',
      description: 'A tech company',
      url: 'https://dba.example.com',
      services: ['Development', 'Consulting'],
      icon: '//--',
    },
  ],
  featuredProjects: [
    {
      id: '1',
      slug: 'project1',
      name: 'Enterprise Platform',
      tagline: 'Scalable business solution',
      description: 'Built a comprehensive platform handling thousands of users.',
      impact: 'Reduced processing time by 50%',
      techStack: ['Elixir', 'Phoenix', 'PostgreSQL', 'React'],
      status: 'Production',
      links: { demo: 'https://demo.example.com' },
    },
    {
      id: '2',
      slug: 'project2',
      name: 'Audit System',
      tagline: 'Compliance automation',
      description: 'Automated compliance checking system.',
      impact: null,
      techStack: ['TypeScript', 'Node.js'],
      status: 'Production',
      links: null,
    },
  ],
  techStack: [
    {
      id: '1',
      name: 'Backend',
      icon: '//--',
      items: ['Elixir', 'Phoenix', 'Node.js', 'TypeScript'],
    },
    {
      id: '2',
      name: 'Frontend',
      icon: '</>',
      items: ['React', 'Vue', 'Next.js', 'Tailwind'],
    },
    {
      id: '3',
      name: 'Infrastructure',
      icon: '[ ]',
      items: ['Kubernetes', 'Docker', 'AWS', 'GCP'],
    },
  ],
  workExperience: [
    {
      id: '1',
      title: 'Senior Staff Engineer',
      company: 'DBA',
      description: 'Leading development of enterprise systems.',
      startDate: new Date('2020-01-01'),
      endDate: null,
      current: true,
      highlights: ['Led team of 5 engineers', 'Reduced deploy time by 70%'],
      skills: ['Elixir', 'Phoenix', 'Kubernetes'],
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'Previous Company',
      description: 'Full-stack development.',
      startDate: new Date('2018-01-01'),
      endDate: new Date('2019-12-31'),
      current: false,
      highlights: ['Built core features', 'Improved performance'],
      skills: ['JavaScript', 'React', 'Node.js'],
    },
  ],
}

const mockTranslations = {
  downloadPdf: 'Download PDF',
  professionalSummary: 'Professional Summary',
  coreCompetencies: 'Core Competencies',
  currentPositions: 'Current Positions',
  keyProjects: 'Key Projects',
  technicalSkills: 'Technical Skills',
  professionalExperience: 'Professional Experience',
  education: 'Education',
  educationText: 'Self-taught developer with continuous learning.',
  present: 'Present',
  impact: 'Impact',
  tech: 'Tech',
}

describe('CVContent', () => {
  describe('header section', () => {
    it('renders name', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Alexander Pulido')).toBeInTheDocument()
    })

    it('renders professional headline', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(
        screen.getByText('Senior Staff Engineer - CTO - Full-Stack Architect')
      ).toBeInTheDocument()
    })

    it('renders contact email', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('alexanderpulido81@gmail.com')).toBeInTheDocument()
    })

    it('renders website link', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByRole('link', { name: /dbadbadba\.com/i })).toBeInTheDocument()
    })

    it('renders GitHub link', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(
        screen.getByRole('link', { name: /github\.com\/alexanderpulido/i })
      ).toBeInTheDocument()
    })

    it('renders LinkedIn link', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(
        screen.getByRole('link', { name: /linkedin\.com\/in\/alexanderpulido/i })
      ).toBeInTheDocument()
    })
  })

  describe('professional summary section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Professional Summary')).toBeInTheDocument()
    })

    it('renders bio text', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(
        screen.getByText(/Test bio content with 10\+ years of experience/i)
      ).toBeInTheDocument()
    })
  })

  describe('core competencies section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Core Competencies')).toBeInTheDocument()
    })

    it('renders all highlights', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      mockCVData.professionalSummary.highlights.forEach((highlight) => {
        expect(screen.getByText(highlight)).toBeInTheDocument()
      })
    })
  })

  describe('current positions section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Current Positions')).toBeInTheDocument()
    })

    it('renders all current roles', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      mockCVData.currentRoles.forEach((role) => {
        expect(screen.getByText(role.title)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(role.company))).toBeInTheDocument()
      })
    })

    it('shows Present label for current roles', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      const presentLabels = screen.getAllByText('Present')
      expect(presentLabels.length).toBeGreaterThan(0)
    })
  })

  describe('key projects section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Key Projects')).toBeInTheDocument()
    })

    it('renders project names', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      mockCVData.featuredProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
      })
    })

    it('renders project descriptions', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      mockCVData.featuredProjects.forEach((project) => {
        expect(screen.getByText(project.description)).toBeInTheDocument()
      })
    })

    it('renders impact when present', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText(/Reduced processing time by 50%/)).toBeInTheDocument()
    })

    it('renders tech stack for projects', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      // Check one of the tech stacks is rendered
      expect(screen.getByText(/Elixir, Phoenix, PostgreSQL, React/)).toBeInTheDocument()
    })
  })

  describe('technical skills section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Technical Skills')).toBeInTheDocument()
    })

    it('renders skill categories', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      mockCVData.techStack.forEach((category) => {
        expect(screen.getByText(`${category.name}:`)).toBeInTheDocument()
      })
    })

    it('renders skills within categories', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      // Check items are displayed
      expect(screen.getByText(/Elixir, Phoenix, Node\.js, TypeScript/)).toBeInTheDocument()
    })
  })

  describe('professional experience section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Professional Experience')).toBeInTheDocument()
    })

    it('renders job titles', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Senior Staff Engineer')).toBeInTheDocument()
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })

    it('renders companies', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Previous Company')).toBeInTheDocument()
    })

    it('renders date ranges correctly', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      // Current job should show "Present"
      expect(screen.getAllByText(/Present/)).toBeTruthy()

      // Past job should show year range
      expect(screen.getByText('2018 - 2019')).toBeInTheDocument()
    })

    it('renders job highlights', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Led team of 5 engineers')).toBeInTheDocument()
      expect(screen.getByText('Reduced deploy time by 70%')).toBeInTheDocument()
    })
  })

  describe('education section', () => {
    it('renders section title', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Education')).toBeInTheDocument()
    })

    it('renders education text', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(
        screen.getByText('Self-taught developer with continuous learning.')
      ).toBeInTheDocument()
    })
  })

  describe('toolbar', () => {
    it('renders language switcher', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByText('Language:')).toBeInTheDocument()
    })

    it('renders download button', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument()
    })
  })

  describe('empty data handling', () => {
    it('does not render sections with empty data', () => {
      const emptyData = {
        ...mockCVData,
        featuredProjects: [],
        workExperience: [],
        techStack: [],
        currentRoles: [],
      }

      render(<CVContent cvData={emptyData} translations={mockTranslations} locale="en" />)

      // These section titles should not be present when data is empty
      expect(screen.queryByText('Key Projects')).not.toBeInTheDocument()
      expect(screen.queryByText('Technical Skills')).not.toBeInTheDocument()
      expect(screen.queryByText('Current Positions')).not.toBeInTheDocument()
      expect(screen.queryByText('Professional Experience')).not.toBeInTheDocument()
    })

    it('handles null professionalSummary', () => {
      const dataWithNullSummary = {
        ...mockCVData,
        professionalSummary: null,
      }

      render(<CVContent cvData={dataWithNullSummary} translations={mockTranslations} locale="en" />)

      // Should not render professional summary section
      expect(screen.queryByText('Professional Summary')).not.toBeInTheDocument()
      expect(screen.queryByText('Core Competencies')).not.toBeInTheDocument()
    })
  })

  describe('locale handling', () => {
    it('accepts different locales', () => {
      const locales: Locale[] = ['en', 'es', 'it']

      locales.forEach((locale) => {
        const { unmount } = render(
          <CVContent cvData={mockCVData} translations={mockTranslations} locale={locale} />
        )

        // Should render without errors
        expect(screen.getByText('Alexander Pulido')).toBeInTheDocument()

        unmount()
      })
    })
  })

  describe('print styles', () => {
    it('has print:hidden class on toolbar', () => {
      const { container } = render(
        <CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />
      )

      const toolbar = container.querySelector('.print\\:hidden')
      expect(toolbar).toBeInTheDocument()
    })

    it('cv-content element exists for PDF generation', () => {
      render(<CVContent cvData={mockCVData} translations={mockTranslations} locale="en" />)

      const cvContent = document.getElementById('cv-content')
      expect(cvContent).toBeInTheDocument()
    })
  })
})
