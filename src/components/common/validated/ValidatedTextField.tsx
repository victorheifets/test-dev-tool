import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface ValidatedTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'error' | 'helperText'> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  multiline?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  rows?: number;
}

export const ValidatedTextField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  multiline = false,
  type = 'text',
  placeholder,
  rows,
  ...textFieldProps
}: ValidatedTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          label={label}
          type={type}
          multiline={multiline}
          rows={multiline ? rows || 3 : undefined}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          required={required}
          fullWidth
          // Ensure controlled component behavior
          value={field.value ?? ''}
          onChange={(e) => {
            const value = type === 'number' ? (e.target.value === '' ? undefined : Number(e.target.value)) : e.target.value;
            field.onChange(value);
          }}
        />
      )}
    />
  );
};