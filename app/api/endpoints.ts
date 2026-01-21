import { apiGet } from '~/service/apiClient';
import type { Favourite, PagedDataRequestOptions, Vote } from './types';
import { GALLERY_PAGE_SIZE } from '~/utils';

export const getFavourites = async (userId: string, options?: PagedDataRequestOptions): Promise<Favourite[]> => {
	const queryParams = {
		attach_image: String(true),
		sub_id: userId,
		page: String(options?.page || 0),
		limit: String(options?.limit || GALLERY_PAGE_SIZE),
		size: options?.size || 'small',
	};

	const query = new URLSearchParams(queryParams);

	if (options?.order) query.set('order', options.order);

	return apiGet<Favourite[]>(`/favourites?${query.toString()}`);
};

export const getVotes = async (userId?: string, options?: PagedDataRequestOptions): Promise<Vote[]> => {
	const queryParams = {
		attach_image: String(options?.attachImage || true),
		page: String(options?.page || 0),
		limit: String(options?.limit || GALLERY_PAGE_SIZE),
		size: options?.size || 'small',
	};

	const query = new URLSearchParams(queryParams);

	if (userId) query.set('sub_id', userId);
	if (options?.order) query.set('order', options.order);

	return apiGet<Vote[]>(`/votes?${query.toString()}`);
};
