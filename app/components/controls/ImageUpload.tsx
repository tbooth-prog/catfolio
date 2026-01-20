import { useRef, type ChangeEvent } from "react";
import { DropZone } from "../aria/DropZone";
import { Button } from "./Buttons";
import type { DragTypes, DropEvent } from "react-aria";
import { ACCEPTED_IMAGE_TYPES } from "~/utils";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "~/store";
import { setTotalUploads, uploadImage } from "~/store/uploadSlice";

export function ImageUpload() {
  const dispatch = useDispatch<AppDispatch>();

  const inputRef = useRef<HTMLInputElement>(null);

  // Handlers ==================================================================

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const fileList = e.target.files;

    if (fileList !== null && fileList.length > 0) {
      dispatch(setTotalUploads({ count: fileList.length }));
      handleFileUpload(Array.from(fileList));
    }
  };

  const handleFileUpload = (files: File[]) => {
    Promise.allSettled(
      files.map(async (file) => {
        const uploadId = crypto.randomUUID();

        let width: number | undefined;
        let height: number | undefined;

        try {
          const bitmap = await createImageBitmap(file);
          width = bitmap.width;
          height = bitmap.height;
          bitmap.close();
        } catch {
          // ignore — dimensions optional
        }

        dispatch(uploadImage({ uploadId, file, width, height }));
      }),
    );
  };

  return (
    <div
      className="h-90 sm:h-128 flex w-full md:w-3/4"
      onClick={() => inputRef.current?.click()}
    >
      <DropZone
        getDropOperation={(types: DragTypes) =>
          ACCEPTED_IMAGE_TYPES.some((t) => types.has(t)) ? "copy" : "cancel"
        }
        onDrop={async (e: DropEvent) => {
          // get all acceptable files
          const items = e.items.filter(
            (item) => item.kind === "file" && item.type.startsWith("image/"),
          );

          const files: File[] = [];

          for (const item of e.items) {
            if (item.kind === "file" && item.type.startsWith("image/")) {
              try {
                const file = await item.getFile();
                if (file) {
                  files.push(file); // Mutating the array, not reassigning the variable
                }
              } catch (error) {
                console.error("Error retrieving file:", error);
              }
            }
          }

          dispatch(setTotalUploads({ count: files.length }));
          handleFileUpload(files);
        }}
      >
        <div
          slot="label"
          className="flex flex-1 flex-col p-6 gap-8 border-dashed border-subtle-dark dog:border-subtle h-full border-2 rounded items-center justify-center"
        >
          <h2 className="font-bold text-3xl hidden sm:block">
            Drag and drop an image or
            <br />
            <span className="text-primary dog:text-primary-dark">
              browse to upload
            </span>
          </h2>
          <Button onClick={() => inputRef.current?.click()}>
            Upload your photos
          </Button>
        </div>
      </DropZone>
      <input
        ref={inputRef}
        multiple
        type="file"
        hidden
        accept={ACCEPTED_IMAGE_TYPES.join(", ")}
        onChange={handleSelectFile}
      />
    </div>
  );
}
