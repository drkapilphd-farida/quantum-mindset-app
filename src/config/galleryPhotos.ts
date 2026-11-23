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
// Nov 2026: newer workshop photos from the owner, best first (the homepage
// glimpse and program pages show the first few). No city or date is written.
export const GALLERY_PHOTOS: readonly GalleryPhotoEntry[] = [
  { id: "workshop-2026-ws02", src: "/gallery/workshop-2026-ws02.jpg", alt: "Dr. Kapil with a full workshop batch", category: "workshops" },
  { id: "workshop-2026-ws03", src: "/gallery/workshop-2026-ws03.jpg", alt: "Dr. Kapil with participants at a workshop", category: "workshops" },
  { id: "workshop-2026-ws08", src: "/gallery/workshop-2026-ws08.jpg", alt: "Group meditation during a workshop", category: "workshops" },
  { id: "workshop-2026-ws10", src: "/gallery/workshop-2026-ws10.jpg", alt: "Participants after a practice session", category: "workshops" },
  { id: "workshop-2026-ws01", src: "/gallery/workshop-2026-ws01.jpg", alt: "Dr. Kapil with workshop participants", category: "workshops" },
  { id: "workshop-2026-ws16", src: "/gallery/workshop-2026-ws16.jpg", alt: "Workshop session in progress", category: "workshops" },
  { id: "workshop-2026-ws18", src: "/gallery/workshop-2026-ws18.jpg", alt: "Dr. Kapil leading a workshop session", category: "workshops" },
  { id: "workshop-2026-ws04", src: "/gallery/workshop-2026-ws04.jpg", alt: "Floor practice session on mats", category: "workshops" },
  { id: "workshop-2026-ws07", src: "/gallery/workshop-2026-ws07.jpg", alt: "Guided practice in a workshop hall", category: "workshops" },
  { id: "workshop-2026-ws05", src: "/gallery/workshop-2026-ws05.jpg", alt: "Meditation group in white", category: "workshops" },
  { id: "workshop-2026-ws12", src: "/gallery/workshop-2026-ws12.jpg", alt: "Participants in a workshop session", category: "workshops" },
  { id: "workshop-2026-ws11", src: "/gallery/workshop-2026-ws11.jpg", alt: "Dr. Kapil with a workshop group", category: "workshops" },
  { id: "workshop-2026-ws13", src: "/gallery/workshop-2026-ws13.jpg", alt: "Seated meditation practice", category: "workshops" },
  { id: "workshop-2026-ws14", src: "/gallery/workshop-2026-ws14.jpg", alt: "Participants listening during a session", category: "workshops" },
  { id: "workshop-2026-ws17", src: "/gallery/workshop-2026-ws17.jpg", alt: "Workshop session with participants", category: "workshops" },
  { id: "workshop-2026-ws19", src: "/gallery/workshop-2026-ws19.jpg", alt: "Participants during a workshop session", category: "workshops" },
  { id: "workshop-2026-ws15", src: "/gallery/workshop-2026-ws15.jpg", alt: "Certificate presentation", category: "workshops" },
  { id: "img-20220828-123945", src: "/IMG_20220828_123945.jpg", alt: "Dr. Kapil with the batch · 2022", category: "workshops" },
  { id: "img-20220910-164123", src: "/IMG_20220910_164123.jpg", alt: "Workshop session · 2022", category: "workshops" },
  { id: "img-20220910-164131", src: "/IMG_20220910_164131.jpg", alt: "Dr. Kapil with the batch · 2022", category: "workshops" },
  { id: "img-20221121-122722", src: "/IMG_20221121_122722.jpg", alt: "Lying-down practice · 2022", category: "workshops" },
  { id: "img-20221124-141950", src: "/IMG_20221124_141950.jpg", alt: "Standing practice · 2022", category: "workshops" },
  { id: "img-20221225-192623", src: "/IMG_20221225_192623.jpg", alt: "Certificate presentation · 2022", category: "workshops" },
  { id: "img-20221225-192728", src: "/IMG_20221225_192728.jpg", alt: "Certificate presentation · 2022", category: "workshops" },
  { id: "img-20221225-192753", src: "/IMG_20221225_192753.jpg", alt: "Certificate presentation · 2022", category: "workshops" },
]
