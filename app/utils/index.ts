import { ImageOrientation } from "./enums";

export const USER_ID_KEY = "catfolio:userId";
export const THEME_KEY = "catfolio:theme";
// Load more height, takes any valid bottom value string
// used to trigger infinte scroll loader before reaching the bottom
export const INFINITE_SCROLL_TOLERANCE = "75vh";

export function getOrCreateUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getInitialTheme(): "cat" | "dog" {
  return (localStorage.getItem(THEME_KEY) as "cat" | "dog") || "cat";
}

export const getImageOrientation = (
  width?: number,
  height?: number,
): ImageOrientation => {
  if (!width || !height) {
    return ImageOrientation.Landscape;
  }

  const aspect = width / height;

  if (aspect < 0.9) {
    return ImageOrientation.Portrait;
  } else if (aspect <= 1.1) {
    return ImageOrientation.Square;
  } else {
    return ImageOrientation.Landscape;
  }
};

export function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();

  return items.filter((item) => !seen.has(item.id) && seen.add(item.id));
}
