import { TestBed } from '@angular/core/testing';
import { DashboardMockService } from './dashboard-mock.service';
import { Transaction } from './dashboard.service';

describe('DashboardMockService', () => {
  let service: DashboardMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics with the correct format', (done) => {
      service.getDashboardStats('month').subscribe(stats => {
        expect(stats).toBeDefined();
        expect(stats.totalExpenses).toBeGreaterThanOrEqual(0);
        expect(stats.totalIncome).toBeGreaterThanOrEqual(0);
        expect(stats.balance).toBeDefined();
        expect(stats.recentTransactions.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('getCategoryExpenses', () => {
    it('should return category expenses data with the correct format', (done) => {
      service.getCategoryExpenses('month').subscribe(data => {
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expect(data[0].category).toBeDefined();
        expect(data[0].amount).toBeDefined();
        done();
      });
    });

    it('should adjust values based on date range', (done) => {
      // Get data for a month
      service.getCategoryExpenses('month').subscribe(monthData => {
        // Get data for a year
        service.getCategoryExpenses('year').subscribe(yearData => {
          // Year data should be larger than month data (using multiplier logic)
          expect(yearData[0].amount).toBeGreaterThan(monthData[0].amount);
          done();
        });
      });
    });
  });

  describe('getMonthlyExpenses', () => {
    it('should return monthly expenses with the correct format', (done) => {
      const currentYear = new Date().getFullYear();
      service.getMonthlyExpenses(currentYear).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.length).toBe(12); // Should have 12 months
        expect(data[0].month).toBeDefined();
        expect(data[0].amount).toBeDefined();
        done();
      });
    });
  });

  describe('Transaction CRUD operations', () => {
    it('should add a new transaction', (done) => {
      const newTransaction: Partial<Transaction> = {
        description: 'Test Transaction',
        amount: -50,
        category: 'food',
        date: '2025-02-15'
      };

      // Get initial transactions count
      service.getTransactions().subscribe(initialTransactions => {
        const initialCount = initialTransactions.length;

        // Add a new transaction
        service.addTransaction(newTransaction as Transaction).subscribe(addedTransaction => {
          expect(addedTransaction.id).toBeDefined();
          expect(addedTransaction.description).toBe(newTransaction.description+'');

          // Verify the transaction was added
          service.getTransactions().subscribe(updatedTransactions => {
            expect(updatedTransactions.length).toBe(initialCount + 1);
            done();
          });
        });
      });
    });

    it('should update an existing transaction', (done) => {
      // First get a transaction to update
      service.getTransactions().subscribe(transactions => {
        const transactionToUpdate = { ...transactions[0], description: 'Updated Description' };

        // Update the transaction
        service.updateTransaction(transactionToUpdate).subscribe(updatedTransaction => {
          expect(updatedTransaction.description).toBe('Updated Description');

          // Verify the transaction was updated in the list
          service.getTransactions().subscribe(newTransactions => {
            const found = newTransactions.find(t => t.id === transactionToUpdate.id);
            expect(found?.description).toBe('Updated Description');
            done();
          });
        });
      });
    });

    it('should delete a transaction', (done) => {
      // First get transactions to find one to delete
      service.getTransactions().subscribe(initialTransactions => {
        const initialCount = initialTransactions.length;
        const idToDelete = initialTransactions[0].id;

        // Delete the transaction
        service.deleteTransaction(idToDelete).subscribe(result => {
          expect(result).toBeTrue();

          // Verify the transaction was deleted
          service.getTransactions().subscribe(newTransactions => {
            expect(newTransactions.length).toBe(initialCount - 1);
            const foundDeleted = newTransactions.find(t => t.id === idToDelete);
            expect(foundDeleted).toBeUndefined();
            done();
          });
        });
      });
    });
  });

  describe('Chart data transformation', () => {
    it('should transform category data for pie chart', () => {
      const categoryData = [
        { category: 'Comida', amount: 300 },
        { category: 'Transporte', amount: 200 }
      ];

      const chartData = service.transformCategoryDataForChart(categoryData);

      expect(chartData.labels).toEqual(['Comida', 'Transporte']);
      expect(chartData.datasets[0].data).toEqual([300, 200]);
      expect(chartData.datasets[0].backgroundColor).toBeDefined();
    });

    it('should transform monthly data for line chart', () => {
      const monthlyData = [
        { month: 'Ene', amount: 800 },
        { month: 'Feb', amount: 900 }
      ];

      const chartData = service.transformMonthlyDataForChart(monthlyData);

      expect(chartData.labels).toEqual(['Ene', 'Feb']);
      expect(chartData.datasets[0].data).toEqual([800, 900]);
      expect(chartData.datasets[0].label).toBeDefined();
      expect(chartData.datasets[0].borderColor).toBeDefined();
    });
  });
});
