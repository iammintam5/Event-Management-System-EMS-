import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { validateEnvironment } from './config/environment.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    PrismaModule,
    // Access-token signing foundation only. No authentication handlers in Phase 0.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '15m',
          issuer: 'ems-identity',
          audience: 'ems-gateway',
        },
        verifyOptions: { algorithms: ['HS256'], issuer: 'ems-identity', audience: 'ems-gateway' },
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
