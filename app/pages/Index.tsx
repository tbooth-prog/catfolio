import { Masonry } from "~/components/ui/Masonry";
import type { AppDispatch, RootState } from "~/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getImages } from "~/store/gallerySlice";
import { TaskStatus } from "~/utils/enums";
import { useDogMode } from "~/utils/hooks";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { images, status } = useSelector((state: RootState) => state.gallery);
  const { isDogModeEnabled } = useDogMode();

  useEffect(() => {
    dispatch(getImages());
  }, [isDogModeEnabled]);

  return (
    <div className="w-full">
      <Masonry items={images} />
    </div>
  );
}
