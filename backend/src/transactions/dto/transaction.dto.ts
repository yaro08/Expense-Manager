import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsDate, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @ApiProperty({
    example: 100.50,
    description: 'The amount of the transaction',
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({
    example: 'Grocery shopping',
    description: 'Description of the transaction'
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    description: 'Type of transaction'
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({
    example: '2025-02-21',
    description: 'Date of the transaction',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    example: 1,
    description: 'Category ID for the transaction',
    required: false
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

export class UpdateTransactionDto {
  @ApiProperty({
    example: 100.50,
    description: 'The amount of the transaction',
    minimum: 0.01,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiProperty({
    example: 'Grocery shopping',
    description: 'Description of the transaction',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    description: 'Type of transaction',
    required: false
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({
    example: '2025-02-21',
    description: 'Date of the transaction',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    example: 1,
    description: 'Category ID for the transaction',
    required: false
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

export class DateRangeDto {
  @ApiProperty({
    example: '2025-02-01',
    description: 'Start date for filtering transactions'
  })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({
    example: '2025-02-21',
    description: 'End date for filtering transactions'
  })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;
}

export class TransactionResponse {
  @ApiProperty({
    example: 1,
    description: 'Transaction ID'
  })
  id!: number;

  @ApiProperty({
    example: 100.50,
    description: 'Transaction amount'
  })
  amount!: number;

  @ApiProperty({
    example: 'Grocery shopping',
    description: 'Transaction description'
  })
  description!: string;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    description: 'Transaction type'
  })
  type!: TransactionType;

  @ApiProperty({
    example: '2025-02-21T12:00:00Z',
    description: 'Transaction date'
  })
  date!: Date;

  @ApiProperty({
    example: { id: 1, name: 'Groceries' },
    description: 'Associated category',
    required: false
  })
  category?: any;

  constructor(partial: Partial<TransactionResponse>) {
    Object.assign(this, partial);
  }
}