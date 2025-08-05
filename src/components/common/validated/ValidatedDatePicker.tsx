import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { format, parse, isValid } from 'date-fns';

interface ValidatedDatePickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  // Allow pass-through of other DatePicker props
  slotProps?: DatePickerProps<any>['slotProps'];
}

export const ValidatedDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  slotProps,
}: ValidatedDatePickerProps<T>) => {
  const parseDate = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null;
    try {
      const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  };

  const formatDate = (date: Date | null): string | undefined => {
    if (!date || !isValid(date)) return undefined;
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={label}
            value={parseDate(field.value)}
            format="dd/MM/yyyy"
            closeOnSelect
            onChange={(newValue) => {
              field.onChange(formatDate(newValue));
            }}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
              textField: {
                fullWidth: true,
                required,
                error: !!error,
                helperText: error?.message,
                inputProps: {
                  placeholder: 'DD/MM/YYYY'
                },
                ...slotProps?.textField,
              },
              popper: {
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: { offset: [0, 4] }
                  }
                ]
              },
              ...slotProps,
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};