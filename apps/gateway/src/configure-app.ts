import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApp(app: INestApplication): void {
  // Keep the leading slash: the HTTP adapter also uses this prefix for error middleware.
  app.setGlobalPrefix('/api');
  app.enableCors({ origin: app.get(ConfigService).getOrThrow<string>('FRONTEND_URL') });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  const swagger = new DocumentBuilder()
    .setTitle('Event Management System API')
    .setDescription('API Gateway for Event Management System Microservices')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));
}
