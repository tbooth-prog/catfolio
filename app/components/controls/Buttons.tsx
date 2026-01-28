'use client';
import { useRef } from 'react';
import { useButton } from 'react-aria';
import { composeRenderProps, Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Link, type LinkProps } from 'react-router';
import { tv } from 'tailwind-variants';
import { focusRing } from '~/lib/react-aria-utils';

export interface SharedButtonProps {
	/** @default 'primary' */
	variant?: 'primary' | 'secondary' | 'destructive' | 'quiet' | 'contrast';
}

const buttonClasses = tv({
	extend: focusRing,
	base: 'relative inline-flex items-center justify-center gap-2 border border-transparent dog:border-white/10 h-9 box-border px-3.5 py-0 [&:has(>svg:only-child)]:px-0 [&:has(>svg:only-child)]:h-8 [&:has(>svg:only-child)]:w-8 font-sans text-sm text-center transition rounded-lg cursor-default [-webkit-tap-highlight-color:transparent] cursor-pointer',
	variants: {
		variant: {
			primary: 'bg-primary dog:bg-primary-dark hover:bg-blue-700 pressed:bg-blue-800 text-white',
			secondary:
				'border-black/10 bg-neutral-50 hover:bg-neutral-100 pressed:bg-neutral-200 text-neutral-800 dog:bg-neutral-700 dog:hover:bg-neutral-600 dog:pressed:bg-neutral-500 dog:text-neutral-100',
			destructive: 'bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white',
			quiet: 'border-0 bg-transparent hover:bg-neutral-200 pressed:bg-neutral-300 text-neutral-800 dog:hover:bg-neutral-700 dog:pressed:bg-neutral-600 dog:text-neutral-100',
			contrast: 'bg-violet-600 hover:bg-violet-700 pressed:bg-violet-800 text-white',
		},
		isDisabled: {
			true: 'border-transparent dog:border-transparent bg-neutral-100 dog:bg-neutral-800 text-neutral-300 dog:text-neutral-600 forced-colors:text-[GrayText] cursor-not-allowed',
		},
		isPending: {
			true: 'text-transparent',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
	compoundVariants: [
		{
			variant: 'quiet',
			isDisabled: true,
			class: 'bg-transparent',
		},
	],
});

export function Button(props: SharedButtonProps & AriaButtonProps) {
	return (
		<AriaButton {...props} className={composeRenderProps(props.className, (className, renderProps) => buttonClasses({ ...renderProps, variant: props.variant, className }))}>
			{composeRenderProps(props.children, (children, { isPending }) => (
				<>
					{children}
					{isPending && (
						<span aria-hidden className="absolute inset-0 flex items-center justify-center">
							<svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" stroke={props.variant === 'secondary' || props.variant === 'quiet' ? 'light-dark(black, white)' : 'white'}>
								<circle cx="12" cy="12" r="10" strokeWidth="4" fill="none" className="opacity-25" />
								<circle cx="12" cy="12" r="10" strokeWidth="4" strokeLinecap="round" fill="none" pathLength="100" strokeDasharray="60 140" strokeDashoffset="0" />
							</svg>
						</span>
					)}
				</>
			))}
		</AriaButton>
	);
}

export function LinkButton(props: SharedButtonProps & LinkProps) {
	const { to, children, className, state, variant } = props;

	const ref = useRef(null);
	const { buttonProps } = useButton({ elementType: 'a', href: typeof to === 'string' ? to : undefined }, ref);

	return (
		<Link ref={ref} to={to} state={state} {...buttonProps} className={buttonClasses({ variant, className })}>
			{children}
		</Link>
	);
}
