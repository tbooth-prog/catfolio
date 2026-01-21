import { i } from 'node_modules/vite/dist/node/chunks/moduleRunnerTransport';
import type { BaseImage, UserImage } from '~/api/types';
import type { GalleryFilter, GallerySortOption, ImageOrientation, TaskStatus } from '~/utils/enums';

export interface AsyncRequest {
	status: TaskStatus;
	error: string | null;
}

export interface PaginatedAsyncRequest extends AsyncRequest {
	currentPage: number;
	hasMore: boolean;
}

export interface PaginatedAsyncResult<T> {
	items: T[];
	pagination: {
		currentPage: number;
		hasMore: boolean;
	};
}

export interface FileUploadRequest {
	uploadId: string;
	file: File;
	width?: number;
	height?: number;
}

export interface SelectedFile {
	url: string;
	status: TaskStatus;
	error: string | null;
	orientation: ImageOrientation;
}

export interface FileUploadSuccess {
	uploadId: string;
}

export interface FileUploadFailure {
	uploadId: string;
	message: string;
}

export type ImageStoreBaseState = {
	initial: AsyncRequest;
	pagination: PaginatedAsyncRequest;
};

export interface GalleryImageMeta {
	favouriteId?: number | undefined;
	voteId?: number | undefined;
	myVote?: number;
}

export interface GalleryImageType extends BaseImage {
	meta?: GalleryImageMeta;
}

export interface FavouriteImageRequest {
	imageId: string;
	favouriteId: number;
}

export interface MyVote {
	voteId: number | undefined;
	value: 1 | -1 | undefined;
}

export interface VoteImageRequest {
	imageId: string;
	vote: MyVote;
}

export interface SnackbarError {
	title: string;
	message: string;
}

export interface SnackbarErrorRequest {
	id: string;
	error: SnackbarError;
}
