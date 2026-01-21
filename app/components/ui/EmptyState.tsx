import { GalleryFilter } from '~/utils/enums';
import { LinkButton } from '../controls/Buttons';
import { Search, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '~/store';
import { useDogMode } from '~/utils/hooks';

export function EmptyState() {
	const filter = useSelector((state: RootState) => state.gallery.filter);
	const { isDogModeEnabled } = useDogMode();

	const getTitle = () => {
		switch (filter) {
			case GalleryFilter.MyImages:
				return 'No uploads yet';
			case GalleryFilter.Favourites:
				return 'No favourites yet';
			case GalleryFilter.TopRated:
				return 'No votes yet';
			default:
				return 'Nothing here yet';
		}
	};

	const getBody = () => {
		switch (filter) {
			case GalleryFilter.MyImages:
				return 'Upload an image to see it appear here.';
			case GalleryFilter.Favourites:
				return 'Favourite images you like and they’ll show up here.';
			case GalleryFilter.TopRated:
				return 'Vote on images to see your activity here.';
			default:
				return 'Upload images, favourite ones you love, or cast your first vote.';
		}
	};

	return (
		<div className="mt-[20vh] flex flex-col items-center justify-center gap-6 text-center md:mt-[25vh]">
			<h1 className="text-lg font-bold">{getTitle()}</h1>
			<div>
				<p>{getBody()}</p>
				{isDogModeEnabled && filter === GalleryFilter.MyImages && <p className="mt-1 text-sm text-secondary-text-dark">It may take a few minutes for your images to appear.</p>}
			</div>
			<div className="mt-6 flex w-full flex-wrap items-center justify-center gap-4">
				<LinkButton variant="secondary" to={`/?filter=${GalleryFilter.All}`} className="shrink-0">
					<Search strokeWidth={1} className="size-5" />
					<span>View all images</span>
				</LinkButton>
				<LinkButton to="/upload">
					<Upload strokeWidth={1} className="size-5" />
					<span>Upload an image</span>
				</LinkButton>
			</div>
		</div>
	);
}
