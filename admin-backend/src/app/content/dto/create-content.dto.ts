import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateContentDto {
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;
}