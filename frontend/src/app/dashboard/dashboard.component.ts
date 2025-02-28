import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardStats, CategoryExpense, MonthlyExpense, Transaction } from './dashboard.service';
import { DashboardMockService } from './dashboard-mock.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../shared/components/language-selector/language-selector.component';
import { TranslationService } from '../core/services/translation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, DatePipe, TranslateModule, LanguageSelectorComponent],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('transactionForm') transactionForm!: NgForm;

  // Datos para el gráfico de gastos por categoría
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: []
    }]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  // Datos para el gráfico de gastos por mes
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Gastos',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  // Estadísticas generales
  public stats: DashboardStats = {
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    mostExpensiveCategory: '',
    recentTransactions: []
  };

  // Filtros
  public selectedDateRange = 'month';
  public selectedCategory = 'all';

  // Transaction management
  public editMode = false;
  public currentTransaction: Transaction = this.getEmptyTransaction();

  constructor(private dashboardService: DashboardMockService, private translationService: TranslationService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(dateRange: string = 'month', category: string = 'all'): void {
    // Cargar estadísticas generales
    this.dashboardService.getDashboardStats(dateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats: DashboardStats) => {
        this.stats = stats;
      });

    // Cargar datos para el gráfico de categorías
    this.dashboardService.getCategoryExpenses(dateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CategoryExpense[]) => {
        this.pieChartData = this.dashboardService.transformCategoryDataForChart(data);
      });

    // Cargar datos para el gráfico de gastos mensuales
    this.dashboardService.getMonthlyExpenses(new Date().getFullYear())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: MonthlyExpense[]) => {
        this.lineChartData = this.dashboardService.transformMonthlyDataForChart(data);
      });
  }

  onDateRangeChange(range: string): void {
    this.selectedDateRange = range;
    this.loadDashboardData(range, this.selectedCategory);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loadDashboardData(this.selectedDateRange, category);
  }

  // Transaction management methods
  getEmptyTransaction(): Transaction {
    return {
      id: '',
      description: '',
      amount: 0,
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    };
  }

  editTransaction(transaction: Transaction): void {
    this.editMode = true;
    // Create a copy to avoid direct reference manipulation
    this.currentTransaction = {
      ...transaction,
      // Ensure date is in the right format for the date input
      date: transaction.date instanceof Date
        ? transaction.date.toISOString().split('T')[0]
        : (typeof transaction.date === 'string'
          ? (transaction.date.includes('T')
            ? transaction.date.split('T')[0]
            : transaction.date)
          : new Date().toISOString().split('T')[0])
    };
  }

  deleteTransaction(id: string): void {
    const confirmMessage = this.translationService.instant('DASHBOARD.TRANSACTIONS.DELETE_CONFIRM');
    if (confirm(confirmMessage)) {
      this.dashboardService.deleteTransaction(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // Reload data after deletion
          this.loadDashboardData(this.selectedDateRange, this.selectedCategory);
        });
    }
  }

  saveTransaction(): void {
    if (this.transactionForm && this.transactionForm.invalid) {
      return; // Do not proceed if form is invalid
    }

    // Handle the save operation
    const saveOperation = this.editMode
      ? this.dashboardService.updateTransaction(this.currentTransaction)
      : this.dashboardService.addTransaction(this.currentTransaction);

    saveOperation.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Reset form and reload data
        this.cancelEdit();
        this.loadDashboardData(this.selectedDateRange, this.selectedCategory);
      });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentTransaction = this.getEmptyTransaction();
    if (this.transactionForm) {
      this.transactionForm.resetForm();
    }
  }
}
