export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T | null; 
    error?: string;
    statusCode: number;
  }

  export type ApiError = {
    message: string;
    // Add any other error properties you might need
  };