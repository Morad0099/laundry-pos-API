import type { ApiResponse } from '../types/response.types';

export class ResponseHandler {
  static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
    return {
      status: true,
      message,
      data,
      statusCode
    };
  }

  static error<T>(message: string, statusCode = 400, error?: string): ApiResponse<T> {
    return {
      status: false,
      message,
      error,
      statusCode,
      data: null
    };
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return this.success(data, message, 201);
  }

  static notFound<T>(resource = 'Resource'): ApiResponse<T> {
    return this.error<T>(`${resource} not found`, 404);
  }

  static badRequest<T>(message = 'Bad request'): ApiResponse<T> {
    return this.error<T>(message, 400);
  }

  static unauthorized<T>(message = 'Unauthorized'): ApiResponse<T> {
    return this.error<T>(message, 401);
  }
}