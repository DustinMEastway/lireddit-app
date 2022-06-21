import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { Errors, InputField, Loading, Page } from '../../../components';
import { withUrqlClient } from '../../../core';
import { useAuthenticatedGuard } from '../../../guards';
import { usePostQuery, usePostUpdateMutation, useUserDetailsQuery } from '../../../generated/graphql';
import { handleFormErrorMessages } from '../../../lib/client';

const editPostPageGuards = [ useAuthenticatedGuard ];

export const EditPostPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const id = parseInt(router.query.id as string);
  const [{ data: post, error: postError }] = usePostQuery({
    pause: !id,
    variables: { input: { id } }
  });
  const [ , postUpdate ] = usePostUpdateMutation();
  const [ { data: userDetails } ] = useUserDetailsQuery();
  let content: JSX.Element | null = null;

  if (!post || !userDetails?.userDetails) {
    content = <Loading isLoading />
  } else if (!post?.post) {
    content = <Errors errors={postError} />
  } else if (post.post.creator.id !== userDetails.userDetails.id) {
    content = <Errors errors={['Unable to edit post you did not create.']} />
  } else {
    const { text, title } = post.post;
    content = <Formik
      initialValues={{ text, title }}
      onSubmit={async (values, { setErrors }) => {
        const response = await postUpdate({ input: { id, ...values } });
        if (handleFormErrorMessages(response, setErrors, toast)) {
          toast({
            isClosable: true,
            status: 'success',
            title: 'Post updated.'
          });
          router.back();
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
    )}</Formik>;
  }

  return <Page guards={editPostPageGuards} size="small">
    {content}
  </Page>;
};

export default withUrqlClient()(EditPostPage);
