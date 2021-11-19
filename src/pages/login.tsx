import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, Wrapper } from '../components';
import { useUserLoginMutation } from '../generated/graphql';

export interface LoginProps {
};

export const Login: React.FC<LoginProps> = ({}) => {
  const [ {}, userCreate ] = useUserLoginMutation();
  const router = useRouter();

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ password: '', username: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await userCreate({ input: values });
          const errors = response.error?.graphQLErrors[0].extensions.children as Record<string, string[]> | undefined;
          if (errors) {
            setErrors(errors);
          } else {
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
  );
};

export default Login;
