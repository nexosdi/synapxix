import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { PaginationDto } from '../../../shared/data-access/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../shared/data-access/dto/base-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);
    
    constructor(private readonly prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            return await this.prisma.category.create({
                data: createCategoryDto,
            });
        } catch (e) {
            this.logger.error(`Failed to create category: ${e.message}`, e.stack);
            throw e;
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { skip, limit, page } = paginationDto;

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.category.findMany({
                skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            this.prisma.category.count(),
        ]);

        return new PaginatedResponseDto(items, totalItems, page, limit);
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        try {
            await this.findOne(id); // Ensure the category exists
            return await this.prisma.category.update({
                where: { id },
                data: updateCategoryDto,
            });
        } catch (e) {
            this.logger.error(`Failed to update category with ID ${id}: ${e.message}`, e.stack);
            throw e;
        }
    }

    async remove(id: number) {
        try {
            await this.findOne(id); // Ensure the category exists
            return await this.prisma.category.delete({
                where: { id },
            });
        } catch (e) {
            this.logger.error(`Failed to remove category with ID ${id}: ${e.message}`, e.stack);
            throw e;
        }
    }
}