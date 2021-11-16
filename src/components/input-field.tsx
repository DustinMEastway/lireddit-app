import { InputHTMLAttributes } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
};

export const InputField: React.FC<InputFieldProps> = ({ label, size: _, ...props }) => {
  const [ field, { error, touched } ] = useField(props);

  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
