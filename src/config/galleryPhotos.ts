// Real Photo Gallery™ — backs /gallery and the homepage's "Moments From
// Our Workshops" glimpse section (a subset of this same array, so the
// two can never drift apart — see GalleryGlimpse.tsx). Every `src` is
// `undefined` until a real photo is dropped into public/gallery/ and
// this file is updated to point at it — no placeholder photo content is
// invented here, only clearly labeled empty slots (see PhotoGallery.tsx
// for what an unset slot renders as).
export type GalleryCategory = "workshops" | "retreats" | "qsr";

export type GalleryPhotoEntry = {
  id: string;
  src: string | undefined;
  alt: string;
  category: GalleryCategory;
};

// Phase 4.4: the owner's real workshop photos (uploaded to public/; the
// date in each file name gives the year — no city is in the names, so none
// is written). Captions say only what the photo shows. Which program each
// photo is from is not certain, so the page shows no filters.
export const GALLERY_PHOTOS: readonly GalleryPhotoEntry[] = [
  { id: "img-20220828-123945", src: "/IMG_20220828_123945.jpg", alt: "Dr. Kapil with the batch · 2022", category: "workshops" },
  { id: "img-20220910-164123", src: "/IMG_20220910_164123.jpg", alt: "Workshop session · 2022", category: "workshops" },
  { id: "img-20220910-164131", src: "/IMG_20220910_164131.jpg", alt: "Dr. Kapil with the batch · 2022", category: "workshops" },
  { id: "img-20221121-122722", src: "/IMG_20221121_122722.jpg", alt: "Lying-down practice · 2022", category: "workshops" },
  { id: "img-20221124-141950", src: "/IMG_20221124_141950.jpg", alt: "Standing practice · 2022", category: "workshops" },
  { id: "img-20221225-192623", src: "/IMG_20221225_192623.jpg", alt: "Certificate presentation · 2022", category: "workshops" },
  { id: "img-20221225-192728", src: "/IMG_20221225_192728.jpg", alt: "Certificate presentation · 2022", category: "workshops" },
  { id: "img-20221225-192753", src: "/IMG_20221225_192753.jpg", alt: "Certificate presentation · 2022", category: "workshops" },
]
