import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string | Date;
}

export interface CategoryExpense {
  category: string;
  amount: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  mostExpensiveCategory: string;
  recentTransactions: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'api/transactions'; // Replace with actual API URL when available

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

  // Transaction CRUD operations
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  deleteTransaction(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
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
