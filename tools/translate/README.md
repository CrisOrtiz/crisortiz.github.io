# Content editor and automatic translation

Section texts live in Firestore at `content/{es|en}/sections/{home|about|nav}`. Each field is a whole sentence (or a list); `{years}` is filled in by the site. The fields are listed in `angular-project/src/app/content-schema.ts`.

1. Open `https://crisortiz.github.io/?admin`, sign in with Google and edit a section in either language.
2. On save, the edited fields are queued in `translation_jobs`.
3. The **Translate site content** GitHub Action runs every 10 minutes (or by hand from the Actions tab),
   translates the queued fields with DeepL and writes them into the other language. The site shows the
   change right away because it reads Firestore live.

Every run also fills any text that exists in one language but is missing or empty in the other.

**Migrating the old structure**: if Firestore still has the old documents (`home_section`, `p_1`, `salute`…),
the editor shows a **Migrar contenido** button that converts them in place. Until then the site converts them on the fly.

Fields you did not edit are not overwritten, so you can fine-tune a translation by editing the other
language with "Traducir automáticamente" turned off.

## One-time setup

1. **Firebase Auth**: Console > Authentication > Sign-in method > enable **Google**. Add
   `crisortiz.github.io` under Settings > Authorized domains.
2. **Firestore rules**: paste [`firestore.rules`](../../firestore.rules) into Console > Firestore > Rules.
3. **Admin access**: open `/?admin`, sign in, copy the uid it shows, and create an empty document
   `admins/{uid}` in Firestore.
4. **DeepL**: create a free DeepL API account (500,000 characters/month) and copy the key.
5. **Service account**: Firebase Console > Project settings > Service accounts > Generate new private key.
6. **GitHub secrets** (repo Settings > Secrets and variables > Actions): `DEEPL_API_KEY` with the DeepL
   key and `FIREBASE_SERVICE_ACCOUNT` with the whole JSON file contents.

## Running locally

```sh
cd tools/translate
npm install
export DEEPL_API_KEY=... GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
node translate.mjs                                      # process pending jobs
node translate.mjs --section aboutme_section --from es  # retranslate a whole section
npm test
```
