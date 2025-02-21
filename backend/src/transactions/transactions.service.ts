import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './transaction.entity';
import { UserEntity } from '../auth/user.entity';
import { CreateTransactionDto, UpdateTransactionDto, TransactionResponse, DateRangeDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user: UserEntity,
  ): Promise<TransactionResponse> {
    try {
      const transaction = this.transactionsRepository.create({
        ...createTransactionDto,
        user,
        date: createTransactionDto.date || new Date(),
      });
      const savedTransaction = await this.transactionsRepository.save(transaction);
      return new TransactionResponse(savedTransaction);
    } catch (error) {
      throw new BadRequestException('Failed to create transaction');
    }
  }

  async findAll(userId: number): Promise<TransactionResponse[]> {
    try {
      const transactions = await this.transactionsRepository.find({
        where: { user: { id: userId } },
        relations: ['category'],
        order: { date: 'DESC' },
      });
      return transactions.map(transaction => new TransactionResponse(transaction));
    } catch (error) {
      throw new BadRequestException('Failed to fetch transactions');
    }
  }

  async findByDateRange(
    userId: number,
    dateRange: DateRangeDto,
  ): Promise<TransactionResponse[]> {
    try {
      const transactions = await this.transactionsRepository.find({
        where: {
          user: { id: userId },
          date: Between(dateRange.startDate, dateRange.endDate),
        },
        relations: ['category'],
        order: { date: 'DESC' },
      });
      return transactions.map(transaction => new TransactionResponse(transaction));
    } catch (error) {
      throw new BadRequestException('Failed to fetch transactions by date range');
    }
  }

  async findOne(id: number, userId: number): Promise<TransactionResponse> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return new TransactionResponse(transaction);
  }

  async update(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    await this.findOne(id, userId);

    try {
      await this.transactionsRepository.update(
        { id, user: { id: userId } },
        updateTransactionDto,
      );
      return this.findOne(id, userId);
    } catch (error) {
      throw new BadRequestException(`Failed to update transaction with ID ${id}`);
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    // Verify existence and ownership
    await this.findOne(id, userId);

    try {
      await this.transactionsRepository.delete({ id, user: { id: userId } });
    } catch (error) {
      throw new BadRequestException(`Failed to delete transaction with ID ${id}`);
    }
  }
}