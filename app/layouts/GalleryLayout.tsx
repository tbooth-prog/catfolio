import { Cat, Dog, Heart, ImageUp, Star } from 'lucide-react';
import { Outlet } from 'react-router';
import { LinkButton } from '~/components/controls/Buttons';
import { GalleryFilter } from '~/utils/enums';
import { useDogMode } from '~/utils/hooks';

export default function GalleryLayout() {
	const { isDogModeEnabled } = useDogMode();

	return (
		<div className="w-full flex-1">
			<div className="sticky top-20 z-10 -mx-6 -mt-6 mb-6 flex min-h-16 items-center gap-4 border-b border-b-subtle bg-background px-6 py-2 dog:border-subtle-dark dog:bg-background-dark">
				<LinkButton to={`/?filter=${GalleryFilter.All}`} variant="secondary" className="flex-1 sm:flex-initial">
					{isDogModeEnabled ? <Dog strokeWidth={1} className="size-5" /> : <Cat strokeWidth={1} className="size-5" />}
					<span className="hidden sm:block">{`All ${isDogModeEnabled ? 'Dogs' : 'Cats'}`}</span>
				</LinkButton>
				<LinkButton to={`/?filter=${GalleryFilter.MyImages}`} variant="secondary" className="flex-1 sm:flex-initial">
					<ImageUp strokeWidth={1} className="size-5" />
					<span className="hidden sm:block">My Images</span>
				</LinkButton>
				<LinkButton to={`/?filter=${GalleryFilter.Favourites}`} variant="secondary" className="flex-1 sm:flex-initial">
					<Heart strokeWidth={1} className="size-5" />
					<span className="hidden sm:block">Favourites</span>
				</LinkButton>
				{!isDogModeEnabled && (
					<LinkButton to={`/?filter=${GalleryFilter.TopRated}`} variant="secondary" className="flex-1 sm:flex-initial">
						<Star strokeWidth={1} className="size-5" />
						<span className="hidden sm:block">My Votes</span>
					</LinkButton>
				)}
			</div>
			<Outlet />
		</div>
	);
}
