import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';
import type { RootState } from '~/store';
import { UploadImage } from './UploadImage';

export function UploadGallery() {
	const { pendingFiles, totalUploads } = useSelector((state: RootState) => state.upload);

	if (totalUploads <= 2) {
		return (
			<div className="flex w-full flex-wrap justify-start gap-4">
				{Object.entries(pendingFiles).map(([uploadId, imageData]) => (
					<UploadImage key={uploadId} image={imageData} uploadId={uploadId} />
				))}
			</div>
		);
	}

	return (
		<>
			<Masonry breakpointCols={{ default: 3, 640: 2 }} className="flex w-full gap-4" columnClassName="*:mb-4 -mb-4">
				{Object.entries(pendingFiles).map(([uploadId, imageData]) => (
					<UploadImage key={uploadId} image={imageData} uploadId={uploadId} isMasonry />
				))}
			</Masonry>
			<div className="pointer-events-none absolute bottom-8 h-24 w-full bg-linear-to-t from-surface to-transparent dog:from-surface-dark" />
		</>
	);
}
