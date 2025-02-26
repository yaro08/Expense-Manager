import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardStats, CategoryExpense, MonthlyExpense, Transaction } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardMockService {

  constructor() { }

  getDashboardStats(dateRange: string = 'month'): Observable<DashboardStats> {
    const multiplier = dateRange === 'week' ? 0.25 : dateRange === 'year' ? 12 : 1;

    return of({
      totalExpenses: 1050 * multiplier,
      totalIncome: 2000 * multiplier,
      balance: 950 * multiplier,
      mostExpensiveCategory: 'Servicios',
      recentTransactions: [
        { id: 1, description: 'Supermercado', amount: -150, date: new Date() },
        { id: 2, description: 'Gasolina', amount: -80, date: new Date(Date.now() - 86400000) },
        { id: 3, description: 'Netflix', amount: -15, date: new Date(Date.now() - 172800000) },
        { id: 4, description: 'Salario', amount: 2000, date: new Date(Date.now() - 259200000) },
        { id: 5, description: 'Restaurante', amount: -60, date: new Date(Date.now() - 345600000) }
      ]
    }).pipe(delay(500)); // Simular retraso de red
  }

  getCategoryExpenses(dateRange: string = 'month'): Observable<CategoryExpense[]> {
    const multiplier = dateRange === 'week' ? 0.25 : dateRange === 'year' ? 12 : 1;

    return of([
      { category: 'Comida', amount: 300 * multiplier },
      { category: 'Transporte', amount: 200 * multiplier },
      { category: 'Entretenimiento', amount: 150 * multiplier },
      { category: 'Servicios', amount: 400 * multiplier }
    ]).pipe(delay(500)); // Simular retraso de red
  }

  getMonthlyExpenses(year: number): Observable<MonthlyExpense[]> {
    return of([
      { month: 'Ene', amount: 650 },
      { month: 'Feb', amount: 800 },
      { month: 'Mar', amount: 950 },
      { month: 'Abr', amount: 750 },
      { month: 'May', amount: 880 },
      { month: 'Jun', amount: 940 },
      { month: 'Jul', amount: 1020 },
      { month: 'Ago', amount: 780 },
      { month: 'Sep', amount: 850 },
      { month: 'Oct', amount: 900 },
      { month: 'Nov', amount: 1100 },
      { month: 'Dic', amount: 1500 }
    ]).pipe(delay(500)); // Simular retraso de red
  }

  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    return of([
      { id: 1, description: 'Supermercado', amount: -150, date: new Date() },
      { id: 2, description: 'Gasolina', amount: -80, date: new Date(Date.now() - 86400000) },
      { id: 3, description: 'Netflix', amount: -15, date: new Date(Date.now() - 172800000) },
      { id: 4, description: 'Salario', amount: 2000, date: new Date(Date.now() - 259200000) },
      { id: 5, description: 'Restaurante', amount: -60, date: new Date(Date.now() - 345600000) }
    ].slice(0, limit)).pipe(delay(500)); // Simular retraso de red
  }

  // Método para transformar los datos para Chart.js
  transformCategoryDataForChart(data: CategoryExpense[]): any {
    return {
      labels: data.map(item => item.category),
      datasets: [{
        data: data.map(item => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ]
      }]
    };
  }

  transformMonthlyDataForChart(data: MonthlyExpense[]): any {
    return {
      labels: data.map(item => item.month),
      datasets: [{
        label: 'Gastos Mensuales',
        data: data.map(item => item.amount),
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)'
      }]
    };
  }
}
