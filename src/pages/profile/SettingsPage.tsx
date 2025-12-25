import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { changePasswordSchema } from '@/schemas/auth.schemas';
import { handleApiError } from '@/utils/error-handler';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileFormFields } from '@/components/forms/ProfileFormFields';
import { PasswordFormFields } from '@/components/forms/PasswordFormFields';
import { NotificationSettings } from '@/components/forms/NotificationSettings';
import { AvatarUpload } from '@/components/forms/AvatarUpload';
import { Save, User, Lock, Bell } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  birthday: z.date().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof changePasswordSchema>;

export function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.picture);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
    control: controlProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      birthday: user?.birthday ? new Date(user.birthday) : undefined,
      gender: user?.gender || undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Sync avatarUrl with user.picture when user data changes
  useEffect(() => {
    if (user?.picture) {
      setAvatarUrl(user.picture);
    }
  }, [user?.picture]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSubmittingProfile(true);
    try {
      // Prepare update data
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthday: data.birthday?.toISOString().split('T')[0],
        gender: data.gender,
        ...(avatarId && { avatarId }), // Include avatarId if it exists
      };

      // Call update profile API
      await authService.updateProfile(updateData);
      
      // Get fresh user data from API
      const updatedUser = await authService.getCurrentUser();
      
      // Update auth store with fresh user data
      useAuthStore.getState().updateUser(updatedUser);
      
      // Update avatar URL from fresh user data
      if (updatedUser.picture) {
        setAvatarUrl(updatedUser.picture);
      }
      
      toast.success('Profile updated successfully');
      
      // Clear avatarId after successful update
      setAvatarId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsSubmittingPassword(true);
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleAvatarUploadSuccess = (fileUrl: string, id: string) => {
    setAvatarUrl(fileUrl);
    setAvatarId(id);
    toast.info('Avatar uploaded. Click "Save Changes" to update your profile.');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">Please login to access settings</p>
      </div>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#242424] border border-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#256af4]">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#256af4]">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#256af4]">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                  <AvatarUpload
                    currentAvatarUrl={avatarUrl}
                    onUploadSuccess={handleAvatarUploadSuccess}
                    userInitials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                  />
                  <Separator className="bg-gray-800" />
                  <ProfileFormFields
                    register={registerProfile}
                    errors={profileErrors}
                    control={controlProfile}
                    setValue={setProfileValue}
                    userGender={user.gender}
                  />
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#256af4] hover:bg-[#1e5dd9]"
                      disabled={isSubmittingProfile}
                    >
                      {isSubmittingProfile ? (
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
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                  <PasswordFormFields register={registerPassword} errors={passwordErrors} />
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#256af4] hover:bg-[#1e5dd9]"
                      disabled={isSubmittingPassword}
                    >
                      {isSubmittingPassword ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Updating...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NotificationSettings />
                <Separator className="bg-gray-800" />
                <p className="text-xs text-gray-400">
                  Note: Notification settings are currently in development and will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </>
  );
}
