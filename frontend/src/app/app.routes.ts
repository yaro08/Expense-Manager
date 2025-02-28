import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LanguageTestComponent } from './shared/components/language-test/language-test.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'language-test', component: LanguageTestComponent }
];
