// Portfolio content taken from Cristhian's resume (Oct 2026) and LinkedIn profile.
// Each section is keyed by language code; add or edit entries here to update the site.

export type Lang = 'en' | 'es';

export interface SectionHeading {
  tag: string;
  title: string;
  highlight: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: string;
  project: string;
  highlights: string[];
  stack: string[];
}

export interface EducationItem {
  icon: string;
  title: string;
  school: string;
  period: string;
  desc: string;
}

export interface ProjectItem {
  icon: string;
  name: string;
  context: string;
  desc: string;
  stack: string[];
  url?: string;
}

const STACK = {
  attendance: ['Angular', 'ASP.NET', 'MySQL', 'Microsoft Graph API', 'Docker', 'GitLab CI/CD', 'Jest'],
  banking: ['Progress OpenEdge ABL', 'Linux', 'Bash', 'Salesforce', 'Jira'],
  eprocurement: ['Java', 'JavaScript', 'PostgreSQL', 'Maven', 'Tomcat', 'AWS'],
  materialUi: ['Java', 'JavaScript', 'Material UI', 'Maven', 'Tomcat'],
  applicants: ['Java', 'Spring', 'React.js', 'MySQL', 'SQL Server', 'Firebase'],
  events: ['PHP', 'Laravel', 'Angular', 'TypeScript', 'MySQL'],
  portfolio: ['Angular 20', 'Firebase', 'Firestore', 'Bootstrap', 'GitHub Actions'],
  pygame: ['Python', 'Pygame']
};

export const EXPERIENCE_HEADING: Record<Lang, SectionHeading> = {
  en: { tag: 'Experience', title: 'My Work', highlight: 'Experience' },
  es: { tag: 'Experiencia', title: 'Mi experiencia', highlight: 'laboral' }
};

