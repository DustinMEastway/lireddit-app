import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, Page } from '../components';
import { withUrqlClient } from '../core';
import { useUserForgotPasswordMutation } from '../generated/graphql';
import { useUnauthenticatedGuard } from '../guards';
import { handleFormErrorMessages } from '../lib/client';

const forgotPasswordGuards = [ useUnauthenticatedGuard ];

export const ForgotPassword: React.FC = () => {
  const [ , userForgotPassword ] = useUserForgotPasswordMutation();
  const router = useRouter();
  const toast = useToast();

  return <Page guards={forgotPasswordGuards} size="small">
    <Formik
      initialValues={{ input: '' }}
      onSubmit={async ({ input }, { setErrors }) => {
        const response = await userForgotPassword({ input });
        if (handleFormErrorMessages(response, setErrors, toast)) {
          toast({
            description: 'Check inbox to reset password.',
            isClosable: true,
            status: 'success',
            title: 'Email sent.'
          });
          router.push('/login');
        }
      }}
    >{({ isSubmitting }) => (
      <Form className="spaced-rows">
        <InputField label="Username" name="input" placeholder="username" />
        <Stack direction="row" justifyContent="end" spacing="1rem">
          <Button isLoading={isSubmitting} type="submit">Request Password Reset</Button>
        </Stack>
      </Form>
    )}</Formik>
  </Page>;
};

export default withUrqlClient()(ForgotPassword);
