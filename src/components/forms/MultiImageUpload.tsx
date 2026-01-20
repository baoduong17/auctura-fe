import { useState, useRef, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { mediaService } from "@/services/media.service";
import { X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import type { MediaBucket } from "@/types/media";

interface UploadedImage {
  id: string;
  url: string;
  isUploading?: boolean;
}

interface MultiImageUploadProps {
  bucket?: MediaBucket;
  initialImages?: { id: string; url: string }[];
  onImagesChange: (mediaIds: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function MultiImageUpload({
  bucket = "items",
  initialImages = [],
  onImagesChange,
  maxImages = 10,
  label = "Item Images",
}: MultiImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImages.length > 0) {
      const mappedImages = initialImages.map((img) => ({
        id: img.id,
        url: img.url,
      }));
      setImages(mappedImages);
    }
  }, [initialImages]);

  const updateParent = useCallback(
    (newImages: UploadedImage[]) => {
      const mediaIds = newImages
        .filter((img) => !img.isUploading)
        .map((img) => img.id);
      onImagesChange(mediaIds);
    },
    [onImagesChange],
  );

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast.error(
        `You can only upload ${remainingSlots} more image(s). Maximum is ${maxImages}.`,
      );
      return;
    }

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not an image or video file`);
        return;
      }

      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      const maxSizeLabel = isVideo ? "50MB" : "5MB";

      if (file.size > maxSize) {
        toast.error(`${file.name} is larger than ${maxSizeLabel}`);
        return;
      }
    }

    setIsUploading(true);

    const uploadPromises = files.map(async (file) => {
      try {
        const presignedData = await mediaService.getPresignedUrl({
          fileName: file.name,
          bucket,
        });

        const renamedFile = new File([file], presignedData.fileName, {
          type: file.type,
        });

        await mediaService.uploadToPresignedUrl(
          presignedData.presignedUrl,
          renamedFile,
        );

        const mediaRecord = await mediaService.createMedia({
          bucket,
          fileName: presignedData.fileName,
        });

        return {
          id: mediaRecord.id,
          url: mediaRecord.fileUrl,
        };
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(
      (r): r is UploadedImage => r !== null,
    );

    if (successfulUploads.length > 0) {
      const newImages = [...images, ...successfulUploads];
      setImages(newImages);
      updateParent(newImages);
      toast.success(
        `${successfulUploads.length} image(s) uploaded successfully`,
      );
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const newImages = images.filter((img) => img.id !== imageId);
    setImages(newImages);
    updateParent(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label className="text-primary">{label}</Label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 bg-[#1a1a1a] group"
          >
            <img
              src={image.url}
              alt="Uploaded item"
              className="w-full h-full object-cover"
            />
            {image.isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border hover:border-foreground bg-background hover:bg-foreground flex flex-col items-center justify-center gap-2 text-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8" />
                <span className="text-xs">Add Media</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
