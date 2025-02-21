import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions?: Transaction[];
}