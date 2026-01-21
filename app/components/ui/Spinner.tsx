import { clsx } from 'clsx';

interface Props {
	className?: string;
}

export function Spinner(props: Props) {
	const { className = 'size-8' } = props;

	const spinnerClass = clsx('animate-spin rounded-full border-2 border-neutral-200 border-t-primary dog:border-neutral-200 dog:border-t-primary-dark', className);

	return <div className={spinnerClass} />;
}
