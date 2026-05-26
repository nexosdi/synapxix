import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express'; // <--- Esto es necesario para el tipado en Nest
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { Auth0JwtPayload } from '../auth/jwt.strategy';
import { ProfileService } from './profile.service';
import { UpdatePreferencesDto } from './dto/updated-preferences';

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

@Get()
async get(@Req() req: Request) {
  const userId = (req.user as Auth0JwtPayload).sub!; 
  return this.profileService.getPreferences(userId);
}

  @Patch()
  async update(
    @Req() req: Request, 
    @Body() updatePreferencesDto: UpdatePreferencesDto 
  ) {
    const userId = (req.user as Auth0JwtPayload).sub!;
    return this.profileService.updatePreferences(userId, updatePreferencesDto);
  }
}