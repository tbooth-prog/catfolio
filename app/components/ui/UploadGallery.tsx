import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { UploadImage } from "./UploadImage";

export function UploadGallery() {
  const { pendingFiles, totalUploads } = useSelector(
    (state: RootState) => state.upload,
  );

  if (totalUploads <= 2) {
    return (
      <div className=" flex justify-start w-full flex-wrap gap-4">
        {Object.entries(pendingFiles).map(([uploadId, imageData]) => (
          <UploadImage key={uploadId} image={imageData} uploadId={uploadId} />
        ))}
      </div>
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={{ default: 3, 640: 2 }}
        className="flex w-full gap-4"
        columnClassName="*:mb-4 -mb-4"
      >
        {Object.entries(pendingFiles).map(([uploadId, imageData]) => (
          <UploadImage
            key={uploadId}
            image={imageData}
            uploadId={uploadId}
            isMasonry
          />
        ))}
      </Masonry>
      <div className="absolute bottom-0 w-full h-32 from-surface dog:from-surface-dark to-transparent bg-linear-to-t pointer-events-none" />
    </>
  );
}
