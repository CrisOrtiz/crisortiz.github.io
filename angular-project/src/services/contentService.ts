import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

export const CONTENT_LANGS = ['en', 'es'];
const CACHE_PREFIX = 'content:';
const FADE_MS = 150;

@Injectable({ providedIn: 'root' })
export class ContentService {

private _lang$ = new BehaviorSubject<string>(localStorage.getItem('lang') || this.translate.currentLang || this.translate.getDefaultLang() || 'en');
public currentLang$ = this._lang$.asObservable();

  // One live subscription per section holding both languages, so switching never waits on the network
  private sections = new Map<string, Observable<Record<string, any>>>();
  private fadeTimer?: ReturnType<typeof setTimeout>;

 constructor(
  private firestore: Firestore,
  private translate: TranslateService,
  private injector: Injector
 ) {}

  setLanguage(lang: string) {
    if (!lang || lang === this._lang$.value) return;
    localStorage.setItem('lang', lang);
    // Fade the page out, swap the texts while it is hidden, then fade back in
    this.fade(() => {
      this._lang$.next(lang);
      this.translate.use(lang); // keeps ngx-translate in sync and emits onLangChange
    });
  }

  getContent(lang: string, section: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `content/${lang}/sections/${section}`);
      return docData(ref, { idField: 'id' });
    });
  }

  // Emits the section content for the active language. Starts from the last copy saved in
  // localStorage (no flash of fallback text), and keeps the previous text until the new one exists.
  watchContent(section: string): Observable<any> {
    const lang$ = merge(
      this._lang$,
      this.translate.onLangChange.pipe(map((e: any) => e.lang))
    ).pipe(distinctUntilChanged());

    return combineLatest([lang$, this.bothLanguages(section)]).pipe(
      map(([lang, byLang]) => byLang[lang]),
      filter(content => !!content),
      // The cached copy and the live Firestore copy are usually identical: don't re-render for that
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  private bothLanguages(section: string): Observable<Record<string, any>> {
    let cached = this.sections.get(section);
    if (!cached) {
      const perLang = CONTENT_LANGS.map(lang =>
        this.getContent(lang, section).pipe(
          tap(content => this.writeCache(lang, section, content)),
          startWith(this.readCache(lang, section))
        )
      );
      cached = combineLatest(perLang).pipe(
        map(values => Object.fromEntries(CONTENT_LANGS.map((lang, i) => [lang, values[i]]))),
        shareReplay({ bufferSize: 1, refCount: false })
      );
      this.sections.set(section, cached);
    }
    return cached;
  }

  private readCache(lang: string, section: string): any {
    try {
      const raw = localStorage.getItem(`${CACHE_PREFIX}${lang}:${section}`);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  }

  private writeCache(lang: string, section: string, content: any): void {
    try {
      if (content) localStorage.setItem(`${CACHE_PREFIX}${lang}:${section}`, JSON.stringify(content));
    } catch {
      // storage full or blocked: the live Firestore data still works
    }
  }

  private fade(swap: () => void): void {
    const root = typeof document !== 'undefined' ? document.documentElement : undefined;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!root || reduceMotion) {
      swap();
      return;
    }
    clearTimeout(this.fadeTimer);
    root.classList.add('lang-switching');
    this.fadeTimer = setTimeout(() => {
      swap();
      requestAnimationFrame(() => root.classList.remove('lang-switching'));
    }, FADE_MS);
  }
}
