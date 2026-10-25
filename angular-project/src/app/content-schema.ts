// Shape of the section documents at content/{lang}/sections/{id}.
// Texts are whole sentences; {name} placeholders are filled in by the site (see fillTemplate).

export interface ContentField {
  key: string;
  list?: boolean;
  hint?: string;
}

export interface ContentSection {
  id: string;
  label: string;
  // Document id used before the content was restructured
  legacyId: string;
  fields: ContentField[];
}

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: 'home',
    label: 'Home',
    legacyId: 'home_section',
    fields: [
      { key: 'greeting' },
      { key: 'headline', hint: 'Text before the animated roles' },
      { key: 'roles', list: true, hint: 'Animated roles, one per line' },
      { key: 'summary', hint: '{years} is replaced with the years of experience' },
      { key: 'cta', hint: 'Label next to the social links' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    legacyId: 'aboutme_section',
    fields: [
      { key: 'title' },
      { key: 'paragraphs', list: true, hint: 'One paragraph per line' },
      { key: 'highlight', hint: 'Closing paragraph shown in bold' },
      { key: 'yearsLabel', hint: 'Label under the years-of-experience counter' },
    ],
  },
  {
    id: 'nav',
    label: 'Menu',
    legacyId: 'header_section',
    fields: [
      { key: 'home' },
      { key: 'about' },
      { key: 'projects' },
      { key: 'education' },
      { key: 'experience' },
      { key: 'contact' },
    ],
  },
];

// Shown until Firestore answers on a first visit, and for any field missing in Firestore
export const CONTENT_DEFAULTS: Record<string, Record<string, Record<string, unknown>>> = {
  en: {
    home: {
      greeting: 'Hey! I am Cristhian',
      headline: 'I am a',
      roles: ['Software Developer'],
      summary: 'Full Stack Developer with {years}+ years of experience building software solutions.',
      cta: 'Contact me',
    },
    about: { yearsLabel: 'Years of experience.' },
    nav: { home: 'Home', about: 'About me', projects: 'Projects', education: 'Education', experience: 'Experience', contact: 'Contact' },
  },
  es: {
    home: {
      greeting: '¡Hola! Soy Cristhian',
      headline: 'Soy',
      roles: ['Desarrollador de Software'],
      summary: 'Desarrollador Full Stack con {years}+ años de experiencia construyendo soluciones de software.',
      cta: 'Contáctame',
    },
    about: { yearsLabel: 'Años de experiencia.' },
    nav: { home: 'Inicio', about: 'Sobre mí', projects: 'Proyectos', education: 'Educación', experience: 'Experiencia', contact: 'Contacto' },
  },
};

export function withDefaults(lang: string, sectionId: string, data: Record<string, unknown> | undefined): Record<string, unknown> {
  return { ...(CONTENT_DEFAULTS[lang]?.[sectionId] ?? {}), ...(data ?? {}) };
}

export function sectionById(id: string): ContentSection | undefined {
  return CONTENT_SECTIONS.find(s => s.id === id);
}

/** Replaces {name} placeholders, e.g. fillTemplate('{years}+ years', { years: 5 }) -> '5+ years'. */
export function fillTemplate(text: string | undefined, vars: Record<string, string | number>): string {
  return (text ?? '').replace(/\{(\w+)\}/g, (match, name) => name in vars ? String(vars[name]) : match);
}

function clean(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== ''));
}

function joinSentence(...parts: unknown[]): string | undefined {
  if (parts.every(p => p === undefined)) return undefined;
  return parts.map(p => (p ?? '') as string).join('').replace(/\s+/g, ' ').trim();
}

/** Converts a document in the old fragmented format (salute, iam, p_1, xp…) to the current one. */
export function migrateLegacy(sectionId: string, d: Record<string, any>): Record<string, unknown> {
  switch (sectionId) {
    case 'home':
      return clean({
        greeting: d['salute'],
        headline: typeof d['iam'] === 'string' ? d['iam'].trim() : undefined,
        roles: d['typedStrings'],
        summary: d['fullstackdev'] !== undefined || d['xpyears'] !== undefined
          ? joinSentence(d['fullstackdev'], '{years}', d['xpyears'])
          : undefined,
        cta: d['contactme'],
      });
    case 'about': {
      const paragraphs = ['p_1', 'p_2', 'p_3'].map(k => d[k]).filter(p => typeof p === 'string' && p.trim());
      return clean({
        title: d['title'],
        paragraphs: paragraphs.length ? paragraphs : undefined,
        highlight: d['p_4'],
        yearsLabel: d['xpYears'],
      });
    }
    case 'nav':
      return clean({
        home: d['home'],
        about: d['aboutme'],
        projects: d['projects'],
        education: d['education'],
        experience: d['xp'],
        contact: d['contact'],
      });
    default:
      return d;
  }
}
