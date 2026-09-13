import 'reflect-metadata';
import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validateEnvironment } from './config/environment.js';

async function bootstrap() {
  const config = validateEnvironment(process.env);
  const { AppModule } = await import('./app.module.js');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    abortOnError: false,
    transport: Transport.NATS,
    options: {
      servers: [config.NATS_URL],
      queue: 'operations-service',
      timeout: 2000,
      reconnect: true,
      maxReconnectAttempts: -1,
      reconnectTimeWait: 1000,
    },
  });
  app.enableShutdownHooks();
  await app.listen();
}

void bootstrap().catch((error: unknown) => {
  // Only our validation messages are safe to print. Driver errors may include credentials.
  const message =
    error instanceof Error &&
    /^(Missing environment variable:|Invalid environment variable:|DATABASE_URL must|DIRECT_URL must|JWT )/.test(
      error.message,
    )
      ? error.message
      : 'operations service startup failed. Check environment and NATS availability.';
  Logger.error(message, 'Bootstrap');
  process.exitCode = 1;
});
