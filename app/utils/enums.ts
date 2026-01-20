export const TaskStatus = {
  Idle: "idle",
  Pending: "pending",
  Succeded: "succeeded",
  Failed: "failed",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const GalleryFilter = {
  All: "all",
  MyImages: "my-images",
  Favourites: "favourites",
  TopRated: "top-rated",
} as const;
export type GalleryFilter = (typeof GalleryFilter)[keyof typeof GalleryFilter];

export const GallerySortOption = {
  None: "RAND",
  DateAsc: "ASC",
  DateDesc: "DESC",
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
