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
  HttpStatus
} from '@nestjs/common';
import { DimensionsService } from './dimensions.service';
import { CreateDimensionDto } from './dto/create-dimension.dto';
import { UpdateDimensionDto } from './dto/update-dimension.dto';
import { PaginationDto } from '../../../shared/data-access/dto/pagination.dto';
import { IdParamDto } from '../../../shared/data-access/dto/id-param.dto';

@Controller('dimensions')
export class DimensionsController {
  constructor(private readonly dimensionsService: DimensionsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDimensionDto: CreateDimensionDto) {
    return this.dimensionsService.create(createDimensionDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.dimensionsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.dimensionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdParamDto,
    @Body() updateDimensionDto: UpdateDimensionDto
  ) {
    return this.dimensionsService.update(id, updateDimensionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() { id }: IdParamDto) {
    await this.dimensionsService.remove(id);
  }
}
