import Masonry from "react-masonry-css";
import type { AppDispatch, RootState } from "~/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { GalleryFilter, TaskStatus } from "~/utils/enums";
import { useDogMode } from "~/utils/hooks";
import { GalleryImage } from "~/components/ui/GalleryImage";
import { InfiniteScroll } from "~/components/controls/InfiniteScroll";
import type { Image } from "~/api/types";
import store, { getImages, getMoreImages } from "~/store";
import {
  useLocation,
  useRevalidator,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { LinkButton } from "~/components/controls/Buttons";
import { Cat, Dog, Heart, ImageUp, Star } from "lucide-react";

export function clientLoader(args: ClientLoaderFunctionArgs) {
  const { request } = args;
  const { filter } = store.getState().gallery;

  const { searchParams } = new URL(request.url);
  const urlFilter = searchParams.get("filter") ?? GalleryFilter.MyImages;

  if (urlFilter !== filter) {
    getImages(urlFilter as GalleryFilter);
  }
}

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { revalidate } = useRevalidator();
  const { search } = useLocation();

  const { images, pagination } = useSelector(
    (state: RootState) => state.gallery,
  );
  const { isDogModeEnabled } = useDogMode();

  useEffect(() => {
    revalidate();
  }, [isDogModeEnabled, search]);

  // Render ====================================================================
  return (
    <div className="w-full flex-1">
      <div className="min-h-16 border-b border-b-subtle dog:border-subtle-dark px-6 py-2 bg-background dog:bg-background-dark flex items-center gap-4 sticky top-20 z-10 -mx-6 -mt-6 mb-6">
        <LinkButton
          to={`/?filter=${GalleryFilter.All}`}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          {isDogModeEnabled ? (
            <Dog strokeWidth={1} className="size-5" />
          ) : (
            <Cat strokeWidth={1} className="size-5" />
          )}
          <span className="hidden sm:block">{`All ${isDogModeEnabled ? "Dogs" : "Cats"}`}</span>
        </LinkButton>
        <LinkButton
          to={`/?filter=${GalleryFilter.MyImages}`}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          <ImageUp strokeWidth={1} className="size-5" />
          <span className="hidden sm:block">My Images</span>
        </LinkButton>
        <LinkButton
          to={`/?filter=${GalleryFilter.Favourites}`}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          <Heart strokeWidth={1} className="size-5" />
          <span className="hidden sm:block">Favourites</span>
        </LinkButton>
        <LinkButton
          to={`/?filter=${GalleryFilter.TopRated}`}
          variant="secondary"
          className="flex-1 sm:flex-initial"
        >
          <Star strokeWidth={1} className="size-5" />
          <span className="hidden sm:block">Top Rated</span>
        </LinkButton>
      </div>
      <InfiniteScroll
        loader={getMoreImages}
        isLoadingMore={pagination.status === TaskStatus.Pending}
      >
        <Masonry
          breakpointCols={{ default: 4, 1024: 3, 768: 2, 640: 1 }}
          className="flex w-full gap-6"
          columnClassName="*:mb-6 -mb-6"
        >
          {images.map((item: Image) => (
            <GalleryImage key={item.id} image={item} />
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}
