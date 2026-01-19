import { UploadIcon } from "lucide-react";
import { useEffect, useRef, useState, type UIEvent } from "react";
import { Link, Outlet } from "react-router";
import { Switch } from "~/components/aria/Switch";
import { LinkButton } from "~/components/controls/Buttons";
import { ScrollHint } from "~/components/ui/ScrollHint";
import { SCROLL_HINT_BUFFER } from "~/utils";
import { useDogMode } from "~/utils/hooks";

export default function AppLayout() {
  const { isDogModeEnabled, toggleDogMode } = useDogMode();

  const [showTopScrollHint, setShowTopScrollHint] = useState<boolean>(false);
  const [showBottomScrollHint, setShowBottomScrollHint] =
    useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = contentRef.current;
    if (!scrollContainer) return;

    const checkScrollAvailable = () => {
      const { clientHeight, scrollHeight, scrollTop } = scrollContainer;
      setShowTopScrollHint(scrollTop > SCROLL_HINT_BUFFER);
      setShowBottomScrollHint(
        scrollTop + clientHeight < scrollHeight - SCROLL_HINT_BUFFER,
      );
    };

    checkScrollAvailable();
    window.addEventListener("resize", checkScrollAvailable);

    return () => window.removeEventListener("resize", checkScrollAvailable);
  });

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollContainer = e.currentTarget;
    const { clientHeight, scrollHeight, scrollTop } = scrollContainer;
    setShowTopScrollHint(scrollTop > SCROLL_HINT_BUFFER);
    setShowBottomScrollHint(
      scrollTop + clientHeight < scrollHeight - SCROLL_HINT_BUFFER,
    );
  };

  return (
    <div className="flex flex-col h-dvh max-w-7xl border-x border-x-subtle dog:border-subtle-dark mx-auto">
      <div className="sticky top-0 z-10 ">
        <header className="bg-surface dog:bg-surface-dark border-b border-subtle dog:border-subtle-dark flex justify-between items-center px-6 py-5">
          <Link to="/" className="font-logo text-3xl">
            {`${isDogModeEnabled ? "dogfol" : "catfol"}`}
            <span className="text-primary dog:text-primary-dark">.io</span>
          </Link>
          <div className="flex items-center gap-8">
            <Switch isSelected={isDogModeEnabled} onChange={toggleDogMode}>
              <span slot="label">
                {isDogModeEnabled ? "Disable dog mode" : "Enable dog mode"}
              </span>
            </Switch>
            <LinkButton to="/upload" className="shrink-0">
              <div className="flex gap-2 items-center">
                <span>{`Upload ${isDogModeEnabled ? "Dog" : "Cat"}`}</span>
                <UploadIcon className="size-4" />
              </div>
            </LinkButton>
          </div>
        </header>
        {/* Filters & Sort */}
        <div className="min-h-16 border-b border-b-subtle dog:border-subtle-dark px-6 py-2 bg-background dog:bg-background-dark"></div>
      </div>
      <main className="flex flex-1 flex-col items-center relative overflow-hidden">
        <div
          className="flex-1 overflow-auto scroll-smooth p-6 "
          ref={contentRef}
          onScroll={handleScroll}
        >
          <ScrollHint
            showHint={showTopScrollHint}
            className="top-0 bg-linear-to-b"
          />
          <Outlet />
          <ScrollHint
            showHint={showBottomScrollHint}
            className="bottom-0 bg-linear-to-t"
          />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
