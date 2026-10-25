import { describe, expect, it } from '@jest/globals';
import { fillTemplate, migrateLegacy, withDefaults } from './content-schema';

describe('content schema', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(fillTemplate('With {years}+ years {x}', { years: 6 })).toBe('With 6+ years {x}');
    expect(fillTemplate(undefined, {})).toBe('');
  });

  it('migrates the old home fragments into whole sentences', () => {
    expect(migrateLegacy('home', {
      salute: 'Hey! I am Cristhian',
      iam: 'I am a',
      fullstackdev: 'Full Stack Developer with ',
      xpyears: '+ years of experience building software solutions.',
      contactme: 'Contact me',
    })).toEqual({
      greeting: 'Hey! I am Cristhian',
      headline: 'I am a',
      summary: 'Full Stack Developer with {years}+ years of experience building software solutions.',
      cta: 'Contact me',
    });
  });

  it('migrates about paragraphs into a list and the last one into highlight', () => {
    expect(migrateLegacy('about', { title: 'About me', p_1: 'One', p_2: 'Two', p_3: 'Three', p_4: 'Four', xpYears: 'Years.' }))
      .toEqual({ title: 'About me', paragraphs: ['One', 'Two', 'Three'], highlight: 'Four', yearsLabel: 'Years.' });
  });

  it('renames menu keys', () => {
    expect(migrateLegacy('nav', { home: 'Inicio', aboutme: 'Sobre mi', xp: 'Experiencia', contact: 'Contacto', education: 'Educación' }))
      .toEqual({ home: 'Inicio', about: 'Sobre mi', experience: 'Experiencia', contact: 'Contacto', education: 'Educación' });
  });

  it('applies language defaults under the stored data', () => {
    expect(withDefaults('es', 'nav', { home: 'Casa' })['projects']).toBe('Proyectos');
    expect(withDefaults('es', 'nav', { home: 'Casa' })['home']).toBe('Casa');
  });
});
