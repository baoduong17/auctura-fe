import { Controller } from "react-hook-form";
import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthday?: Date;
  gender?: "MALE" | "FEMALE";
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
          <Label htmlFor="firstName" className="text-primary">
            First Name *
          </Label>
          <Input
            id="firstName"
            {...register("firstName")}
            className="bg-background border text-primary"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-primary">
            Last Name *
          </Label>
          <Input
            id="lastName"
            {...register("lastName")}
            className="bg-background border text-primary"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-primary">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled
          className="bg-background border text-primary opacity-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-primary">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber")}
          className="bg-background border text-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday" className="text-primary bg-background">
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
        <Label htmlFor="gender" className="text-primary bg-background">
          Gender
        </Label>
        <Select
          defaultValue={userGender}
          onValueChange={(value) => setValue("gender", value as string)}
        >
          <SelectTrigger className="bg-background border text-primary">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className="bg-background border-gray-800">
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
