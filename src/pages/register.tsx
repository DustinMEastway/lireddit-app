import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import {
  InputField,
  Link,
  NavBar,
  Wrapper
} from '../components';
import { withUrqlClient } from '../core';
import { useUserCreateMutation } from '../generated/graphql';
import { handleFormErrorMessages } from '../lib/client';

export interface RegisterProps {
};

export const Register: React.FC<RegisterProps> = ({}) => {
  const [ {}, userCreate ] = useUserCreateMutation();
  const router = useRouter();
  const toast = useToast();

  return <>
    <NavBar />
    <Wrapper size="small">
      <Formik
        initialValues={{ email: '', password: '', username: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await userCreate({ input: values });
          if (handleFormErrorMessages(response, setErrors, toast)) {
            router.push('/');
          }
        }}
      >{({ isSubmitting }) => (
        <Form className="spaced-rows">
          <InputField label="Email" name="email" placeholder="email" />
          <InputField label="Username" name="username" placeholder="username" />
          <InputField label="Password" name="password" placeholder="password" type="password" />
          <Stack direction="row" justifyContent="center" spacing="1rem">
            <Link label="Already have an account?" route="/login" />
          </Stack>
          <Stack direction="row" justifyContent="end" spacing="1rem">
            <Button isLoading={isSubmitting} type="submit">Register</Button>
          </Stack>
        </Form>
      )}</Formik>
    </Wrapper>
  </>;
};

export default withUrqlClient()(Register);
