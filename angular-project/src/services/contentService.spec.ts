import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TranslateService } from '@ngx-translate/core';
import { ContentService } from './contentService';

describe('ContentService', () => {
  let docs: Record<string, Subject<any>>;
  let service: ContentService;
  const translateMock = {
    currentLang: 'en',
    getDefaultLang: () => 'en',
    use: jest.fn(),
    onLangChange: new Subject<any>(),
  } as unknown as TranslateService;

  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    docs = { en: new Subject(), es: new Subject() };
    service = new ContentService({} as any, translateMock, {} as any);
    jest.spyOn(service, 'getContent').mockImplementation((lang: string) => docs[lang].asObservable());
  });

  it('switches to the preloaded language without another fetch', () => {
    const seen: any[] = [];
    service.watchContent('test').subscribe(c => seen.push(c));
    docs['en'].next({ salute: 'Hi' });
    docs['es'].next({ salute: 'Hola' });

    service.setLanguage('es');
    jest.advanceTimersByTime(200);

    expect(seen.slice(-2)).toEqual([{ salute: 'Hi' }, { salute: 'Hola' }]);
    expect(service.getContent).toHaveBeenCalledTimes(2);
    expect(translateMock.use).toHaveBeenCalledWith('es');
  });

  it('starts from the copy cached in localStorage', () => {
    localStorage.setItem('content-v2:en:test', JSON.stringify({ salute: 'Cached' }));
    const seen: any[] = [];
    service.watchContent('test').subscribe(c => seen.push(c));

    expect(seen).toEqual([{ salute: 'Cached' }]);

    docs['en'].next({ salute: 'Live' });
    docs['es'].next({ salute: 'Hola' });
    expect(seen).toEqual([{ salute: 'Cached' }, { salute: 'Live' }]);
    expect(JSON.parse(localStorage.getItem('content-v2:es:test')!)).toEqual({ salute: 'Hola' });
  });

  it('fills fields missing in Firestore from the defaults', () => {
    const seen: any[] = [];
    service.watchContent('home').subscribe(c => seen.push(c));
    docs['en'].next({ greeting: 'Hi there' });
    docs['es'].next(undefined);

    expect(seen.at(-1).greeting).toBe('Hi there');
    expect(seen.at(-1).cta).toBe('Contact me');
  });
});
