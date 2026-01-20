import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { mediaService } from "@/services/media.service";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import type { MediaBucket } from "@/types/media";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUploadSuccess?: (fileUrl: string, id: string) => void;
  userInitials?: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  onUploadSuccess,
  userInitials = "U",
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    currentAvatarUrl,
  );
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Start upload process
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    try {
      const bucket: MediaBucket = "avatar";
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

      setAvatarUrl(mediaRecord.fileUrl);
      setPreviewUrl(undefined);

      toast.success(
        'Avatar uploaded successfully. Click "Save Changes" to update your profile.',
      );

      if (onUploadSuccess) {
        onUploadSuccess(mediaRecord.fileUrl, mediaRecord.id);
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Failed to upload avatar. Please try again.");
      setPreviewUrl(undefined);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label className="text-primary">Profile Picture</Label>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewUrl || avatarUrl} alt="Profile picture" />
            <AvatarFallback className="bg-[#256af4] text-white text-2xl">
              {isUploading ? <LoadingSpinner size="sm" /> : userInitials}
            </AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="bg-card border text-primary hover:bg-card-foreground hover:text-primary-foreground"
          >
            {isUploading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Avatar
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
