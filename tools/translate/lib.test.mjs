import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyTranslations, collectTexts, deeplLang, deeplUrl, missingKeys, otherLang, protectPlaceholders, restorePlaceholders,
} from './lib.mjs';

test('collects trimmed texts from strings and lists, skipping blanks', () => {
  const data = { iam: 'Soy un ', typed: ['Dev', 'Mentor'], empty: '  ', other: 'ignored' };
  assert.deepEqual(collectTexts(data, ['iam', 'typed', 'empty']), ['Soy un', 'Dev', 'Mentor']);
});

test('applies translations in order and restores surrounding whitespace', () => {
  const data = { iam: 'Soy un ', typed: ['Desarrollador', 'Mentor'], empty: '' };
  const keys = ['iam', 'typed', 'empty'];
  assert.deepEqual(applyTranslations(data, keys, ['I am a', 'Developer', 'Mentor']), {
    iam: 'I am a ',
    typed: ['Developer', 'Mentor'],
    empty: '',
  });
});

test('ignores keys missing from the source', () => {
  assert.deepEqual(applyTranslations({}, ['nope'], []), {});
});

test('maps languages for DeepL', () => {
  assert.equal(otherLang('es'), 'en');
  assert.equal(otherLang('en'), 'es');
  assert.equal(deeplLang('en', true), 'EN-US');
  assert.equal(deeplLang('en', false), 'EN');
  assert.equal(deeplLang('es', true), 'ES');
  assert.equal(deeplUrl('abc:fx'), 'https://api-free.deepl.com/v2/translate');
  assert.equal(deeplUrl('abc'), 'https://api.deepl.com/v2/translate');
});

test('finds texts missing or empty in the other language', () => {
  const en = { greeting: 'Hi', roles: ['Dev'], summary: 'With {years}+ years', cta: 'Contact', count: 3 };
  const es = { greeting: 'Hola', roles: [], cta: '  ' };
  assert.deepEqual(missingKeys(en, es), ['roles', 'summary', 'cta']);
  assert.deepEqual(missingKeys(es, en), []);
  assert.deepEqual(missingKeys(en, undefined), ['greeting', 'roles', 'summary', 'cta']);
});

test('protects placeholders and xml characters for DeepL', () => {
  const protectedText = protectPlaceholders('A & B with {years}+ years <3');
  assert.equal(protectedText, 'A &amp; B with <keep>{years}</keep>+ years &lt;3');
  assert.equal(restorePlaceholders('A &amp; B con <keep>{years}</keep>+ años &lt;3'), 'A & B con {years}+ años <3');
});
