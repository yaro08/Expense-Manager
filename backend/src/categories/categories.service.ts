import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponse } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponse> {
    try {
      const category = this.categoriesRepository.create({
        ...createCategoryDto,
        isActive: true,
      });
      const savedCategory = await this.categoriesRepository.save(category);
      return new CategoryResponse(savedCategory);
    } catch (error) {
      throw new BadRequestException('Failed to create category');
    }
  }

  async findAll(): Promise<CategoryResponse[]> {
    const categories = await this.categoriesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
    return categories.map(category => new CategoryResponse(category));
  }

  async findOne(id: number): Promise<CategoryResponse> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return new CategoryResponse(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponse> {
    const category = await this.findOne(id);
    try {
      await this.categoriesRepository.update(id, updateCategoryDto);
      const updatedCategory = await this.categoriesRepository.findOne({ where: { id } });
      return new CategoryResponse(updatedCategory!);
    } catch (error) {
      throw new BadRequestException(`Failed to update category with ID ${id}`);
    }
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    try {
      await this.categoriesRepository.update(id, { isActive: false });
    } catch (error) {
      throw new BadRequestException(`Failed to delete category with ID ${id}`);
    }
  }
}