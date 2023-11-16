import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getOk() {
    return { status: 'Ok', message: 'server is running' };
  }
}
