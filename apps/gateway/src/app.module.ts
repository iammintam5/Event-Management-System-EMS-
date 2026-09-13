import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { validateEnvironment } from './config/environment.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { NatsModule } from './messaging/nats.module.js';
import { HealthController } from './health/health.controller.js';
import { HealthService } from './health/health.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }), NatsModule],
  controllers: [HealthController],
  providers: [HealthService, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
