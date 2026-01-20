import { useSelector } from "react-redux";
import type { RootState } from "~/store";

export function UploadError() {
  const { failedFiles } = useSelector((state: RootState) => state.upload);

  return (
    <ul className="flex gap-4 flex-wrap ">
      {Object.entries(failedFiles).map(([uploadId, imageData]) => (
        <div
          key={uploadId}
          className="flex h-28 w-full p-4 bg-surface dog:bg-surface-dark rounded-lg border border-red-600 gap-4"
        >
          <img
            src={imageData.url}
            className="shrink-0 rounded h-full aspect-square"
          />
          <div className="text-center w-full">
            <h3>Upload failed</h3>
            <p>{imageData.error}</p>
          </div>
        </div>
      ))}
    </ul>
  );
}
