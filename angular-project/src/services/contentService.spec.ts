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
    service.watchContent('home_section').subscribe(c => seen.push(c));
    docs['en'].next({ salute: 'Hi' });
    docs['es'].next({ salute: 'Hola' });

    service.setLanguage('es');
    jest.advanceTimersByTime(200);

    expect(seen).toEqual([{ salute: 'Hi' }, { salute: 'Hola' }]);
    expect(service.getContent).toHaveBeenCalledTimes(2);
    expect(translateMock.use).toHaveBeenCalledWith('es');
  });

  it('starts from the copy cached in localStorage', () => {
    localStorage.setItem('content:en:home_section', JSON.stringify({ salute: 'Cached' }));
    const seen: any[] = [];
    service.watchContent('home_section').subscribe(c => seen.push(c));

    expect(seen).toEqual([{ salute: 'Cached' }]);

    docs['en'].next({ salute: 'Live' });
    docs['es'].next({ salute: 'Hola' });
    expect(seen).toEqual([{ salute: 'Cached' }, { salute: 'Live' }]);
    expect(JSON.parse(localStorage.getItem('content:es:home_section')!)).toEqual({ salute: 'Hola' });
  });
});
