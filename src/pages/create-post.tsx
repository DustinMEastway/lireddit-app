import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, NavBar, Wrapper } from '../components';
import { withUrqlClient } from '../core';
import { useAuthenticatedGuard } from '../guards';
import { usePostCreateMutation } from '../generated/graphql';
import { handleFormErrorMessages } from '../lib/client';

export const CreatePost: React.FC = () => {
  const isAuthenticated = useAuthenticatedGuard();
  const [ {}, postCreate ] = usePostCreateMutation();
  const router = useRouter();
  const toast = useToast();

  if (!isAuthenticated) {
    return <>Loading...</>;
  }

  return <>
    <NavBar />
    <Wrapper size="small">
      <Formik
        initialValues={{ text: '', title: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await postCreate({ input: values });
          if (handleFormErrorMessages(response, setErrors, toast)) {
            toast({
              isClosable: true,
              status: 'success',
              title: 'Post created.'
            });
            router.push('/');
          }
        }}
      >{({ isSubmitting }) => (
        <Form className="spaced-rows">
          <InputField label="Title" name="title" />
          <InputField label="Text" name="text" textarea />
          <Stack direction="row" justifyContent="end" spacing="1rem">
            <Button isLoading={isSubmitting} type="submit">Save</Button>
          </Stack>
        </Form>
      )}</Formik>
    </Wrapper>
  </>;
};

export default withUrqlClient()(CreatePost);
