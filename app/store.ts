import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import galleryReducer from "./store/gallerySlice";
import type { TaskStatus } from "./utils/enums";

const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
    // upload: uploadReducer,
  },
});

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
