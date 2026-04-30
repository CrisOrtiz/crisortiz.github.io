import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContentService {

private _lang$ = new BehaviorSubject<string>(localStorage.getItem('lang') || this.translate.currentLang || this.translate.getDefaultLang() || 'en');
public currentLang$ = this._lang$.asObservable();
    
 constructor(
  private firestore: Firestore,
  private translate: TranslateService,
  private injector: Injector
 ) {}

  setLanguage(lang: string) {
    if (!lang) return;
    localStorage.setItem('lang', lang);
    this._lang$.next(lang);
    this.translate.use(lang); // keeps ngx-translate in sync and emits onLangChange
  }

  // Expects a document at "content/{lang}" with localized fields
  getContent(lang: string, section: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `content/${lang}/sections/${section}`);
      return docData(ref, { idField: 'id' });
    });
  }

  // Watch content for the active language and emit when TranslateService changes
  watchContent(section: string): Observable<any> {
    const initial = this._lang$.value;
    return merge(
      of(initial),
      this._lang$.pipe(map(l => l)),
      this.translate.onLangChange.pipe(map((e: any) => e.lang))
    ).pipe(
      distinctUntilChanged(),
      tap(lang => console.log('[ContentService] loading content for:', lang)),
      switchMap((lang: string) => this.getContent(lang, section))
    );
  }
}