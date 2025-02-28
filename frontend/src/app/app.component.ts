import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  title = 'Gestor de Gastos';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    // Initialize translation service
    // The service will automatically set the language based on browser preference
  }
}
