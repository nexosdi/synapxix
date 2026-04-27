// /server/src/app/profile/dto/updated-preferences.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferencesDto { // <--- ASEGÚRATE DE QUE DIGA 'export'
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  notifications?: boolean;
}