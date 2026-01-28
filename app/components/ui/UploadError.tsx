import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/store';
import { Button } from '../controls/Buttons';
import { RefreshCw, Trash2 } from 'lucide-react';
import { clearFailedFile, resetRetryStatus, retryUpload } from '~/store/uploadSlice';
import { TaskStatus } from '~/utils/enums';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import type { SelectedFile } from '~/store/types';

interface Props {
	uploadId: string;
	imageData: SelectedFile;
}

export function UploadError(props: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const { uploadId, imageData } = props;

	useEffect(() => {
		if (imageData.retryStatus === TaskStatus.Succeeded) {
			const clearFileTimer = setTimeout(() => {
				dispatch(clearFailedFile({ uploadId }));
			}, 250);

			return () => clearTimeout(clearFileTimer);
		}

		if (imageData.retryStatus === TaskStatus.Failed) {
			const resetFileTimer = setTimeout(() => {
				dispatch(resetRetryStatus({ uploadId }));
			}, 750);

			return () => clearTimeout(resetFileTimer);
		}
	}, [imageData.retryStatus]);

	// Handlers ===============================================================

	const handleRemove = () => {
		dispatch(clearFailedFile({ uploadId }));
	};

	const handleRetry = () => {
		dispatch(retryUpload({ uploadId }));
	};

	// Render =================================================================

	return (
		<motion.div
			animate={imageData.retryStatus === TaskStatus.Failed ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
			key={uploadId}
			className={clsx('flex w-full items-center gap-4 rounded-lg border border-red-600 bg-surface p-4 transition-shadow sm:items-start dog:bg-surface-dark', {
				'shadow-md shadow-red-600': imageData.retryStatus === TaskStatus.Failed,
				'border-green-600': imageData.retryStatus === TaskStatus.Succeeded,
			})}
		>
			<img src={imageData.url} className="aspect-square h-12 shrink-0 rounded object-cover sm:h-20" />
			<div className="flex-1 truncate text-left">
				<h3 className="text-lg font-bold">Upload failed</h3>
				<p className="truncate text-sm text-secondary-text dog:text-secondary-text-dark">{imageData.error}</p>
			</div>
			<div className="flex h-full shrink-0 flex-col justify-between">
				<Button variant="destructive" type="button" onClick={handleRemove}>
					<Trash2 strokeWidth={1} className="size-5" />
					<span className="hidden sm:block">Remove</span>
				</Button>
				<Button variant="secondary" onClick={handleRetry} isPending={imageData.retryStatus === TaskStatus.Pending} isDisabled={imageData.retryStatus !== TaskStatus.Idle}>
					<RefreshCw strokeWidth={1} className="size-5" />
					<span className="hidden sm:block">Retry</span>
				</Button>
			</div>
		</motion.div>
	);
}
