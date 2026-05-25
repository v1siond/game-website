// Comprehensive tech stack - no percentages, just categories
// Based on actual repos in /projects

export interface TechCategory {
  name: string
  icon: string
  items: string[]
}

export const TECH_STACK: TechCategory[] = [
  {
    name: 'Languages',
    icon: '💻',
    items: [
      'Elixir',
      'TypeScript',
      'JavaScript',
      'Ruby',
      'Python',
      'C#',
      'C++',
      'PHP',
      'SQL',
      'HTML/CSS',
      'Terraform/HCL',
    ],
  },
  {
    name: 'Backend Frameworks',
    icon: '⚙️',
    items: [
      'Phoenix',
      'Rails',
      'Express',
      'Laravel',
      '.NET',
      'Node.js',
      'Ash Framework',
      'Absinthe (GraphQL)',
    ],
  },
  {
    name: 'Frontend Frameworks',
    icon: '🎨',
    items: [
      'React',
      'Vue.js',
      'Angular',
      'Next.js',
      'Quasar',
      'LiveView',
      'Tailwind CSS',
      'Three.js/WebGL',
    ],
  },
  {
    name: 'Databases',
    icon: '🗄️',
    items: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
      'Elasticsearch',
      'Firebase/Firestore',
    ],
  },
  {
    name: 'Cloud & DevOps',
    icon: '☁️',
    items: [
      'Docker',
      'Kubernetes',
      'Terraform',
      'Google Cloud (GCP)',
      'AWS',
      'Azure (AKS)',
      'Railway',
      'Netlify',
      'GitLab CI/CD',
      'ArgoCD',
      'GitHub Actions',
    ],
  },
  {
    name: 'Integrations & APIs',
    icon: '🔌',
    items: [
      'Shopify API',
      'Stripe',
      'Google Workspace API',
      'Slack API',
      'GraphQL/Apollo',
      'REST APIs',
      'OAuth/Auth0',
      'Sentry',
    ],
  },
  {
    name: 'AI & Automation',
    icon: '🤖',
    items: [
      'Claude/Anthropic API',
      'OpenAI/GPT',
      'Google Gemini',
      'Prompt Engineering',
      'AI-assisted Development',
    ],
  },
]

// Flat list of all technologies for quick reference
export const ALL_TECHNOLOGIES = TECH_STACK.flatMap(cat => cat.items)
