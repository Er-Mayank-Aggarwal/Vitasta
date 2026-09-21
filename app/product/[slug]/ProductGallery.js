'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, title }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fallbackImage = 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg';
  const imageList = images && images.length > 0 ? images : [{ cdnUrl: fallbackImage, assetPath: fallbackImage }];
  const currentImg = imageList[selectedIdx]?.cdnUrl || imageList[selectedIdx]?.assetPath || fallbackImage;

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md group">
        <Image
          src={currentImg}
          alt={`${title} - Angle ${selectedIdx + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20">
          Photo {selectedIdx + 1} of {imageList.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {imageList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {imageList.map((img, idx) => {
            const url = img.cdnUrl || img.assetPath;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedIdx === idx
                    ? 'border-[#0B3B60] shadow-md scale-105'
                    : 'border-neutral-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
