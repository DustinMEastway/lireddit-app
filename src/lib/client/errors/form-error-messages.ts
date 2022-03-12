import { GraphQLError } from 'graphql';
import { FormGroupErrorMessages } from '../../forms';

export function isFormControlError<T = any>(
  error: GraphQLError
): error is GraphQLError & { extensions: { formControlError: FormGroupErrorMessages<T>; } } {
  return error && error.extensions.code === 'FORM_CONTROL_ERROR';
}
