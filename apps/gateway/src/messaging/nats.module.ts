import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const NATS_CLIENT = 'NATS_CLIENT';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NATS_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.getOrThrow<string>('NATS_URL')],
            timeout: 1000,
            reconnect: true,
            maxReconnectAttempts: -1,
            reconnectTimeWait: 1000,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}
