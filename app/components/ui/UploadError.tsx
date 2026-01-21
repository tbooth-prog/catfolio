import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '~/store';
import { Button } from '../controls/Buttons';
import { Trash2 } from 'lucide-react';
import { clearFailedFile } from '~/store/uploadSlice';

export function UploadError() {
	const dispatch = useDispatch<AppDispatch>();
	const { failedFiles } = useSelector((state: RootState) => state.upload);

	const handleRemove = (uploadId: string) => {
		dispatch(clearFailedFile({ uploadId }));
	};

	return (
		<ul className="flex flex-wrap gap-4">
			{Object.entries(failedFiles).map(([uploadId, imageData]) => (
				<div key={uploadId} className="flex w-full items-center gap-4 rounded-lg border border-red-600 bg-surface p-4 sm:items-start dog:bg-surface-dark">
					<img src={imageData.url} className="aspect-square h-12 shrink-0 rounded object-cover sm:h-20" />
					<div className="flex-1 truncate text-left">
						<h3 className="text-lg font-bold">Upload failed</h3>
						<p className="truncate text-sm text-secondary-text dog:bg-secondary-text-dark">{imageData.error}</p>
					</div>
					<div className="shrink-0">
						<Button variant="destructive" type="button" onClick={() => handleRemove(uploadId)}>
							<Trash2 strokeWidth={1} className="size-5" />
							<span className="hidden sm:block">Remove</span>
						</Button>
					</div>
				</div>
			))}
		</ul>
	);
}
