import { useToast } from '@chakra-ui/toast';
import { FormikErrors } from 'formik';
import { OperationResult } from 'urql';

import { isFormControlError, FormGroupErrorMessages } from './form-error-messages';

export function handleFormErrorMessages(
  result: OperationResult,
  setErrors: (errors: FormikErrors<any>) => void,
  toast: ReturnType<typeof useToast>
): boolean {
  result.error?.graphQLErrors.map((graphQlError): void => {
    let toastConfig: Partial<{ description: string; title: string; }> | null = null;
    if (isFormControlError(graphQlError)) {
      const formErrors = graphQlError.extensions.formControlError;
      if (formErrors.children) {
        setErrors(formErrors.children);
      } else if (formErrors.errors) {
        toastConfig = {
          description: formErrors.errors.join('\t\n'),
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
