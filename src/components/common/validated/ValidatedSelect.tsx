import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
} from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface ValidatedSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  // Allow pass-through of other Select props
  sx?: SelectProps['sx'];
  size?: SelectProps['size'];
}

export const ValidatedSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  disabled = false,
  fullWidth = true,
  ...selectProps
}: ValidatedSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl 
          fullWidth={fullWidth} 
          required={required} 
          error={!!error}
          disabled={disabled}
        >
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            {...selectProps}
            label={label}
            value={field.value || ''}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <FormHelperText>{error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};