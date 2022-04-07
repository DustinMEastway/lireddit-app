import { useToast } from '@chakra-ui/toast';
import { FormikErrors } from 'formik';
import { OperationResult } from 'urql';

import {
  FormArrayErrorMessages,
  FormControlErrorMessages,
  FormErrorMessages,
  FormGroupErrorMessages
} from '../../forms';
import { isFormError } from './is-form-error';

export function handleFormErrorMessages(
  result: OperationResult,
  setErrors: (errors: FormikErrors<any>) => void,
  toast: ReturnType<typeof useToast>
): boolean {
  result.error?.graphQLErrors.map((graphQlError): void => {
    let toastConfig: Partial<{ description: string; title: string; }> | null = null;
    if (isFormError(graphQlError)) {
      const formErrors = graphQlError.extensions.formControlError;
      if ((formErrors as FormArrayErrorMessages<any> | FormGroupErrorMessages<any>).children) {
        setErrors(mapErrorMessages(formErrors) as FormikErrors<any>);
      } else if (formErrors.control) {
        toastConfig = {
          description: formErrors.control.join('\t\n'),
          title: graphQlError.message
        };
      } else {
        toastConfig = {
          title: graphQlError.message
        };
      }
    }

    if (toastConfig) {
      toast({
        isClosable: true,
        status: 'error',
        ...toastConfig
      });
    }
  });

  return !result.error;
}

export function mapErrorMessages<T>(errors: FormErrorMessages<T>): FormikErrors<T> | null {
  if (FormGroupErrorMessages.isInstance(errors) && errors.children) {
    return Object.entries(errors.children).reduce((formErrors, [key, control]): FormikErrors<T> => {
      formErrors[key as keyof(T)] = mapErrorMessages(control) as any;
      return formErrors;
    }, {} as FormikErrors<T>);
  } else if (FormArrayErrorMessages.isInstance<any[]>(errors) && errors.children) {
    return errors.children.map((c) => mapErrorMessages(c)) as any;
  } else if (FormControlErrorMessages.isInstance(errors) && errors.control) {
    return errors.control.join('\n') as any;
  }

  return null;
}