export const EXPERIENCE: Record<Lang, ExperienceItem[]> = {
  en: [
    {
      role: 'Full Stack Developer',
      company: 'Jalasoft',
      period: '2026 - Present',
      type: 'Full time',
      project: 'Platform that tracks attendance, generates reports and schedules Microsoft Teams and Outlook meetings through the Microsoft Graph API for Jala University students.',
      highlights: [
        'Design and implement UI/UX solutions to present attendance data, reports and attendee status more clearly.',
        'Resolve backend performance issues and refactor legacy code to support new functionality.',
        'Write backend and frontend unit tests and review teammates\' code.',
        'Fix and improve GitLab CI/CD pipelines so build errors are caught early.'
      ],
      stack: STACK.attendance
    },
    {
      role: 'Support Developer',
      company: 'Jalasoft',
      period: '2025 - 2026',
      type: 'Full time',
      project: 'Core banking platform for U.S. credit unions: accounts, loans, online and mobile banking, and debit card processing.',
      highlights: [
        'Developed custom fixes in Progress OpenEdge for the core banking system and debit card processing.',
        'Troubleshot real-time production incidents, including outages and data processing bottlenecks.',
        'Resolved complex escalated issues following a structured reliability process.'
      ],
      stack: STACK.banking
    },
    {
      role: 'Full Stack Developer',
      company: 'Jalasoft',
      period: '2023 - 2024',
      type: 'Full time',
      project: 'Supply chain eProcurement platform for a U.S.-based client: requisitions, purchase orders, change requests and email notifications.',
      highlights: [
        'Collaborated with 50+ developers on a shared codebase split across co-dependent repositories.',
        'Implemented features and fixed bugs in the Requisitions, Purchase Orders and Change Requests module.',
        'Applied database updates across environments and sized new features for the Product Owner.'
      ],
      stack: STACK.eprocurement
    },
    {
      role: 'Junior Software Development Engineer',
      company: 'Jalasoft',
      period: '2021 - 2023',
      type: 'Full time',
      project: 'Same eProcurement platform, focused on its shopping and document interfaces.',
      highlights: [
        'Delivered UI/UX enhancements for interfaces handling currencies, prices, emails and item types.',
        'Migrated legacy components to the new Material UI design.',
        'Built reusable components used to assemble views across multiple modules.'
      ],
      stack: STACK.materialUi
    },
    {
      role: 'Teaching Collaborator',
      company: 'Jala University',
      period: 'Oct 2022 - Apr 2023',
      type: 'Part time',
      project: 'Python course for applicants to Jala University.',
      highlights: [
        'Taught Python fundamentals to applicants.',
        'Built small games with Pygame to apply programming concepts.'
      ],
      stack: STACK.pygame
    },
    {
      role: 'Developer Trainee',
      company: 'Fundación Jala',
      period: 'Mar 2021 - Nov 2021',
      type: 'Scholarship',
      project: 'Applicants tracker: web app to manage scholars and track their performance across Jala Foundation programs.',
      highlights: [
        'Split a legacy app into microservices connected through REST services.',
        'Built an email microservice with templates and the role management CRUD.',
        'Migrated users from SQL Server to MySQL for a Spring identity microservice.'
      ],
      stack: STACK.applicants
    },
    {
      role: 'Web Developer',
      company: 'Creative Concepts International Bolivia',
      period: 'Jan 2020 - Dec 2020',
      type: 'Full time',
      project: 'Web app to promote events in the United Arab Emirates, managing photography, video and event information.',
      highlights: [
        'Designed new UIs for media upload and event search and filtering.',
        'Added comments, search, sorting and filtering following REST best practices.'
      ],
      stack: STACK.events
    },
    {
      role: 'Teaching Assistant',
      company: 'Universidad Mayor de San Andrés',
      period: 'Feb 2019 - Nov 2019',
      type: 'Part time',
      project: 'Information Theory and Coding course for third-year Informatics students.',
      highlights: ['Supported lessons and assessments on coding, decoding and encryption.'],
      stack: []
    }
  ],
  es: [
    {
      role: 'Desarrollador Full Stack',
      company: 'Jalasoft',
      period: '2026 - Actualidad',
      type: 'Tiempo completo',
      project: 'Plataforma que registra asistencia, genera reportes y agenda reuniones de Microsoft Teams y Outlook mediante Microsoft Graph API para estudiantes de Jala University.',
      highlights: [
        'Diseño e implemento soluciones UI/UX para mostrar asistencia, reportes y estado de los asistentes con mayor claridad.',
        'Resuelvo problemas de rendimiento del backend y refactorizo código legado para nuevas funcionalidades.',
        'Escribo pruebas unitarias de backend y frontend y reviso el código del equipo.',
        'Mejoro los pipelines de GitLab CI/CD para detectar errores de build a tiempo.'
      ],
      stack: STACK.attendance
    },
    {
      role: 'Desarrollador de Soporte',
      company: 'Jalasoft',
      period: '2025 - 2026',
      type: 'Tiempo completo',
      project: 'Plataforma de core bancario para cooperativas de crédito de EE. UU.: cuentas, préstamos, banca en línea y móvil, y procesamiento de tarjetas de débito.',
      highlights: [
        'Desarrollé correcciones a medida en Progress OpenEdge para el core bancario y el procesamiento de tarjetas de débito.',
        'Atendí incidentes de producción en tiempo real, incluidas caídas de servidor y cuellos de botella.',
        'Resolví casos escalados complejos siguiendo un proceso estructurado de confiabilidad.'
      ],
      stack: STACK.banking
    },
    {
      role: 'Desarrollador Full Stack',
      company: 'Jalasoft',
      period: '2023 - 2024',
      type: 'Tiempo completo',
      project: 'Plataforma de eProcurement para un cliente de EE. UU.: requisiciones, órdenes de compra, solicitudes de cambio y notificaciones por correo.',
      highlights: [
        'Colaboré con más de 50 desarrolladores en un código compartido entre repositorios interdependientes.',
        'Implementé funcionalidades y corregí errores en el módulo de Requisiciones, Órdenes de Compra y Solicitudes de Cambio.',
        'Apliqué actualizaciones de base de datos entre ambientes y estimé nuevas funcionalidades para el Product Owner.'
      ],
      stack: STACK.eprocurement
    },
    {
      role: 'Ingeniero de Desarrollo de Software Junior',
      company: 'Jalasoft',
      period: '2021 - 2023',
      type: 'Tiempo completo',
      project: 'La misma plataforma de eProcurement, enfocado en sus interfaces de compras y documentos.',
      highlights: [
        'Entregué mejoras de UI/UX en interfaces que manejan monedas, precios, correos y tipos de ítems.',
        'Migré componentes legados al nuevo diseño con Material UI.',
        'Construí componentes reutilizables para armar vistas en varios módulos.'
      ],
      stack: STACK.materialUi
    },
    {
      role: 'Colaborador Docente',
      company: 'Jala University',
      period: 'Oct 2022 - Abr 2023',
      type: 'Medio tiempo',
      project: 'Curso de Python para postulantes a Jala University.',
      highlights: [
        'Enseñé fundamentos de Python a postulantes.',
        'Desarrollé juegos pequeños con Pygame para aplicar conceptos de programación.'
      ],
      stack: STACK.pygame
    },
    {
      role: 'Desarrollador Becario',
      company: 'Fundación Jala',
      period: 'Mar 2021 - Nov 2021',
      type: 'Beca',
      project: 'Applicants tracker: aplicación web para gestionar becarios y su desempeño en los programas de la Fundación Jala.',
      highlights: [
        'Dividí una aplicación legada en microservicios conectados por servicios REST.',
        'Construí un microservicio de correos con plantillas y el CRUD de roles.',
        'Migré usuarios de SQL Server a MySQL para un microservicio de identidad en Spring.'
      ],
      stack: STACK.applicants
    },
    {
      role: 'Desarrollador Web',
      company: 'Creative Concepts International Bolivia',
      period: 'Ene 2020 - Dic 2020',
      type: 'Tiempo completo',
      project: 'Aplicación web para promocionar eventos en Emiratos Árabes Unidos, gestionando fotografía, video e información de eventos.',
      highlights: [
        'Diseñé nuevas interfaces para subir medios y buscar y filtrar eventos.',
        'Agregué comentarios, búsqueda, ordenamiento y filtros siguiendo buenas prácticas REST.'
      ],
      stack: STACK.events
    },
    {
      role: 'Auxiliar de Docencia',
      company: 'Universidad Mayor de San Andrés',
      period: 'Feb 2019 - Nov 2019',
      type: 'Medio tiempo',
      project: 'Materia de Teoría de la Información y Codificación para estudiantes de tercer año de Informática.',
      highlights: ['Apoyé clases y evaluaciones sobre codificación, decodificación y cifrado.'],
      stack: []
    }
  ]
};

