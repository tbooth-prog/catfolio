import { Cat, Dog, UploadIcon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { Switch } from "~/components/aria/Switch";
import { LinkButton } from "~/components/controls/Buttons";
import { GalleryFilter } from "~/utils/enums";
import { useDogMode } from "~/utils/hooks";

export default function AppLayout() {
  const { isDogModeEnabled, toggleDogMode } = useDogMode();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-dvh max-w-7xl border-x border-x-subtle dog:border-subtle-dark mx-auto">
      <header className="bg-surface dog:bg-surface-dark border-b border-subtle dog:border-subtle-dark flex justify-between items-center px-6 py-5 sticky top-0 z-10 h-20">
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
              <span className="hidden sm:block">{`Upload ${isDogModeEnabled ? "Dog" : "Cat"}`}</span>
              <UploadIcon className="size-4" />
            </div>
          </LinkButton>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center p-6">
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}
