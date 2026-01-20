import { useSelector } from "react-redux";
import { ImageUpload } from "~/components/controls/ImageUpload";
import { UploadProgress } from "~/components/ui/UploadProgress";
import type { RootState } from "~/store";

export default function Upload() {
  const { showInput } = useSelector((state: RootState) => state.upload);

  return (
    <div className="w-full flex items-center justify-center mt-6 md:mt-12">
      {showInput ? <ImageUpload /> : <UploadProgress />}
    </div>
  );
}
