import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { UserEntity } from '../auth/user.entity';
import { TransactionType } from './dto/transaction.dto';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @CreateDateColumn()
  date!: Date;

  @ManyToOne(() => Category, (category) => category.transactions, { nullable: true })
  category?: Category;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  user!: UserEntity;
}