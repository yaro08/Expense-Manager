import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="language-selector">
      <select (change)="changeLanguage($event)">
        <option *ngFor="let lang of availableLanguages" [value]="lang" selected="{{ lang === currentLang }}">
          {{ ('LANGUAGE.' + lang.toUpperCase()) | translate }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .language-selector {
      display: inline-block;
      margin-left: 10px;
    }
    select {
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  currentLang: string = 'es';
  availableLanguages: string[] = [];

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();

    this.currentLang = this.translationService.getCurrentLang();
  }

  changeLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const lang = select.value;
    this.translationService.useLanguage(lang);
  }
}
