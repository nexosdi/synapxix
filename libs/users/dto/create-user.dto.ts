import { 
  IsEmail, 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean, 
  MaxLength, 
  MinLength 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(3)
  @MaxLength(150)
  username: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  lastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  role?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @
  created_at: Date;
}
