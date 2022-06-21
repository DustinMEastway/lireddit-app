import { Flex, Heading } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

import { usePostQuery } from '../../generated/graphql';
import { Link, Page } from '../../components';
import { withUrqlClient } from '../../core';

export interface PostDetailsPageProps {
};

export const PostDetailsPage: React.FC<PostDetailsPageProps> = ({}) => {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const [{ data: post, error }] = usePostQuery({ pause: !id, variables: { input: { id } } });
  let content: JSX.Element | string;

  if (!post && !error) {
    content = <Flex align="center" direction="column">
      Loading...
    </Flex>;
  } else if (!post?.post) {
    content = <Flex align="center" direction="column">
      {error?.graphQLErrors.join(' ') ?? 'An unknown error occurred.'}
      <Link
        label="Click here to go to post list."
        route="/"
        marginLeft=".25em"
      />
    </Flex>;
  } else {
    const { text, title } = post.post;

    content = <>
      <Heading as="h2">{title}</Heading>
      {text}
    </>;
  }

  return <Page size="small">
    {content}
  </Page>;
};

export default withUrqlClient()(PostDetailsPage);
