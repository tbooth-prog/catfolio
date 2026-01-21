import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '~/store';
import { UploadGallery } from './UploadGallery';
import { Navigate } from 'react-router';
import { UploadError } from './UploadError';
import { EmptyUploadState } from './EmptyUploadState';
import { resetUpload } from '~/store/uploadSlice';

export function UploadProgress() {
	const dispatch = useDispatch();
	const { failedFiles, pendingFiles } = useSelector((state: RootState) => state.upload);

	const canNavigateOnCompletion = useRef<boolean>(true);
	const isUploading = Object.keys(pendingFiles).length > 0;
	const hasErrors = Object.keys(failedFiles).length > 0;

	useEffect(() => {
		if (canNavigateOnCompletion.current && hasErrors) {
			canNavigateOnCompletion.current = false;
		}
	}, [hasErrors]);

	console.log(canNavigateOnCompletion.current, isUploading, hasErrors);

	if (!isUploading && !hasErrors) {
		if (canNavigateOnCompletion.current) {
			dispatch(resetUpload());
			return <Navigate to="/" />;
		} else return <EmptyUploadState />;
	}

	return (
		<div className="flex h-full w-full flex-col items-center gap-8">
			{isUploading && (
				<section className="relative flex h-90 w-full items-start justify-start rounded-lg border border-dashed border-subtle bg-surface p-8 text-center font-sans text-base text-balance sm:h-128 md:w-3/4 dog:border-subtle-dark dog:bg-surface-dark">
					<div className="absolute top-0 left-12 flex -translate-y-1/2 items-center">
						<div className="absolute h-0.5 w-full bg-surface dog:bg-surface-dark" />
						<h2 className="z-10 px-1">Uploading files</h2>
					</div>
					<div className="h-full overflow-hidden">
						<UploadGallery />
					</div>
					<div />
				</section>
			)}
			{hasErrors && (
				<>
					<div className="flex w-full items-center justify-center gap-6 md:w-3/4">
						<hr className="flex-1 border-neutral-200 dog:border-neutral-600" />
						<h2 className="shrink-0">Errors</h2>
						<hr className="flex-1 border-neutral-200 dog:border-neutral-600" />
					</div>
					<section className="w-full md:w-3/4">
						<UploadError />
					</section>
				</>
			)}
		</div>
	);
}
