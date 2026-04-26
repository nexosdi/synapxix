import { CreateDimensionDto } from "./create-dimension.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDimensionDto extends PartialType(CreateDimensionDto) { }