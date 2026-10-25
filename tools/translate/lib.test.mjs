import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyTranslations, collectTexts, deeplLang, deeplUrl, otherLang } from './lib.mjs';

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
