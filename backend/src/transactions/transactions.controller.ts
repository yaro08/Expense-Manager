import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { UserEntity } from '../auth/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponse,
  DateRangeDto,
} from './dto/transaction.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user: UserEntity,
  ): Promise<TransactionResponse> {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    type: [TransactionResponse],
  })
  async findAll(@User() user: UserEntity): Promise<TransactionResponse[]> {
    return this.transactionsService.findAll(user.id);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get transactions within a date range' })
  @ApiQuery({ name: 'startDate', type: String, example: '2025-02-01' })
  @ApiQuery({ name: 'endDate', type: String, example: '2025-02-21' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions within the date range',
    type: [TransactionResponse],
  })
  async findByDateRange(
    @User() user: UserEntity,
    @Query() dateRange: DateRangeDto,
  ): Promise<TransactionResponse[]> {
    return this.transactionsService.findByDateRange(user.id, dateRange);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found transaction',
    type: TransactionResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<TransactionResponse> {
    return this.transactionsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: TransactionResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @User() user: UserEntity,
  ): Promise<TransactionResponse> {
    return this.transactionsService.update(id, user.id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<void> {
    return this.transactionsService.remove(id, user.id);
  }
}