import { useToast, UseToastOptions } from '@chakra-ui/toast';
import { FormikErrors } from 'formik';
import { OperationResult } from 'urql';

import {
  FormArrayErrorMessages,
  FormControlErrorMessages,
  FormErrorMessages,
  FormGroupErrorMessages
} from '../../forms';
import { isFormControlError } from './form-error-messages';

export function toastFormControlError(
  result: OperationResult,
  toast: ReturnType<typeof useToast>,
  controlName: string,
  controlLabel: string,
): boolean {
  let controlErrors: FormErrorMessages<any> | null = null;
  result.error?.graphQLErrors.map((graphQlError): void => {
    let toastConfig: Partial<UseToastOptions> | null = null;
    if (isFormControlError(graphQlError)) {
      const formErrors = graphQlError.extensions.formControlError;
      controlErrors = formErrors.children && formErrors.children[controlName] || null;
      if (controlErrors) {
        toast({
          description: controlErrors?.control?.join('\t\n'),
          title: `Invalid value provided for ${controlLabel}.`,
          isClosable: true,
          status: 'error'
        });
      }
    }
  });

  return !controlErrors;
}
