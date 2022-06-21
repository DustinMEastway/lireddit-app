import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, Heading, Stack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';

import {
  usePostQuery,
  usePostDeleteMutation,
  useUserDetailsQuery
} from '../../generated/graphql';
import { Link, Page } from '../../components';
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
    content = <Flex align="center" direction="column">
      Loading...
    </Flex>;
  } else if (!post?.post) {
    content = <Flex align="center" direction="column">
      {postError?.graphQLErrors.join(' ') ?? 'An unknown error occurred.'}
      <Link
        label="Click here to go to post list."
        route="/"
        marginLeft=".25em"
      />
    </Flex>;
  } else {
    const { creator, text, title } = post.post;

    content = <Stack>
      <Heading as="h2">{title}</Heading>
      <>{text}</>
      <Stack direction="row" justifyContent="end">
        {(creator.id !== userDetails?.userDetails?.id) ? null : <Button
          aria-label="Delete Post"
          colorScheme="red"
          isLoading={postDeleteLoading}
          leftIcon={<DeleteIcon />}
          onClick={async (e) => {
            const postDeleteResponse = await postDelete({ input: { id } });
            if (postDeleteResponse.data?.postDelete) {
              router.back();
            }
          }}
        >
          Delete Post
        </Button>}
      </Stack>
    </Stack>;
  }

  return <Page size="small">
    {content}
  </Page>;
};

export default withUrqlClient()(PostDetailsPage);
