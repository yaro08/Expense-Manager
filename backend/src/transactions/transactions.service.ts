import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './transaction.entity';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: Partial<Transaction>,
    user: UserEntity,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      user,
    });
    return this.transactionsRepository.save(transaction);
  }

  async findAll(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });
  }

  async findByDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      relations: ['category'],
    });
  }

  async findOne(id: number, userId: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category'],
    });
  }

  async update(
    id: number,
    userId: number,
    updateTransactionDto: Partial<Transaction>,
  ): Promise<Transaction | null> {
    await this.transactionsRepository.update(
      { id, user: { id: userId } },
      updateTransactionDto,
    );
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.transactionsRepository.delete({ id, user: { id: userId } });
  }
}