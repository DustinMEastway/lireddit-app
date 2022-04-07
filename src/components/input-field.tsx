import { InputHTMLAttributes } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input, InputProps } from '@chakra-ui/input';
import { ComponentWithAs } from '@chakra-ui/system';
import { Textarea, TextareaProps } from '@chakra-ui/textarea';
import { useField } from 'formik';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  textarea?: false;
};

export interface TextareaFieldProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  textarea: true;
};

export const InputField: React.FC<InputFieldProps | TextareaFieldProps> = ({ label, size: _, textarea, ...props }) => {
  const [ field, { error, touched } ] = useField(props);
  const Control = ((textarea) ? Textarea : Input) as ComponentWithAs<'input' | 'textarea', InputProps | TextareaProps>;

  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Control {...field} {...props} id={field.name} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
