export * from './environment.js';
export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  message: string | string[];
  error: string;
  statusCode: number;
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
