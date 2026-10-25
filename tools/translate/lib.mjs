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

const isBlank = (v) => v === undefined || v === null || (typeof v === 'string' && !v.trim())
  || (Array.isArray(v) && !v.some(i => typeof i === 'string' && i.trim()));

/** Keys that have text in the source document but are missing or empty in the target. */
export function missingKeys(source, target) {
  return Object.keys(source ?? {}).filter(key => !isBlank(source[key]) && isBlank(target?.[key])
    && (typeof source[key] === 'string' || Array.isArray(source[key])));
}

const escapeXml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unescapeXml = (t) => t.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/**
 * Wraps {placeholders} in <keep> tags so DeepL (tag_handling=xml, ignore_tags=keep) leaves them alone.
 * restorePlaceholders undoes it on the translated text.
 */
export function protectPlaceholders(text) {
  return escapeXml(text).replace(/\{(\w+)\}/g, '<keep>{$1}</keep>');
}

export function restorePlaceholders(text) {
  return unescapeXml(text.replace(/<keep>(.*?)<\/keep>/g, '$1'));
}
