import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HEALTH_PATTERNS, type ServiceHealth } from '@ems/contracts';

@Controller()
export class HealthController {
  @MessagePattern(HEALTH_PATTERNS.OPERATIONS)
  check(): ServiceHealth {
    return { service: 'operations', status: 'up' };
  }
}
