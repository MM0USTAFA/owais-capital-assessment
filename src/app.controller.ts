import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ping')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor() {}

  @Get('/ping')
  getOk() {
    return { status: 'Ok', message: 'server is running' };
  }
}
