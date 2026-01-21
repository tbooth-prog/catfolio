import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ApiClient } from '~/service/apiClient';
import { getOrCreateUserId } from '~/utils';
import type { FavouriteImageRequest } from './types';
import type { AddFavourite, DeleteFavourite } from '~/api/types';
import type { RootState } from '~/store';
import { GalleryFilter } from '~/utils/enums';
import { removeImageById } from './gallerySlice';
import { addError } from './errorSlice';
import { ApiResponseError } from '@thatapicompany/thecatapi';

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
export const favouriteImage = createAsyncThunk<AddFavourite, string, { rejectValue: string }>('favourite/favouriteImage', async (imageId: string, { dispatch, rejectWithValue }) => {
	dispatch(addFavouriteImage(imageId));

	try {
		return await ApiClient.getClient().favourites.addFavourite(imageId, getOrCreateUserId());
	} catch (error) {
		const errorMessage = error instanceof ApiResponseError ? error.data.message : 'Unknown error';

		dispatch(
			addError({
				id: crypto.randomUUID(),
				error: { title: 'Error favouriting image', message: errorMessage },
			}),
		);

		return rejectWithValue(errorMessage);
	}
});

// Unfavourite image
export const unfavouriteImage = createAsyncThunk<DeleteFavourite, FavouriteImageRequest, { rejectValue: string }>(
	'favourite/unfavouriteImage',
	async ({ imageId, favouriteId }, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;

		dispatch(removeFavouriteImage(imageId));

		if (state.gallery.filter === GalleryFilter.Favourites) {
			dispatch(removeImageById(imageId));
		}

		try {
			return await ApiClient.getClient().favourites.deleteFavourite(favouriteId);
		} catch (error) {
			const errorMessage = error instanceof ApiResponseError ? error.data.message : 'Unknown error';

			dispatch(
				addError({
					id: crypto.randomUUID(),
					error: { title: 'Error unfavouriting image', message: errorMessage },
				}),
			);

			return rejectWithValue(errorMessage);
		}
	},
);

// Actions =================================================================
export const { addFavouriteImage, bulkAddFavouriteImages, removeFavouriteImage } = favouriteSlice.actions;

// Reducer =================================================================
export default favouriteSlice.reducer;
