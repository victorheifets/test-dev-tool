import { useForm, UseFormProps, UseFormReturn, FieldValues, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

interface UseValidatedFormProps<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ZodSchema<T>;
  onSubmit: (data: T) => void;
}

interface UseValidatedFormReturn<T extends FieldValues> extends Omit<UseFormReturn<T>, 'handleSubmit'> {
  createField: (name: FieldPath<T>) => {
    name: FieldPath<T>;
    control: UseFormReturn<T>['control'];
  };
  handleSubmit: () => void;
}

export const useValidatedForm = <T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  ...formProps
}: UseValidatedFormProps<T>): UseValidatedFormReturn<T> => {
  const form = useForm<T>({
    ...formProps,
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  const createField = (name: FieldPath<T>) => ({
    name,
    control: form.control,
  });

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return {
    ...form,
    createField,
    handleSubmit,
  };
};