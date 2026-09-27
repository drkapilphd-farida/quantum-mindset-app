"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";
import PhotoGallery, { type GalleryPhoto } from "../PhotoGallery";
import { RESIDENTIAL_PHOTOS } from "@/config/residentialGalleryPhotos";

// Retreat environment / group photo gallery grid — 6 slots today, all
// placeholders until real photos are dropped into
// RESIDENTIAL_PHOTOS.gallery (residentialGalleryPhotos.ts). Now uses the
// shared PhotoGallery component (lightbox with prev/next navigation)
// instead of static PhotoPlaceholder tiles, matching the interactive
// gallery pattern built for /gallery and the other retreat pages.
export default function ResidentialGallery(): React.JSX.Element | null {
  const { t } = useLanguage();
  const section = t.residentialLanding.gallery;

  const photos: GalleryPhoto[] = RESIDENTIAL_PHOTOS.gallery.map((src, index) => ({
    id: `residential-gallery-${index + 1}`,
    src,
    alt: `Residential retreat environment photo ${index + 1}`,
  }));

  // Hidden until at least one real photo exists.
  if (photos.every((photo) => photo.src === undefined)) return null;

  return (
    <section className="border-b border-line px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px]">{section.title}</h2>
            <p className="mt-3 text-[15.5px] text-ink-dim">{section.desc}</p>
          </div>
          <Link
            href="/gallery"
            className="group inline-flex flex-none items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-dim transition-colors hover:text-ink"
          >
            {section.viewGalleryCta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <PhotoGallery photos={photos} />
      </div>
    </section>
  );
}
