// src/auth/api-key.service.ts
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hashCrypto } from 'src/utils/api-key.util';
import { ApiKey } from '../database/api-keys.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey) private apiKeyRepo: Repository<ApiKey>,
    private config: ConfigService,
  ) {}

  async validateApiKey(rawKey: string) {
    const secret = this.config.get<string>('API_KEY_SECRET') ?? '';
    const hashedKey = hashCrypto(rawKey, secret);

    return this.apiKeyRepo.findOne({ where: { keyHash: hashedKey } });
  }
}
