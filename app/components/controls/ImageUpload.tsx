import { useRef } from "react";
import { DropZone } from "../aria/DropZone";
import { Button } from "./Buttons";

export function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DropZone
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer"
    >
      <div className="flex flex-1 flex-col p-6 gap-8 border-dashed border-subtle-dark dog:border-subtle h-full border-2 rounded items-center justify-center ">
        <h2 className="font-bold text-3xl">
          Drag and drop an image or{" "}
          <span className="text-primary dog:text-primary-dark">
            browse to upload
          </span>
        </h2>
        <Button>Upload your photos</Button>
        <input ref={inputRef} type="hidden" />
      </div>
    </DropZone>
  );
}
