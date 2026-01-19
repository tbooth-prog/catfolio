import { clsx } from "clsx";

interface Props {
  showHint: boolean;
  className?: string;
}

export function ScrollHint(props: Props) {
  const { showHint, className } = props;

  const hintClass = clsx(
    "pointer-events-none absolute right-0 left-0 z-10 h-24 from-white to-transparent transition-opacity md:h-48",
    className,
    { "opacity-100": showHint, "opacity-0": !showHint },
  );

  return <div className={hintClass} />;
}
