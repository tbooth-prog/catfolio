"use client";
import React from "react";
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Button,
  composeRenderProps,
  type GridListItemProps,
  type GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Checkbox } from "~/components/aria/Checkbox";
import { composeTailwindRenderProps, focusRing } from "~/lib/react-aria-utils";

export function GridList<T extends object>({
  children,
  ...props
}: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "overflow-auto w-50 relative bg-white dog:bg-neutral-900 border border-neutral-300 dog:border-neutral-700 rounded-lg font-sans empty:flex empty:items-center empty:justify-center empty:italic empty:text-sm",
      )}
    >
      {children}
    </AriaGridList>
  );
}

const itemStyles = tv({
  extend: focusRing,
  base: "relative flex gap-3 cursor-default select-none py-2 px-3 text-sm text-neutral-900 dog:text-neutral-200 border-t dog:border-t-neutral-700 border-transparent first:border-t-0 first:rounded-t-lg last:rounded-b-lg last:mb-0 -outline-offset-2",
  variants: {
    isSelected: {
      false:
        "hover:bg-neutral-100 pressed:bg-neutral-100 dog:hover:bg-neutral-700/60 dog:pressed:bg-neutral-700/60",
      true: "bg-blue-100 dog:bg-blue-700/30 hover:bg-blue-200 pressed:bg-blue-200 dog:hover:bg-blue-700/40 dog:pressed:bg-blue-700/40 border-y-blue-200 dog:border-y-blue-900 z-20",
    },
    isDisabled: {
      true: "text-neutral-300 dog:text-neutral-600 forced-colors:text-[GrayText] z-10",
    },
  },
});

export function GridListItem({ children, ...props }: GridListItemProps) {
  let textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaGridListItem textValue={textValue} {...props} className={itemStyles}>
      {composeRenderProps(
        children,
        (children, { selectionMode, selectionBehavior, allowsDragging }) => (
          <>
            {/* Add elements for drag and drop and selection. */}
            {allowsDragging && <Button slot="drag">≡</Button>}
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            {children}
          </>
        ),
      )}
    </AriaGridListItem>
  );
}
