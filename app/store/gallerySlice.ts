import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { GalleryFilter, GallerySortOption, TaskStatus } from '~/utils/enums';
import type { AsyncRequest, FavouriteImageRequest, GalleryImageType, PaginatedAsyncRequest, PaginatedAsyncResult } from './types';
import { defaultAsyncRequestState, defaultPaginatedAsyncRequestState } from './defaultState';
import { ApiClient } from '~/service/apiClient';
import { dedupeById, GALLERY_PAGE_SIZE, getOrCreateUserId, mapFavouriteToGalleryImage, mapUserImageToGalleryImage, mapVoteToGalleryImage } from '~/utils';
import type { Favourite, Image, UserImage, Vote } from '~/api/types';
import type { RootState } from '~/store';
import { getFavourites, getVotes } from '~/api/endpoints';
import { bulkAddFavouriteImages } from './favouriteSlice';
import { getAllVotes } from './voteSlice';

type GalleryState = {
	initial: AsyncRequest;
	images: GalleryImageType[];
	allImagesCache: {
		images: GalleryImageType[];
		currentPage: number;
	};
	pagination: PaginatedAsyncRequest;
	filter: GalleryFilter | null;
	sort: GallerySortOption;
};

const initialState: GalleryState = {
	initial: defaultAsyncRequestState,
	images: [],
	allImagesCache: {
		images: [],
		currentPage: 0,
	},
	pagination: defaultPaginatedAsyncRequestState,
	filter: null,
	sort: GallerySortOption.None,
};