export const EDUCATION_HEADING: Record<Lang, SectionHeading> = {
  en: { tag: 'Education', title: 'My education &', highlight: 'learning journey' },
  es: { tag: 'Educación', title: 'Mi formación y', highlight: 'aprendizaje' }
};

export const EDUCATION: Record<Lang, EducationItem[]> = {
  en: [
    {
      icon: 'bi-cpu-fill',
      title: 'MSc in Data Science and Artificial Intelligence',
      school: 'School of Engineering - UAGRM',
      period: '2026 - 2027',
      desc: 'Master\'s candidate covering statistical modeling, Machine Learning, Deep Learning and Big Data.'
    },
    {
      icon: 'bi-book-fill',
      title: 'BSc in Computer Science (Informatics)',
      school: 'Universidad Mayor de San Andrés',
      period: '2013 - 2021',
      desc: 'Outstanding degree project. Teaching assistant in Information Theory and Coding, and student center lead.'
    },
    {
      icon: 'bi-patch-check-fill',
      title: 'Jalasoft Certified Software Development Professional',
      school: 'Fundación Jala',
      period: '2021',
      desc: 'DEV32 program with industry engineers as mentors: software lifecycle, architecture and agile practices.'
    },
    {
      icon: 'bi-globe',
      title: 'Proficiency in English',
      school: 'Centro Boliviano Americano · EF SET C1',
      period: '2009 - 2012',
      desc: 'Diploma of Proficiency with the University of Michigan, plus an EF SET C1 Advanced certificate.'
    }
  ],
  es: [
    {
      icon: 'bi-cpu-fill',
      title: 'Maestría en Ciencia de Datos e Inteligencia Artificial',
      school: 'Facultad de Ingeniería - UAGRM',
      period: '2026 - 2027',
      desc: 'Candidato a maestría: modelado estadístico, Machine Learning, Deep Learning y Big Data.'
    },
    {
      icon: 'bi-book-fill',
      title: 'Licenciatura en Informática',
      school: 'Universidad Mayor de San Andrés',
      period: '2013 - 2021',
      desc: 'Proyecto de grado sobresaliente. Auxiliar de Teoría de la Información y Codificación, y dirigente del centro de estudiantes.'
    },
    {
      icon: 'bi-patch-check-fill',
      title: 'Jalasoft Certified Software Development Professional',
      school: 'Fundación Jala',
      period: '2021',
      desc: 'Programa DEV32 con ingenieros de la industria como mentores: ciclo de vida del software, arquitectura y metodologías ágiles.'
    },
    {
      icon: 'bi-globe',
      title: 'Suficiencia en Inglés',
      school: 'Centro Boliviano Americano · EF SET C1',
      period: '2009 - 2012',
      desc: 'Diploma de suficiencia con la Universidad de Michigan, y certificado EF SET C1 Advanced.'
    }
  ]
};

