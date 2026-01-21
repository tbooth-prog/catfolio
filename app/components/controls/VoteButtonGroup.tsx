import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { TooltipTrigger } from 'react-aria-components';
import { Button } from './Buttons';
import { Tooltip } from '../aria/Tooltip';
import { clsx } from 'clsx';

interface Props {
	onUpVote: () => void;
	onDownVote: () => void;
	myVote?: -1 | 1 | null;
	totalVotes?: number;
}

export const VoteButtonGroup = (props: Props) => {
	const { onUpVote, onDownVote, myVote, totalVotes = 0 } = props;

	return (
		<div className="absolute right-0 bottom-0 z-20 m-2 flex h-8 items-center rounded-lg bg-neutral-50 dog:bg-neutral-700">
			<TooltipTrigger>
				<Button variant="quiet" onClick={onDownVote}>
					<ArrowBigDown className={clsx('size-4', { 'fill-red-600 text-red-600': myVote === -1, 'fill-transparent transition-colors duration-1000': myVote === null })} />
				</Button>
				<Tooltip>Down vote</Tooltip>
			</TooltipTrigger>
			<div className="h-3/4 w-px bg-neutral-300 dog:bg-neutral-500" />
			<span className={clsx('font-mono text-sm', { 'mx-3': totalVotes >= 0, 'mx-2': totalVotes < 0 })}>{totalVotes}</span>
			<div className="h-3/4 w-px bg-neutral-300 dog:bg-neutral-500" />
			<TooltipTrigger>
				<Button variant="quiet" onClick={onUpVote}>
					<ArrowBigUp className={clsx('size-4', { 'fill-green-600 text-green-600': myVote === 1, 'fill-transparent transition-colors duration-1000': myVote === null })} />
				</Button>
				<Tooltip>Up vote</Tooltip>
			</TooltipTrigger>
		</div>
	);
};
