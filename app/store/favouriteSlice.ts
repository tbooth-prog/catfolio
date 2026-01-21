import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ApiClient } from '~/service/apiClient';
import { getOrCreateUserId } from '~/utils';
import type { FavouriteImageRequest } from './types';
import type { DeleteFavourite } from '~/api/types';
import type { RootState } from '~/store';
import { GalleryFilter } from '~/utils/enums';
import { removeImageById } from './gallerySlice';

type FavouriteState = {
	favouriteImages: Record<string, number>;
};

const initialState: FavouriteState = {
	favouriteImages: {},
};

const favouriteSlice = createSlice({
	name: 'favourite',
	initialState,
	reducers: {
		addFavouriteImage(state, action) {
			// Placeholder favouriteId to optimistically update the UI
			state.favouriteImages[action.payload] = -1;
		},
		bulkAddFavouriteImages(state, action: PayloadAction<FavouriteImageRequest[]>) {
			action.payload.forEach((fav) => {
				state.favouriteImages[fav.imageId] = fav.favouriteId;
			});
		},
		removeFavouriteImage(state, action) {
			delete state.favouriteImages[action.payload];
		},
	},
	extraReducers(builder) {
		builder
			.addCase(favouriteImage.fulfilled, (state, action) => {
				// Update favourite with the favourite id
				state.favouriteImages[action.meta.arg] = action.payload.id;
			})
			.addCase(favouriteImage.rejected, (state, action) => {
				// Remove imageId from favourites if the action fails
				delete state.favouriteImages[action.meta.arg];
			});
		builder.addCase(unfavouriteImage.rejected, (state, action) => {
			// Add imageId to favourites if the action fails
			state.favouriteImages[action.meta.arg.imageId] = action.meta.arg.favouriteId;
		});
	},
});

// Thunks ==================================================================
// Favourite image
export const favouriteImage = createAsyncThunk('favourite/favouriteImage', async (imageId: string, { dispatch }) => {
	dispatch(addFavouriteImage(imageId));

	return ApiClient.getClient().favourites.addFavourite(imageId, getOrCreateUserId());
});

// Unfavourite image
export const unfavouriteImage = createAsyncThunk<DeleteFavourite, FavouriteImageRequest>('favourite/unfavouriteImage', async ({ imageId, favouriteId }, { dispatch, getState }) => {
	const state = getState() as RootState;

	dispatch(removeFavouriteImage(imageId));

	if (state.gallery.filter === GalleryFilter.Favourites) {
		dispatch(removeImageById(imageId));
	}

	return ApiClient.getClient().favourites.deleteFavourite(favouriteId);
});

// Actions =================================================================
export const { addFavouriteImage, bulkAddFavouriteImages, removeFavouriteImage } = favouriteSlice.actions;

// Reducer =================================================================
export default favouriteSlice.reducer;
