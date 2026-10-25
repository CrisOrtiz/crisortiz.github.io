# CrisOrtizDev portfolio

Personal portfolio of Cristhian Ortiz Mercado, published at https://crisortiz.github.io.

The site is an Angular 20 app in `angular-project/`. Pushing to `master` runs the Jest tests, builds the app, and deploys the build to the `prod` branch, which GitHub Pages serves.

## Editing content

- Experience, education and projects (EN/ES): `angular-project/src/app/main/profile-data.ts`
- Home, About and menu labels: Firestore, under `content/{lang}/sections/{section}`
- SEO tags, link preview and structured data: `angular-project/src/index.html`, plus `robots.txt` and `sitemap.xml`

## Development

```bash
cd angular-project
npm install --legacy-peer-deps
npm start            # dev server at http://localhost:4200
npx jest             # unit tests
npm run build:prod   # production build in dist/
```
