import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { UserEntity } from '../auth/user.entity';
import { TransactionType } from './dto/transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  } as UserEntity;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByDateRange: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto = {
        amount: 100,
        description: 'Test Transaction',
        type: TransactionType.EXPENSE,
      };

      const mockTransaction = {
        id: 1,
        ...createTransactionDto,
        date: new Date(),
      };

      mockTransactionsService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(createTransactionDto, mockUser);

      expect(result).toEqual(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(createTransactionDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const mockTransactions = [
        { id: 1, amount: 100, type: TransactionType.EXPENSE },
        { id: 2, amount: 200, type: TransactionType.INCOME },
      ];

      mockTransactionsService.findAll.mockResolvedValue(mockTransactions);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual(mockTransactions);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findByDateRange', () => {
    it('should return transactions within date range', async () => {
      const dateRange = {
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-21'),
      };

      const mockTransactions = [
        { id: 1, amount: 100, date: new Date('2025-02-15') },
      ];

      mockTransactionsService.findByDateRange.mockResolvedValue(mockTransactions);

      const result = await controller.findByDateRange(mockUser, dateRange);

      expect(result).toEqual(mockTransactions);
      expect(service.findByDateRange).toHaveBeenCalledWith(
        mockUser.id,
        dateRange,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single transaction', async () => {
      const mockTransaction = {
        id: 1,
        amount: 100,
        type: TransactionType.EXPENSE,
      };

      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne(1, mockUser);

      expect(result).toEqual(mockTransaction);
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser.id);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const updateDto = { amount: 150 };
      const mockTransaction = {
        id: 1,
        amount: 150,
        type: TransactionType.EXPENSE,
      };

      mockTransactionsService.update.mockResolvedValue(mockTransaction);

      const result = await controller.update(1, updateDto, mockUser);

      expect(result).toEqual(mockTransaction);
      expect(service.update).toHaveBeenCalledWith(1, mockUser.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      await controller.remove(1, mockUser);

      expect(service.remove).toHaveBeenCalledWith(1, mockUser.id);
    });
  });
});