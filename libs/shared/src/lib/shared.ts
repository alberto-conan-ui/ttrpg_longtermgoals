export interface HealthResponse {
  status: 'ok' | 'error';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
