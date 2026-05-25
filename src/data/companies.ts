// Companies to promote

export interface Company {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  services: string[]
  icon: string
}

export const COMPANIES: Company[] = [
  {
    id: 'dba',
    name: 'DBA Consulting',
    tagline: 'Enterprise Software Solutions',
    description: 'Custom software development, system architecture, and technical consulting for businesses of all sizes.',
    url: 'https://dbadbadba.com/',
    services: [
      'Custom Software Development',
      'System Architecture',
      'Technical Consulting',
      'Cloud Infrastructure',
    ],
    icon: '🏢',
  },
  {
    id: 'pmx',
    name: 'PMX',
    tagline: 'Affiliate Marketplace for E-commerce',
    description: 'Full marketing affiliates platform with payment system and Shopify integration. Connect brands with affiliates seamlessly.',
    url: 'https://getpmx.com',
    services: [
      'Shopify Integration',
      'Affiliate Management',
      'Payment Processing',
      'Analytics Dashboard',
    ],
    icon: '🛒',
  },
  {
    id: 'grctechme',
    name: 'GRCTechMe',
    tagline: 'Audit & Compliance Technology',
    description: 'Digital audit platform for lawyers and agencies. Google Marketplace approved. Streamline compliance workflows.',
    url: 'https://grctechme.com/',
    services: [
      'Digital Audits',
      'Compliance Management',
      'Google Workspace Integration',
      'Automated Reporting',
    ],
    icon: '📋',
  },
]
