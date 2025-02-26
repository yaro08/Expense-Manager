import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  mostExpensiveCategory: string;
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category?: string;
}

export interface CategoryExpense {
  category: string;
  amount: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getDashboardStats(dateRange: string = 'month'): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats?range=${dateRange}`);
  }

  getCategoryExpenses(dateRange: string = 'month'): Observable<CategoryExpense[]> {
    return this.http.get<CategoryExpense[]>(`${this.apiUrl}/by-category?range=${dateRange}`);
  }

  getMonthlyExpenses(year: number): Observable<MonthlyExpense[]> {
    return this.http.get<MonthlyExpense[]>(`${this.apiUrl}/monthly?year=${year}`);
  }

  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/recent?limit=${limit}`);
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
