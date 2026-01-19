import { type PropsWithChildren } from "react";
import { ImageCard } from "./ImageCard";
import type { Image } from "~/api/types";

interface Props {
  items: Image[];
}

export function Masonry(props: PropsWithChildren<Props>) {
  const { items } = props;

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 *:mb-6 -mb-6">
      {items.map((item: Image) => (
        <ImageCard key={item.id} image={item} />
      ))}
    </div>
  );
}
