import { TaskStatus } from "~/utils/enums";
import type { AsyncRequest, PaginatedAsyncRequest } from "./types";

export const defaultAsyncRequestState: AsyncRequest = {
  status: TaskStatus.Idle,
  error: null,
};

export const defaultPaginatedAsyncRequestState: PaginatedAsyncRequest = {
  ...defaultAsyncRequestState,
  currentPage: 0,
  hasMore: true,
};
