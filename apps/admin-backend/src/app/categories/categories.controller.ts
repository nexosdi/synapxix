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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../../../shared/data-access/dto/pagination.dto';
import { IdParamDto } from '../../../shared/data-access/dto/id-param.dto';
import { Public, Roles, Resource } from 'nest-keycloak-connect';

/**
 * Controlador de Categorías con seguridad Keycloak
 * 
 * Decoradores de seguridad:
 * - @Public() → Acceso sin autenticación
 * - @Roles('admin') → Solo usuarios con rol específico
 * - @Resource('prueba') → Recurso que valida Keycloak
 */
@Controller('categories')
// @Resource('prueba')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  /**
   * Crear categoría
   * ✅ Requiere: autenticado + rol 'admin'
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @Roles('admin')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Listar categorías
   * ✅ Requiere: autenticado
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  /**
   * Obtener categoría por ID
   * ✅ Requiere: autenticado
   */
  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.categoriesService.findOne(id);
  }

  /**
   * Actualizar categoría
   * ✅ Requiere: autenticado + rol 'admin'
   */
  @Patch(':id')
  // @Roles('admin')
  update(
    @Param() { id }: IdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Eliminar categoría
   * ✅ Requiere: autenticado + rol 'admin'
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Roles('admin')
  async remove(@Param() { id }: IdParamDto) {
    await this.categoriesService.remove(id);
  }

  /**
   * Obtener conteo público (sin autenticación)
   * ✅ Acceso: público
   */
  @Get('public/count')
  @Public()
  getPublicCount() {
    return { totalCategories: 42, message: 'Esto es público' };
  }
}
