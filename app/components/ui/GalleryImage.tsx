import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { GalleryFilter, ImageOrientation } from '~/utils/enums';
import { getImageOrientation } from '~/utils';
import { Heart, Trash2 } from 'lucide-react';
import { ImageOverlayButton } from '../controls/ImageOverlayButton';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '~/store';
import { favouriteImage, unfavouriteImage } from '~/store/favouriteSlice';
import type { GalleryImageType, MyVote } from '~/store/types';
import { VoteButtonGroup } from '../controls/VoteButtonGroup';
import { clearVote, downVote, upVote } from '~/store/voteSlice';
import { useEffect, useState } from 'react';
import { deleteImage } from '~/store/uploadSlice';
import { useDogMode } from '~/utils/hooks';

interface Props {
	image: GalleryImageType;
}

export function GalleryImage(props: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const { image } = props;
	const [myVote, setMyVote] = useState<1 | -1 | null>(null);

	const { filter } = useSelector((state: RootState) => state.gallery);
	const { favouriteImages } = useSelector((state: RootState) => state.favourite);
	const { totalVotes } = useSelector((state: RootState) => state.vote);
	const { isDogModeEnabled } = useDogMode();

	const orientation = getImageOrientation(image.width, image.height);
	const isMyImage = filter === GalleryFilter.MyImages;
	const isFavourite = !!favouriteImages[image.id];
	const score = totalVotes[image.id] || 0;

	useEffect(() => {
		const voteFadeTimer = setTimeout(() => {
			setMyVote(null);
		}, 250);
		return () => clearTimeout(voteFadeTimer);
	}, [myVote]);

	// Handlers ==========================================================

	const handleDeleteClick = () => {
		dispatch(deleteImage(image.id));
	};

	const handleFavouriteClick = () => {
		if (isFavourite) {
			dispatch(unfavouriteImage({ imageId: image.id, favouriteId: favouriteImages[image.id]! }));
		} else {
			dispatch(favouriteImage(image.id));
		}
	};

	const handleUpVoteClick = () => {
		// if (myVote && myVote.value === 1) {
		// 	dispatch(clearVote({ imageId: image.id, vote: myVote }));
		//   } else
		setMyVote(1);
		dispatch(upVote(image.id));
	};

	const handleDownVoteClick = () => {
		// if (myVote && myVote.value === -1) {
		// 	dispatch(clearVote({ imageId: image.id, vote: myVote }));
		//   } else
		setMyVote(-1);
		dispatch(downVote(image.id));
	};

	// Render ============================================================

	const className = clsx('w-full bg-surface dog:bg-surface-dark break-inside-avoid rounded-xl overflow-hidden contain-content relative', {
		'aspect-3/4': orientation === ImageOrientation.Portrait,
		'aspect-4/3': orientation === ImageOrientation.Landscape,
		'aspect-square': orientation === ImageOrientation.Square,
	});

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-100px' }}
			transition={{
				duration: 0.4,
				ease: 'easeOut',
			}}
		>
			<img src={image.url} alt={image.id} className="h-full w-full scale-[1.1] object-cover select-none" loading="lazy" decoding="async" draggable={false} />
			{isMyImage && !isDogModeEnabled && (
				<ImageOverlayButton tooltipLabel="Delete" variant="secondary" className="top-0 left-0" onClick={handleDeleteClick}>
					<Trash2 strokeWidth={1} className={'size-5'} />
				</ImageOverlayButton>
			)}
			<ImageOverlayButton tooltipLabel={isFavourite ? 'Unfavourite' : 'Favourite'} variant="secondary" className="top-0 right-0" onClick={handleFavouriteClick}>
				<Heart strokeWidth={1} className={clsx('size-5', { 'fill-red-500 text-red-500': isFavourite, 'fill-none text-primary-text dog:text-primary-text-dark': !isFavourite })} />
			</ImageOverlayButton>
			<VoteButtonGroup myVote={myVote} totalVotes={score} onUpVote={handleUpVoteClick} onDownVote={handleDownVoteClick} />
		</motion.div>
	);
}
