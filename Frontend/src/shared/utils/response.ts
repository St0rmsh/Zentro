/**
 * Response Helpers
 * Utilities for handling API responses and standardizing response data
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
  timestamp?: string;
}

/**
 * Create successful response
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || "Operation successful",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create error response
 */
export function errorResponse(error: string, statusCode?: number): ApiErrorResponse {
  return {
    success: false,
    error,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if response is successful
 */
export function isSuccessResponse<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as ApiResponse).success === true
  );
}

/**
 * Check if response is error
 */
export function isErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as ApiResponse).success === false
  );
}

/**
 * Extract error message from response
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") return error.message;
    if ("error" in error && typeof error.error === "string") return error.error;
    if ("data" in error && typeof error.data === "object") {
      const data = error.data as Record<string, unknown>;
      if ("message" in data && typeof data.message === "string") return data.message;
      if ("error" in data && typeof data.error === "string") return data.error;
    }
  }
  return "An unexpected error occurred";
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    total,
    page,
    limit,
    hasMore: page < totalPages,
    totalPages,
  };
}

/**
 * Validate paginated response structure
 */
export function isPaginatedResponse<T>(
  data: unknown
): data is PaginatedResponse<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    "total" in data &&
    "page" in data &&
    "limit" in data &&
    Array.isArray((data as PaginatedResponse<unknown>).items)
  );
}

/**
 * Transform API response to local format
 */
export function transformResponse<T, U>(
  response: ApiResponse<T>,
  transformer: (data: T) => U
): ApiResponse<U> {
  if (!response.data) {
    return response as unknown as ApiResponse<U>;
  }
  return {
    ...response,
    data: transformer(response.data),
  };
}
