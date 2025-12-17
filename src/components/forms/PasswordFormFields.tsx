import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormFieldsProps {
  register: UseFormRegister<PasswordFormData>;
  errors: FieldErrors<PasswordFormData>;
}

export function PasswordFormFields({ register, errors }: PasswordFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-gray-200">
          Current Password *
        </Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-200">
          New Password *
        </Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
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
          {...register('confirmPassword')}
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  );
}
