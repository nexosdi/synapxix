import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'director')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers(@Query() query: GetUsersDto, @Request() req: { user: Record<string, unknown> }) {
    return this.adminService.getUsers(query, req.user);
  }

  @Get('users/:id/metrics')
  async getUserMetrics(@Param('id') id: string) {
    return this.adminService.getUserMetrics(id);
  }

  @Get('institutions/:id/stats')
  async getInstitutionStats(@Param('id') id: string) {
    return this.adminService.getInstitutionStats(id);
  }
}
