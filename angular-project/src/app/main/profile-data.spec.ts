import { describe, expect, it } from '@jest/globals';

import { EDUCATION, EXPERIENCE, PROJECTS, pickLang } from './profile-data';

describe('profile data', () => {
  it('should have the same number of entries in English and Spanish', () => {
    expect(EXPERIENCE.es.length).toBe(EXPERIENCE.en.length);
    expect(EDUCATION.es.length).toBe(EDUCATION.en.length);
    expect(PROJECTS.es.length).toBe(PROJECTS.en.length);
  });

  it('should keep the same periods and stacks across languages for experience', () => {
    EXPERIENCE.en.forEach((job, i) => {
      expect(EXPERIENCE.es[i].stack).toEqual(job.stack);
      expect(EXPERIENCE.es[i].company).toBe(job.company);
    });
  });

  it('should fall back to English for unknown languages', () => {
    expect(pickLang('es')).toBe('es');
    expect(pickLang('fr')).toBe('en');
    expect(pickLang(null)).toBe('en');
  });
});
