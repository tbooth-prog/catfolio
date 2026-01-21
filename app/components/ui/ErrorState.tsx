import { GalleryFilter } from '~/utils/enums';
import { Button } from '../controls/Buttons';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getImages, type RootState } from '~/store';

export function ErrorState() {
	const filter = useSelector((state: RootState) => state.gallery.filter);

	return (
		<div className="mt-[15vh] flex flex-col items-center justify-center gap-6 text-center md:mt-[20vh]">
			<TriangleAlert className="size-12 text-red-600" />
			<h1 className="text-lg font-bold">Oops! Something went wrong</h1>
			<p>We aren't able to load the images at the moment. Please try again later.</p>
			<div className="mt-6 flex w-full flex-wrap items-center justify-center gap-4">
				<Button onClick={() => getImages(filter ?? GalleryFilter.MyImages)}>
					<RefreshCw strokeWidth={1} className="size-5" />
					<span>Retry</span>
				</Button>
			</div>
		</div>
	);
}
