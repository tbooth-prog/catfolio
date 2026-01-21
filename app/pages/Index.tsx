import Masonry from 'react-masonry-css';
import type { RootState } from '~/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { GalleryFilter, TaskStatus } from '~/utils/enums';
import { useDogMode } from '~/utils/hooks';
import { GalleryImage } from '~/components/ui/GalleryImage';
import { InfiniteScroll } from '~/components/controls/InfiniteScroll';
import store, { getImages, getMoreImages } from '~/store';
import { useLocation, useRevalidator, type ClientLoaderFunctionArgs } from 'react-router';
import type { GalleryImageType } from '~/store/types';

import { LoadingState } from '~/components/ui/LoadingState';
import { getAllVotes } from '~/store/voteSlice';
import { EmptyState } from '~/components/ui/EmptyState';
import { ErrorState } from '~/components/ui/ErrorState';

export function clientLoader(args: ClientLoaderFunctionArgs) {
	const { request } = args;
	const { filter } = store.getState().gallery;
	const { totalVoteStatus } = store.getState().vote;

	const { searchParams } = new URL(request.url);
	const urlFilter = searchParams.get('filter') ?? GalleryFilter.MyImages;

	if (urlFilter !== filter) {
		getImages(urlFilter as GalleryFilter);
	}

	if (totalVoteStatus === TaskStatus.Failed || totalVoteStatus === TaskStatus.Idle) {
		store.dispatch(getAllVotes());
	}
}

export default function Index() {
	const { revalidate } = useRevalidator();
	const { search } = useLocation();

	const { initial, images, pagination } = useSelector((state: RootState) => state.gallery);
	const { isDogModeEnabled } = useDogMode();

	useEffect(() => {
		revalidate();
	}, [isDogModeEnabled, search]);

	// Render ====================================================================

	if (initial.status === TaskStatus.Failed) {
		return (
			<>
				<title>{isDogModeEnabled ? 'dogfol.io | Gallery' : 'catfol.io | Gallery'}</title>
				<ErrorState />
			</>
		);
	}

	if (initial.status === TaskStatus.Pending || initial.status === TaskStatus.Idle) {
		return (
			<>
				<title>{isDogModeEnabled ? 'dogfol.io | Gallery' : 'catfol.io | Gallery'}</title>
				<LoadingState />
			</>
		);
	}

	if (images.length === 0) {
		return (
			<>
				<title>{isDogModeEnabled ? 'dogfol.io | Gallery' : 'catfol.io | Gallery'}</title>
				<EmptyState />
			</>
		);
	}

	return (
		<>
			<title>{isDogModeEnabled ? 'dogfol.io | Gallery' : 'catfol.io | Gallery'}</title>
			<InfiniteScroll loader={getMoreImages} isLoadingMore={pagination.status === TaskStatus.Pending}>
				<Masonry breakpointCols={{ default: 4, 1024: 3, 768: 2, 640: 1 }} className="flex w-full gap-6" columnClassName="*:mb-6 -mb-6">
					{images.map((image: GalleryImageType) => (image.url ? <GalleryImage key={image.id} image={image} /> : null))}
				</Masonry>
			</InfiniteScroll>
		</>
	);
}
