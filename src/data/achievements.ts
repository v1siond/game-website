// Achievement-based content structure for CV
// No meaningless 1-5 bars - actual accomplishments that recruiters care about

import { Profession } from '@/contexts/ProfessionContext'

export interface Achievement {
  title: string
  metric?: string      // Quantified result
  description?: string // Brief context
  link?: string        // Evidence/portfolio
}

export interface AchievementCategory {
  name: string
  profession: Profession
  icon: string
  achievements: Achievement[]
}

// Engineer achievements are handled by projects.ts with impact statements
// Tech stack is handled by techStack.ts

// Drummer achievements - real accomplishments, not skill bars
export const DRUMMER_ACHIEVEMENTS: AchievementCategory[] = [
  {
    name: 'Experience',
    profession: 'drummer',
    icon: '🥁',
    achievements: [
      { title: '15 years playing', metric: '7 years professional' },
      { title: 'Studio recording', metric: 'Multiple albums' },
      { title: 'Live touring', metric: 'Regional circuit' },
      { title: 'Session work', description: 'Studio drummer for hire' },
    ],
  },
  {
    name: 'Active Bands',
    profession: 'drummer',
    icon: '🎤',
    achievements: [
      {
        title: 'Eon',
        metric: 'Progressive Metal',
        description: 'Complex time signatures, atmospheric soundscapes',
        link: 'http://eonband.net/',
      },
      {
        title: 'Sycsemper',
        metric: 'Metal',
        description: 'Heavy metal exploring darker sonic territories',
      },
      {
        title: 'Retrogroove',
        metric: 'Funk/Soul',
        description: 'Groove is everything - funk and soul covers',
        link: 'https://retrogrooveband.netlify.app/',
      },
    ],
  },
  {
    name: 'Genre Versatility',
    profession: 'drummer',
    icon: '🎵',
    achievements: [
      { title: 'Rock/Metal', description: 'Primary focus - double bass, blast beats' },
      { title: 'Progressive', description: 'Odd time signatures, polyrhythms' },
      { title: 'Latin/Salsa', description: 'Clave patterns, timbale work' },
      { title: 'Funk/Soul', description: 'Ghost notes, pocket playing' },
      { title: 'Jazz Fusion', description: 'Linear drumming, improvisation' },
    ],
  },
]

// Fighter achievements - real training timeline and credentials
export const FIGHTER_ACHIEVEMENTS: AchievementCategory[] = [
  {
    name: 'Training',
    profession: 'fighter',
    icon: '🥊',
    achievements: [
      { title: 'Muay Thai', metric: '3 years', description: 'Striking, clinch work, elbows/knees' },
      { title: 'Brazilian Jiu-Jitsu', metric: '2 years', description: 'Ground game, submissions, sweeps' },
      { title: 'MMA', metric: '1 year', description: 'Combined disciplines, cage work' },
      { title: 'Wrestling', description: 'Takedowns, control, conditioning' },
    ],
  },
  {
    name: 'Teaching',
    profession: 'fighter',
    icon: '🎓',
    achievements: [
      { title: 'Martial Arts Instructor', metric: 'Currently teaching' },
      { title: 'Fundamentals coaching', description: 'New student onboarding and basics' },
      { title: 'Self-defense courses', description: 'Practical techniques for real situations' },
      { title: 'Competition prep', description: 'Training fighters for amateur bouts' },
    ],
  },
  {
    name: 'Philosophy',
    profession: 'fighter',
    icon: '⚔️',
    achievements: [
      { title: 'Discipline', description: 'What the mat taught about consistency' },
      { title: 'Ego management', description: 'Learning to lose and improve' },
      { title: 'Physical fitness', description: 'Functional strength and conditioning' },
      { title: 'Mental resilience', description: 'Staying calm under pressure' },
    ],
  },
]

export function getAchievementsByProfession(profession: Profession): AchievementCategory[] {
  switch (profession) {
    case 'drummer':
      return DRUMMER_ACHIEVEMENTS
    case 'fighter':
      return FIGHTER_ACHIEVEMENTS
    default:
      return [] // Engineer uses tech stack and projects with impact statements
  }
}

// Work experience with quantified achievements - for CV section
export interface WorkAchievement {
  title: string
  company: string
  period: string
  current: boolean
  highlights: string[] // Quantified accomplishments
  technologies?: string[]
}

export const WORK_EXPERIENCE: WorkAchievement[] = [
  {
    title: 'Senior Staff Engineer',
    company: 'DBA',
    period: '2021 - Present',
    current: true,
    highlights: [
      'Architected enterprise insurance platform processing thousands of policies daily',
      'Led migration of multi-million transaction banking app from Node.js to Elixir',
      'Built multi-tenant GraphQL API with real-time carrier feed integration',
      'Implemented Kubernetes infrastructure handling production workloads',
    ],
    technologies: ['Elixir', 'Phoenix', 'GraphQL', 'Kubernetes', 'PostgreSQL'],
  },
  {
    title: 'CTO',
    company: 'PMX',
    period: '2023 - Present',
    current: true,
    highlights: [
      'Built complete affiliate marketplace with full Shopify integration',
      'Implemented payment system with Stripe Connect',
      'Designed analytics dashboard for merchant insights',
    ],
    technologies: ['Rails', 'Next.js', 'Shopify API', 'Stripe'],
  },
  {
    title: 'CTO',
    company: 'GRCTechMe',
    period: '2022 - Present',
    current: true,
    highlights: [
      'Published audit platform on Google Marketplace',
      'Built Google Workspace integration for document management',
      'Implemented multi-role system with phased audit workflows',
    ],
    technologies: ['React', 'Firebase', 'Google Workspace API', 'Google AI'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'ClutchPrep (acquired by Pearson)',
    period: '2018 - 2021',
    current: false,
    highlights: [
      'Built B2B educational platform with grading and analytics',
      'Product was successful enough that Pearson acquired the company',
      'Now powers pearson.com/channels',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
]
