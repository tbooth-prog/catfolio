import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileUploadFailure, FileUploadRequest, FileUploadSuccess, SelectedFile } from './types';
import { ApiClient } from '~/service/apiClient';
import { delay, extractApiErrorMessage, getImageOrientation, getOrCreateUserId } from '~/utils';
import { TaskStatus } from '~/utils/enums';
import { ApiResponseError } from '@thatapicompany/thecatapi';
import { removeImageById } from './gallerySlice';
import { addError } from './errorSlice';

type UploadState = {
	totalUploads: number;
	pendingFiles: Record<string, SelectedFile>;
	failedFiles: Record<string, SelectedFile>;
	showInput: boolean;
};

const initialState: UploadState = {
	totalUploads: 0,
	pendingFiles: {},
	failedFiles: {},
	showInput: true,
};

const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		setTotalUploads: (state: UploadState, action: PayloadAction<{ count: number }>) => {
			state.totalUploads = action.payload.count;
		},
		clearPendingFile: (state: UploadState, action: PayloadAction<{ uploadId: string }>) => {
			const { uploadId } = action.payload;

			if (!Object.keys(state.pendingFiles).includes(uploadId)) return; // Requested upload isn't in state

			const { [uploadId]: targetUpload, ...remainingUploads } = state.pendingFiles;

			if (targetUpload.status === TaskStatus.Succeded) {
				URL.revokeObjectURL(targetUpload.url);
			} else if (targetUpload.status === TaskStatus.Failed) {
				state.failedFiles[uploadId] = targetUpload;
			}

			state.pendingFiles = remainingUploads;
		},
		clearFailedFile: (state: UploadState, action: PayloadAction<{ uploadId: string }>) => {
			const { uploadId } = action.payload;

			if (!Object.keys(state.failedFiles).includes(uploadId)) return; // Requested upload isn't in state

			const { [uploadId]: targetUpload, ...remainingUploads } = state.failedFiles;

			URL.revokeObjectURL(targetUpload.url);
			state.failedFiles = remainingUploads;
		},
		resetUpload: () => initialState,
	},
	extraReducers: (builder) => {
		// Upload image
		builder
			.addCase(uploadImage.pending, (state, action) => {
				const { uploadId, file, width, height }: FileUploadRequest = action.meta.arg;

				if (state.showInput) {
					// Show upload UI
					state.showInput = false;
				}

				state.pendingFiles[uploadId] = {
					url: URL.createObjectURL(file),
					status: TaskStatus.Pending,
					error: null,
					orientation: getImageOrientation(width, height),
				};
			})
			.addCase(uploadImage.fulfilled, (state, action) => {
				const { uploadId } = action.payload;

				state.pendingFiles[uploadId] = {
					...state.pendingFiles[uploadId],
					status: TaskStatus.Succeded,
				};
			})
			.addCase(uploadImage.rejected, (state, action) => {
				if (action.payload) {
					const { uploadId, message } = action.payload;

					state.pendingFiles[uploadId] = {
						...state.pendingFiles[uploadId],
						status: TaskStatus.Failed,
						error: message,
					};
				}
			});
	},
});

// Thunks ==================================================================
export const uploadImage = createAsyncThunk<FileUploadSuccess, FileUploadRequest, { rejectValue: FileUploadFailure }>('upload/uploadImage', async (imageData, { rejectWithValue }) => {
	const { uploadId, file } = imageData;
	try {
		const userId = getOrCreateUserId();

		await delay(500);
		await ApiClient.getClient().images.uploadImage(file, userId);

		return { uploadId };
	} catch (e) {
		const errorMessage = e instanceof ApiResponseError ? extractApiErrorMessage(e) : 'Oops! Image upload failed. Please try again';

		return rejectWithValue({
			uploadId,
			message: errorMessage,
		});
	}
});

export const deleteImage = createAsyncThunk<void, string, { rejectValue: string }>('upload/deleteImage', async (imageId: string, { dispatch, rejectWithValue }) => {
	dispatch(removeImageById(imageId));

	try {
		return await ApiClient.getClient().images.deleteImage(imageId);
	} catch (error) {
		const errorMessage = error instanceof ApiResponseError ? extractApiErrorMessage(error) : 'Unknown error';

		dispatch(
			addError({
				id: crypto.randomUUID(),
				error: { title: 'Error deleting image', message: errorMessage },
			}),
		);

		return rejectWithValue(errorMessage);
	}
});

// Actions =================================================================
export const { setTotalUploads, clearPendingFile, clearFailedFile, resetUpload } = uploadSlice.actions;

// Reducer =================================================================
export default uploadSlice.reducer;
