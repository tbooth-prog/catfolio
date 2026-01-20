import { motion } from "motion/react";
import { clsx } from "clsx";
import { ImageOrientation } from "~/utils/enums";
import type { Image } from "~/api/types";
import { getImageOrientation } from "~/utils";

interface Props {
  image: Image;
}

export function GalleryImage(props: Props) {
  const { image } = props;

  const orientation = getImageOrientation(image.width, image.height);

  const className = clsx(
    "w-full bg-surface dog:bg-surface-dark break-inside-avoid rounded-xl overflow-hidden contain-content",
    {
      "aspect-3/4": orientation === ImageOrientation.Portrait,
      "aspect-4/3": orientation === ImageOrientation.Landscape,
      "aspect-square": orientation === ImageOrientation.Square,
    },
  );

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      <img
        src={image.url}
        alt={image.id}
        className="object-cover h-full w-full scale-[1.1]"
        loading="lazy"
        decoding="async"
      />
    </motion.div>
  );
}