export const PROJECTS_HEADING: Record<Lang, SectionHeading> = {
  en: { tag: 'My Work', title: 'Featured', highlight: 'Projects' },
  es: { tag: 'Mi trabajo', title: 'Proyectos', highlight: 'destacados' }
};

export const PROJECTS: Record<Lang, ProjectItem[]> = {
  en: [
    {
      icon: 'bi-calendar-check-fill',
      name: 'Attendance & Meetings Platform',
      context: 'Jalasoft · Jala University',
      desc: 'Tracks attendance, generates reports and schedules Teams and Outlook meetings through Microsoft Graph.',
      stack: STACK.attendance
    },
    {
      icon: 'bi-credit-card-fill',
      name: 'Credit Union Core Banking',
      context: 'Jalasoft · U.S. credit unions',
      desc: 'Custom fixes and production support for accounts, loans and debit card processing.',
      stack: STACK.banking
    },
    {
      icon: 'bi-cart-check-fill',
      name: 'eProcurement Platform',
      context: 'Jalasoft · U.S. client',
      desc: 'Requisitions, purchase orders and change requests in a codebase shared by 50+ developers.',
      stack: STACK.eprocurement
    },
    {
      icon: 'bi-people-fill',
      name: 'Applicants Tracker',
      context: 'Fundación Jala',
      desc: 'Microservices app to manage scholars across programs, with an email service and role management.',
      stack: STACK.applicants
    },
    {
      icon: 'bi-camera-reels-fill',
      name: 'Events Media Manager',
      context: 'Creative Concepts · UAE',
      desc: 'Web app to promote events and manage their photography, video and information.',
      stack: STACK.events
    },
    {
      icon: 'bi-journal-code',
      name: 'This Portfolio',
      context: 'Personal project',
      desc: 'Bilingual portfolio with content served from Firestore and automatic deploys to GitHub Pages.',
      stack: STACK.portfolio,
      url: 'https://github.com/CrisOrtiz/crisortiz.github.io'
    }
  ],
  es: [
    {
      icon: 'bi-calendar-check-fill',
      name: 'Plataforma de Asistencia y Reuniones',
      context: 'Jalasoft · Jala University',
      desc: 'Registra asistencia, genera reportes y agenda reuniones de Teams y Outlook con Microsoft Graph.',
      stack: STACK.attendance
    },
    {
      icon: 'bi-credit-card-fill',
      name: 'Core Bancario para Cooperativas',
      context: 'Jalasoft · cooperativas de EE. UU.',
      desc: 'Correcciones a medida y soporte en producción para cuentas, préstamos y tarjetas de débito.',
      stack: STACK.banking
    },
    {
      icon: 'bi-cart-check-fill',
      name: 'Plataforma de eProcurement',
      context: 'Jalasoft · cliente de EE. UU.',
      desc: 'Requisiciones, órdenes de compra y solicitudes de cambio en un código compartido por más de 50 desarrolladores.',
      stack: STACK.eprocurement
    },
    {
      icon: 'bi-people-fill',
      name: 'Applicants Tracker',
      context: 'Fundación Jala',
      desc: 'Aplicación de microservicios para gestionar becarios, con servicio de correos y gestión de roles.',
      stack: STACK.applicants
    },
    {
      icon: 'bi-camera-reels-fill',
      name: 'Gestor de Medios para Eventos',
      context: 'Creative Concepts · EAU',
      desc: 'Aplicación web para promocionar eventos y gestionar su fotografía, video e información.',
      stack: STACK.events
    },
    {
      icon: 'bi-journal-code',
      name: 'Este Portafolio',
      context: 'Proyecto personal',
      desc: 'Portafolio bilingüe con contenido desde Firestore y despliegue automático a GitHub Pages.',
      stack: STACK.portfolio,
      url: 'https://github.com/CrisOrtiz/crisortiz.github.io'
    }
  ]
};

export function pickLang(lang: string | null | undefined): Lang {
  return lang === 'es' ? 'es' : 'en';
}
