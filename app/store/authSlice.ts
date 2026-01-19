import { createSlice } from "@reduxjs/toolkit";
import { getOrCreateUserId } from "~/utils";

type AuthState = {
  userId: string | null;
};

const initialState: AuthState = {
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initAuth: (state) => {
      state.userId = getOrCreateUserId();
    },
  },
});

// Thunks ==================================================================

// Actions =================================================================
export const { initAuth } = authSlice.actions;

// Reducer =================================================================
export default authSlice.reducer;
