import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, NavBar, Wrapper } from '../components';
import { withUrqlClient } from '../core';
import { useUserCreateMutation } from '../generated/graphql';
import { handleFormErrorMessages } from '../lib';

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
          <Button isLoading={isSubmitting} type="submit">Register</Button>
        </Form>
      )}</Formik>
    </Wrapper>
  </>;
};

export default withUrqlClient()(Register);
