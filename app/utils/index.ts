import type { Favourite, ImageFavourite, UserImage } from "~/api/types";
import { ImageOrientation } from "./enums";
import type { GalleryImage, GalleryImageMeta } from "~/store/types";

export const GALLERY_PAGE_SIZE = 50;
export const USER_ID_KEY = "catfolio:userId";
export const THEME_KEY = "catfolio:theme";
// Load more height, takes any valid bottom value string
// used to trigger infinte scroll loader before reaching the bottom
export const INFINITE_SCROLL_TOLERANCE = "75vh";
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

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
    return ImageOrientation.Square;
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

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mapUserImageToGalleryImage(image: UserImage): GalleryImage {
  return {
    ...image,
    meta: {
      favouriteId: image.favourite?.id,
      voteId: image.vote?.id,
      myVote: image.vote?.value,
    },
  };
}

export function mapFavouriteToGalleryImage(favourite: Favourite): GalleryImage {
  return {
    id: favourite.image.id,
    url: favourite.image.url,
    meta: {
      favouriteId: favourite.id,
    },
  };
}
