import * as bcrypt from 'bcrypt';
import { CustomConfigService } from './custom-config.service';
import { Inject } from '@nestjs/common';

export class HashService {
  constructor(
    @Inject(CustomConfigService) private configService: CustomConfigService,
  ) {}

  async hash(valueToHash: string): Promise<string> {
    return await bcrypt.hash(
      valueToHash,
      this.configService.get('ENCRYPTION_ROUNDS'),
    );
  }

  async compare(hashedValue: string, valueToCompere: string): Promise<boolean> {
    return await bcrypt.compare(valueToCompere, hashedValue);
  }
}
