import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): Environment {
    return (this.configService.get<string>('NODE_ENV') as Environment) || Environment.DEVELOPMENT;
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX') || 'api/v1';
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-prod';
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '15m';
  }

  get refreshTokenExpiresIn(): string {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';
  }

  get corsOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ORIGINS');
    if (!origins) return ['http://localhost:5173'];
    return origins.split(',').map((origin) => origin.trim());
  }

  get rateLimitTTL(): number {
    return this.configService.get<number>('RATE_LIMIT_TTL') || 60;
  }

  get rateLimitMax(): number {
    return this.configService.get<number>('RATE_LIMIT_MAX') || 100;
  }

  isDevelopment(): boolean {
    return this.nodeEnv === Environment.DEVELOPMENT;
  }

  isProduction(): boolean {
    return this.nodeEnv === Environment.PRODUCTION;
  }
}
