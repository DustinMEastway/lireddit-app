import { Button } from '@chakra-ui/button';
import {
  Flex,
  Heading,
  Stack
} from '@chakra-ui/layout';
import { CircularProgress } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  Link,
  Page,
  PostSummary
} from '../components';
import { withUrqlClient } from '../core';
import { usePostListQuery, PostListInput } from '../generated/graphql';

const defaultPostListInput: PostListInput = {
  cursor: null,
  limit: 15
};

export const Index: React.FC = () => {
  const router = useRouter();
  const [ pagination, setPagination ] = useState(defaultPostListInput);
  const [ { data, fetching, stale } ] = usePostListQuery({ variables: { input: pagination } });
  const posts = data?.postList.items;

  if (!fetching && !data) {
    return <>Something went wrong while getting posts. Please try again.</>;
  } else if (!fetching && !posts?.length) {
    return <>No posts to display. Quick, create a post to be the first!</>;
  }

  let loadItemsElement: JSX.Element | null = null;
  if (!posts || stale) {
    loadItemsElement = <CircularProgress isIndeterminate margin="auto" />;
  } else if (data?.postList.hasMore) {
    loadItemsElement = (
      <Button
        margin="auto"
        onClick={() => setPagination({
          ...pagination,
          cursor: posts[posts.length - 1].createdAt
        })}
      >
        Load More
      </Button>
    );
  }

  return <Page>
    <Flex align="center" marginBottom="2rem">
      <Link label="Create Post" marginLeft="auto" route="/post/create">
        Create Post &gt;
      </Link>
    </Flex>
    {(!posts) ? null : (
      <Stack spacing="1rem">
        {posts.map((post) =>
          <PostSummary
            key={post.id}
            onClick={() => {
              router.push(`/post/${post.id}`);
            }}
            post={post}
          />
        )}
      </Stack>
    )}
    {(!loadItemsElement) ? null : (
      <Flex align="center" paddingY="1rem">
        {loadItemsElement}
      </Flex>
    )}
  </Page>;
};

export default withUrqlClient()(Index);
