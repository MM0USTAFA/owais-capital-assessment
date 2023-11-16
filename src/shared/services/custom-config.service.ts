import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVVariables } from 'src/config/env.conf';

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  get(key: keyof ENVVariables) {
    return this.configService.get(key);
  }
}
