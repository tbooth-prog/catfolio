import { TooltipTrigger, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Button, type SharedButtonProps } from './Buttons';
import type { PropsWithChildren } from 'react';
import { Tooltip } from '../aria/Tooltip';
import { clsx } from 'clsx';

interface Props extends SharedButtonProps, AriaButtonProps {
	tooltipLabel: string;
}

export function ImageOverlayButton(props: PropsWithChildren<Props>) {
	const { tooltipLabel, children, className, ...buttonProps } = props;

	const buttonClass = clsx('absolute z-20 m-2', className);

	return (
		<TooltipTrigger>
			<Button className={buttonClass} {...buttonProps}>
				{children}
			</Button>
			<Tooltip>{tooltipLabel}</Tooltip>
		</TooltipTrigger>
	);
}
