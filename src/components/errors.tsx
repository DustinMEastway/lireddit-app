import { Flex } from '@chakra-ui/layout';
import { CombinedError } from '@urql/core';

import { Link } from './link';

export interface ErrorsProps {
  errors?: CombinedError | string[];
}

export const Errors: React.FC<ErrorsProps> = ({ errors }) => {
  const errorMessages = (errors instanceof Array) ? errors : errors?.graphQLErrors.map((e) => e.toString());

  return <Flex align="center" direction="column">
    {errorMessages?.join(' ') ?? 'An unknown error occurred.'}
    <Link
      label="Click here to return to the main page."
      route="/"
      marginLeft=".25em"
    />
  </Flex>;
};
