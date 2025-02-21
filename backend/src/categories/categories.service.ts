import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateCategoryDto: Partial<Category>,
  ): Promise<Category | null> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.update(id, { isActive: false });
  }
}