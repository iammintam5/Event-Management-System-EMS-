import type { ApiSuccess } from '@ems/shared';

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiGet<T>(
  path: string,
  signal?: AbortSignal,
): Promise<ApiSuccess<T>> {
  const timeout = AbortSignal.timeout(10_000);
  const response = await fetch(`${apiUrl}${path}`, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok)
    throw new Error(
      `API trả mã ${response.status}. Kiểm tra backend và database rồi thử lại.`,
    );
  return response.json() as Promise<ApiSuccess<T>>;
}
