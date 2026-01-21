import { useSelector } from 'react-redux';
import { ImageUpload } from '~/components/controls/ImageUpload';
import { UploadProgress } from '~/components/ui/UploadProgress';
import type { RootState } from '~/store';
import store from '~/store';
import { resetFilter } from '~/store/gallerySlice';
import { useDogMode } from '~/utils/hooks';

export function clientLoader() {
	store.dispatch(resetFilter());
}

export default function Upload() {
	const { showInput } = useSelector((state: RootState) => state.upload);
	const { isDogModeEnabled } = useDogMode();

	return (
		<>
			<title>{isDogModeEnabled ? 'dogfol.io | Upload' : 'catfol.io | Upload'}</title>
			<div className="mt-6 flex w-full items-center justify-center md:mt-12">{showInput ? <ImageUpload /> : <UploadProgress />}</div>
		</>
	);
}
