import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-language-test',
  standalone: true,
  imports: [CommonModule, TranslateModule, LanguageSelectorComponent],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">{{ 'DASHBOARD.TITLE' | translate }}</h1>
      <app-language-selector></app-language-selector>
      <div class="mt-4">
        <p>{{ 'DASHBOARD.STATS.TOTAL_EXPENSES' | translate }}: $1,234.56</p>
        <p>{{ 'DASHBOARD.STATS.TOTAL_INCOME' | translate }}: $2,345.67</p>
        <p>{{ 'DASHBOARD.STATS.BALANCE' | translate }}: $1,111.11</p>
      </div>
    </div>
  `
})
export class LanguageTestComponent {}
