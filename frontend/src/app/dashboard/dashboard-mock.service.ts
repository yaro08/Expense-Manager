import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardStats, CategoryExpense, MonthlyExpense, Transaction } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardMockService {
  // Mock data for transactions
  private transactions: Transaction[] = [
    {
      id: '1',
      description: 'Compra supermercado',
      amount: -85.50,
      category: 'food',
      date: '2025-02-20'
    },
    {
      id: '2',
      description: 'Gasolina',
      amount: -45.00,
      category: 'transport',
      date: '2025-02-21'
    },
    {
      id: '3',
      description: 'Cine',
      amount: -28.00,
      category: 'entertainment',
      date: '2025-02-22'
    },
    {
      id: '4',
      description: 'Factura electricidad',
      amount: -65.75,
      category: 'services',
      date: '2025-02-23'
    },
    {
      id: '5',
      description: 'Nómina',
      amount: 1250.00,
      category: 'income',
      date: '2025-02-15'
    }
  ];

  constructor() {}

  // Get dashboard stats with mock data
  getDashboardStats(dateRange: string): Observable<DashboardStats> {
    // Calculate totals
    const totalExpenses = this.transactions
      .filter(t => t.amount < 0)
      .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

    const totalIncome = this.transactions
      .filter(t => t.amount > 0)
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Return mock data with a slight delay to simulate API call
    return of({
      totalExpenses: totalExpenses,
      totalIncome: totalIncome,
      balance: totalIncome - totalExpenses,
      mostExpensiveCategory: 'food',
      recentTransactions: this.transactions
    }).pipe(delay(500));
  }

  // Get expenses by category
  getCategoryExpenses(dateRange: string = 'month'): Observable<CategoryExpense[]> {
    const multiplier = dateRange === 'week' ? 0.25 : dateRange === 'year' ? 12 : 1;

    return of([
      { category: 'Comida', amount: 300 * multiplier },
      { category: 'Transporte', amount: 200 * multiplier },
      { category: 'Entretenimiento', amount: 150 * multiplier },
      { category: 'Servicios', amount: 400 * multiplier }
    ]).pipe(delay(500));
  }

  // Get monthly expenses
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
    ]).pipe(delay(500));
  }

  // Transform category data for pie chart
  transformCategoryDataForChart(data: CategoryExpense[]): any {
    return {
      labels: data.map(item => item.category),
      datasets: [{
        data: data.map(item => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ]
      }]
    };
  }

  // Transform monthly data for line chart
  transformMonthlyDataForChart(data: MonthlyExpense[]): any {
    return {
      labels: data.map(item => item.month),
      datasets: [
        {
          data: data.map(item => item.amount),
          label: 'Gastos',
          fill: true,
          tension: 0.5,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.3)'
        }
      ]
    };
  }

  // Transaction management methods
  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions).pipe(delay(300));
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    // Create a new transaction with an ID
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9) // Simple ID generation
    };

    this.transactions.unshift(newTransaction);
    return of(newTransaction).pipe(delay(300));
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    const index = this.transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      this.transactions[index] = { ...transaction };
    }
    return of(transaction).pipe(delay(300));
  }

  deleteTransaction(id: string): Observable<boolean> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
