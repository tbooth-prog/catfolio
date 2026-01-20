import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { GalleryFilter, GallerySortOption, TaskStatus } from "~/utils/enums";
import type {
  AsyncRequest,
  GalleryImage,
  PaginatedAsyncRequest,
  PaginatedAsyncResult,
} from "./types";
import {
  defaultAsyncRequestState,
  defaultPaginatedAsyncRequestState,
} from "./defaultState";
import { ApiClient } from "~/service/apiClient";
import {
  dedupeById,
  GALLERY_PAGE_SIZE,
  getOrCreateUserId,
  mapFavouriteToGalleryImage,
  mapUserImageToGalleryImage,
} from "~/utils";
import type { Image, UserImage } from "~/api/types";
import type { RootState } from "~/store";

type GalleryState = {
  initial: AsyncRequest;
  images: GalleryImage[];
  allImagesCache: GalleryImage[];
  pagination: PaginatedAsyncRequest;
  filter: GalleryFilter;
  sort: GallerySortOption;
};

const initialState: GalleryState = {
  initial: defaultAsyncRequestState,
  images: [],
  allImagesCache: [],
  pagination: defaultPaginatedAsyncRequestState,
  filter: GalleryFilter.MyImages,
  sort: GallerySortOption.None,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    resetGallery: () => initialState,
  },
  extraReducers: (builder) => {
    // Get my images
    builder
      .addCase(getMyImages.pending, (state) => {
        state.initial.status = TaskStatus.Pending;

        // If the previous gallery was showing all images - move them to the cache before changing filter
        if (state.filter === GalleryFilter.All) {
          state.allImagesCache = state.images;
        }

        state.images = [];
        state.initial.error = null;
        // Update current filter
        state.filter = GalleryFilter.MyImages;
        // Reset pagination as this is an initial load
        state.pagination = defaultPaginatedAsyncRequestState;
      })
      .addCase(getMyImages.fulfilled, (state, action) => {
        state.initial.status = TaskStatus.Succeded;
        state.images = action.payload.map((image) =>
          mapUserImageToGalleryImage(image),
        );
      })
      .addCase(getMyImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });

    // Get more my images
    builder
      .addCase(getMoreMyImages.pending, (state) => {
        state.pagination.status = TaskStatus.Pending;
        state.pagination.error = null;
      })
      .addCase(
        getMoreMyImages.fulfilled,
        (state, action: PayloadAction<PaginatedAsyncResult<UserImage>>) => {
          const moreGalleryItems = action.payload.items.map((image) =>
            mapUserImageToGalleryImage(image),
          );
          state.images = dedupeById([...state.images, ...moreGalleryItems]);

          state.pagination = {
            ...action.payload.pagination,
            status: TaskStatus.Succeded,
            error: null,
          };
        },
      )
      .addCase(getMoreMyImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });

    // Get images
    builder
      .addCase(getAllImages.pending, (state) => {
        state.initial.status = TaskStatus.Pending;
        state.images = [];
        state.initial.error = null;
        state.filter = GalleryFilter.All;
        // Reset pagination as this is an initial load
        state.pagination = defaultPaginatedAsyncRequestState;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.initial.status = TaskStatus.Succeded;
        state.images = action.payload;
      })
      .addCase(getAllImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });

    // Get more images
    builder
      .addCase(getMoreAllImages.pending, (state) => {
        state.pagination.status = TaskStatus.Pending;
        state.pagination.error = null;
      })
      .addCase(
        getMoreAllImages.fulfilled,
        (state, action: PayloadAction<PaginatedAsyncResult<Image>>) => {
          state.images = dedupeById([...state.images, ...action.payload.items]);
          state.pagination = {
            ...action.payload.pagination,
            status: TaskStatus.Succeded,
            error: null,
          };
        },
      )
      .addCase(getMoreAllImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });

    // Get favourite images
    builder
      .addCase(getFavouriteImages.pending, (state) => {
        state.initial.status = TaskStatus.Pending;

        // If the previous gallery was showing all images - move them to the cache before changing filter
        if (state.filter === GalleryFilter.All) {
          state.allImagesCache = state.images;
        }

        state.images = [];
        state.initial.error = null;
        // Update current filter
        state.filter = GalleryFilter.Favourites;
        // Reset pagination as this is an initial load
        state.pagination = defaultPaginatedAsyncRequestState;
      })
      .addCase(getFavouriteImages.fulfilled, (state, action) => {
        state.initial.status = TaskStatus.Succeded;
        state.images = action.payload.map((favourite) =>
          mapFavouriteToGalleryImage(favourite),
        );
      })
      .addCase(getFavouriteImages.rejected, (state, action) => {
        state.initial.status = TaskStatus.Failed;
        state.initial.error = action.error.message || "Failed to load images";
      });
  },
});

// Thunks ==================================================================
// Fetch my images
export const getMyImages = createAsyncThunk("gallery/getMyImages", async () => {
  return ApiClient.getClient().images.getImages({
    subId: getOrCreateUserId(),
    limit: GALLERY_PAGE_SIZE,
    size: "small",
  });
});

export const getMoreMyImages = createAsyncThunk<
  PaginatedAsyncResult<UserImage>
>("gallery/getMoreMyImages", async (_, { getState }) => {
  const state = getState() as RootState;
  const nextPage = state.gallery.pagination.currentPage + 1;

  const moreImages = await ApiClient.getClient().images.getImages({
    limit: GALLERY_PAGE_SIZE,
    size: "small",
    page: nextPage,
  });

  return {
    items: moreImages,
    pagination: {
      currentPage: nextPage,
      hasMore: moreImages.length === 50,
    },
  };
});

// -------------------------------------------------------------------------
// Fetch random set of images
export const getAllImages = createAsyncThunk(
  "gallery/getAllImages",
  async (_, { getState }) => {
    const state = getState() as RootState;

    // Return the current cache if there is one to save an API call
    if (state.gallery.allImagesCache.length > 0) {
      return state.gallery.allImagesCache;
    }

    return ApiClient.getClient().images.searchImages({
      limit: GALLERY_PAGE_SIZE,
      size: "small",
    });
  },
);

export const getMoreAllImages = createAsyncThunk<PaginatedAsyncResult<Image>>(
  "gallery/getMoreAllImages",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const nextPage = state.gallery.pagination.currentPage + 1;

    const moreImages = await ApiClient.getClient().images.searchImages({
      limit: GALLERY_PAGE_SIZE,
      size: "small",
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

// -------------------------------------------------------------------------
// Fetch my favourites
export const getFavouriteImages = createAsyncThunk(
  "gallery/getFavouriteImages",
  async () => {
    return ApiClient.getClient().favourites.getFavourites(getOrCreateUserId());
  },
);

// Actions =================================================================
export const { resetGallery } = gallerySlice.actions;

// Reducer =================================================================
export default gallerySlice.reducer;
