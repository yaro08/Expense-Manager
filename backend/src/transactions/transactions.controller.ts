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
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator'; // Importamos el decorador correcto
import { UserEntity } from '../auth/user.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
      @Body() createTransactionDto: Partial<Transaction>,
      @User() user: UserEntity,
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.transactionsService.findAll(user.id);
  }

  @Get('date-range')
  findByDateRange(
      @User() user: UserEntity,
      @Query('startDate') startDate: string,
      @Query('endDate') endDate: string,
  ) {
    return this.transactionsService.findByDateRange(
        user.id,
        new Date(startDate),
        new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.transactionsService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(
      @Param('id') id: string,
      @Body() updateTransactionDto: Partial<Transaction>,
      @User() user: UserEntity,
  ) {
    return this.transactionsService.update(+id, user.id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.transactionsService.remove(+id, user.id);
  }
}
