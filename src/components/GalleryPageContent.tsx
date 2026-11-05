"use client";

import { useLanguage } from "@/context/LanguageContext";
import SimplePageNav from "./SimplePageNav";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";
import PhotoGallery from "./PhotoGallery";
import { GALLERY_PHOTOS } from "@/config/galleryPhotos";

// Phase 4.4: real workshop photos; no filters (which program each photo is
// from is not certain) and no "photos added as each program happens" line.

export default function GalleryPageContent(): React.JSX.Element {
  const { t } = useLanguage();
  const g = t.galleryPage;
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SimplePageNav />
      <main className="px-6 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-content">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">{g.eyebrow}</p>
            <h1 className="mt-4 text-[32px] font-extrabold leading-tight sm:text-[40px]">{g.title}</h1>
          </div>

          <PhotoGallery photos={GALLERY_PHOTOS} className="mt-10" />
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
