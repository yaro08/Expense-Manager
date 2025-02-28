import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Groceries',
    description: 'The name of the category'
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Monthly grocery expenses',
    description: 'A description of the category',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Groceries',
    description: 'The name of the category',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Monthly grocery expenses',
    description: 'A description of the category',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the category is active',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CategoryResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category'
  })
  id!: number;

  @ApiProperty({
    example: 'Groceries',
    description: 'The name of the category'
  })
  name!: string;

  @ApiProperty({
    example: 'Monthly grocery expenses',
    description: 'A description of the category'
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the category is active'
  })
  isActive!: boolean;

  constructor(partial: Partial<CategoryResponse>) {
    Object.assign(this, partial);
  }
}