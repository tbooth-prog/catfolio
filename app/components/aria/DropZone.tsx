"use client";
import {
  composeRenderProps,
  type DropZoneProps,
  DropZone as RACDropZone,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZone = tv({
  base: "flex items-center justify-center p-8 min-h-90 md:min-h-128 w-full md:w-3/4 font-sans text-base text-balance text-center rounded-lg border border-1 border-subtle dog:border-subtle-dark bg-surface dog:bg-surface-dark",
  variants: {
    isFocusVisible: {
      true: "outline-2 -outline-offset-1 outline-primary dog:outline-primary-dark forced-colors:outline-[Highlight]",
    },
    isDropTarget: {
      true: "bg-surface-focus dog:bg-surface-focus-dark outline outline-2 -outline-offset-1 outline-primary dog:outline-primary-dark forced-colors:outline-[Highlight] hover:bg-surface-focus",
    },
    isHovered: {
      true: "bg-neutral-100 dog:bg-neutral-900",
    },
  },
  compoundVariants: [
    {
      isDropTarget: true,
      isHovered: true,
      class:
        "bg-surface-focus dog:bg-surface-focus-dark outline outline-2 -outline-offset-1 outline-primary dog:outline-primary-dark forced-colors:outline-[Highlight] hover:bg-surface-focus",
    },
  ],
});

export function DropZone(props: DropZoneProps) {
  return (
    <RACDropZone
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        dropZone({ ...renderProps, className }),
      )}
    />
  );
}
