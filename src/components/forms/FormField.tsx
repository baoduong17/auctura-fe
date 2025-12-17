// components/forms/FormField.tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  register?: any;
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  className,
  inputClassName,
  required = false,
  register,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn('bg-[#1a1a1a] border-gray-700 text-white', inputClassName)}
        {...register}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
