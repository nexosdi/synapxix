import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/data-access/prisma.service';
import { PaginationDto } from '../../../shared/data-access/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../shared/data-access/dto/base-response.dto';
import { CreateDimensionDto } from './dto/create-dimension.dto';
import { UpdateDimensionDto } from './dto/update-dimension.dto';

@Injectable()
export class DimensionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDimensionDto: CreateDimensionDto) {
        try {
            return await this.prisma.dimension.create({
                data: createDimensionDto,
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { skip, limit, page } = paginationDto;

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.dimension.findMany({
                skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            this.prisma.dimension.count(),
        ]);

        return new PaginatedResponseDto(items, totalItems, page, limit);
    }

    async findOne(id: number) {
        const dimension = await this.prisma.dimension.findUnique({
            where: { id },
        });

        if (!dimension) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return dimension;
    }

    async update(id: number, updateDimensionDto: UpdateDimensionDto) {
        try {
            await this.findOne(id); // Ensure the dimension exists
            return await this.prisma.dimension.update({
                where: { id },
                data: updateDimensionDto,
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async remove(id: number) {
        try {
            await this.findOne(id); // Ensure the dimension exists
            return await this.prisma.dimension.delete({
                where: { id },
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}