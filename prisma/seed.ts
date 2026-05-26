import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting CV seed...')

  // Clear existing CV data
  await prisma.technology.deleteMany()
  await prisma.techCategory.deleteMany()
  await prisma.project.deleteMany()
  await prisma.workExperience.deleteMany()
  await prisma.company.deleteMany()
  await prisma.band.deleteMany()
  await prisma.role.deleteMany()
  await prisma.aboutMe.deleteMany()
  await prisma.professionalSummary.deleteMany()

  // Seed Professional Summary
  await prisma.professionalSummary.create({
    data: {
      headline: 'Senior Staff Engineer | CTO | Full-Stack Architect',
      tagline: 'If you need to build it, I can deliver it.',
      bio: `10+ years architecting and delivering production systems across the full stack. From migrating multi-million transaction apps to building complete SaaS platforms from scratch. I've helped build Truth Social in its early stages, created enterprise insurance platforms processing thousands of policies daily, and shipped a Google Marketplace-approved audit system. Currently Senior Staff Engineer at DBA and CTO of two startups. I specialize in turning complex requirements into working software.`,
      highlights: [
        'Enterprise Elixir/Phoenix systems at scale',
        'Full-stack from infrastructure to frontend',
        'Complex data migrations and refactoring',
        'Shopify, Stripe, and API integrations',
        'Kubernetes and cloud architecture',
      ],
      // Spanish translations
      headline_es: 'Ingeniero Staff Senior | CTO | Arquitecto Full-Stack',
      tagline_es: 'Si necesitas construirlo, puedo entregarlo.',
      bio_es: `Mas de 10 anos arquitecturando y entregando sistemas de produccion en todo el stack. Desde migrar aplicaciones de millones de transacciones hasta construir plataformas SaaS completas desde cero. Ayude a construir Truth Social en sus primeras etapas, cree plataformas de seguros empresariales que procesan miles de polizas diariamente, y lance un sistema de auditoria aprobado en Google Marketplace. Actualmente Ingeniero Staff Senior en DBA y CTO de dos startups. Me especializo en convertir requisitos complejos en software funcional.`,
      highlights_es: [
        'Sistemas empresariales Elixir/Phoenix a escala',
        'Full-stack desde infraestructura hasta frontend',
        'Migraciones de datos complejas y refactorizacion',
        'Integraciones con Shopify, Stripe y APIs',
        'Kubernetes y arquitectura en la nube',
      ],
      // Italian translations
      headline_it: 'Staff Engineer Senior | CTO | Architetto Full-Stack',
      tagline_it: 'Se hai bisogno di costruirlo, posso realizzarlo.',
      bio_it: `Oltre 10 anni di esperienza nella progettazione e consegna di sistemi in produzione su tutto lo stack. Dalla migrazione di applicazioni con milioni di transazioni alla costruzione di piattaforme SaaS complete da zero. Ho contribuito a costruire Truth Social nelle sue prime fasi, creato piattaforme assicurative aziendali che elaborano migliaia di polizze al giorno, e lanciato un sistema di audit approvato su Google Marketplace. Attualmente Staff Engineer Senior presso DBA e CTO di due startup. Mi specializzo nel trasformare requisiti complessi in software funzionante.`,
      highlights_it: [
        'Sistemi aziendali Elixir/Phoenix su larga scala',
        'Full-stack dalla infrastruttura al frontend',
        'Migrazioni di dati complesse e refactoring',
        'Integrazioni con Shopify, Stripe e API',
        'Kubernetes e architettura cloud',
      ],
    },
  })

  // Seed About Me sections
  await prisma.aboutMe.createMany({
    data: [
      {
        professionId: 'engineer',
        headline: 'Senior Staff Engineer',
        bio: `10+ years building production systems from backend to infrastructure. Architected enterprise platforms handling millions of transactions. From Elixir microservices to Kubernetes clusters, I deliver robust, scalable solutions. Currently leading technical strategy at DBA and two startups.`,
        quickFacts: ['10+ years experience', 'Full-stack + DevOps', 'CTO x 2', 'Enterprise scale'],
        headline_es: 'Ingeniero Staff Senior',
        bio_es: `Mas de 10 anos construyendo sistemas de produccion desde backend hasta infraestructura. Arquitecte plataformas empresariales que manejan millones de transacciones. Desde microservicios Elixir hasta clusters Kubernetes, entrego soluciones robustas y escalables. Actualmente liderando estrategia tecnica en DBA y dos startups.`,
        quickFacts_es: ['10+ anos de experiencia', 'Full-stack + DevOps', 'CTO x 2', 'Escala empresarial'],
        headline_it: 'Staff Engineer Senior',
        bio_it: `Oltre 10 anni di costruzione di sistemi in produzione dal backend all\'infrastruttura. Ho progettato piattaforme aziendali che gestiscono milioni di transazioni. Dai microservizi Elixir ai cluster Kubernetes, fornisco soluzioni robuste e scalabili. Attualmente guido la strategia tecnica presso DBA e due startup.`,
        quickFacts_it: ['10+ anni di esperienza', 'Full-stack + DevOps', 'CTO x 2', 'Scala aziendale'],
      },
      {
        professionId: 'drummer',
        headline: 'Professional Drummer',
        bio: `15 years behind the kit, 7 professional. Trained across rock, metal, latin, and jazz fusion. Currently active in three bands: Eon (prog metal), Sycsemper (metal), and Retrogroove (funk/soul). Studio recording and live touring experience.`,
        quickFacts: ['15 years playing', '7 years professional', '3 active bands', 'Studio & touring'],
        headline_es: 'Baterista Profesional',
        bio_es: `15 anos detras de la bateria, 7 profesionales. Entrenado en rock, metal, latin y jazz fusion. Actualmente activo en tres bandas: Eon (prog metal), Sycsemper (metal) y Retrogroove (funk/soul). Experiencia en grabacion de estudio y giras.`,
        quickFacts_es: ['15 anos tocando', '7 anos profesional', '3 bandas activas', 'Estudio y giras'],
        headline_it: 'Batterista Professionista',
        bio_it: `15 anni dietro la batteria, 7 professionali. Formato in rock, metal, latin e jazz fusion. Attualmente attivo in tre band: Eon (prog metal), Sycsemper (metal) e Retrogroove (funk/soul). Esperienza in registrazione in studio e tour.`,
        quickFacts_it: ['15 anni di pratica', '7 anni professionali', '3 band attive', 'Studio e tour'],
      },
      {
        professionId: 'fighter',
        headline: 'Martial Arts Instructor',
        bio: `6 years training across Muay Thai, MMA, and Brazilian Jiu-Jitsu. Now instructing and passing on what the mat taught me about discipline, ego, and growth.`,
        quickFacts: ['Muay Thai 3y', 'BJJ 2y', 'MMA 1y', 'Instructor'],
        headline_es: 'Instructor de Artes Marciales',
        bio_es: `6 anos entrenando Muay Thai, MMA y Jiu-Jitsu Brasileno. Ahora instruyendo y transmitiendo lo que la colchoneta me enseno sobre disciplina, ego y crecimiento.`,
        quickFacts_es: ['Muay Thai 3a', 'BJJ 2a', 'MMA 1a', 'Instructor'],
        headline_it: 'Istruttore di Arti Marziali',
        bio_it: `6 anni di allenamento tra Muay Thai, MMA e Jiu-Jitsu Brasiliano. Ora insegno e trasmetto cio che il tatami mi ha insegnato su disciplina, ego e crescita.`,
        quickFacts_it: ['Muay Thai 3a', 'BJJ 2a', 'MMA 1a', 'Istruttore'],
      },
    ],
  })

  // Seed Current Roles
  await prisma.role.createMany({
    data: [
      {
        slug: 'dba',
        title: 'Senior Staff Engineer',
        company: 'DBA',
        type: 'employment',
        current: true,
        description: 'Enterprise software development for insurance and financial services.',
        order: 0,
        title_es: 'Ingeniero Staff Senior',
        description_es: 'Desarrollo de software empresarial para seguros y servicios financieros.',
        title_it: 'Staff Engineer Senior',
        description_it: 'Sviluppo software aziendale per assicurazioni e servizi finanziari.',
      },
      {
        slug: 'pmx',
        title: 'CTO',
        company: 'PMX',
        type: 'leadership',
        current: true,
        description: 'Leading technical strategy for affiliate marketplace platform.',
        order: 1,
        title_es: 'CTO',
        description_es: 'Liderando la estrategia tecnica para plataforma de marketplace de afiliados.',
        title_it: 'CTO',
        description_it: 'Guida della strategia tecnica per piattaforma marketplace affiliati.',
      },
      {
        slug: 'grctechme',
        title: 'CTO',
        company: 'GRCTechMe',
        type: 'leadership',
        current: true,
        description: 'Building audit and compliance technology for legal professionals.',
        order: 2,
        title_es: 'CTO',
        description_es: 'Construyendo tecnologia de auditoria y cumplimiento para profesionales legales.',
        title_it: 'CTO',
        description_it: 'Costruzione di tecnologie di audit e compliance per professionisti legali.',
      },
    ],
  })

  // Seed Companies
  await prisma.company.createMany({
    data: [
      {
        slug: 'dba',
        name: 'DBA Consulting',
        tagline: 'Enterprise Software Solutions',
        description: 'Custom software development, system architecture, and technical consulting for businesses of all sizes.',
        url: 'https://dbadbadba.com/',
        services: ['Custom Software Development', 'System Architecture', 'Technical Consulting', 'Cloud Infrastructure'],
        icon: '🏢',
        order: 0,
        tagline_es: 'Soluciones de Software Empresarial',
        description_es: 'Desarrollo de software personalizado, arquitectura de sistemas y consultoria tecnica para empresas de todos los tamanos.',
        services_es: ['Desarrollo de Software Personalizado', 'Arquitectura de Sistemas', 'Consultoria Tecnica', 'Infraestructura en la Nube'],
        tagline_it: 'Soluzioni Software Aziendali',
        description_it: 'Sviluppo software personalizzato, architettura di sistemi e consulenza tecnica per aziende di tutte le dimensioni.',
        services_it: ['Sviluppo Software Personalizzato', 'Architettura di Sistemi', 'Consulenza Tecnica', 'Infrastruttura Cloud'],
      },
      {
        slug: 'pmx',
        name: 'PMX',
        tagline: 'Affiliate Marketplace for E-commerce',
        description: 'Full marketing affiliates platform with payment system and Shopify integration. Connect brands with affiliates seamlessly.',
        url: 'https://getpmx.com',
        services: ['Shopify Integration', 'Affiliate Management', 'Payment Processing', 'Analytics Dashboard'],
        icon: '🛒',
        order: 1,
        tagline_es: 'Marketplace de Afiliados para E-commerce',
        description_es: 'Plataforma completa de afiliados de marketing con sistema de pagos e integracion con Shopify. Conecta marcas con afiliados sin problemas.',
        services_es: ['Integracion con Shopify', 'Gestion de Afiliados', 'Procesamiento de Pagos', 'Panel de Analiticas'],
        tagline_it: 'Marketplace Affiliati per E-commerce',
        description_it: 'Piattaforma completa di affiliati marketing con sistema di pagamento e integrazione Shopify. Connetti brand con affiliati senza problemi.',
        services_it: ['Integrazione Shopify', 'Gestione Affiliati', 'Elaborazione Pagamenti', 'Dashboard Analytics'],
      },
      {
        slug: 'grctechme',
        name: 'GRCTechMe',
        tagline: 'Audit & Compliance Technology',
        description: 'Digital audit platform for lawyers and agencies. Google Marketplace approved. Streamline compliance workflows.',
        url: 'https://grctechme.com/',
        services: ['Digital Audits', 'Compliance Management', 'Google Workspace Integration', 'Automated Reporting'],
        icon: '📋',
        order: 2,
        tagline_es: 'Tecnologia de Auditoria y Cumplimiento',
        description_es: 'Plataforma digital de auditoria para abogados y agencias. Aprobada en Google Marketplace. Optimiza flujos de trabajo de cumplimiento.',
        services_es: ['Auditorias Digitales', 'Gestion de Cumplimiento', 'Integracion con Google Workspace', 'Reportes Automatizados'],
        tagline_it: 'Tecnologia di Audit e Compliance',
        description_it: 'Piattaforma di audit digitale per avvocati e agenzie. Approvata su Google Marketplace. Semplifica i flussi di lavoro di compliance.',
        services_it: ['Audit Digitali', 'Gestione Compliance', 'Integrazione Google Workspace', 'Reportistica Automatizzata'],
      },
    ],
  })

  // Seed Bands
  await prisma.band.createMany({
    data: [
      {
        slug: 'eon',
        name: 'Eon',
        genre: 'Progressive Metal',
        role: 'Drummer',
        url: 'http://eonband.net/',
        active: true,
        description: 'Progressive metal with complex time signatures and atmospheric soundscapes.',
        order: 0,
        description_es: 'Metal progresivo con compases complejos y paisajes sonoros atmosfericos.',
        description_it: 'Metal progressivo con tempi complessi e paesaggi sonori atmosferici.',
      },
      {
        slug: 'sycsemper',
        name: 'Sycsemper',
        genre: 'Metal',
        role: 'Drummer',
        url: null,
        active: true,
        description: 'Heavy metal project exploring darker sonic territories.',
        order: 1,
        description_es: 'Proyecto de heavy metal explorando territorios sonicos mas oscuros.',
        description_it: 'Progetto heavy metal che esplora territori sonori piu oscuri.',
      },
      {
        slug: 'retrogroove',
        name: 'Retrogroove',
        genre: 'Funk/Soul',
        role: 'Drummer',
        url: 'https://retrogrooveband.netlify.app/',
        active: true,
        description: 'Funk and soul covers with a modern twist. Groove is everything.',
        order: 2,
        description_es: 'Covers de funk y soul con un toque moderno. El groove es todo.',
        description_it: 'Cover funk e soul con un tocco moderno. Il groove e tutto.',
      },
    ],
  })

  // Seed Projects
  await prisma.project.createMany({
    data: [
      {
        slug: 'pearson-channels',
        name: 'Pearson Channels',
        tagline: 'B2B educational platform acquired by Pearson',
        description: 'Built the complete B2B product at ClutchPrep: full class app with grading, customizable content, and analytics. So successful that Pearson acquired it.',
        impact: 'Product acquired by Pearson; now powers pearson.com/channels',
        professions: ['engineer'],
        tags: ['work'],
        techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        status: 'completed',
        featured: true,
        links: { site: 'https://www.pearson.com/channels' },
        order: 0,
        tagline_es: 'Plataforma educativa B2B adquirida por Pearson',
        description_es: 'Construi el producto B2B completo en ClutchPrep: aplicacion de clases completa con calificaciones, contenido personalizable y analiticas. Tan exitoso que Pearson lo adquirio.',
        impact_es: 'Producto adquirido por Pearson; ahora alimenta pearson.com/channels',
        tagline_it: 'Piattaforma educativa B2B acquisita da Pearson',
        description_it: 'Ho costruito il prodotto B2B completo in ClutchPrep: app completa per classi con valutazioni, contenuto personalizzabile e analytics. Cosi di successo che Pearson l\'ha acquisita.',
        impact_it: 'Prodotto acquisito da Pearson; ora alimenta pearson.com/channels',
      },
      {
        slug: 'agencyrocket',
        name: 'AgencyRocket',
        tagline: 'Enterprise insurance back-office platform',
        description: 'Full-stack enterprise platform for insurance agencies. Multi-tenant architecture, real-time policy tracking, carrier feed integration, commission calculations.',
        impact: 'Processing thousands of policies daily across multiple carriers',
        professions: ['engineer'],
        tags: ['work'],
        techStack: ['Elixir', 'Phoenix', 'GraphQL', 'Vue.js', 'Kubernetes'],
        status: 'active',
        featured: true,
        links: undefined,
        order: 1,
        tagline_es: 'Plataforma de back-office empresarial para seguros',
        description_es: 'Plataforma empresarial full-stack para agencias de seguros. Arquitectura multi-inquilino, seguimiento de polizas en tiempo real, integracion con feeds de aseguradoras, calculos de comisiones.',
        impact_es: 'Procesando miles de polizas diariamente a traves de multiples aseguradoras',
        tagline_it: 'Piattaforma back-office aziendale per assicurazioni',
        description_it: 'Piattaforma aziendale full-stack per agenzie assicurative. Architettura multi-tenant, tracciamento polizze in tempo reale, integrazione feed assicuratori, calcoli commissioni.',
        impact_it: 'Elaborando migliaia di polizze giornalmente attraverso piu assicuratori',
      },
      {
        slug: 'securecard-migration',
        name: 'SecureCard Migration',
        tagline: 'Multi-million transaction app migration',
        description: 'Migrated all queries from Node.js to Elixir on a banking card platform handling millions of transactions.',
        impact: 'Zero-downtime migration of mission-critical financial system',
        professions: ['engineer'],
        tags: ['work'],
        techStack: ['Elixir', 'Node.js', 'PostgreSQL'],
        status: 'completed',
        featured: true,
        links: undefined,
        order: 2,
        tagline_es: 'Migracion de app con millones de transacciones',
        description_es: 'Migre todas las consultas de Node.js a Elixir en una plataforma de tarjetas bancarias que maneja millones de transacciones.',
        impact_es: 'Migracion sin tiempo de inactividad de sistema financiero critico',
        tagline_it: 'Migrazione app con milioni di transazioni',
        description_it: 'Ho migrato tutte le query da Node.js a Elixir su una piattaforma di carte bancarie che gestisce milioni di transazioni.',
        impact_it: 'Migrazione zero-downtime di sistema finanziario mission-critical',
      },
      {
        slug: 'truthsocial',
        name: 'Truth Social',
        tagline: 'Social media platform - early development',
        description: 'Participated in early-stage development of the Truth Social platform.',
        impact: undefined,
        professions: ['engineer'],
        tags: ['work'],
        techStack: ['Ruby', 'Rails', 'PostgreSQL'],
        status: 'completed',
        featured: false,
        links: undefined,
        order: 3,
        tagline_es: 'Plataforma de redes sociales - desarrollo inicial',
        description_es: 'Participe en el desarrollo de etapa inicial de la plataforma Truth Social.',
        tagline_it: 'Piattaforma social media - sviluppo iniziale',
        description_it: 'Ho partecipato allo sviluppo iniziale della piattaforma Truth Social.',
      },
      {
        slug: 'pmx-platform',
        name: 'PMX Platform',
        tagline: 'Full affiliate marketing marketplace',
        description: 'Built complete affiliate marketplace with Shopify full integration, payment system, and analytics dashboard. Connects brands with affiliates.',
        impact: 'Live platform with active merchants and affiliates',
        professions: ['engineer'],
        tags: ['work'],
        techStack: ['Rails', 'Shopify API', 'Stripe', 'Next.js'],
        status: 'active',
        featured: true,
        links: { site: 'https://getpmx.com' },
        order: 4,
        tagline_es: 'Marketplace completo de marketing de afiliados',
        description_es: 'Construi un marketplace de afiliados completo con integracion total con Shopify, sistema de pagos y panel de analiticas. Conecta marcas con afiliados.',
        impact_es: 'Plataforma en vivo con comerciantes y afiliados activos',
        tagline_it: 'Marketplace completo di affiliate marketing',
        description_it: 'Ho costruito un marketplace affiliati completo con integrazione Shopify totale, sistema di pagamento e dashboard analytics. Connette brand con affiliati.',
        impact_it: 'Piattaforma live con merchant e affiliati attivi',
      },
      {
        slug: 'auditechme',
        name: 'AuditechMe / GRCTechMe',
        tagline: 'Google Marketplace approved audit system',
        description: 'Built audit platform for lawyers and agencies. Google Workspace integration, multi-role system, phased workflow. Published on Google Marketplace.',
        impact: 'Live on Google Marketplace with active users',
        professions: ['engineer'],
        tags: ['work'],
        techStack: ['React', 'Firebase', 'Google AI', 'Google Workspace API'],
        status: 'active',
        featured: true,
        links: { site: 'https://grctechme.com/' },
        order: 5,
        tagline_es: 'Sistema de auditoria aprobado por Google Marketplace',
        description_es: 'Construi plataforma de auditoria para abogados y agencias. Integracion con Google Workspace, sistema multi-rol, flujo de trabajo por fases. Publicado en Google Marketplace.',
        impact_es: 'En vivo en Google Marketplace con usuarios activos',
        tagline_it: 'Sistema di audit approvato su Google Marketplace',
        description_it: 'Ho costruito una piattaforma di audit per avvocati e agenzie. Integrazione Google Workspace, sistema multi-ruolo, workflow a fasi. Pubblicato su Google Marketplace.',
        impact_it: 'Live su Google Marketplace con utenti attivi',
      },
      {
        slug: 'nebulith',
        name: 'Nebulith Engine',
        tagline: 'Open-source ASCII isometric game engine',
        description: 'Custom game engine for creating isometric worlds using ASCII art. Tile-based rendering, collision detection, procedural generation.',
        impact: undefined,
        professions: ['engineer'],
        tags: ['personal', 'open-source'],
        techStack: ['TypeScript', 'Canvas API', 'Next.js', 'WebGL'],
        status: 'active',
        featured: true,
        links: { demo: '/personal-projects/game-engine' },
        order: 6,
        tagline_es: 'Motor de juego isometrico ASCII de codigo abierto',
        description_es: 'Motor de juego personalizado para crear mundos isometricos usando arte ASCII. Renderizado basado en tiles, deteccion de colisiones, generacion procedural.',
        tagline_it: 'Motore di gioco isometrico ASCII open-source',
        description_it: 'Motore di gioco personalizzato per creare mondi isometrici usando arte ASCII. Rendering basato su tile, rilevamento collisioni, generazione procedurale.',
      },
    ],
  })

  // Seed Tech Categories and Technologies
  const techCategories = [
    {
      name: 'Languages',
      icon: '💻',
      order: 0,
      name_es: 'Lenguajes',
      name_it: 'Linguaggi',
      items: ['Elixir', 'TypeScript', 'JavaScript', 'Ruby', 'Python', 'C#', 'C++', 'PHP', 'SQL', 'HTML/CSS', 'Terraform/HCL'],
    },
    {
      name: 'Backend Frameworks',
      icon: '⚙️',
      order: 1,
      name_es: 'Frameworks Backend',
      name_it: 'Framework Backend',
      items: ['Phoenix', 'Rails', 'Express', 'Laravel', '.NET', 'Node.js', 'Ash Framework', 'Absinthe (GraphQL)'],
    },
    {
      name: 'Frontend Frameworks',
      icon: '🎨',
      order: 2,
      name_es: 'Frameworks Frontend',
      name_it: 'Framework Frontend',
      items: ['React', 'Vue.js', 'Angular', 'Next.js', 'Quasar', 'LiveView', 'Tailwind CSS', 'Three.js/WebGL'],
    },
    {
      name: 'Databases',
      icon: '🗄️',
      order: 3,
      name_es: 'Bases de Datos',
      name_it: 'Database',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase/Firestore'],
    },
    {
      name: 'Cloud & DevOps',
      icon: '☁️',
      order: 4,
      name_es: 'Nube y DevOps',
      name_it: 'Cloud e DevOps',
      items: ['Docker', 'Kubernetes', 'Terraform', 'Google Cloud (GCP)', 'AWS', 'Azure (AKS)', 'Railway', 'Netlify', 'GitLab CI/CD', 'ArgoCD', 'GitHub Actions'],
    },
    {
      name: 'Integrations & APIs',
      icon: '🔌',
      order: 5,
      name_es: 'Integraciones y APIs',
      name_it: 'Integrazioni e API',
      items: ['Shopify API', 'Stripe', 'Google Workspace API', 'Slack API', 'GraphQL/Apollo', 'REST APIs', 'OAuth/Auth0', 'Sentry'],
    },
    {
      name: 'AI & Automation',
      icon: '🤖',
      order: 6,
      name_es: 'IA y Automatizacion',
      name_it: 'IA e Automazione',
      items: ['Claude/Anthropic API', 'OpenAI/GPT', 'Google Gemini', 'Prompt Engineering', 'AI-assisted Development'],
    },
  ]

  for (const category of techCategories) {
    const { items, ...categoryData } = category
    const created = await prisma.techCategory.create({
      data: categoryData,
    })

    await prisma.technology.createMany({
      data: items.map((name, index) => ({
        name,
        categoryId: created.id,
        order: index,
      })),
    })
  }

  // Seed Work Experience
  await prisma.workExperience.createMany({
    data: [
      {
        title: 'Senior Staff Engineer',
        company: 'DBA Consulting',
        description: 'Leading enterprise software development for insurance and financial services.',
        startDate: new Date('2020-01-01'),
        endDate: null,
        current: true,
        highlights: [
          'Architected and delivered enterprise insurance platform processing thousands of policies daily',
          'Led large-scale user migration system for 50k+ users with zero-downtime deployment',
          'Built multi-tenant SaaS architecture with real-time policy tracking and carrier integration',
          'Implemented GraphQL APIs with Elixir/Phoenix and Vue.js frontends',
        ],
        skills: ['Elixir', 'Phoenix', 'Vue.js', 'Kubernetes', 'PostgreSQL', 'GraphQL'],
        order: 0,
        title_es: 'Ingeniero Staff Senior',
        description_es: 'Liderando desarrollo de software empresarial para seguros y servicios financieros.',
        highlights_es: [
          'Arquitecte y entregue plataforma de seguros empresarial procesando miles de polizas diariamente',
          'Lidere sistema de migracion de usuarios a gran escala para 50k+ usuarios con despliegue sin tiempo de inactividad',
          'Construi arquitectura SaaS multi-inquilino con seguimiento de polizas en tiempo real e integracion con aseguradoras',
          'Implemente APIs GraphQL con Elixir/Phoenix y frontends Vue.js',
        ],
        title_it: 'Staff Engineer Senior',
        description_it: 'Guida dello sviluppo software aziendale per assicurazioni e servizi finanziari.',
        highlights_it: [
          'Ho progettato e consegnato una piattaforma assicurativa aziendale che elabora migliaia di polizze al giorno',
          'Ho guidato un sistema di migrazione utenti su larga scala per 50k+ utenti con deployment zero-downtime',
          'Ho costruito un\'architettura SaaS multi-tenant con tracciamento polizze in tempo reale e integrazione assicuratori',
          'Ho implementato API GraphQL con Elixir/Phoenix e frontend Vue.js',
        ],
      },
      {
        title: 'CTO & Co-Founder',
        company: 'PMX',
        description: 'Leading technical strategy for affiliate marketplace platform.',
        startDate: new Date('2022-01-01'),
        endDate: null,
        current: true,
        highlights: [
          'Built complete affiliate marketing marketplace with Shopify full integration',
          'Implemented payment processing with Stripe, commission tracking, and analytics',
          'Led product strategy and technical architecture decisions',
        ],
        skills: ['Rails', 'Next.js', 'Shopify API', 'Stripe', 'PostgreSQL'],
        order: 1,
        title_es: 'CTO y Co-Fundador',
        description_es: 'Liderando estrategia tecnica para plataforma de marketplace de afiliados.',
        highlights_es: [
          'Construi marketplace completo de marketing de afiliados con integracion total con Shopify',
          'Implemente procesamiento de pagos con Stripe, seguimiento de comisiones y analiticas',
          'Lidere estrategia de producto y decisiones de arquitectura tecnica',
        ],
        title_it: 'CTO e Co-Fondatore',
        description_it: 'Guida della strategia tecnica per piattaforma marketplace affiliati.',
        highlights_it: [
          'Ho costruito un marketplace completo di affiliate marketing con integrazione Shopify totale',
          'Ho implementato l\'elaborazione pagamenti con Stripe, tracciamento commissioni e analytics',
          'Ho guidato la strategia di prodotto e le decisioni di architettura tecnica',
        ],
      },
      {
        title: 'CTO & Co-Founder',
        company: 'GRCTechMe',
        description: 'Building audit and compliance technology for legal professionals.',
        startDate: new Date('2023-01-01'),
        endDate: null,
        current: true,
        highlights: [
          'Built audit platform approved for Google Marketplace',
          'Integrated Google Workspace API for seamless enterprise workflow',
          'Implemented AI-powered document analysis and compliance reporting',
        ],
        skills: ['React', 'Firebase', 'Google Workspace API', 'Google AI'],
        order: 2,
        title_es: 'CTO y Co-Fundador',
        description_es: 'Construyendo tecnologia de auditoria y cumplimiento para profesionales legales.',
        highlights_es: [
          'Construi plataforma de auditoria aprobada para Google Marketplace',
          'Integre Google Workspace API para flujo de trabajo empresarial sin problemas',
          'Implemente analisis de documentos impulsado por IA y reportes de cumplimiento',
        ],
        title_it: 'CTO e Co-Fondatore',
        description_it: 'Costruzione di tecnologie di audit e compliance per professionisti legali.',
        highlights_it: [
          'Ho costruito una piattaforma di audit approvata per Google Marketplace',
          'Ho integrato Google Workspace API per un workflow aziendale senza problemi',
          'Ho implementato analisi documenti alimentata da IA e reportistica compliance',
        ],
      },
      {
        title: 'Senior Software Engineer',
        company: 'ClutchPrep (acquired by Pearson)',
        description: 'Full-stack development for educational technology platform.',
        startDate: new Date('2018-01-01'),
        endDate: new Date('2020-01-01'),
        current: false,
        highlights: [
          'Built B2B educational platform that was acquired by Pearson',
          'Developed full class application with grading, customizable content, and analytics',
          'Product now powers pearson.com/channels',
        ],
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        order: 3,
        title_es: 'Ingeniero de Software Senior',
        description_es: 'Desarrollo full-stack para plataforma de tecnologia educativa.',
        highlights_es: [
          'Construi plataforma educativa B2B que fue adquirida por Pearson',
          'Desarrolle aplicacion de clases completa con calificaciones, contenido personalizable y analiticas',
          'El producto ahora alimenta pearson.com/channels',
        ],
        title_it: 'Ingegnere Software Senior',
        description_it: 'Sviluppo full-stack per piattaforma di tecnologia educativa.',
        highlights_it: [
          'Ho costruito una piattaforma educativa B2B acquisita da Pearson',
          'Ho sviluppato un\'applicazione completa per classi con valutazioni, contenuto personalizzabile e analytics',
          'Il prodotto ora alimenta pearson.com/channels',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'SecureCard Financial',
        description: 'Backend development for financial services platform.',
        startDate: new Date('2016-01-01'),
        endDate: new Date('2018-01-01'),
        current: false,
        highlights: [
          'Migrated mission-critical banking application from Node.js to Elixir',
          'Zero-downtime migration of system handling millions of transactions',
          'Improved system performance and reliability',
        ],
        skills: ['Elixir', 'Node.js', 'PostgreSQL'],
        order: 4,
        title_es: 'Ingeniero de Software',
        description_es: 'Desarrollo backend para plataforma de servicios financieros.',
        highlights_es: [
          'Migre aplicacion bancaria critica de Node.js a Elixir',
          'Migracion sin tiempo de inactividad de sistema que maneja millones de transacciones',
          'Mejore el rendimiento y confiabilidad del sistema',
        ],
        title_it: 'Ingegnere Software',
        description_it: 'Sviluppo backend per piattaforma di servizi finanziari.',
        highlights_it: [
          'Ho migrato un\'applicazione bancaria mission-critical da Node.js a Elixir',
          'Migrazione zero-downtime di un sistema che gestisce milioni di transazioni',
          'Ho migliorato le prestazioni e l\'affidabilita del sistema',
        ],
      },
      {
        title: 'Software Developer',
        company: 'Various Contracts & Projects',
        description: 'Full-stack development across various technologies.',
        startDate: new Date('2014-01-01'),
        endDate: new Date('2016-01-01'),
        current: false,
        highlights: [
          'Participated in early-stage development of Truth Social platform',
          'Built custom web applications for small businesses',
          'Full-stack development across Ruby, PHP, and JavaScript',
        ],
        skills: ['Ruby', 'PHP', 'JavaScript', 'MySQL'],
        order: 5,
        title_es: 'Desarrollador de Software',
        description_es: 'Desarrollo full-stack a traves de varias tecnologias.',
        highlights_es: [
          'Participe en el desarrollo de etapa inicial de la plataforma Truth Social',
          'Construi aplicaciones web personalizadas para pequenas empresas',
          'Desarrollo full-stack en Ruby, PHP y JavaScript',
        ],
        title_it: 'Sviluppatore Software',
        description_it: 'Sviluppo full-stack attraverso varie tecnologie.',
        highlights_it: [
          'Ho partecipato allo sviluppo iniziale della piattaforma Truth Social',
          'Ho costruito applicazioni web personalizzate per piccole imprese',
          'Sviluppo full-stack in Ruby, PHP e JavaScript',
        ],
      },
    ],
  })

  console.log('CV seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
