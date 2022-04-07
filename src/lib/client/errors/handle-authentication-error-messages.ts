import { useToast } from '@chakra-ui/toast';
import { OperationResult } from 'urql';

import { isAuthenticationError } from './is-authentication-error';

export function handleAuthenticationErrorMessages(
  result: OperationResult,
  toast: ReturnType<typeof useToast>
): boolean {
  result.error?.graphQLErrors.map((graphQlError): void => {
    if (!isAuthenticationError(graphQlError)) {
      return;
    }

    toast({
      isClosable: true,
      status: 'error',
      title: graphQlError.message
    });
  });

  return !result.error;
}
