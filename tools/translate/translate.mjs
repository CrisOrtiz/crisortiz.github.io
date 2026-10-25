// Applies pending translation jobs written by the site's admin page (/?admin).
//
// Each job lives at translation_jobs/{section}_{lang} and lists the fields edited in that language.
// Those fields are translated with DeepL and merged into the other language's document, so manual
// tweaks to fields that were not edited are kept.
// Every run also fills any text that exists in one language but is missing in the other.
//
// Usage:
//   node translate.mjs                         process pending jobs (what the GitHub Action runs)
//   node translate.mjs --section home_section --from es   translate a whole section now
//
// Env: DEEPL_API_KEY, and FIREBASE_SERVICE_ACCOUNT (service account JSON) or GOOGLE_APPLICATION_CREDENTIALS.
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  LANGS, applyTranslations, collectTexts, deeplLang, deeplUrl, missingKeys, otherLang,
  protectPlaceholders, restorePlaceholders,
} from './lib.mjs';

// Old fragmented documents, replaced by home/about/nav; never written to
const LEGACY_SECTIONS = ['home_section', 'aboutme_section', 'header_section'];

const apiKey = process.env.DEEPL_API_KEY;
if (!apiKey) {
  console.error('DEEPL_API_KEY is not set');
  process.exit(1);
}

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
initializeApp({ credential: serviceAccount ? cert(JSON.parse(serviceAccount)) : applicationDefault() });
const db = getFirestore();

async function deepl(texts, from, to) {
  if (!texts.length) return [];
  const res = await fetch(deeplUrl(apiKey), {
    method: 'POST',
    headers: { 'Authorization': `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: texts.map(protectPlaceholders),
      source_lang: deeplLang(from, false),
      target_lang: deeplLang(to, true),
      tag_handling: 'xml',
      ignore_tags: ['keep'],
    }),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  const body = await res.json();
  return body.translations.map(t => restorePlaceholders(t.text));
}

async function translateSection(section, from, keys) {
  const to = otherLang(from);
  const snap = await db.doc(`content/${from}/sections/${section}`).get();
  const data = snap.data() ?? {};
  const fields = keys ?? Object.keys(data);
  const translated = await deepl(collectTexts(data, fields), from, to);
  const update = applyTranslations(data, fields, translated);
  if (Object.keys(update).length) {
    await db.doc(`content/${to}/sections/${section}`).set(update, { merge: true });
  }
  console.log(`${section}: ${from} -> ${to} [${Object.keys(update).join(', ')}]`);
}

async function fillMissing() {
  const ids = new Set();
  for (const lang of LANGS) {
    const refs = await db.collection(`content/${lang}/sections`).listDocuments();
    refs.forEach(ref => ids.add(ref.id));
  }
  for (const section of ids) {
    if (LEGACY_SECTIONS.includes(section)) continue;
    const [en, es] = await Promise.all(LANGS.map(lang => db.doc(`content/${lang}/sections/${section}`).get()));
    const docs = { en: en.data() ?? {}, es: es.data() ?? {} };
    for (const from of LANGS) {
      const keys = missingKeys(docs[from], docs[otherLang(from)]);
      if (keys.length) await translateSection(section, from, keys);
    }
  }
}

async function processJobs() {
  const jobs = await db.collection('translation_jobs').get();
  if (jobs.empty) console.log('No pending translations');
  for (const job of jobs.docs) {
    const { section, sourceLang, fields } = job.data();
    if (!section || !LANGS.includes(sourceLang) || LEGACY_SECTIONS.includes(section)) {
      console.warn(`Skipping malformed job ${job.id}`);
      continue;
    }
    await translateSection(section, sourceLang, fields);
    try {
      // Only delete if nobody queued more edits while we were translating
      await job.ref.delete({ lastUpdateTime: job.updateTime });
    } catch {
      console.log(`${job.id} changed during translation, it will run again next time`);
    }
  }
}

const args = process.argv.slice(2);
const sectionArg = args.indexOf('--section');
if (sectionArg >= 0) {
  const fromArg = args.indexOf('--from');
  const from = fromArg >= 0 ? args[fromArg + 1] : 'es';
  await translateSection(args[sectionArg + 1], from);
} else {
  await processJobs();
  await fillMissing();
}
