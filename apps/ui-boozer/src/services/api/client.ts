/**
 * Normalized API error response
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * Request options
 */
export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * API Client configuration
 */
export interface ClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

/**
 * REST API Client
 * Handles JSON requests/responses, error normalization, and timeout support
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000; // 30s default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  /**
   * Set the base URL (for dynamic configuration)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const timeoutMs = options?.timeout || this.timeout;
    const headers = { ...this.defaultHeaders, ...options?.headers };

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let responseData: unknown;

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw this.normalizeError(responseData, response.status);
      }

      return {
        data: responseData as T,
        status: response.status,
        headers: this.headersToObject(response.headers),
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.normalizeError(error);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Normalize errors into consistent shape
   */
  private normalizeError(error: unknown, status?: number): ApiError {
    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        message: 'Request timeout',
        code: 'TIMEOUT',
        status: 408,
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        message: 'Network error',
        code: 'NETWORK_ERROR',
        status: 0,
      };
    }

    // Handle API error responses
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorObj = error as Record<string, unknown>;
      return {
        message: String(errorObj.message || 'Unknown error'),
        code: String(errorObj.code || 'API_ERROR'),
        status: status || (errorObj.status as number | undefined),
      };
    }

    // Handle generic error objects
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        status,
      };
    }

    // Fallback
    return {
      message: String(error || 'Unknown error'),
      code: 'UNKNOWN_ERROR',
      status,
    };
  }

  /**
   * Convert Headers object to plain object
   */
  private headersToObject(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
}

/**
 * Create and export a default client instance
 */
export const createApiClient = (baseUrl: string, config?: Partial<ClientConfig>) => {
  return new ApiClient({
    baseUrl,
    ...config,
  });
};
