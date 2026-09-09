import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API readiness and PostgreSQL connectivity through Prisma',
  })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        data: {
          status: 'ok',
          database: 'up',
          timestamp: '2026-09-09T00:00:00.000Z',
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({ description: 'Database unavailable' })
  check() {
    return this.health.check();
  }
}
