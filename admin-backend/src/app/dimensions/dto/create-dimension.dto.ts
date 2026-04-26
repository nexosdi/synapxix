import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateDimensionDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;
}