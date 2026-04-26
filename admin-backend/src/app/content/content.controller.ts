import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PaginationDto } from '../../../shared/data-access/dto/pagination.dto';
import { IdParamDto } from '../../../shared/data-access/dto/id-param.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contentService.findAll(paginationDto);
  }

  @Get()
  search(@Query('q') query: string, @Query() paginationDto: PaginationDto) {
    return this.contentService.search(query, paginationDto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdParamDto, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdParamDto) {
    await this.contentService.remove(id);
  }
}
