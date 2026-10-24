import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateConsentDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  scope: string;

  @IsString()
  @IsNotEmpty()
  status: 'GRANTED' | 'REVOKED';
}
