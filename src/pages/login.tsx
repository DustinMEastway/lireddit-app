import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, NavBar, Wrapper } from '../components';
import { withUrqlClient } from '../core';
import { useUserLoginMutation } from '../generated/graphql';
import { handleFormErrorMessages } from '../lib/client';

export interface LoginProps {
};

export const Login: React.FC<LoginProps> = ({}) => {
  const [ {}, userCreate ] = useUserLoginMutation();
  const router = useRouter();
  const toast = useToast();

  return <>
    <NavBar />
    <Wrapper size="small">
      <Formik
        initialValues={{ password: '', username: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await userCreate({ input: values });
          if (handleFormErrorMessages(response, setErrors, toast)) {
            router.push('/');
          }
        }}
      >{({ isSubmitting }) => (
        <Form className="spaced-rows">
          <InputField label="Username" name="username" placeholder="username" />
          <InputField label="Password" name="password" placeholder="password" type="password" />
          <Button isLoading={isSubmitting} type="submit">Log in</Button>
        </Form>
      )}</Formik>
    </Wrapper>
  </>;
};

export default withUrqlClient()(Login);
