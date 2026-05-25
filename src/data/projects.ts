import { Profession } from '@/contexts/ProfessionContext'

export interface Project {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  impact?: string // Quantified achievement
  professions: Profession[]
  tags: ('work' | 'personal' | 'open-source')[]
  techStack: string[]
  status: 'active' | 'completed' | 'archived'
  featured: boolean
  links?: {
    demo?: string
    github?: string
    site?: string
  }
}

export const PROJECTS_DATA: Project[] = [
  // Featured Work Projects
  {
    id: 'pearson-channels',
    name: 'Pearson Channels',
    slug: 'pearson-channels',
    tagline: 'B2B educational platform acquired by Pearson',
    description: 'Built the complete B2B product at ClutchPrep: full class app with grading, customizable content, and analytics. So successful that Pearson acquired it.',
    impact: 'Product acquired by Pearson; now powers pearson.com/channels',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    status: 'completed',
    featured: true,
    links: {
      site: 'https://www.pearson.com/channels',
    },
  },
  {
    id: 'agencyrocket',
    name: 'AgencyRocket',
    slug: 'agencyrocket',
    tagline: 'Enterprise insurance back-office platform',
    description: 'Full-stack enterprise platform for insurance agencies. Multi-tenant architecture, real-time policy tracking, carrier feed integration, commission calculations.',
    impact: 'Processing thousands of policies daily across multiple carriers',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['Elixir', 'Phoenix', 'GraphQL', 'Vue.js', 'Kubernetes'],
    status: 'active',
    featured: true,
  },
  {
    id: 'securecard-migration',
    name: 'SecureCard Migration',
    slug: 'securecard-migration',
    tagline: 'Multi-million transaction app migration',
    description: 'Migrated all queries from Node.js to Elixir on a banking card platform handling millions of transactions.',
    impact: 'Zero-downtime migration of mission-critical financial system',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['Elixir', 'Node.js', 'PostgreSQL'],
    status: 'completed',
    featured: true,
  },
  {
    id: 'truthsocial',
    name: 'Truth Social',
    slug: 'truthsocial',
    tagline: 'Social media platform - early development',
    description: 'Participated in early-stage development of the Truth Social platform.',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['Ruby', 'Rails', 'PostgreSQL'],
    status: 'completed',
    featured: false,
  },
  {
    id: 'pmx-platform',
    name: 'PMX Platform',
    slug: 'pmx-platform',
    tagline: 'Full affiliate marketing marketplace',
    description: 'Built complete affiliate marketplace with Shopify full integration, payment system, and analytics dashboard. Connects brands with affiliates.',
    impact: 'Live platform with active merchants and affiliates',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['Rails', 'Shopify API', 'Stripe', 'Next.js'],
    status: 'active',
    featured: true,
    links: {
      site: 'https://getpmx.com',
    },
  },
  {
    id: 'auditechme',
    name: 'AuditechMe / GRCTechMe',
    slug: 'auditechme',
    tagline: 'Google Marketplace approved audit system',
    description: 'Built audit platform for lawyers and agencies. Google Workspace integration, multi-role system, phased workflow. Published on Google Marketplace.',
    impact: 'Live on Google Marketplace with active users',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['React', 'Firebase', 'Google AI', 'Google Workspace API'],
    status: 'active',
    featured: true,
    links: {
      site: 'https://grctechme.com/',
    },
  },
  {
    id: 'insuradmin',
    name: 'InsurAdmin',
    slug: 'insuradmin',
    tagline: 'Insurance carrier feeds parser',
    description: 'Full carrier feeds parsing system for insurance data. Handles complex PDF illustrations and data extraction.',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['Ruby', 'Rails', 'PostgreSQL', 'PDF Parsing'],
    status: 'active',
    featured: false,
  },
  {
    id: 'quility-migration',
    name: 'Quility Migration',
    slug: 'quility-migration',
    tagline: 'Large-scale user migration system',
    description: 'Paginated migration system for moving 50k+ users between platforms with validation, rollback, deduplication, and Slack/GCS reporting.',
    impact: '23 test users migrated with 0 failures in production',
    professions: ['engineer'],
    tags: ['work'],
    techStack: ['Elixir', 'Phoenix', 'GCS', 'Slack API'],
    status: 'active',
    featured: false,
  },
  // Personal Projects
  {
    id: 'nebulith',
    name: 'Nebulith Engine',
    slug: 'nebulith',
    tagline: 'Open-source ASCII isometric game engine',
    description: 'Custom game engine for creating isometric worlds using ASCII art. Tile-based rendering, collision detection, procedural generation.',
    professions: ['engineer'],
    tags: ['personal', 'open-source'],
    techStack: ['TypeScript', 'Canvas API', 'Next.js', 'WebGL'],
    status: 'active',
    featured: true,
    links: {
      demo: '/personal-projects/game-engine',
    },
  },
  {
    id: 'eonband-site',
    name: 'Eon Band Website',
    slug: 'eonband',
    tagline: '3D interactive band website',
    description: 'Music site with WebGL 3D creatures, Spotify/YouTube API integration, i18n support, and CMS.',
    professions: ['engineer', 'drummer'],
    tags: ['personal'],
    techStack: ['Next.js', 'Three.js', 'React Three Fiber'],
    status: 'active',
    featured: false,
    links: {
      site: 'http://eonband.net/',
    },
  },
]

export function filterProjectsByProfession(
  projects: Project[],
  profession: Profession | 'all'
): Project[] {
  if (profession === 'all') return projects
  return projects.filter(p => p.professions.includes(profession))
}

export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter(p => p.featured)
}
