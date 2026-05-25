import { Profession } from '@/contexts/ProfessionContext'

export interface AboutMe {
  professionId: Profession
  bio: string
  headline: string
  quickFacts: string[]
}

// Professional summary focused on selling services
export const PROFESSIONAL_SUMMARY = {
  headline: 'Senior Staff Engineer • CTO • Full-Stack Architect',
  tagline: 'If you need to build it, I can deliver it.',
  bio: `10+ years architecting and delivering production systems across the full stack. From migrating multi-million transaction apps to building complete SaaS platforms from scratch. I've helped build Truth Social in its early stages, created enterprise insurance platforms processing thousands of policies daily, and shipped a Google Marketplace-approved audit system. Currently Senior Staff Engineer at DBA and CTO of two startups. I specialize in turning complex requirements into working software.`,
  highlights: [
    'Enterprise Elixir/Phoenix systems at scale',
    'Full-stack from infrastructure to frontend',
    'Complex data migrations and refactoring',
    'Shopify, Stripe, and API integrations',
    'Kubernetes and cloud architecture',
  ],
}

export const ABOUT_DATA: Record<Profession, AboutMe> = {
  engineer: {
    professionId: 'engineer',
    headline: 'Senior Staff Engineer',
    bio: `10+ years building production systems from backend to infrastructure. Architected enterprise platforms handling millions of transactions. From Elixir microservices to Kubernetes clusters, I deliver robust, scalable solutions. Currently leading technical strategy at DBA and two startups.`,
    quickFacts: [
      '10+ years experience',
      'Full-stack + DevOps',
      'CTO × 2',
      'Enterprise scale',
    ],
  },
  drummer: {
    professionId: 'drummer',
    headline: 'Professional Drummer',
    bio: `15 years behind the kit, 7 professional. Trained across rock, metal, latin, and jazz fusion. Currently active in three bands: Eon (prog metal), Sycsemper (metal), and Retrogroove (funk/soul). Studio recording and live touring experience.`,
    quickFacts: [
      '15 years playing',
      '7 years professional',
      '3 active bands',
      'Studio & touring',
    ],
  },
  fighter: {
    professionId: 'fighter',
    headline: 'Martial Arts Instructor',
    bio: `6 years training across Muay Thai, MMA, and Brazilian Jiu-Jitsu. Now instructing and passing on what the mat taught me about discipline, ego, and growth.`,
    quickFacts: [
      'Muay Thai 3y',
      'BJJ 2y',
      'MMA 1y',
      'Instructor',
    ],
  },
}
