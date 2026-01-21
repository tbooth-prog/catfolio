import { type PropsWithChildren, useEffect, useRef } from 'react';
// import { Loader } from "./Loader";
import { INFINITE_SCROLL_TOLERANCE } from '~/utils';
import { Spinner } from '../ui/Spinner';

interface Props {
	loader: () => void;
	isLoadingMore: boolean;
	scrollTolerance?: number;
}

export function InfiniteScroll(props: PropsWithChildren<Props>) {
	const { children, loader, isLoadingMore, scrollTolerance = INFINITE_SCROLL_TOLERANCE } = props;
	const endOfListRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.length === 1 && entries[0].isIntersecting) {
					loader();
				}
			},
			{ threshold: 1 },
		);

		const checkpoint = endOfListRef.current;

		if (checkpoint) {
			observer.observe(checkpoint);
		}

		return () => {
			if (checkpoint) {
				observer.unobserve(checkpoint);
			}
		};
	}, [endOfListRef, loader]);

	return (
		<>
			{children}

			<div>
				<div id="list-end" className="width-full relative left-0" ref={endOfListRef} style={{ bottom: scrollTolerance }} />
				{isLoadingMore && (
					<div className="mt-12 flex items-center justify-center">
						<Spinner />
					</div>
				)}
			</div>
		</>
	);
}
