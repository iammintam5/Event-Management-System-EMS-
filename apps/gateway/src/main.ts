import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const config = app.get(ConfigService);
  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(config.getOrThrow<number>('PORT'));
}

void bootstrap().catch(() => {
  Logger.error(
    'Gateway startup failed. Check environment validation and port availability.',
    'Bootstrap',
  );
  process.exitCode = 1;
});
