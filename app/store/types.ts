import type { TaskStatus } from "~/utils/enums";

export interface AsyncRequest {
  status: TaskStatus;
  error: string | null;
}

export interface PaginatedAsyncRequest extends AsyncRequest {
  currentPage: number;
  hasMore: boolean;
}

export interface PaginatedAsyncResult<T> {
  items: T[];
  pagination: {
    currentPage: number;
    hasMore: boolean;
  };
}
