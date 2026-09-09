/** Public HTTP contracts only. Never export database models or secrets here. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: { statusCode: number; message: string | string[]; path: string };
}

export interface HealthStatus {
  status: 'ok';
  database: 'up';
  timestamp: string;
}
