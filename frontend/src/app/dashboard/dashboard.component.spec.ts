import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardMockService } from './dashboard-mock.service';
import { NgChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardMockService;

  const mockDashboardStats = {
    totalExpenses: 1000,
    totalIncome: 2000,
    balance: 1000,
    mostExpensiveCategory: 'food',
    recentTransactions: [
      {
        id: '1',
        description: 'Grocery Shopping',
        amount: -100,
        category: 'food',
        date: '2025-02-15'
      },
      {
        id: '2',
        description: 'Salary',
        amount: 2000,
        category: 'income',
        date: '2025-02-01'
      }
    ]
  };

  const mockCategoryExpenses = [
    { category: 'Comida', amount: 500 },
    { category: 'Transporte', amount: 300 },
    { category: 'Entretenimiento', amount: 200 }
  ];

  const mockMonthlyExpenses = [
    { month: 'Ene', amount: 800 },
    { month: 'Feb', amount: 1000 },
    { month: 'Mar', amount: 900 }
  ];

  beforeEach(async () => {
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardMockService', [
      'getDashboardStats',
      'getCategoryExpenses',
      'getMonthlyExpenses',
      'addTransaction',
      'updateTransaction',
      'deleteTransaction',
      'transformCategoryDataForChart',
      'transformMonthlyDataForChart'
    ]);

    dashboardServiceSpy.getDashboardStats.and.returnValue(of(mockDashboardStats));
    dashboardServiceSpy.getCategoryExpenses.and.returnValue(of(mockCategoryExpenses));
    dashboardServiceSpy.getMonthlyExpenses.and.returnValue(of(mockMonthlyExpenses));
    dashboardServiceSpy.addTransaction.and.returnValue(of({ id: '3', description: 'New Transaction', amount: -50, category: 'food', date: '2025-02-20' }));
    dashboardServiceSpy.updateTransaction.and.returnValue(of({ id: '1', description: 'Updated Transaction', amount: -150, category: 'food', date: '2025-02-15' }));
    dashboardServiceSpy.deleteTransaction.and.returnValue(of(true));
    dashboardServiceSpy.transformCategoryDataForChart.and.returnValue({
      labels: ['Comida', 'Transporte', 'Entretenimiento'],
      datasets: [{ data: [500, 300, 200] }]
    });
    dashboardServiceSpy.transformMonthlyDataForChart.and.returnValue({
      labels: ['Ene', 'Feb', 'Mar'],
      datasets: [{ data: [800, 1000, 900], label: 'Gastos' }]
    });

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        NgChartsModule,
        DashboardComponent
      ],
      providers: [
        { provide: DashboardMockService, useValue: dashboardServiceSpy },
        DatePipe
      ]
    }).compileComponents();

    dashboardService = TestBed.inject(DashboardMockService) as jasmine.SpyObj<DashboardMockService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    expect(dashboardService.getDashboardStats).toHaveBeenCalled();
    expect(dashboardService.getCategoryExpenses).toHaveBeenCalled();
    expect(dashboardService.getMonthlyExpenses).toHaveBeenCalled();
    expect(component.stats).toEqual(mockDashboardStats);
  });

  it('should update data when date range changes', () => {
    // Reset the call counts
    (dashboardService.getDashboardStats as jasmine.Spy).calls.reset();
    (dashboardService.getCategoryExpenses as jasmine.Spy).calls.reset();

    // Change the date range
    component.onDateRangeChange('year');

    // Verify that the services were called with the new date range
    expect(dashboardService.getDashboardStats).toHaveBeenCalledWith('year');
    expect(dashboardService.getCategoryExpenses).toHaveBeenCalledWith('year');
  });

  it('should update data when category filter changes', () => {
    // Reset the call counts
    (dashboardService.getDashboardStats as jasmine.Spy).calls.reset();
    (dashboardService.getCategoryExpenses as jasmine.Spy).calls.reset();

    // Change the category
    component.onCategoryChange('food');

    // Verify that the services were called with the correct parameters
    expect(dashboardService.getDashboardStats).toHaveBeenCalledWith('month');
    expect(dashboardService.getCategoryExpenses).toHaveBeenCalledWith('month');
  });

  it('should add a new transaction', () => {
    // Set up a new transaction
    component.currentTransaction = {
      id: '',
      description: 'New Test Transaction',
      amount: -75,
      category: 'entertainment',
      date: '2025-02-25'
    };

    // Save the transaction
    component.saveTransaction();

    // Verify that the service was called to add the transaction
    expect(dashboardService.addTransaction).toHaveBeenCalledWith(component.currentTransaction);

    // Verify that the form was reset
    expect(component.editMode).toBeFalse();
  });

  it('should edit an existing transaction', () => {
    // Start editing an existing transaction
    const transaction = mockDashboardStats.recentTransactions[0];
    component.editTransaction(transaction);

    // Verify that edit mode is enabled
    expect(component.editMode).toBeTrue();
    expect(component.currentTransaction.id).toEqual(transaction.id);

    // Update the transaction
    component.currentTransaction.description = 'Updated Test Description';
    component.saveTransaction();

    // Verify that the service was called to update the transaction
    expect(dashboardService.updateTransaction).toHaveBeenCalledWith(component.currentTransaction);
  });

  it('should delete a transaction', () => {
    // Mock the confirmation dialog to return true
    spyOn(window, 'confirm').and.returnValue(true);

    // Delete a transaction
    component.deleteTransaction('1');

    // Verify that the service was called to delete the transaction
    expect(dashboardService.deleteTransaction).toHaveBeenCalledWith('1');
  });

  it('should cancel editing mode', () => {
    // Set up editing mode
    component.editMode = true;
    component.currentTransaction = mockDashboardStats.recentTransactions[0];

    // Cancel editing
    component.cancelEdit();

    // Verify that editing mode is disabled and the transaction is reset
    expect(component.editMode).toBeFalse();
    expect(component.currentTransaction.id).toEqual('');
  });
});
