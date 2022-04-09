import { createStandaloneToast } from '@chakra-ui/toast';
import { default as Router } from 'next/router';
import { dedupExchange, fetchExchange, Exchange  } from 'urql';
import { pipe, tap } from 'wonka';

import { isAuthenticationError } from '../../../lib/client';

export const authenticationErrorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      const authenticationError = error?.graphQLErrors.find((error) => isAuthenticationError(error));
      if (!authenticationError) {
        return;
      }

      createStandaloneToast()({
        isClosable: true,
        status: 'error',
        title: authenticationError.message
      });
      Router.replace('/login');
    })
  );
};
