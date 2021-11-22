import { GraphQLError } from 'graphql';

export type FormControlErrorMessages = string[];

export function isControlErrorMessages(
  error: FormErrorMessages | null | undefined
): error is FormControlErrorMessages {
  return (!!error && error instanceof Array);
}

export interface FormGroupErrorMessages {
  children?: Record<string, FormControlErrorMessages>;
  errors?: FormControlErrorMessages;
}

export function isGroupErrorMessages(
  error: FormErrorMessages | null | undefined
): error is FormGroupErrorMessages {
  return (
    !!error
    && typeof error === 'object'
    && typeof (error as Exclude<FormErrorMessages, FormControlErrorMessages>).children === 'object'
  );
}

export interface FormArrayErrorMessages {
  children?: (FormControlErrorMessages | null)[];
  errors?: FormControlErrorMessages;
}

export function isArrayErrorMessages(
  error: FormErrorMessages | null | undefined
): error is FormArrayErrorMessages {
  return (
    !!error
    && typeof error === 'object'
    && (error as Exclude<FormErrorMessages, FormControlErrorMessages>).children instanceof Array
  );
}

export type FormErrorMessages = FormControlErrorMessages | FormGroupErrorMessages | FormArrayErrorMessages;

export function isFormControlError(
  error: GraphQLError
): error is GraphQLError & { extensions: { formControlError: FormGroupErrorMessages; } } {
  return error && error.extensions.code === 'FORM_CONTROL_ERROR';
}
