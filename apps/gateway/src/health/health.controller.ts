import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto, HealthUnavailableDto } from './health.dto.js';
import { HealthService } from './health.service.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Check Gateway, NATS and all five service responders (not database readiness)',
  })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiResponse({ status: 503, type: HealthUnavailableDto })
  async check(): Promise<HealthResponseDto> {
    const data = await this.health.check();
    if (data.broker !== 'up' || Object.values(data.services).some((status) => status !== 'up')) {
      throw new ServiceUnavailableException({
        message: 'One or more platform components are unavailable',
        error: 'Service Unavailable',
        data,
      });
    }
    return { success: true, data };
  }
}
