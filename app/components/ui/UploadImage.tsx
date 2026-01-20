import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import { ImageOrientation, TaskStatus } from "~/utils/enums";
import type { SelectedFile } from "~/store/types";
import { Spinner } from "./Spinner";
import { CircleCheck, CircleX, FileCheck, FileX } from "lucide-react";
import { useEffect, useState } from "react";
import { clearPendingFile } from "~/store/uploadSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "~/store";

interface Props {
  uploadId: string;
  image: SelectedFile;
  isMasonry?: boolean;
}

export function UploadImage(props: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { uploadId, image, isMasonry = false } = props;
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    if (
      image.status === TaskStatus.Succeded ||
      image.status === TaskStatus.Failed
    ) {
      setIsExiting(true);
      const clearFileTimer = setTimeout(() => {
        dispatch(clearPendingFile({ uploadId }));
      }, 750);

      return () => clearTimeout(clearFileTimer);
    }
  }, [image.status]);

  const className = clsx(
    "relative flex bg-surface dog:bg-surface-dark break-inside-avoid rounded-xl overflow-hidden contain-content border border-subtle-dark dog:border-subtle ",
    {
      "aspect-3/4": image.orientation === ImageOrientation.Portrait,
      "aspect-4/3": image.orientation === ImageOrientation.Landscape,
      "aspect-square": image.orientation === ImageOrientation.Square,
      "max-h-48": !isMasonry,
      "w-full": isMasonry,
    },
  );

  const exitY = image.status === TaskStatus.Succeded ? -10 : 10;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className={className}
          key={uploadId}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          exit={{
            opacity: 0,
            y: exitY,
          }}
        >
          <img
            src={image.url}
            alt={`Upload image ${uploadId}`}
            className="object-cover h-full w-full blur-sm"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute flex items-center justify-center h-full w-full bg-neutral-400/50">
            {image.status === TaskStatus.Pending && (
              <Spinner className="size-12 sm:size-16 md:size-20" />
            )}
            {image.status === TaskStatus.Succeded && (
              <CircleCheck
                fill="oklch(62.7% 0.194 149.214)"
                strokeWidth={1}
                className="size-1/4 text-primary-text"
              />
            )}
            {image.status === TaskStatus.Failed && (
              <CircleX
                fill="oklch(57.7% 0.245 27.325)"
                strokeWidth={1}
                className="size-1/4  text-primary-text"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