const gallerySlice = createSlice({
	name: 'gallery',
	initialState,
	reducers: {
		resetFilter: (state) => {
			state.filter = null;
		},
		removeImageById: (state, action: PayloadAction<string>) => {
			state.images = state.images.filter((image) => image.id !== action.payload);
		},
		resetGallery: () => initialState,
	},
	extraReducers: (builder) => {
		// Get my images
		builder
			.addCase(getMyImages.pending, (state) => {
				state.initial.status = TaskStatus.Pending;

				// If the previous gallery was showing all images - move them to the cache before changing filter
				if (state.filter === GalleryFilter.All) {
					state.allImagesCache.images = state.images;
					state.allImagesCache.currentPage = state.pagination.currentPage;
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

				state.initial.status = TaskStatus.Succeded;
				if (action.payload.length < GALLERY_PAGE_SIZE) {
					state.pagination.hasMore = false;
				}

				const myImages = action.payload.map((image) => mapUserImageToGalleryImage(image));

				state.images = myImages;
			})
			.addCase(getMyImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get more my images
		builder
			.addCase(getMoreMyImages.pending, (state) => {
				state.pagination.status = TaskStatus.Pending;
				state.pagination.error = null;
			})
			.addCase(getMoreMyImages.fulfilled, (state, action: PayloadAction<PaginatedAsyncResult<UserImage>>) => {
				const moreGalleryItems = action.payload.items.map((image) => mapUserImageToGalleryImage(image));
				state.images = dedupeById([...state.images, ...moreGalleryItems]);

				state.pagination = {
					...action.payload.pagination,
					status: TaskStatus.Succeded,
					error: null,
				};
			})
			.addCase(getMoreMyImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get images
		builder
			.addCase(getAllImages.pending, (state) => {
				state.initial.status = TaskStatus.Pending;
				state.images = [];
				state.initial.error = null;
				state.filter = GalleryFilter.All;
				// Reset pagination as this is an initial load - pull current page from cache
				state.pagination = { ...defaultPaginatedAsyncRequestState, currentPage: state.allImagesCache.currentPage };
			})
			.addCase(getAllImages.fulfilled, (state, action) => {
				state.initial.status = TaskStatus.Succeded;
				if (action.payload.length < GALLERY_PAGE_SIZE) {
					state.pagination.hasMore = false;
				}

				state.images = action.payload;
			})
			.addCase(getAllImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get more images
		builder
			.addCase(getMoreAllImages.pending, (state) => {
				state.pagination.status = TaskStatus.Pending;
				state.pagination.error = null;
			})
			.addCase(getMoreAllImages.fulfilled, (state, action: PayloadAction<PaginatedAsyncResult<Image>>) => {
				state.images = dedupeById([...state.images, ...action.payload.items]);
				state.pagination = {
					...action.payload.pagination,
					status: TaskStatus.Succeded,
					error: null,
				};
			})
			.addCase(getMoreAllImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get favourite images
		builder
			.addCase(getFavouriteImages.pending, (state) => {
				state.initial.status = TaskStatus.Pending;

				// If the previous gallery was showing all images - move them to the cache before changing filter
				if (state.filter === GalleryFilter.All) {
					state.allImagesCache.images = state.images;
					state.allImagesCache.currentPage = state.pagination.currentPage;
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

				state.initial.status = TaskStatus.Succeded;
				if (action.payload.length < GALLERY_PAGE_SIZE) {
					state.pagination.hasMore = false;
				}

				state.images = action.payload.map((favourite) => mapFavouriteToGalleryImage(favourite));
			})
			.addCase(getFavouriteImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get more favourite images
		builder
			.addCase(getMoreFavouriteImages.pending, (state) => {
				state.pagination.status = TaskStatus.Pending;
				state.pagination.error = null;
			})
			.addCase(getMoreFavouriteImages.fulfilled, (state, action: PayloadAction<PaginatedAsyncResult<Favourite>>) => {
				const moreGalleryItems = action.payload.items.map((favourite) => mapFavouriteToGalleryImage(favourite));
				state.images = dedupeById([...state.images, ...moreGalleryItems]);

				state.pagination = {
					...action.payload.pagination,
					status: TaskStatus.Succeded,
					error: null,
				};
			})
			.addCase(getMoreFavouriteImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get voted images
		builder
			.addCase(getTopRatedImages.pending, (state) => {
				state.initial.status = TaskStatus.Pending;

				// If the previous gallery was showing all images - move them to the cache before changing filter
				if (state.filter === GalleryFilter.All) {
					state.allImagesCache.images = state.images;
					state.allImagesCache.currentPage = state.pagination.currentPage;
				}

				state.images = [];
				state.initial.error = null;
				// Update current filter
				state.filter = GalleryFilter.TopRated;
				// Reset pagination as this is an initial load
				state.pagination = defaultPaginatedAsyncRequestState;
			})
			.addCase(getTopRatedImages.fulfilled, (state, action) => {
				state.initial.status = TaskStatus.Succeded;

				state.initial.status = TaskStatus.Succeded;
				if (action.payload.length < GALLERY_PAGE_SIZE) {
					state.pagination.hasMore = false;
				}

				const topRatedImages: GalleryImageType[] = [];

				for (const vote of action.payload) {
					if (vote.image?.url) {
						topRatedImages.push(mapVoteToGalleryImage(vote));
					}
				}

				state.images = dedupeById(topRatedImages);
			})
			.addCase(getTopRatedImages.rejected, (state, action) => {
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});

		// Get more voted images
		builder
			.addCase(getMoreTopRatedImages.pending, (state) => {
				state.pagination.status = TaskStatus.Pending;
				state.pagination.error = null;
			})
			.addCase(getMoreTopRatedImages.fulfilled, (state, action: PayloadAction<PaginatedAsyncResult<Vote>>) => {
				const moreGalleryItems: GalleryImageType[] = [];

				for (const vote of action.payload.items) {
					if (vote.image?.url) {
						moreGalleryItems.push(mapVoteToGalleryImage(vote));
					}
				}

				state.images = dedupeById([...state.images, ...moreGalleryItems]);

				state.pagination = {
					...action.payload.pagination,
					status: TaskStatus.Succeded,
					error: null,
				};
			})
			.addCase(getMoreTopRatedImages.rejected, (state, action) => {
				console.log('failed');
				state.initial.status = TaskStatus.Failed;
				state.initial.error = action.error.message || 'Failed to load images';
			});
	},
});

// Thunks ==================================================================
// Fetch my images
export const getMyImages = createAsyncThunk('gallery/getMyImages', async (_, { dispatch }) => {
	const myImages = await ApiClient.getClient().images.getImages({
		subId: getOrCreateUserId(),
		limit: GALLERY_PAGE_SIZE,
		size: 'small',
	});

	// Add any favourited images to favourites
	const favImages: FavouriteImageRequest[] = [];
	myImages.forEach((image) => {
		if (image.favourite) {
			favImages.push({
				imageId: image.id,
				favouriteId: image.favourite.id,
			});
		}
	});
	dispatch(bulkAddFavouriteImages(favImages));

	return myImages;
});

export const getMoreMyImages = createAsyncThunk<PaginatedAsyncResult<UserImage>>('gallery/getMoreMyImages', async (_, { getState, dispatch }) => {
	const state = getState() as RootState;
	const nextPage = state.gallery.pagination.currentPage + 1;

	const moreImages = await ApiClient.getClient().images.getImages({
		subId: getOrCreateUserId(),
		limit: GALLERY_PAGE_SIZE,
		size: 'small',
		page: nextPage,
	});

	// Add any favourited images to favourites
	const favImages: FavouriteImageRequest[] = [];
	moreImages.forEach((image) => {
		if (image.favourite) {
			favImages.push({
				imageId: image.id,
				favouriteId: image.favourite.id,
			});
		}
	});
	dispatch(bulkAddFavouriteImages(favImages));

	return {
		items: moreImages,
		pagination: {
			currentPage: nextPage,
			hasMore: moreImages.length === GALLERY_PAGE_SIZE,
		},
	};
});

// -------------------------------------------------------------------------
// Fetch random set of images
export const getAllImages = createAsyncThunk('gallery/getAllImages', async (_, { getState }) => {
	const state = getState() as RootState;

	// Return the current cache if there is one to save an API call
	if (state.gallery.allImagesCache.images.length > 0) {
		return state.gallery.allImagesCache.images;
	}

	return ApiClient.getClient().images.searchImages({
		limit: GALLERY_PAGE_SIZE,
		size: 'small',
	});
});

export const getMoreAllImages = createAsyncThunk<PaginatedAsyncResult<Image>>('gallery/getMoreAllImages', async (_, { getState }) => {
	const state = getState() as RootState;
	const nextPage = state.gallery.pagination.currentPage + 1;

	const moreImages = await ApiClient.getClient().images.searchImages({
		limit: GALLERY_PAGE_SIZE,
		size: 'small',
		page: nextPage,
	});

	return {
		items: moreImages,
		pagination: {
			currentPage: nextPage,
			hasMore: moreImages.length === GALLERY_PAGE_SIZE,
		},
	};
});

// -------------------------------------------------------------------------
// Fetch my favourites
export const getFavouriteImages = createAsyncThunk('gallery/getFavouriteImages', async (_, { dispatch }) => {
	const favourites = await getFavourites(getOrCreateUserId());

	// Bulk add favourite images to the store
	const favImages: FavouriteImageRequest[] = favourites.map((favourite) => ({ imageId: favourite.image_id, favouriteId: favourite.id }));
	dispatch(bulkAddFavouriteImages(favImages));

	return favourites;
});

export const getMoreFavouriteImages = createAsyncThunk<PaginatedAsyncResult<Favourite>>('gallery/getMoreFavouriteImages', async (_, { getState, dispatch }) => {
	const state = getState() as RootState;
	const nextPage = state.gallery.pagination.currentPage + 1;

	const moreImages = await getFavourites(getOrCreateUserId(), { page: nextPage });

	// Bulk add more favourite images to the store
	const favImages: FavouriteImageRequest[] = moreImages.map((favourite) => ({ imageId: favourite.image_id, favouriteId: favourite.id }));
	dispatch(bulkAddFavouriteImages(favImages));

	return {
		items: moreImages,
		pagination: {
			currentPage: nextPage,
			hasMore: moreImages.length === GALLERY_PAGE_SIZE,
		},
	};
});

// -------------------------------------------------------------------------
// Fetch my top rated images
export const getTopRatedImages = createAsyncThunk('gallery/getTopRatedImages', async (_, { getState, dispatch }) => {
	const state = getState() as RootState;
	if (state.vote.totalVoteStatus === TaskStatus.Failed || state.vote.totalVoteStatus === TaskStatus.Idle) {
		await dispatch(getAllVotes());
	}

	return getVotes();
});

export const getMoreTopRatedImages = createAsyncThunk<PaginatedAsyncResult<Vote>>('gallery/getMoreTopRatedImages', async (_, { getState }) => {
	const state = getState() as RootState;
	const nextPage = state.gallery.pagination.currentPage + 1;

	const moreImages = await getVotes(undefined, { page: nextPage });

	return {
		items: moreImages,
		pagination: {
			currentPage: nextPage,
			hasMore: moreImages.length === GALLERY_PAGE_SIZE,
		},
	};
});

// Actions =================================================================
export const { resetFilter, removeImageById, resetGallery } = gallerySlice.actions;

// Reducer =================================================================
export default gallerySlice.reducer;
