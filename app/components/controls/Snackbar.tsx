import { AlertOctagon, X } from 'lucide-react';
import { Button } from './Buttons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/store';
import { removeError } from '~/store/errorSlice';
import { useEffect } from 'react';

interface Props {
	errorId: string;
	title: string;
	message: string;
}

export function Snackbar(props: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const { errorId, title, message } = props;

	useEffect(() => {
		const dismissErrorTimer = setTimeout(() => {
			dispatch(removeError(errorId));
		}, 5000);

		return () => clearTimeout(dismissErrorTimer);
	}, []);

	return (
		<div className="pointer-events-auto flex h-16 w-full items-center gap-4 overflow-hidden rounded-lg bg-red-500 px-4 py-2 text-white">
			<AlertOctagon className="size-8 shrink-0" />
			<div className="flex-1 overflow-hidden">
				<p className="truncate text-sm leading-tight font-bold sm:text-base">
					{title}
					<br />
					<span className="text-xs font-normal sm:text-sm">{message}</span>
				</p>
			</div>
			<Button variant="destructive" className="shrink-0 rounded-full" onClick={() => dispatch(removeError(errorId))}>
				<X className="size-5" />
			</Button>
		</div>
	);
}
