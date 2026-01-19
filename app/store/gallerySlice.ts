import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Image } from "~/api/types";
import { ApiClient } from "~/service/apiClient";
import type { RootState } from "~/store";
import { GalleryFilter, GallerySortOption, TaskStatus } from "~/utils/enums";
import type {
  AsyncRequest,
  PaginatedAsyncRequest,
  PaginatedAsyncResult,
} from "./types";
import {
  defaultAsyncRequestState,
  defaultPaginatedAsyncRequestState,
} from "./defaultState";
import { dedupeById } from "~/utils";

type GalleryState = {
  initial: AsyncRequest;
  images: Image[];
  pagination: PaginatedAsyncRequest;
  filter: GalleryFilter;
  sort: GallerySortOption;
};

const initialState: GalleryState = {
  initial: defaultAsyncRequestState,
  images: [],
  pagination: defaultPaginatedAsyncRequestState,
  filter: GalleryFilter.None,
  sort: GallerySortOption.None,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get images
    builder
      .addCase(getImages.pending, (state) => {
        state.initial.status = TaskStatus.Pending;
        state.images = [];
        state.initial.error = null;
        // Reset pagination as this is an initial load
        state.pagination = defaultPaginatedAsyncRequestState;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.initial.status = TaskStatus.Succeded;
        state.images = action.payload;
      })
      .addCase(getImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });

    // Get more images
    builder
      .addCase(getMoreImages.pending, (state) => {
        state.pagination.status = TaskStatus.Pending;
        state.pagination.error = null;
      })
      .addCase(
        getMoreImages.fulfilled,
        (state, action: PayloadAction<PaginatedAsyncResult<Image>>) => {
          state.images = dedupeById([...state.images, ...action.payload.items]);
          state.pagination = {
            ...action.payload.pagination,
            status: TaskStatus.Succeded,
            error: null,
          };
        },
      )
      .addCase(getMoreImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });
  },
});

// Thunks ==================================================================
// Fetch random set of images
export const getImages = createAsyncThunk("gallery/getImages", async () => {
  return ApiClient.getClient().images.searchImages({ limit: 50 });
});

export const getMoreImages = createAsyncThunk<PaginatedAsyncResult<Image>>(
  "gallery/getMoreImages",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const nextPage = state.gallery.pagination.currentPage + 1;

    const moreImages = await ApiClient.getClient().images.searchImages({
      limit: 50,
      page: nextPage,
    });

    return {
      items: moreImages,
      pagination: {
        currentPage: nextPage,
        hasMore: moreImages.length === 50,
      },
    };
  },
);

// Actions =================================================================

// Reducer =================================================================
export default gallerySlice.reducer;
