import { type PropsWithChildren, useEffect, useRef } from "react";
// import { Loader } from "./Loader";
import { INFINITE_SCROLL_TOLERANCE } from "~/utils";

interface Props {
  loader: () => void;
  isLoadingMore: boolean;
  scrollTolerance?: number;
}

export function InfiniteScroll(props: PropsWithChildren<Props>) {
  const {
    children,
    loader,
    isLoadingMore,
    scrollTolerance = INFINITE_SCROLL_TOLERANCE,
  } = props;
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length === 1 && entries[0].isIntersecting) {
          loader();
        }
      },
      { threshold: 1 },
    );

    const checkpoint = endOfListRef.current;

    if (checkpoint) {
      observer.observe(checkpoint);
    }

    return () => {
      if (checkpoint) {
        observer.unobserve(checkpoint);
      }
    };
  }, [endOfListRef, loader]);

  return (
    <>
      {children}

      <div>
        <div
          id="list-end"
          className="relative width-full left-0"
          ref={endOfListRef}
          style={{ bottom: scrollTolerance }}
        />
        {/*{isLoadingMore && <Loader className="load-checkpoint" />}*/}
      </div>
    </>
  );
}
