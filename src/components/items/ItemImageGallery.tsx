import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItemMedia } from "@/types/item";

interface ItemImageGalleryProps {
  images: ItemMedia[];
  itemName: string;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

function isVideoFile(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext));
}

export function ItemImageGallery({ images, itemName }: ItemImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-background rounded-lg flex items-center justify-center border border-gray-800">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-16 w-16 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No media available</p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const currentMedia = images[currentIndex];
  const isCurrentVideo = isVideoFile(currentMedia.fileName);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 group">
        {isCurrentVideo ? (
          <video
            key={currentMedia.id}
            src={currentMedia.fileUrl}
            controls
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={currentMedia.fileUrl}
            alt={`${itemName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((media, index) => {
            const isVideo = isVideoFile(media.fileName);
            return (
              <button
                key={media.id}
                type="button"
                onClick={() => goToIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-[#256af4] ring-1 ring-[#256af4]"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                {isVideo ? (
                  <>
                    <video
                      src={media.fileUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </>
                ) : (
                  <img
                    src={media.fileUrl}
                    alt={`${itemName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
