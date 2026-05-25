import { Profession } from '@/contexts/ProfessionContext'

export interface ExperienceEntry {
  id: string
  title: string
  organization: string
  startDate: string
  endDate: string | null
  description: string
  skills: string[]
  professions: Profession[]
  highlights?: string[]
}

export const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    id: 'agencyrocket',
    title: 'Principal Engineer',
    organization: 'AgencyRocket',
    startDate: '2024-01',
    endDate: null,
    description: 'Leading API architecture for insurance tech platform. Phoenix/Elixir, Vue, Kubernetes.',
    skills: ['Elixir', 'Phoenix', 'Vue.js', 'Kubernetes', 'PostgreSQL'],
    professions: ['engineer'],
    highlights: [
      'Architected migration system for multi-tenant data',
      'Built real-time policy tracking with LiveView',
    ],
  },
  {
    id: 'quility',
    title: 'Senior Engineer',
    organization: 'Quility',
    startDate: '2020-06',
    endDate: '2024-01',
    description: 'Full-stack development, system migrations, API design.',
    skills: ['Elixir', 'Phoenix', 'React', 'PostgreSQL', 'AWS'],
    professions: ['engineer'],
    highlights: [
      'Led platform migration affecting 50k+ users',
      'Reduced API response times by 40%',
    ],
  },
  {
    id: 'freelance-eng',
    title: 'Freelance Developer',
    organization: 'Self-employed',
    startDate: '2014-01',
    endDate: '2020-06',
    description: 'Full-stack development for various clients. Python, PHP, JavaScript.',
    skills: ['Python', 'PHP', 'JavaScript', 'MySQL', 'Docker'],
    professions: ['engineer'],
  },
  {
    id: 'band-pro',
    title: 'Professional Drummer',
    organization: 'Various Bands',
    startDate: '2017-01',
    endDate: null,
    description: 'Session work, studio recording, and live touring across multiple genres.',
    skills: ['Rock', 'Metal', 'Latin', 'Jazz Fusion', 'Studio Recording'],
    professions: ['drummer'],
    highlights: [
      'National tour - 30+ cities',
      'Multiple studio album recordings',
    ],
  },
  {
    id: 'instructor-bjj',
    title: 'BJJ Instructor',
    organization: 'Local Academy',
    startDate: '2022-01',
    endDate: null,
    description: 'Teaching fundamentals and advanced techniques to students of all levels.',
    skills: ['Brazilian Jiu-Jitsu', 'Instruction', 'Curriculum Design'],
    professions: ['fighter'],
    highlights: [
      'Teaching 3 classes per week',
      'Trained 20+ students to competition level',
    ],
  },
  {
    id: 'muay-thai',
    title: 'Muay Thai Practitioner',
    organization: 'Training',
    startDate: '2018-01',
    endDate: '2021-01',
    description: 'Intensive training in traditional Muay Thai techniques.',
    skills: ['Muay Thai', 'Striking', 'Clinch Work'],
    professions: ['fighter'],
  },
  {
    id: 'mma-training',
    title: 'MMA Training',
    organization: 'Training',
    startDate: '2021-01',
    endDate: '2022-01',
    description: 'Combined disciplines training for mixed martial arts.',
    skills: ['MMA', 'Wrestling', 'Ground & Pound'],
    professions: ['fighter'],
  },
]

export function filterExperienceByProfession(
  entries: ExperienceEntry[],
  profession: Profession | 'all'
): ExperienceEntry[] {
  if (profession === 'all') return entries
  return entries.filter(e => e.professions.includes(profession))
}
