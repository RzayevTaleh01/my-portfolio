"use client";

import { X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarZoomLabels {
  viewPhoto: string;
  closePhoto: string;
  zoomIn: string;
  zoomOut: string;
}

interface AvatarZoomProps {
  src: string;
  name: string;
  t: AvatarZoomLabels;
  /** Sizing of the cropped frame - the caller owns width and aspect ratio. */
  className?: string;
  sizes: string;
  priority?: boolean;
}

/**
 * The profile photo in a cropped frame; clicking it opens the full picture,
 * where a second click (or the button) toggles a magnified, scrollable view.
 */
export function AvatarZoom({ src, name, t, className, sizes, priority }: AvatarZoomProps) {
  const [zoomed, setZoomed] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  // The magnified photo is wider than the viewport, so start the reader in the middle of it.
  const centre = useCallback(() => {
    const el = viewport.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);
  const control =
    "flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70";

  return (
    <Dialog.Root onOpenChange={(open) => !open && setZoomed(false)}>
      <Dialog.Trigger
        aria-label={t.viewPhoto}
        className={cn(
          "group relative block cursor-zoom-in overflow-hidden rounded-2xl border bg-surface transition-colors hover:border-border-strong",
          className,
        )}
      >
        {/* The source is a 3:4 headshot, so the crop is biased upwards to keep the face centred. */}
        <Image
          src={src}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-[50%_14%] transition-transform duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ZoomIn className="size-5 text-white" />
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="dialog-content fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
        >
          <Dialog.Title className="sr-only">{name}</Dialog.Title>
          {/* Anywhere around the photo closes the lightbox. */}
          <Dialog.Close aria-label={t.closePhoto} className="absolute inset-0 cursor-zoom-out" />

          <div ref={viewport} className="relative max-h-[86vh] max-w-[92vw] overflow-auto overscroll-contain rounded-2xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
            <Image
              src={src}
              alt={name}
              width={1086}
              height={1448}
              sizes="(max-width: 768px) 92vw, 720px"
              onClick={() => setZoomed((z) => !z)}
              onTransitionEnd={centre}
              className={cn(
                "block select-none transition-[width] duration-300",
                zoomed ? "h-auto w-[130vh] max-w-none cursor-zoom-out" : "max-h-[86vh] w-auto cursor-zoom-in",
              )}
            />
          </div>

          <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? t.zoomOut : t.zoomIn}
              className={control}
            >
              {zoomed ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
            </button>
            <Dialog.Close aria-label={t.closePhoto} className={control}>
              <X className="size-4" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
