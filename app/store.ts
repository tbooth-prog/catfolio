import { configureStore } from "@reduxjs/toolkit";
import galleryReducer, {
  getAllImages,
  getFavouriteImages,
  getMoreAllImages,
  getMoreMyImages,
  getMyImages,
  resetGallery,
} from "./store/gallerySlice";
import uploadReducer, { resetUpload } from "./store/uploadSlice";
import { GalleryFilter } from "./utils/enums";

const store = configureStore({
  reducer: {
    gallery: galleryReducer,
    upload: uploadReducer,
  },
});

export const getImages = (filter: GalleryFilter): void => {
  switch (filter) {
    case GalleryFilter.All:
      store.dispatch(getAllImages());
      break;
    case GalleryFilter.Favourites:
      store.dispatch(getFavouriteImages());
      break;
    case GalleryFilter.MyImages:
      store.dispatch(getMyImages());
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
    }
  }
};

export const resetApp = () => {
  store.dispatch(resetGallery());
  store.dispatch(resetUpload());
};

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
