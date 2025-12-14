// pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schemas';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { handleApiError } from '@/utils/error-handler';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const result = await authService.register(data);
      login(result.token, result.user);
      toast.success('Registration successful!');
      navigate('/marketplace');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#242424] border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-200">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-200">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-200">
                Phone Number (Optional)
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                {...register('phoneNumber')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-200">
                Gender (Optional)
              </Label>
              <Select onValueChange={(value) => setValue('gender', value as any)}>
                <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-gray-200">
                Birthday (Optional)
              </Label>
              <Input
                id="birthday"
                type="date"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                {...register('birthday')}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#256af4] hover:bg-[#1e5dd9] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Creating account...</span>
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#256af4] hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
