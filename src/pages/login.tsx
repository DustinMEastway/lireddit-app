import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, Link, Page } from '../components';
import { withUrqlClient } from '../core';
import { useUserLoginMutation } from '../generated/graphql';
import { useUnauthenticatedGuard } from '../guards';
import { handleFormErrorMessages } from '../lib/client';

export interface LoginProps {
};

const loginGuards = [ useUnauthenticatedGuard ];

export const Login: React.FC<LoginProps> = ({}) => {
  const [ , userCreate ] = useUserLoginMutation();
  const router = useRouter();
  const toast = useToast();

  return <Page guards={loginGuards} size="small">
    <Formik
      initialValues={{ password: '', username: '' }}
      onSubmit={async (values, { setErrors }) => {
        const response = await userCreate({ input: values });
        handleFormErrorMessages(response, setErrors, toast);
      }}
    >{({ isSubmitting }) => (
      <Form className="spaced-rows">
        <InputField label="Username" name="username" placeholder="username" />
        <InputField label="Password" name="password" placeholder="password" type="password" />
        <Stack direction="row" justifyContent="center" spacing="1rem">
          <Link label="Need an account?" route="/register" />
          <Link label="Forget your password?" route="/forgot-password" />
        </Stack>
        <Stack direction="row" justifyContent="end" spacing="1rem">
          <Button isLoading={isSubmitting} type="submit">Log in</Button>
        </Stack>
      </Form>
    )}</Formik>
  </Page>;
};

export default withUrqlClient()(Login);
