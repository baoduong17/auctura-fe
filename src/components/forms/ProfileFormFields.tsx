import { Controller } from 'react-hook-form';
import type { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthday?: Date;
  gender?: 'MALE' | 'FEMALE';
}

interface ProfileFormFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  control: Control<ProfileFormData>;
  setValue: (name: keyof ProfileFormData, value: any) => void;
  userGender?: string;
}

export function ProfileFormFields({
  register,
  errors,
  control,
  setValue,
  userGender,
}: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-200">
            First Name *
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className="bg-[#1a1a1a] border-gray-700 text-white"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-200">
            Last Name *
          </Label>
          <Input
            id="lastName"
            {...register('lastName')}
            className="bg-[#1a1a1a] border-gray-700 text-white"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-200">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled
          className="bg-[#1a1a1a] border-gray-700 text-white opacity-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-gray-200">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register('phoneNumber')}
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday" className="text-gray-200">
          Birthday
        </Label>
        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Select your birthday"
              maxDate={new Date()}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender" className="text-gray-200">
          Gender
        </Label>
        <Select
          defaultValue={userGender}
          onValueChange={(value) => setValue('gender', value as string)}
        >
          <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className="bg-[#242424] border-gray-800">
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
