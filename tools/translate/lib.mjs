// Pure helpers for translate.mjs, kept separate so they can be tested without Firebase or DeepL.

export const LANGS = ['es', 'en'];

export function otherLang(lang) {
  return lang === 'es' ? 'en' : 'es';
}

// DeepL wants a regional variant for English targets
export function deeplLang(lang, asTarget) {
  if (lang === 'en') return asTarget ? 'EN-US' : 'EN';
  return lang.toUpperCase();
}

export function deeplUrl(apiKey) {
  return apiKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
}

/**
 * Flattens the requested fields of a section into a list of texts.
 * Leading/trailing whitespace is stripped here and restored by applyTranslations,
 * because the site concatenates fragments like "I am a " + role.
 */
export function collectTexts(data, keys) {
  const texts = [];
  for (const key of keys) {
    const value = data[key];
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
      if (typeof item === 'string' && item.trim()) texts.push(item.trim());
    }
  }
  return texts;
}

export function applyTranslations(data, keys, translated) {
  const queue = [...translated];
  const translateOne = (text) => {
    if (typeof text !== 'string' || !text.trim()) return text;
    const lead = text.match(/^\s*/)[0];
    const trail = text.match(/\s*$/)[0];
    return lead + queue.shift() + trail;
  };
  const result = {};
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) result[key] = value.map(translateOne);
    else if (typeof value === 'string') result[key] = translateOne(value);
  }
  return result;
}
