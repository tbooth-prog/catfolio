import Masonry from "react-masonry-css";
import type { AppDispatch, RootState } from "~/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getImages, getMoreImages } from "~/store/gallerySlice";
import { TaskStatus } from "~/utils/enums";
import { useDogMode } from "~/utils/hooks";
import { ImageCard } from "~/components/ui/ImageCard";
import { InfiniteScroll } from "~/components/controls/InfiniteScroll";
import type { Image } from "~/api/types";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { images, initial, pagination } = useSelector(
    (state: RootState) => state.gallery,
  );
  const { isDogModeEnabled } = useDogMode();

  useEffect(() => {
    dispatch(getImages());
  }, [isDogModeEnabled]);

  // Handlers ==================================================================

  const handleLoadMore = () => {
    // Bail if already loading or no more to load
    if (pagination.status === TaskStatus.Pending || !pagination.hasMore) return;

    dispatch(getMoreImages());
  };

  // Render ====================================================================
  return (
    <div className="w-full flex-1">
      <InfiniteScroll
        loader={handleLoadMore}
        isLoadingMore={pagination.status === TaskStatus.Pending}
      >
        <Masonry
          breakpointCols={{ default: 4, 1024: 3, 768: 2, 640: 1 }}
          className="flex w-full gap-6"
          columnClassName="*:mb-6 -mb-6"
        >
          {images.map((item: Image) => (
            <ImageCard key={item.id} image={item} />
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}
