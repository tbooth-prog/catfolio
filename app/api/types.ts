// Types to support endpoints file

export interface PagedDataRequestOptions {
	size?: 'thumb' | 'small' | 'med' | 'full';
	page?: number;
	limit?: number;
	order?: string;
	attachImage?: boolean;
}

// Cat api types derived from /@thatapicompany/thecatapi/dist/index.d.ts

export interface BaseImage {
	id: string;
	width?: number; // Not available on all returned images
	height?: number; // Not available on all returned images
	url: string;
}

export interface Image extends BaseImage {
	breeds?: Record<string, any>[];
	categories?: Record<string, any>[];
}

export interface ImageVote {
	id: number;
	value: number;
}

export interface ImageFavourite {
	id: number;
}

export interface UserImage extends Omit<Image, 'breeds'> {
	breeds: Record<string, any>[];
	breedId: string | null;
	originalFilename: string;
	subId: string | null;
	createdAt: Date;
	vote?: ImageVote;
	favourite?: ImageFavourite;
}

export interface UploadedImage extends BaseImage {
	subId?: string;
	originalFilename: string;
	pending: boolean;
	approved: boolean;
}

export interface Favourite {
	id: number;
	user_id: string;
	image_id: string;
	sub_id: string | null;
	createdAt: Date;
	image: {
		id: string;
		url: string;
	};
}

export interface Vote {
	id: number;
	image_id: string;
	sub_id: string | null;
	value: number;
	countryCode: string;
	createdAt: Date;
	image: {
		id: string;
		url: string;
	};
}

export interface AddFavourite {
	id: number;
	message: string;
}

export interface DeleteFavourite {
	message: string;
}
