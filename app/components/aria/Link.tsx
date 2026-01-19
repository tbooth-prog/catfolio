"use client";
import React from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "~/lib/react-aria-utils";

interface LinkProps extends AriaLinkProps {
  variant?: "primary" | "secondary";
}

const styles = tv({
  extend: focusRing,
  base: "underline disabled:no-underline disabled:cursor-default forced-colors:disabled:text-[GrayText] transition rounded-xs [-webkit-tap-highlight-color:transparent]",
  variants: {
    variant: {
      primary:
        "text-blue-600 dog:text-blue-500 underline decoration-blue-600/60 hover:decoration-blue-600 dog:decoration-blue-500/60 dog:hover:decoration-blue-500",
      secondary:
        "text-neutral-700 dog:text-neutral-300 underline decoration-neutral-700/50 hover:decoration-neutral-700 dog:decoration-neutral-300/70 dog:hover:decoration-neutral-300",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export function Link(props: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className, variant: props.variant }),
      )}
    />
  );
}
