import { GalleryFilter } from '~/utils/enums';
import { Button, LinkButton } from '../controls/Buttons';
import { Search, Upload } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/store';
import { resetUpload } from '~/store/uploadSlice';

export function EmptyUploadState() {
	const dispatch = useDispatch<AppDispatch>();

	const handleUploadMore = () => {
		dispatch(resetUpload());
	};

	return (
		<div className="mt-[20vh] flex flex-col items-center justify-center gap-6 text-center md:mt-[25vh]">
			<h1 className="text-lg font-bold">No more uploads to review</h1>
			<p>Upload more images or view your uploaded images</p>
			<div className="mt-6 flex w-full flex-wrap items-center justify-center gap-4">
				<LinkButton variant="secondary" to={`/?filter=${GalleryFilter.MyImages}`} className="shrink-0">
					<Search strokeWidth={1} className="size-5" />
					<span>View your images</span>
				</LinkButton>
				<Button onClick={handleUploadMore}>
					<Upload strokeWidth={1} className="size-5" />
					<span>Upload more images</span>
				</Button>
			</div>
		</div>
	);
}
