import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionType } from './dto/transaction.dto';
import { UserEntity } from '../auth/user.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  } as UserEntity;

  const mockTransactionsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionsRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a transaction', async () => {
      const createTransactionDto = {
        amount: 100,
        description: 'Test Transaction',
        type: TransactionType.EXPENSE,
      };

      const mockTransaction = {
        id: 1,
        ...createTransactionDto,
        user: mockUser,
        date: new Date(),
      };

      mockTransactionsRepository.create.mockReturnValue(mockTransaction);
      mockTransactionsRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createTransactionDto, mockUser);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        user: mockUser,
        date: expect.any(Date),
      });
    });

    it('should throw BadRequestException when creation fails', async () => {
      mockTransactionsRepository.save.mockRejectedValue(new Error());

      await expect(
        service.create(
          { amount: 100, description: 'Test', type: TransactionType.EXPENSE },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const mockTransactions = [
        { id: 1, amount: 100, type: TransactionType.EXPENSE },
        { id: 2, amount: 200, type: TransactionType.INCOME },
      ];

      mockTransactionsRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll(mockUser.id);

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['category'],
        order: { date: 'DESC' },
      });
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

      mockTransactionsRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findByDateRange(mockUser.id, dateRange);

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionsRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: mockUser.id },
          date: expect.any(Object),
        },
        relations: ['category'],
        order: { date: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      const mockTransaction = {
        id: 1,
        amount: 100,
        type: TransactionType.EXPENSE,
      };

      mockTransactionsRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(1, mockUser.id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: mockUser.id } },
        relations: ['category'],
      });
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
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

      mockTransactionsRepository.findOne
        .mockResolvedValueOnce(mockTransaction)
        .mockResolvedValueOnce(mockTransaction);
      mockTransactionsRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, mockUser.id, updateDto);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsRepository.update).toHaveBeenCalledWith(
        { id: 1, user: { id: mockUser.id } },
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      const mockTransaction = {
        id: 1,
        amount: 100,
        type: TransactionType.EXPENSE,
      };

      mockTransactionsRepository.findOne.mockResolvedValue(mockTransaction);
      mockTransactionsRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1, mockUser.id);

      expect(mockTransactionsRepository.delete).toHaveBeenCalledWith({
        id: 1,
        user: { id: mockUser.id },
      });
    });
  });
});