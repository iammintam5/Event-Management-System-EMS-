import { ApiProperty } from '@nestjs/swagger';

export class ServicesHealthDto {
  @ApiProperty({ enum: ['up', 'down'] }) identity!: 'up' | 'down';
  @ApiProperty({ enum: ['up', 'down'] }) event!: 'up' | 'down';
  @ApiProperty({ enum: ['up', 'down'] }) registration!: 'up' | 'down';
  @ApiProperty({ enum: ['up', 'down'] }) operations!: 'up' | 'down';
  @ApiProperty({ enum: ['up', 'down'] }) reporting!: 'up' | 'down';
}

export class PlatformHealthDto {
  @ApiProperty({ enum: ['up'] }) gateway!: 'up';
  @ApiProperty({ enum: ['up', 'down'] }) broker!: 'up' | 'down';
  @ApiProperty({ type: ServicesHealthDto }) services!: ServicesHealthDto;
}

export class HealthResponseDto {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: PlatformHealthDto }) data!: PlatformHealthDto;
}

export class HealthUnavailableDto {
  @ApiProperty({ example: false }) success!: false;
  @ApiProperty({ example: 'One or more platform components are unavailable' }) message!: string;
  @ApiProperty({ example: 'Service Unavailable' }) error!: string;
  @ApiProperty({ example: 503 }) statusCode!: number;
  @ApiProperty({ type: PlatformHealthDto }) data!: PlatformHealthDto;
}
