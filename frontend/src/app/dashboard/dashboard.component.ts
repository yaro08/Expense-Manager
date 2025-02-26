import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardStats, CategoryExpense, MonthlyExpense } from './dashboard.service';
import { DashboardMockService } from './dashboard-mock.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

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

  constructor(private dashboardService: DashboardMockService) {}

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
}
