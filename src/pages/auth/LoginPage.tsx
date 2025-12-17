// pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schemas';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { handleApiError } from '@/utils/error-handler';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormField } from '@/components/forms/FormField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/constants/theme';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await authService.login(data);
      login(result.token, result.user);
      toast.success('Login successful!');
      navigate('/marketplace');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full text-white"
          style={{ backgroundColor: COLORS.primary }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Signing in...</span>
            </>
          ) : (
            'Sign in'
          )}
        </Button>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: COLORS.primary }} className="hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
