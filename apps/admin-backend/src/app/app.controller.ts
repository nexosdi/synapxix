import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, Resource } from 'nest-keycloak-connect';

@Controller()
@Resource('prueba')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('public')
  @Public()
  getPublicData() {
    return { message: 'This is public data' };
  }
}
