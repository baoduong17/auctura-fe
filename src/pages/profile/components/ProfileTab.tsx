import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { handleApiError } from "@/utils/error-handler";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileFormFields } from "@/components/forms/ProfileFormFields";
import { AvatarUpload } from "@/components/forms/AvatarUpload";
import { Save } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  birthday: z.date().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileTab() {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.picture);
  const [avatarId, setAvatarId] = useState<string | null>(
    user?.avatarId || null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      birthday: user?.birthday ? new Date(user.birthday) : undefined,
      gender: user?.gender || undefined,
    },
  });

  useEffect(() => {
    if (user?.picture) {
      setAvatarUrl(user.picture);
    }
  }, [user?.picture]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthday: data.birthday?.toISOString().split("T")[0],
        gender: data.gender,
        avatarId: avatarId,
      };

      await authService.updateProfile(updateData);
      const updatedUser = await authService.getCurrentUser();

      useAuthStore.getState().updateUser(updatedUser);

      if (updatedUser.picture) {
        setAvatarUrl(updatedUser.picture);
      }

      toast.success("Profile updated successfully");

      setAvatarId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUploadSuccess = (fileUrl: string, id: string) => {
    setAvatarUrl(fileUrl);
    setAvatarId(id);
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="bg-background border">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AvatarUpload
            currentAvatarUrl={avatarUrl}
            onUploadSuccess={handleAvatarUploadSuccess}
            userInitials={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
          />
          <Separator className="bg-background" />
          <ProfileFormFields
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            userGender={user.gender}
          />
          <Separator className="bg-background" />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-background hover:bg-foreground text-primary hover:text-primary-foreground border"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
