import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ping')
@Controller()
export class AppController {
  constructor() {}

  @Get('/ping')
  getOk() {
    return { status: 'Ok', message: 'server is running' };
  }
}
