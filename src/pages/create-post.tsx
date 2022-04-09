import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { InputField, Page } from '../components';
import { withUrqlClient } from '../core';
import { useAuthenticatedGuard } from '../guards';
import { usePostCreateMutation } from '../generated/graphql';
import { handleFormErrorMessages } from '../lib/client';

const createPostGuards = [ useAuthenticatedGuard ];

export const CreatePost: React.FC = () => {
  const [ , postCreate ] = usePostCreateMutation();
  const router = useRouter();
  const toast = useToast();

  return <Page guards={createPostGuards} size="small">
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
  </Page>;
};

export default withUrqlClient()(CreatePost);
