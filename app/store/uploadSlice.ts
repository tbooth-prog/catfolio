import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileUploadFailure, FileUploadRequest, FileUploadSuccess, SelectedFile } from './types';
import { ApiClient } from '~/service/apiClient';
import { delay, extractApiErrorMessage, getImageOrientation, getOrCreateUserId } from '~/utils';
import { TaskStatus } from '~/utils/enums';
import { ApiResponseError } from '@thatapicompany/thecatapi';
import { cleanUpImageById, removeImageById, restoreImageById } from './gallerySlice';
import { addError } from './errorSlice';
import { getFile, removeFile, storeFile } from '~/service/fileCache';

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

			if (targetUpload.status === TaskStatus.Succeeded) {
				URL.revokeObjectURL(targetUpload.url);
			} else if (targetUpload.status === TaskStatus.Failed) {
				state.failedFiles[uploadId] = targetUpload;
			}

			state.pendingFiles = remainingUploads;
		},
		resetRetryStatus: (state: UploadState, action: PayloadAction<{ uploadId: string }>) => {
			const { uploadId } = action.payload;
			state.failedFiles[uploadId].retryStatus = TaskStatus.Idle;
		},
		clearFailedFile: (state: UploadState, action: PayloadAction<{ uploadId: string }>) => {
			const { uploadId } = action.payload;

			if (!Object.keys(state.failedFiles).includes(uploadId)) return; // Requested upload isn't in state

			const { [uploadId]: targetUpload, ...remainingUploads } = state.failedFiles;

			URL.revokeObjectURL(targetUpload.url);
			// Clear file from cache
			removeFile(uploadId);

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
					retryStatus: TaskStatus.Idle,
				};
			})
			.addCase(uploadImage.fulfilled, (state, action) => {
				const { uploadId } = action.payload;

				state.pendingFiles[uploadId] = {
					...state.pendingFiles[uploadId],
					status: TaskStatus.Succeeded,
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

		// Retry upload
		builder
			.addCase(retryUpload.pending, (state, action) => {
				const { uploadId } = action.meta.arg;

				state.failedFiles[uploadId] = {
					...state.failedFiles[uploadId],
					retryStatus: TaskStatus.Pending,
				};
			})
			.addCase(retryUpload.fulfilled, (state, action) => {
				const { uploadId } = action.meta.arg;

				state.failedFiles[uploadId] = {
					...state.failedFiles[uploadId],
					retryStatus: TaskStatus.Succeeded,
				};
			})
			.addCase(retryUpload.rejected, (state, action) => {
				const { uploadId } = action.meta.arg;

				if (action.payload) {
					state.failedFiles[uploadId] = {
						...state.failedFiles[uploadId],
						retryStatus: TaskStatus.Failed,
						error: action.payload.message,
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

		// Add file to cache to allow for easy retry
		storeFile(uploadId, file);

		return rejectWithValue({
			uploadId,
			message: errorMessage,
		});
	}
});

export const retryUpload = createAsyncThunk<void, { uploadId: string }, { rejectValue: FileUploadFailure }>('upload/retryUpload', async ({ uploadId }, { dispatch, rejectWithValue }) => {
	try {
		// Get file from cache
		const file = getFile(uploadId);
		if (!file) throw new Error('File not found');

		const userId = getOrCreateUserId();

		await delay(500);
		await ApiClient.getClient().images.uploadImage(file, userId);
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
		const del = await ApiClient.getClient().images.deleteImage(imageId);
		dispatch(cleanUpImageById(imageId));
		return del;
	} catch (error) {
		const errorMessage = error instanceof ApiResponseError ? extractApiErrorMessage(error) : 'Unknown error';

		dispatch(restoreImageById(imageId));

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
export const { setTotalUploads, clearPendingFile, clearFailedFile, resetRetryStatus, resetUpload } = uploadSlice.actions;

// Reducer =================================================================
export default uploadSlice.reducer;
