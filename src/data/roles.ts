// Current professional roles

export interface Role {
  id: string
  title: string
  company: string
  type: 'employment' | 'leadership'
  current: boolean
  description: string
}

export const CURRENT_ROLES: Role[] = [
  {
    id: 'dba',
    title: 'Senior Staff Engineer',
    company: 'DBA',
    type: 'employment',
    current: true,
    description: 'Enterprise software development for insurance and financial services.',
  },
  {
    id: 'pmx',
    title: 'CTO',
    company: 'PMX',
    type: 'leadership',
    current: true,
    description: 'Leading technical strategy for affiliate marketplace platform.',
  },
  {
    id: 'grctechme',
    title: 'CTO',
    company: 'GRCTechMe',
    type: 'leadership',
    current: true,
    description: 'Building audit and compliance technology for legal professionals.',
  },
]
