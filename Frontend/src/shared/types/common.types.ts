/**
 * Common Type Definitions
 */

/**
 * HTTP Method Types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

/**
 * HTTP Status Codes
 */
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = typeof HttpStatusCode[keyof typeof HttpStatusCode];

/**
 * Generic request/response types
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
  withCredentials?: boolean;
}

export interface ResponseConfig<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

/**
 * Query Filter Types
 */
export interface QueryFilter {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains";
  value: unknown;
}

export interface QuerySort {
  field: string;
  direction: "asc" | "desc";
}

export interface QueryOptions {
  filters?: QueryFilter[];
  sort?: QuerySort[];
  pagination?: {
    page: number;
    limit: number;
  };
}

/**
 * Generic List Response
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * File Upload Types
 */
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

/**
 * Form State Types
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Async State Types
 */
export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T, E = Error> {
  status: AsyncStatus;
  data: T | null;
  error: E | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Mutation Types
 */
export interface MutationState<T, E = Error> extends AsyncState<T, E> {
  reset: () => void;
  mutate: (data: T) => Promise<T>;
}

/**
 * Tree Node Types
 */
export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  data?: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
  disabled?: boolean;
}

/**
 * Select Option Types
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  group?: string;
}

/**
 * Badge Types
 */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
export type BadgeSize = "sm" | "md" | "lg";

/**
 * Button State Types
 */
export type ButtonState = "idle" | "loading" | "success" | "error" | "disabled";

/**
 * Notification Alert Types
 */
export type AlertSeverity = "info" | "success" | "warning" | "error";
export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Modal/Dialog Types
 */
export type DialogAction = "open" | "close" | "cancel" | "confirm";

/**
 * Breakpoint Types
 */
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Side Types
 */
export type Side = "top" | "right" | "bottom" | "left";

/**
 * Alignment Types
 */
export type Alignment = "start" | "center" | "end";

/**
 * VirtualList Types
 */
export interface VirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  bufferSize?: number;
  isHorizontal?: boolean;
}

/**
 * Drag & Drop Types
 */
export interface DragItem<T = unknown> {
  id: string;
  type: string;
  data: T;
}

export interface DropZoneOptions {
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  noDrag?: boolean;
  noClick?: boolean;
}
