// pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schemas';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { handleApiError } from '@/utils/error-handler';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormField } from '@/components/forms/FormField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLORS } from '@/constants/theme';
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
    <AuthLayout
      title="Create an account"
      description="Enter your information to get started"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            register={register('firstName')}
            required
          />

          <FormField
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            register={register('lastName')}
            required
          />
        </div>

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          register={register('email')}
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          error={errors.password?.message}
          register={register('password')}
          required
        />

        <FormField
          id="phoneNumber"
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+1234567890"
          register={register('phoneNumber')}
        />

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

        <FormField
          id="birthday"
          label="Birthday (Optional)"
          type="date"
          register={register('birthday')}
        />

        <Button
          type="submit"
          className="w-full text-white"
          style={{ backgroundColor: COLORS.primary }}
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
          <Link to="/login" style={{ color: COLORS.primary }} className="hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
