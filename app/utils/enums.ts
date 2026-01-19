export const TaskStatus = {
  Idle: "idle",
  Pending: "pending",
  Succeded: "succeeded",
  Failed: "failed",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const GalleryFilter = {
  None: "none",
  MyImages: "my-images",
  Favourites: "favorites",
  Voted: "voted",
} as const;
export type GalleryFilter = (typeof GalleryFilter)[keyof typeof GalleryFilter];

export const GallerySortOption = {
  None: "none",
  DateAsc: "date-asc",
  DateDesc: "date-desc",
  TopRated: "top-rated",
} as const;
export type GallerySortOption =
  (typeof GallerySortOption)[keyof typeof GallerySortOption];

export const ImageOrientation = {
  Portrait: "portrait",
  Landscape: "landscape",
  Square: "square",
} as const;
export type ImageOrientation =
  (typeof ImageOrientation)[keyof typeof ImageOrientation];
