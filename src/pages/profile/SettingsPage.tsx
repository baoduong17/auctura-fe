// pages/profile/SettingsPage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, User, Lock, Bell } from 'lucide-react';
import { toast } from 'sonner';

// Validation schemas
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      birthday: user?.birthday || '',
      gender: user?.gender || undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    // TODO: Implement API call to update profile
    setIsSubmittingProfile(true);
    try {
      console.log('Update profile:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onSubmitPassword = async (_data: PasswordFormData) => {
    // TODO: Implement API call to change password
    setIsSubmittingPassword(true);
    try {
      console.log('Change password');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-gray-400">Please login to access settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account preferences</p>
        </div>

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

          {/* Profile Tab */}
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
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-200">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        {...registerProfile('firstName')}
                        className="bg-[#1a1a1a] border-gray-700 text-white"
                      />
                      {profileErrors.firstName && (
                        <p className="text-red-500 text-sm">{profileErrors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-200">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        {...registerProfile('lastName')}
                        className="bg-[#1a1a1a] border-gray-700 text-white"
                      />
                      {profileErrors.lastName && (
                        <p className="text-red-500 text-sm">{profileErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...registerProfile('email')}
                      disabled
                      className="bg-[#1a1a1a] border-gray-700 text-white opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400">Email cannot be changed</p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-200">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...registerProfile('phoneNumber')}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  {/* Birthday */}
                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="text-gray-200">
                      Birthday
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      {...registerProfile('birthday')}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-200">
                      Gender
                    </Label>
                    <Select
                      defaultValue={user.gender}
                      onValueChange={(value) => setProfileValue('gender', value as any)}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#242424] border-gray-800">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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

          {/* Security Tab */}
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
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-200">
                      Current Password *
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...registerPassword('currentPassword')}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-200">
                      New Password *
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerPassword('newPassword')}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-200">
                      Confirm New Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword('confirmPassword')}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

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

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Bid Notifications</p>
                    <p className="text-sm text-gray-400">
                      Get notified when someone bids on your items
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Auction Ending Soon</p>
                    <p className="text-sm text-gray-400">
                      Get alerts when your auctions are about to end
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Outbid Alerts</p>
                    <p className="text-sm text-gray-400">
                      Get notified when someone outbids you
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium">Email Newsletter</p>
                    <p className="text-sm text-gray-400">
                      Receive updates and promotions via email
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <Separator className="bg-gray-800" />

                <p className="text-xs text-gray-400">
                  Note: Notification settings are currently in development and will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
