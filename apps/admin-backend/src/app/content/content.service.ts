import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/data-access/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { PaginationDto } from '../../../shared/data-access/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../shared/data-access/dto/base-response.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createContentDto: CreateContentDto) {
        try {
            return await this.prisma.content.create({
                data: createContentDto,
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { skip, limit, page } = paginationDto;

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.content.findMany({
                skip,
                take: limit,
                orderBy: { id: 'desc' },    // recent content first
            }),
            this.prisma.content.count(),
        ]);

        return new PaginatedResponseDto(items, totalItems, page, limit);
    }

    async findOne(id: number) {
        const content = await this.prisma.content.findUnique({
            where: { id },
        });

        if (!content) {
            throw new NotFoundException(`Content with ID ${id} not found`);
        }

        return content;
    }

    async update(id: number, updateContentDto: UpdateContentDto) {
        try {
            await this.findOne(id); // Ensure the content exists
            return await this.prisma.content.update({
                where: { id },
                data: updateContentDto,
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async remove(id: number) {
        try {
            await this.findOne(id); // Ensure the content exists
            return await this.prisma.content.delete({
                where: { id },
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // search by title or description
    async search(query: string, paginationDto: PaginationDto) {
        const { skip, limit, page } = paginationDto;

        const [items, totalItems] = await this.prisma.$transaction([
            this.prisma.content.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
                skip,
                take: limit,
                orderBy: { id: 'desc' },    // recent content first
            }),
            this.prisma.content.count({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
            }),
        ]);

        return new PaginatedResponseDto(items, totalItems, page, limit);    
    }
}