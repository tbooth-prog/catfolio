import { Spinner } from './Spinner';

export const LoadingState = () => {
	return (
		<>
			<div className="mt-[20vh] flex w-full flex-col items-center justify-center gap-8 md:mt-[25vh]">
				<Spinner className="size-16 sm:size-20" />
				<span>Fetching images...</span>
			</div>
		</>
	);
};
