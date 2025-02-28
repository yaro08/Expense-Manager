import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategoriesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a category', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };

      const mockCategory = {
        id: 1,
        ...createCategoryDto,
        isActive: true,
      };

      mockCategoriesRepository.create.mockReturnValue(mockCategory);
      mockCategoriesRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesRepository.create).toHaveBeenCalledWith({
        ...createCategoryDto,
        isActive: true,
      });
      expect(mockCategoriesRepository.save).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw BadRequestException when creation fails', async () => {
      mockCategoriesRepository.save.mockRejectedValue(new Error());

      await expect(service.create({ name: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of active categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1', isActive: true },
        { id: 2, name: 'Category 2', isActive: true },
      ];

      mockCategoriesRepository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
      expect(mockCategoriesRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' }
      });
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const mockCategory = { id: 1, name: 'Test Category', isActive: true };
      mockCategoriesRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      const updateDto = { name: 'Updated Category' };
      const mockCategory = { id: 1, name: 'Updated Category', isActive: true };

      mockCategoriesRepository.findOne
        .mockResolvedValueOnce(mockCategory) // for the initial findOne
        .mockResolvedValueOnce(mockCategory); // for the findOne after update
      mockCategoriesRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should soft delete a category', async () => {
      const mockCategory = { id: 1, name: 'Test Category', isActive: true };
      mockCategoriesRepository.findOne.mockResolvedValue(mockCategory);
      mockCategoriesRepository.update.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockCategoriesRepository.update).toHaveBeenCalledWith(1, {
        isActive: false,
      });
    });
  });
});