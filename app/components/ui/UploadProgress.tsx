import { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { UploadGallery } from "./UploadGallery";
import { Navigate } from "react-router";
import { UploadError } from "./UploadError";

export function UploadProgress() {
  const { failedFiles, pendingFiles } = useSelector(
    (state: RootState) => state.upload,
  );

  const canNavigateOnCompletion = useRef<boolean>(true);
  const isUploading = Object.keys(pendingFiles).length > 0;
  const hasErrors = Object.keys(failedFiles).length > 0;

  useEffect(() => {
    if (canNavigateOnCompletion.current && hasErrors) {
      canNavigateOnCompletion.current = false;
    }
  }, [hasErrors]);

  if (!isUploading && !hasErrors) {
    return canNavigateOnCompletion.current ? <Navigate to="/" /> : <div></div>;
  }

  return (
    <div className="h-full flex w-full md:w-3/4 flex-col gap-8">
      {isUploading && (
        <section className="max-h-[50vh] flex relative items-start justify-start p-8 w-full font-sans text-base text-balance text-center rounded-lg border  border-subtle dog:border-subtle-dark bg-surface dog:bg-surface-dark border-dashed">
          <div className="absolute top-0 left-12 -translate-y-1/2 flex items-center">
            <div className="absolute w-full h-0.5 bg-surface dog:bg-surface-dark" />
            <h2 className="z-10 px-1">Uploading files</h2>
          </div>
          <div className="h-full overflow-hidden">
            <UploadGallery />
          </div>
          <div />
        </section>
      )}
      {hasErrors && (
        <>
          <div className="flex justify-center items-center gap-6">
            <hr className="flex-1 border-neutral-200 dog:border-neutral-600" />
            <h2 className="shrink-0">Errors</h2>
            <hr className="flex-1 border-neutral-200 dog:border-neutral-600" />
          </div>
          <section>
            <UploadError />
          </section>
        </>
      )}
    </div>
  );
}
