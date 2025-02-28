import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('');
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Initialize with browser language or default to English
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = this.getSupportedLanguage(browserLang);

    // Set available languages
    translate.addLangs(['en', 'es']);

    // Set default language
    translate.setDefaultLang('en');

    // Use the browser language if available, or default to English
    this.useLanguage(defaultLang);
  }

  private getSupportedLanguage(lang: string): string {
    return ['en', 'es'].includes(lang) ? lang : 'en';
  }

  public useLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  public getCurrentLang(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }

  public getAvailableLanguages(): string[] {
    return this.translate.getLangs();
  }

  public instant(key: string | string[], interpolateParams?: Object): string | any {
    return this.translate.instant(key, interpolateParams);
  }

  public get(key: string | string[], interpolateParams?: Object): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }
}
