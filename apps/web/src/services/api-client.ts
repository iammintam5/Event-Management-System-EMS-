import type { ApiError, ApiResponse } from '@ems/shared';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not configured');
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://'))
    throw new Error('API path must be relative');
  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (typeof options.body === 'string' && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
    ...options,
    headers,
    signal: options.signal ?? AbortSignal.timeout(10_000),
  });
  const body: ApiResponse<T> = await response.json().catch(() => {
    throw new ApiRequestError('Gateway returned an invalid response', response.status);
  });
  if (!body || typeof body !== 'object' || typeof body.success !== 'boolean')
    throw new ApiRequestError('Gateway returned an invalid response', response.status);
  if (!response.ok || body.success !== true) {
    const message = (body as ApiError).message;
    throw new ApiRequestError(
      Array.isArray(message) ? message.join(', ') : message || 'Request failed',
      response.status,
      body,
    );
  }
  return body.data;
}
