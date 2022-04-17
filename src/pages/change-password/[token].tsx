import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { InputField, Page } from '../../components';
import { withUrqlClient } from '../../core';
import { handleFormErrorMessages, toastFormControlError } from '../../lib/client';
import { useUserChangePasswordMutation } from '../../generated/graphql';
import { useChangePasswordGuard } from '../../guards';

const changePasswordGuards = [ useChangePasswordGuard ];

export const ChangePassword: NextPage = () => {
  const [ , userChangePassword ] = useUserChangePasswordMutation();
  const router = useRouter();
  const toast = useToast();

  return <Page guards={changePasswordGuards} size="small">
    <Formik
      initialValues={{ password: '', token: router.query.token as string }}
      onSubmit={async (values, { setErrors }) => {
        const response = await userChangePassword({ input: values });
        if (!toastFormControlError(response, toast, 'token', 'Token')) {
          router.push('/forgot-password');
        } else if (handleFormErrorMessages(response, setErrors, toast)) {
          router.push('/');
        }
      }}
    >{({ isSubmitting }) => (
      <Form className="spaced-rows">
        <InputField label="Password" name="password" placeholder="password" type="password" />
        <Button isLoading={isSubmitting} type="submit">Change Password</Button>
      </Form>
    )}</Formik>
  </Page>;
};

export default withUrqlClient()(ChangePassword);
