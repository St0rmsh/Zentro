/**
 * Pagination Types
 */

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Cursor {
  id: string;
  timestamp: number;
}

export interface CursorPaginationParams {
  cursor?: Cursor;
  limit: number;
}

export interface CursorPaginatedData<T> {
  data: T[];
  nextCursor?: Cursor;
  hasMore: boolean;
}
