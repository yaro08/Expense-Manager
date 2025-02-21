import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { UserEntity } from '../auth/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number; // Se usa "!" para indicar que siempre tendrá valor después de ser generado.

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number; // Se usa "!" o se puede hacer opcional con "?"

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: ['income', 'expense'],
  })
  type!: 'income' | 'expense';

  @CreateDateColumn()
  date!: Date;

  @ManyToOne(() => Category, (category) => category.transactions, { nullable: true })
  category?: Category; // Opcional con "?" porque podría ser null

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  user!: UserEntity;
}
