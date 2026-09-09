import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();
  const swagger = new DocumentBuilder()
    .setTitle('Event Management System API')
    .setDescription('Phase 0 — infrastructure and health checks')
    .setVersion('0.0.0')
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swagger),
  );
  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);
  Logger.log(
    `API: http://localhost:${port}/api | Swagger: http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
}

void bootstrap().catch(() => {
  Logger.error(
    'API startup failed. Verify environment, database connectivity and port availability.',
    undefined,
    'Bootstrap',
  );
  process.exitCode = 1;
});
