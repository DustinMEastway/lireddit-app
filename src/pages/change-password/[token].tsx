import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { InputField, Page } from '../../components';
import { withUrqlClient } from '../../core';
import { handleFormErrorMessages, toastFormControlError } from '../../lib/client';
import { useUserChangePasswordMutation } from '../../generated/graphql';

export const ChangePassword: NextPage<{ token: string; }> = ({ token }) => {
  const [ , userChangePassword ] = useUserChangePasswordMutation();
  const router = useRouter();
  const toast = useToast();

  return <Page size="small">
    <Formik
      initialValues={{ password: '', token }}
      onSubmit={async (values, { setErrors }) => {
        const response = await userChangePassword({ input: values });
        if (!toastFormControlError(response, toast, 'token', 'Token')) {
          router.push('/forgot-password');
        }

        handleFormErrorMessages(response, setErrors, toast);
      }}
    >{({ isSubmitting }) => (
      <Form className="spaced-rows">
        <InputField label="Password" name="password" placeholder="password" type="password" />
        <Button isLoading={isSubmitting} type="submit">Change Password</Button>
      </Form>
    )}</Formik>
  </Page>;
};

ChangePassword.getInitialProps = (context) => {
  return {
    token: context.query.token as string
  }
};

export default withUrqlClient()(ChangePassword);
