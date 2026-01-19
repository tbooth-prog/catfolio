import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Image } from "~/api/types";
import { ApiClient } from "~/service/apiClient";
import { GalleryFilter, GallerySortOption, TaskStatus } from "~/utils/enums";

type GalleryState = {
  status: TaskStatus;
  error: string | null;
  images: Image[];
  page: number;
  filter: GalleryFilter;
  sort: GallerySortOption;
};

const initialState: GalleryState = {
  status: TaskStatus.Idle,
  error: null,
  images: [],
  page: 0,
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
        state.status = TaskStatus.Pending;
        state.images = [];
        state.error = null;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.status = TaskStatus.Succeded;
        state.images = action.payload;
      })
      .addCase(getImages.rejected, (state, action) => {
        state.status = TaskStatus.Failed;
        state.error = action.error.message || "Failed to load images";
      });
  },
});

// Thunks ==================================================================
export const getImages = createAsyncThunk("gallery/getImages", async () => {
  return ApiClient.getClient().images.searchImages({ limit: 40 });
});

// Actions =================================================================

// Reducer =================================================================
export default gallerySlice.reducer;
