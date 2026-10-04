"use client";
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductImage } from '@/types/catalog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl border bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Tidak ada gambar</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-2xl border bg-muted aspect-square" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((img, i) => (
            <div className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center bg-card" key={i}>
              {img.driveId ? (
                <img 
                  src={getImageUrl(img.driveId, 'w800')} 
                  alt={img.alt || `Gambar ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ) : (
                <div className="text-muted-foreground text-sm flex flex-col items-center">
                  <span>No Image</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {images.length > 1 && (
        <>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10 shadow-md"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10 shadow-md"
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === selectedIndex ? "bg-primary w-4" : "bg-primary/30"
                }`}
                onClick={() => emblaApi?.scrollTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
