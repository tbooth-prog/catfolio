import { configureStore } from '@reduxjs/toolkit';
import errorReducer from './store/errorSlice';
import favouriteReducer from './store/favouriteSlice';
import galleryReducer, {
	getAllImages,
	getFavouriteImages,
	getMoreAllImages,
	getMoreFavouriteImages,
	getMoreMyImages,
	getMoreTopRatedImages,
	getMyImages,
	getTopRatedImages,
	resetGallery,
} from './store/gallerySlice';
import uploadReducer, { resetUpload } from './store/uploadSlice';
import voteReducer from './store/voteSlice';
import { GalleryFilter } from './utils/enums';

const store = configureStore({
	reducer: {
		error: errorReducer,
		favourite: favouriteReducer,
		gallery: galleryReducer,
		upload: uploadReducer,
		vote: voteReducer,
	},
});

export const getImages = (filter: GalleryFilter): void => {
	switch (filter) {
		case GalleryFilter.All:
			store.dispatch(getAllImages());
			break;
		case GalleryFilter.MyImages:
			store.dispatch(getMyImages());
			break;
		case GalleryFilter.Favourites:
			store.dispatch(getFavouriteImages());
			break;
		case GalleryFilter.TopRated:
			store.dispatch(getTopRatedImages());
			break;
	}
};

export const getMoreImages = () => {
	const galleryState = store.getState().gallery;

	const currentFilter = galleryState.filter;
	const hasMore = galleryState.pagination.hasMore;

	if (hasMore) {
		switch (currentFilter) {
			case GalleryFilter.All:
				store.dispatch(getMoreAllImages());
				break;
			case GalleryFilter.MyImages:
				store.dispatch(getMoreMyImages());
				break;
			case GalleryFilter.Favourites:
				store.dispatch(getMoreFavouriteImages());
				break;
			case GalleryFilter.TopRated:
				store.dispatch(getMoreTopRatedImages());
				break;
		}
	}
};

export const resetApp = () => {
	store.dispatch(resetGallery());
	store.dispatch(resetUpload());
};

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
