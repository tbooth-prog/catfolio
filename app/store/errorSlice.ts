import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SnackbarError, SnackbarErrorRequest } from './types';

type ErrorState = {
	errors: Record<string, SnackbarError>;
};

const initialState: ErrorState = {
	errors: {},
};

export const errorSlice = createSlice({
	name: 'error',
	initialState,
	reducers: {
		addError: (state, action: PayloadAction<SnackbarErrorRequest>) => {
			state.errors[action.payload.id] = action.payload.error;
		},
		removeError: (state, action: PayloadAction<string>) => {
			delete state.errors[action.payload];
		},
	},
});

// Actions =================================================================
export const { addError, removeError } = errorSlice.actions;

// Reducer =================================================================
export default errorSlice.reducer;
