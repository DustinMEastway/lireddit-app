import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Heading, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';

import {
  usePostQuery,
  usePostDeleteMutation,
  useUserDetailsQuery
} from '../../generated/graphql';
import { Errors, Link, Loading, Page } from '../../components';
import { withUrqlClient } from '../../core';

export interface PostDetailsPageProps {
};

export const PostDetailsPage: React.FC<PostDetailsPageProps> = ({}) => {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const [ { data: userDetails } ] = useUserDetailsQuery();
  const [{ fetching: postDeleteLoading }, postDelete] = usePostDeleteMutation();
  const [{ data: post, error: postError }] = usePostQuery({
    pause: !id || postDeleteLoading,
    variables: { input: { id } }
  });
  let content: JSX.Element | string;

  if (!post && !postError) {
    content = <Loading isLoading />;
  } else if (!post?.post) {
    content = <Errors errors={postError} />;
  } else {
    const { creator, text, title } = post.post;

    content = <Stack spacing="1em">
      <Heading as="h2">{title}</Heading>
      <Text whiteSpace="pre-wrap">{text}</Text>
      <Stack direction="row" justifyContent="end">
        {(creator.id !== userDetails?.userDetails?.id) ? null : <>
          <Button
            aria-label="Edit Post"
            isLoading={postDeleteLoading}
            leftIcon={<EditIcon />}
            onClick={() => {
              router.push(`/post/edit/${id}`);
            }}
          >
            Edit
          </Button>
          <Button
            aria-label="Delete Post"
            colorScheme="red"
            isLoading={postDeleteLoading}
            leftIcon={<DeleteIcon />}
            onClick={async () => {
              const postDeleteResponse = await postDelete({ input: { id } });
              if (postDeleteResponse.data?.postDelete) {
                router.back();
              }
            }}
          >
            Delete Post
          </Button>
        </>}
      </Stack>
    </Stack>;
  }

  return <Page size="small">
    {content}
  </Page>;
};

export default withUrqlClient()(PostDetailsPage);
